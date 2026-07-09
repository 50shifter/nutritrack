"use server";

import { prisma, isDbConnected } from "@/lib/prisma";
import type { Status } from "@prisma/client";
import { doctors, medicalRecords, blogPosts, type Doctor as MockDoctor, type MedicalRecord as MockMedicalRecord, type BlogPost as MockBlogPost } from "@/data/medical";

// Demo mode fallbacks
const MOCK_DOCTORS = doctors;
const MOCK_RECORDS = medicalRecords;
const MOCK_BLOG_POSTS = blogPosts;

const MOCK_APPOINTMENTS: Record<string, unknown>[] = [
  { id: "1", userId: "demo", doctorId: "1", date: "2025-07-15T10:00:00Z", timeSlot: "10:00", type: "CONSULTATION", status: "CONFIRMED" },
  { id: "2", userId: "demo", doctorId: "2", date: "2025-07-20T14:30:00Z", timeSlot: "14:30", type: "FOLLOW_UP", status: "PENDING" },
];

const MOCK_PATIENT = {
  id: "demo-user-id", name: "Демо Пользователь", email: "demo@medicare.ru",
  phone: "+7 (999) 123-45-67", dob: "1990-01-01",
  role: "PATIENT" as const, password: "hashed", image: null, emailVerified: null, insurance: null,
};

const EMPTY_ARRAY: unknown[] = [];

/* ─── Helpers ─── */

function dbOr<T>(dbFn: () => Promise<T>, fallbackFn: () => T): Promise<T> {
  if (!isDbConnected) return Promise.resolve(fallbackFn());
  return dbFn().catch(() => fallbackFn());
}

/* ─── Doctors ─── */

export async function getDoctors(filters?: { search?: string; specialty?: string }) {
  return dbOr(
    async () => prisma!.doctor.findMany({
      where: filters?.search || filters?.specialty
        ? { OR: filters.search
            ? [{ name: { contains: filters.search, mode: "insensitive" } }, { specialty: { contains: filters.search, mode: "insensitive" } }]
            : [{ specialty: filters.specialty }],
          specialty: filters?.specialty,
        } : {},
      orderBy: { rating: "desc" as const },
      include: { schedule: true },
    }),
    () => {
      let result = MOCK_DOCTORS;
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        result = result.filter((d: any) => d.name.toLowerCase().includes(s) || d.specialty.toLowerCase().includes(s));
      }
      if (filters?.specialty) result = result.filter((d: any) => d.specialty === filters.specialty);
      return result as any;
    }
  ) as any;
}

export async function getDoctorById(id: string) {
  return dbOr(
    async () => prisma!.doctor.findUnique({
      where: { id },
      include: { schedule: true, appointments: { orderBy: { date: "desc" as const }, take: 10 }, medicalRecords: { orderBy: { date: "desc" as const }, take: 5 } },
    }),
    () => {
      const doc = MOCK_DOCTORS.find((d: any) => d.id === Number(id)) ?? null;
      return doc ? { ...doc, schedule: null, appointments: [], medicalRecords: [], email: null, bio: null, education: [], certifications: [], id: String(id) } : null;
    }
  ) as any;
}

export async function getAvailableSlots(doctorId: string, dateStr: string) {
  return dbOr(
    async () => {
      const dayOfWeek = new Date(dateStr).getDay();
      const schedules = await prisma!.schedule.findFirst({ where: { doctorId } });
      if (!schedules) return [];
      const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
      const booked = await prisma!.appointment.findMany({
        where: { doctorId, date: new Date(dateStr), status: { in: ["CONFIRMED", "PENDING"] } },
        select: { timeSlot: true },
      });
      const occupied = new Set((booked as { timeSlot: string }[]).map(b => b.timeSlot));
      let start = "09:00"; let end = "18:00";
      switch (dayOfWeek) {
        case 1: start = schedules.mondayStart ?? "09:00"; end = schedules.mondayEnd ?? "18:00"; break;
        case 2: start = schedules.tuesdayStart ?? "09:00"; end = schedules.tuesdayEnd ?? "18:00"; break;
        case 3: start = schedules.wednesdayStart ?? "09:00"; end = schedules.wednesdayEnd ?? "17:00"; break;
        case 4: start = schedules.thursdayStart ?? "09:00"; end = schedules.thursdayEnd ?? "18:00"; break;
        case 5: start = schedules.fridayStart ?? "09:00"; end = schedules.fridayEnd ?? "16:00"; break;
        case 6: start = schedules.saturdayStart ?? "10:00"; end = schedules.saturdayEnd ?? "14:00"; break;
        default: return [];
      }
      return timeSlots.filter(slot => slot >= start && slot < end && !occupied.has(slot));
    },
    () => ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30"]
  );
}

/* ─── Appointments ─── */

export async function createAppointment(data: { userId: string; doctorId: string; date: string; timeSlot: string; type?: string; notes?: string }) {
  return dbOr(
    async () => prisma!.appointment.create({
      data: { ...data, status: "PENDING" as Status, date: new Date(data.date), type: (data.type as any) ?? "CONSULTATION", notes: data.notes ?? null, diagnosis: null, createdAt: new Date(), updatedAt: new Date() },
      include: { doctor: true, user: true },
    }),
    () => ({ ...data, id: `apt-${Date.now()}`, status: "PENDING" as Status, date: new Date(data.date), doctor: undefined, user: MOCK_PATIENT, diagnosis: null, createdAt: new Date(), updatedAt: new Date() }) as any
  );
}

export async function getUserAppointments(userId: string) {
  return dbOr(
    async () => prisma!.appointment.findMany({ where: { userId }, orderBy: { date: "desc" as const }, include: { doctor: true } }),
    () => MOCK_APPOINTMENTS
  );
}

export async function updateAppointmentStatus(appointmentId: string, status: Status) {
  return dbOr(
    async () => prisma!.appointment.update({ where: { id: appointmentId }, data: { status } }),
    () => ({ id: appointmentId, status })
  );
}

/* ─── Medical Records ─── */

export async function getMedicalRecords(userId: string) {
  return dbOr(
    async () => prisma!.medicalRecord.findMany({ where: { userId }, orderBy: { date: "desc" as const }, include: { doctor: true } }),
    () => MOCK_RECORDS.map((r: any) => ({ ...r, doctor: MOCK_DOCTORS.find((d: any) => d.id === r.doctorId) || MOCK_DOCTORS[0] }))
  ) as any;
}

export async function createMedicalRecord(data: { userId: string; doctorId: string; date: string; type: string; diagnosis?: string; notes?: string }) {
  return dbOr(
    async () => prisma!.medicalRecord.create({ data }),
    () => ({ ...data, id: `rec-${Date.now()}`, date: new Date(data.date), doctor: undefined, notes: data.notes ?? null, diagnosis: data.diagnosis ?? null, createdAt: new Date(), followUp: null }) as any
  );
}

/* ─── Prescriptions ─── */

export async function getPrescriptions(userId: string) {
  return dbOr(
    async () => prisma!.prescription.findMany({ where: { userId }, orderBy: { date: "desc" as const }, include: { doctor: true } }),
    () => EMPTY_ARRAY
  );
}

export async function createPrescription(data: { userId: string; doctorId: string; medicine: string; dosage: string; duration: string; appointmentId?: string }) {
  return dbOr(
    async () => prisma!.prescription.create({
      data: { ...data, date: new Date(), appointmentId: data.appointmentId ?? null },
    }),
    () => ({ ...data, id: `rx-${Date.now()}`, date: new Date(), status: "ACTIVE" as const, doctor: undefined, createdAt: new Date(), appointmentId: data.appointmentId ?? null, dosage: data.dosage ?? "" }) as any
  );
}

/* ─── Blog Posts ─── */

export async function getBlogPosts(params?: { published?: boolean; category?: string }) {
  return dbOr(
    async () => prisma!.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: "desc" as const } }),
    () => (params?.category ? MOCK_BLOG_POSTS.filter((p: any) => p.category === params.category) : MOCK_BLOG_POSTS) as unknown[]
  );
}

export async function getBlogPostBySlug(slug: string) {
  if (!isDbConnected) {
    return MOCK_BLOG_POSTS.find((p: any) => p.title.toLowerCase().includes(slug)) ?? null as any;
  }
  if (!prisma) return null;
  return prisma.blogPost.findUnique({ where: { slug } });
}

/* ─── Medications / Pharmacy ─── */
// Note: medications data comes from medical.ts — uses mock for now
const MOCK_MEDICATIONS: any[] = [
  { id: 1, name: "Парацетамол", price: 89, category: "Обезболивающее", description: "Жаропонижающее, обезболивающее", dosage: "500 мг", rating: 4.5, stock: 150, isPrescription: false },
  { id: 2, name: "Ибупрофен", price: 120, category: "Обезболивающее", description: "Противовоспалительное", dosage: "200 мг", rating: 4.3, stock: 90, isPrescription: false },
  { id: 3, name: "Амоксициллин", price: 180, category: "Антибиотики", description: "Антибиотик широкого спектра", dosage: "500 мг", rating: 4.7, stock: 60, isPrescription: true },
  { id: 4, name: "Витамин D3", price: 350, category: "Витамины", description: "Поддержка иммунитета", dosage: "2000 МЕ", rating: 4.8, stock: 200, isPrescription: false },
  { id: 5, name: "Лоратадин", price: 95, category: "Антигистаминные", description: "От аллергии", dosage: "10 мг", rating: 4.4, stock: 120, isPrescription: false },
];

export async function getMedications(params?: { search?: string; category?: string }) {
  return dbOr(
    async () => prisma!.medication.findMany({
      where: params?.search || params?.category ? {
        OR: params?.search ? [{ name: { contains: params.search, mode: "insensitive" } }, { description: { contains: params.search, mode: "insensitive" } }] : undefined,
        category: params?.category && params.category !== "Все" ? params.category : undefined,
      } : {},
    }),
    () => {
      let result = MOCK_MEDICATIONS;
      if (params?.search) {
        const s = params.search.toLowerCase();
        result = result.filter((m: any) => m.name.toLowerCase().includes(s));
      }
      if (params?.category && params.category !== "Все") result = result.filter((m: any) => m.category === params.category);
      return result;
    }
  ) as any;
}

export async function createMedication(data: { name: string; price: number; image?: string; category: string; description?: string; dosage?: string; stock?: number }) {
  return dbOr(
    async () => prisma!.medication.create({ data }),
    () => ({ ...data, id: `med-${Date.now()}`, rating: 0, stock: data.stock ?? 0, isPrescription: false, image: data.image ?? null, dosage: data.dosage ?? null, description: data.description ?? null }) as any
  );
}

/* ─── User Profile ─── */

export async function updateUserProfile(userId: string, data: { name?: string; phone?: string; dob?: string; insurance?: string }) {
  return dbOr(
    async () => prisma!.user.update({ where: { id: userId }, data }),
    () => ({ ...data, id: userId, email: MOCK_PATIENT.email, role: "PATIENT" as const, password: null, image: null, emailVerified: null }) as any
  );
}
