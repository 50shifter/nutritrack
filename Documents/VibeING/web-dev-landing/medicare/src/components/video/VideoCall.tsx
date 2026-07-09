"use client";

import { useEffect, useState, useRef } from "react";
import { Mic, MicOff, Video as VidIcon, VideoOff, Phone, MessageSquare, X, User, Clock, HeartPulse } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoCallProps {
  roomCode: string;
  doctorName?: string;
  appointmentId?: string;
  onLeave: () => void;
}

export function VideoCall({ roomCode, doctorName = "Врач", appointmentId, onLeave }: VideoCallProps) {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [callTime, setCallTime] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => setCallTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Start local camera/mic (stub — no real WebRTC peer connection)
  useEffect(() => {
    let cancelled = false;

    async function startLocalMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: true,
        });

        if (cancelled) return;
        streamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          await localVideoRef.current.play();
        }
      } catch {
        // Camera access denied or unavailable — that's fine for a stub
      }
    }

    startLocalMedia();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleToggleMic = () => {
    if (!streamRef.current) return;
    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  const handleToggleCamera = () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoOn(videoTrack.enabled);
    }
  };

  const handleEndCall = () => {
    onLeave();
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] bg-gray-900">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 p-3 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent rounded-t-2xl">
        <div className="flex items-center gap-3 text-white">
          <span className="text-sm font-mono">{formatTime(callTime)}</span>
          <span className="flex items-center gap-1.5 text-xs text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Демо-режим
          </span>
          {appointmentId && (
            <span className="text-xs bg-white/10 px-2 py-1 rounded-lg">Консультация #{String(appointmentId).slice(-4)}</span>
          )}
        </div>
        <button onClick={() => setChatOpen(!chatOpen)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors" aria-label="Чат">
          <MessageSquare size={18} />
        </button>
      </div>

      {/* Main video area */}
      <div className="relative w-full h-[500px] bg-gray-900 flex items-center justify-center overflow-hidden rounded-b-none">
        {/* Doctor side — stub placeholder */}
        <div className="flex flex-col items-center justify-center text-white/70 gap-4">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border-2 border-dashed border-white/15 flex items-center justify-center">
            <HeartPulse size={48} className="text-cyan-400/60" />
          </div>
          <p className="text-xl font-semibold text-white/90">{doctorName}</p>
          <p className="text-sm text-white/50 max-w-xs text-center leading-relaxed">
            Тут должен быть врач, но это pet-project 🐾
          </p>
        </div>

        {/* Patient's local camera (PiP) */}
        {videoOn && (
          <div className="absolute bottom-20 right-4 w-56 h-40 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg z-10">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
          </div>
        )}

        {/* No camera placeholder */}
        {!videoOn && (
          <div className="absolute bottom-20 right-4 w-56 h-40 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-white/10">
            <VideoOff size={28} className="text-white/30" />
          </div>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
          <button
            onClick={handleToggleMic}
            className={`p-3 rounded-full transition-colors ${micOn ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-red-500 text-white"}`}
            aria-label={micOn ? "Выключить микрофон" : "Включить микрофон"}
          >
            {micOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          <button
            onClick={handleToggleCamera}
            className={`p-3 rounded-full transition-colors ${videoOn ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-red-500 text-white"}`}
            aria-label={videoOn ? "Выключить камеру" : "Включить камеру"}
          >
            {videoOn ? <VidIcon size={20} /> : <VideoOff size={20} />}
          </button>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="p-3 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Чат"
          >
            <MessageSquare size={20} />
          </button>
          <button
            onClick={handleEndCall}
            className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center"
            aria-label="Завершить звонок"
          >
            <Phone size={20} rotate={135} />
          </button>
        </div>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute right-4 bottom-20 w-80 bg-white rounded-xl shadow-2xl border border-[#E2E8F0] overflow-hidden"
          >
            <div className="p-3 border-b border-[#E2E8F0] flex items-center justify-between">
              <span className="font-medium text-sm text-dark">Чат с врачом</span>
              <button onClick={() => setChatOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors"><X size={16} /></button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: "calc(500px - 120px)" }}>
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <HeartPulse size={14} className="text-cyan-600" />
                </div>
                <div className="bg-gray-100 rounded-xl px-3 py-2 text-sm text-dark max-w-[80%]">
                  Это демо-чат. В pet-project врач пока не доступен 😊
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-[#E2E8F0]">
              <input type="text" placeholder="Введите сообщение..." className="w-full px-3 py-2 rounded-lg bg-gray-100 text-sm outline-none focus:ring-1 ring-cyan-500" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
