/**
 * Zod Validation Schemas — единый модуль валидации для всех 6 проектов VibeING.
 * Защищает от: SQL/NoSQL injection, malformed input, oversized payloads, 
 * type confusion attacks.
 */

import { z } from 'zod';

// ─── Общие схемы ───────────────────────────────────────────────

export const EmailSchema = z.string()
  .min(1, 'Email обязателен')
  .max(254, 'Email слишком длинный')
  .email('Некорректный email формат');

export const PasswordSchema = z.string()
  .min(8, 'Пароль минимум 8 символов')
  .max(128, 'Пароль слишком длинный')
  .refine(
    (val) => /[A-Z]/.test(val),
    'Пароль должен содержать заглавную букву'
  )
  .refine(
    /[a-z]/.test(val),
    'Пароль должен содержать строчную букву'
  )
  .refine(
    /[0-9]/.test(val),
    'Пароль должен содержать цифру'
  );

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export const SearchQuerySchema = z.object({
  search: z.string()
    .max(200, 'Поиск слишком длинный')
    .transform(val => val.trim())
    .optional(),
});

// ─── FinFlow (3001) — Financial schemas ────────────────────────

export const TransactionCreateSchema = z.object({
  name: z.string().min(1).max(200),
  amount: z.number().positive('Сумма должна быть положительной'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1).max(100),
  date: z.coerce.date().optional(),
  notes: z.string().max(500).optional(),
});

export const TransactionUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  amount: z.number().positive().optional(),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().min(1).max(100).optional(),
  date: z.coerce.date().optional(),
  notes: z.string().max(500).optional(),
});

export const GoalCreateSchema = z.object({
  name: z.string().min(1).max(200),
  target: z.number().positive('Целевая сумма должна быть положительной'),
  current: z.number().nonnegative('Текущая сумма не может быть отрицательной').default(0),
  deadline: z.coerce.date(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, 'Некорректный цвет').optional(),
});

export const GoalUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  target: z.number().positive().optional(),
  current: z.number().nonnegative().optional(),
  deadline: z.coerce.date().optional(),
});

// ─── MediCare (3002) — Medical schemas ─────────────────────────

export const DoctorSearchSchema = z.object({
  search: z.string().max(100).optional(),
  specialty: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(50).default(20),
});

export const AppointmentCreateSchema = z.object({
  doctorId: z.string().uuid('Некорректный ID врача'),
  date: z.coerce.date(),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/, 'Формат времени HH:mm'),
  type: z.enum(['CONSULTATION', 'FOLLOW_UP']).default('CONSULTATION'),
  notes: z.string().max(1000).optional(),
});

export const MedicalRecordCreateSchema = z.object({
  doctorId: z.string().uuid('Некорректный ID врача'),
  date: z.coerce.date(),
  type: z.string().min(1).max(100),
  diagnosis: z.string().max(2000).optional(),
  notes: z.string().max(5000).optional(),
});

export const PrescriptionCreateSchema = z.object({
  doctorId: z.string().uuid('Некорректный ID врача'),
  medicine: z.string().min(1).max(200),
  dosage: z.string().min(1).max(100),
  duration: z.string().min(1).max(100),
});

export const UserProfileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/).optional(),
  dob: z.coerce.date().optional(),
  insurance: z.string().max(200).optional(),
});

// ─── GreenMarket (3003) — E-commerce schemas ──────────────────

export const ProductSearchSchema = z.object({
  search: z.string().max(100).optional(),
  category: z.string().max(50).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'rating', 'name']).default('rating'),
});

export const CartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

// ─── FoodHub (3004) — Food delivery schemas ───────────────────

export const OrderCreateSchema = z.object({
  items: z.array(CartItemSchema).min(1, 'Заказ должен содержать хотя бы один товар'),
  address: z.string().min(5).max(500),
  phone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/),
  comment: z.string().max(500).optional(),
});

// ─── LuxStay (3005) — Hotel booking schemas ───────────────────

export const BookingSearchSchema = z.object({
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guests: z.number().int().min(1).max(20).default(1),
});

export const BookingCreateSchema = z.object({
  hotelId: z.string().uuid('Некорректный ID отеля'),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guests: z.number().int().min(1).max(20),
  name: z.string().min(1).max(100),
  email: EmailSchema,
  phone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/),
  specialRequests: z.string().max(500).optional(),
});

// ─── Artisan (3006) — Portfolio schemas ────────────────────────

export const ContactFormSchema = z.object({
  name: z.string().min(1).max(100),
  email: EmailSchema,
  message: z.string().min(5).max(2000),
});

// ─── Универсальный parser для API routes ───────────────────────

export function parseWithSchema<T>(schema: z.ZodType<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
  };
}

// ─── Common passwords list (для проверки силы пароля) ──────────

export const COMMON_PASSWORDS = new Set([
  'password', '123456', '123456789', 'qwerty', 'abc123',
  'demo123', 'admin', 'password123', 'letmein', 'welcome',
  'shadow', 'master', 'monkey', 'dragon', 'login',
  'passw0rd', 'hello', 'charlie', 'donald', 'football',
]);

export function checkCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.has(password.toLowerCase());
}

// ─── Password strength validator ───────────────────────────────

export interface PasswordStrength {
  score: number;    // 0-4
  isValid: boolean;
  errors: string[];
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const errors: string[] = [];
  let score = 0;

  if (password.length < 8) errors.push('Минимум 8 символов');
  else if (password.length >= 12) score++;
  
  if (!/[A-Z]/.test(password)) errors.push('Нужна заглавная буква');
  else score++;

  if (!/[a-z]/.test(password)) errors.push('Нужна строчная буква');
  else score++;

  if (!/[0-9]/.test(password)) errors.push('Нужна цифра');
  else score++;

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    errors.push('Нужен спецсимвол (!@#$%^&*)');
  } else {
    score++;
  }

  if (checkCommonPassword(password)) {
    errors.push('Пароль слишком распространённый');
    return { score: 0, isValid: false, errors };
  }

  // Check for repeated characters or patterns
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Избегайте повторяющихся символов');
  }

  const isValid = errors.length === 0;
  
  return { score: Math.min(score, 4), isValid, errors };
}
