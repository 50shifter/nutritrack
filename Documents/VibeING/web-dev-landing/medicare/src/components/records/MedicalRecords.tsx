"use client";

import { ChevronRight } from "lucide-react";
import type { MedicalRecord, Prescription } from "@/data/medical";

interface RecordsPageProps {
  records: MedicalRecord[];
  prescriptions: Prescription[];
}

export function MedicalRecords({ records, prescriptions }: RecordsPageProps) {
  const [openId, setOpenId] = React.useState<number | null>(null);

  return (
    <section className="py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-bold text-3xl text-dark mb-8">Медицинские записи</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Visits */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-bold text-sm text-text/50 uppercase tracking-wider mb-4">Приёмы</h3>
            {records.map(r => (
              <div key={r.id} className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
                <button onClick={() => setOpenId(openId === r.id ? null : r.id)} className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors">
                  <div>
                    <div className="font-medium text-sm text-dark">{r.type}</div>
                    <div className="text-xs text-text/50 mt-1">{r.date} • {r.doctor}</div>
                  </div>
                  <ChevronRight size={16} className={`text-text/30 transition-transform ${openId === r.id ? 'rotate-90' : ''}`} />
                </button>
                <div className={`accordion-content ${openId === r.id ? 'open' : ''}`}>
                  <div className="px-4 pb-4 space-y-3">
                    <div className="p-3 rounded-lg bg-[#F1F5F9]">
                      <div className="text-[10px] text-text/40 uppercase">Диагноз</div>
                      <div className="text-sm font-medium text-dark mt-1">{r.diagnosis}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#F1F5F9]">
                      <div className="text-[10px] text-text/40 uppercase">Заметки</div>
                      <div className="text-sm text-dark mt-1">{r.notes}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Side panel */}
          <div className="space-y-6">
            <h3 className="font-bold text-sm text-text/50 uppercase tracking-wider">Рецепты</h3>
            {prescriptions.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-[#E2E8F0] p-4">
                <div className="font-medium text-sm text-dark">{p.medicine}</div>
                <div className="text-xs text-text/50 mt-1">{p.dosage} • {p.duration}</div>
                <div className="text-[10px] text-text/40 mt-2">{p.doctor} • {p.date}</div>
              </div>
            ))}

            {/* Quick stats */}
            <div className="bg-[#0891B2]/5 rounded-xl border border-[#0891B2]/10 p-4">
              <div className="text-sm font-bold text-[#0891B2] mb-3">Статистика</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-text/60">Всего приёмов</span><span className="font-medium text-dark">{records.length}</span></div>
                <div className="flex justify-between"><span className="text-text/60">Рецептов</span><span className="font-medium text-dark">{prescriptions.length}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
