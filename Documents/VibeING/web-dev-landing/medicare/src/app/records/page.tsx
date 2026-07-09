"use client";

import { medicalRecords, prescriptions } from "@/data/medical";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/ui/PageTransition";
import { MedicalRecords } from "@/components/records/MedicalRecords";

export default function RecordsPage() {
  return (
    <main>
      <Header />
      <PageTransition>
        <MedicalRecords records={medicalRecords} prescriptions={prescriptions} />
      </PageTransition>
      <Footer />
    </main>
  );
}
