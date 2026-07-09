"use client";

import { Search, Filter } from "lucide-react";
import type { Doctor } from "@/data/medical";
import { DoctorCard } from "./DoctorCard";

interface DoctorsListProps {
  doctors: Doctor[];
}

export function DoctorsList({ doctors }: DoctorsListProps) {
  return (
    <section className="py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-bold text-3xl text-dark mb-2">Наши врачи</h2>
        <p className="text-text/50 mb-8">Найдите лучшего специалиста для вас</p>

        {/* Search & filter — this is a placeholder; the actual form will be in the page */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {doctors.map((d, i) => (
            <DoctorCard key={d.id} doctor={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
