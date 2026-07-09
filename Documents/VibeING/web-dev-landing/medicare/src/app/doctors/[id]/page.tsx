import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { doctors } from "@/data/medical";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/ui/PageTransition";
import { Star, Calendar, MapPin, Mail, Phone, Clock, Shield, ArrowLeft, FileText, Award, BookOpen } from "lucide-react";

interface DoctorProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function DoctorProfilePage({ params }: DoctorProfilePageProps) {
  const { id } = await params;
  const doctorId = parseInt(id);
  const d = doctors.find(doc => doc.id === doctorId);

  if (!d) notFound();

  return (
    <main>
      <Header />
      <PageTransition>
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Back button */}
            <Link href="/doctors" className="inline-flex items-center gap-2 text-sm text-[#0891B2] hover:underline font-medium">
              <ArrowLeft size={16} /> Назад к списку врачей
            </Link>

            {/* Doctor info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column - photo & main info */}
              <div className="lg:col-span-1 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <img src={d.image} alt={d.name} className="w-full h-[320px] object-cover rounded-2xl" />
                </motion.div>

                {/* Quick info card */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 space-y-4">
                  <h1 className="font-bold text-xl text-dark">{d.name}</h1>
                  <p className="text-[#0891B2] font-medium">{d.specialty}</p>

                  <div className="flex items-center gap-2">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-dark">{d.rating}</span>
                    <span className="text-sm text-text/40">({d.patients.toLocaleString()} отзывов)</span>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
                    <div className="flex items-center gap-3 text-sm">
                      <Clock size={16} className="text-text/30" />
                      <span className="text-dark">{d.experience} лет опыта</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin size={16} className="text-text/30" />
                      <span className="text-dark">Москва, ул. Медицинская 12</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail size={16} className="text-text/30" />
                      <span className="text-dark">{d.name.toLowerCase().replace(/\s/g, '.')}@medicare.ru</span>
                    </div>
                  </div>

                  {/* Availability badge */}
                  <div className={`px-4 py-2 rounded-xl text-sm font-medium text-center ${d.available ? "bg-green-500/10 text-green-600" : "bg-gray-100 text-text"}`}>
                    {d.available ? "Свободен для записи" : "Занят"}
                  </div>

                  {/* CTA */}
                  <Link href={`/doctors/${d.id}/book`}>
                    <button className="w-full py-3 rounded-xl bg-[#0891B2] text-white font-medium hover:bg-[#0891B2]/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#0891B2]/20">
                      <Calendar size={16} /> Записаться на приём
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right column - details */}
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <h2 className="font-bold text-lg text-dark mb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-[#0891B2]" /> О враче
                  </h2>
                  <p className="text-text/70 leading-relaxed">
                    {d.name} — высококвалифицированный специалист с многолетним опытом работы. 
                    Специализируется на {d.specialty.toLowerCase()}. Регулярно повышает квалификацию, 
                    участвует в международных конференциях. Подход к лечению основан на доказательной медицине.
                  </p>
                </motion.div>

                {/* Education */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h2 className="font-bold text-lg text-dark mb-3 flex items-center gap-2">
                    <Award size={18} className="text-[#0891B2]" /> Образование
                  </h2>
                  <div className="space-y-3">
                    {[
                      { year: "2005", school: "Первый МГМУ им. И.М. Сеченова", degree: "Лечебное дело" },
                      { year: "2007", school: "РМАПО", degree: "Интернатура по терапии" },
                    ].map(ed => (
                      <div key={ed.year} className="flex items-start gap-4 p-3 rounded-xl bg-[#F1F5F9]">
                        <span className="text-xs text-text/40 mt-0.5 shrink-0">{ed.year}</span>
                        <div>
                          <div className="font-medium text-sm text-dark">{ed.degree}</div>
                          <div className="text-xs text-text/40">{ed.school}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Certifications */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h2 className="font-bold text-lg text-dark mb-3 flex items-center gap-2">
                    <Shield size={18} className="text-[#0891B2]" /> Сертификаты
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["Дерматоскопия", "УЗИ диагностика", "Лечебная физкультура"].map(cert => (
                      <div key={cert} className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[#E2E8F0]">
                        <FileText size={14} className="text-[#0891B2]" />
                        <span className="text-sm text-dark">{cert}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Schedule */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h2 className="font-bold text-lg text-dark mb-3 flex items-center gap-2">
                    <Clock size={18} className="text-[#0891B2]" /> Расписание
                  </h2>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {[
                      { day: "Пн", time: "9:00–18:00" },
                      { day: "Вт", time: "9:00–18:00" },
                      { day: "Ср", time: "10:00–17:00" },
                      { day: "Чт", time: "9:00–18:00" },
                      { day: "Пт", time: "9:00–16:00" },
                      { day: "Сб", time: "10:00–14:00" },
                      { day: "Вс", time: "Выходной" },
                    ].map(d => (
                      <div key={d.day} className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                        <div className="font-bold text-sm text-dark">{d.day}</div>
                        <div className="text-xs text-text/40 mt-1">{d.time}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Reviews */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <h2 className="font-bold text-lg text-dark mb-3">Отзывы пациентов</h2>
                  <div className="space-y-4">
                    {[
                      { name: "Алексей М.", date: "15.06.2025", rating: 5, text: "Отличный врач! Внимательно выслушал, назначил правильное лечение. Очень благодарен!" },
                      { name: "Екатерина В.", date: "08.06.2025", rating: 5, text: "Профессионал своего дела. Всё объяснила простым языком, чувствовала себя комфортно." },
                    ].map(rev => (
                      <div key={rev.date} className="p-4 rounded-xl bg-white border border-[#E2E8F0]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-dark">{rev.name}</span>
                          <span className="text-xs text-text/40">{rev.date}</span>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} className={`fill-yellow-400 text-yellow-400 ${i >= rev.rating ? "opacity-20" : ""}`} />
                          ))}
                        </div>
                        <p className="text-sm text-text/70 leading-relaxed">{rev.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
      <Footer />
    </main>
  );
}
