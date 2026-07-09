"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/ui/PageTransition";
import { VideoCall } from "@/components/video/VideoCall";
import { ArrowLeft, Clock, Calendar, User, AlertCircle, Loader2, Copy, Check } from "lucide-react";

interface ConsultationPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConsultationPage({ params }: ConsultationPageProps) {
  const { id } = await params;

  return (
    <main>
      <Header />
      <ConsultationInner appointmentId={id} />
      <Footer />
    </main>
  );
}

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function ConsultationInner({ appointmentId }: { appointmentId: string }) {
  const [roomCode, setRoomCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate a random room code client-side (no API needed for stub)
    if (!roomCode && !loading) return;
    
    async function init() {
      try {
        if (appointmentId && /^[A-Z2-9]{6}$/i.test(appointmentId)) {
          setRoomCode(appointmentId.toUpperCase());
        } else {
          // Generate a random 6-char code for demo purposes
          const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
          let code = "";
          for (let i = 0; i < 6; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
          }
          setRoomCode(code);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Ошибка");
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    init();
  }, []);

  const handleCopyLink = () => {
    if (!roomCode) return;
    const url = `${window.location.origin}/consultation/${roomCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[#0891B2]" />
        </div>
      </PageTransition>
    );
  }

  if (error || !roomCode) {
    return (
      <PageTransition>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <p className="text-dark font-medium">{error || "Не удалось создать видеозвонок"}</p>
            <Link href="/profile" className="mt-4 inline-block text-[#0891B2] hover:underline">Вернуться в профиль</Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="py-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-4">
        {/* Back button */}
        <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-[#0891B2] hover:underline font-medium">
          <ArrowLeft size={16} /> Вернуться в профиль
        </Link>

        {/* Room info card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <User size={20} className="text-cyan-600" />
            </div>
            <div>
              <div className="font-medium text-sm text-dark">Консультация с врачом</div>
              <div className="text-xs text-text/40 flex items-center gap-1.5 mt-0.5">
                Код комнаты: <span className="font-mono font-bold text-[#0891B2]">{roomCode}</span>
                <button onClick={handleCopyLink} className="inline-flex items-center hover:text-[#0891B2] transition-colors" title="Скопировать ссылку">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 text-xs font-medium">
            <Clock size={12} /> Демо-режим
          </span>
        </div>

        {/* Video call */}
        <VideoCall roomCode={roomCode} appointmentId={appointmentId} onLeave={() => window.location.href = "/profile"} />
      </section>
    </PageTransition>
  );
}
