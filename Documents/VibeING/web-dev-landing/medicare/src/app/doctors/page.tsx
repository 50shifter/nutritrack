"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { doctors } from "@/data/medical";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/ui/PageTransition";
import { DoctorsList } from "@/components/doctors/DoctorsList";
import { Search, Filter } from "lucide-react";

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");

  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpec = !specialty || d.specialty === specialty;
    return matchSearch && matchSpec;
  });

  const specialties = [...new Set(doctors.map(d => d.specialty))];

  return (
    <main>
      <Header />
      <PageTransition>
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-bold text-3xl text-dark mb-2">Наши врачи</h2>
            <p className="text-text/50 mb-8">Найдите лучшего специалиста для вас</p>

            {/* Search & filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0]">
                <Search size={16} className="text-text/30" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск врача..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-text/30" />
              </div>
              <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-sm outline-none">
                <option value="">Все специальности</option>
                {specialties.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Results count */}
            <p className="text-sm text-text/40 mb-6">Найдено: {filtered.length} врачей</p>

            {/* Doctor cards */}
            {filtered.length > 0 ? (
              <DoctorsList doctors={filtered} />
            ) : (
              <div className="text-center py-12 text-text/40">
                <Filter size={48} className="mx-auto mb-4 opacity-30" />
                <p>Врачи не найдены. Попробуйте изменить фильтры.</p>
              </div>
            )}
          </div>
        </section>
      </PageTransition>
      <Footer />
    </main>
  );
}
