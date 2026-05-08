"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TechnicianDashboard() {
  const [activeJob, setActiveJob] = useState<any>(null);
  const [jobStatus, setJobStatus] = useState<string>("idle");

  useEffect(() => {
    // Veritabanındaki "pending" (Bekleyen) işleri canlı dinle
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "jobs",
          filter: "status=eq.pending",
        },
        (payload: any) => {
          console.log("Neuer Auftrag empfangen!", payload.new);
          setActiveJob(payload.new);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateJobStatus = async (newStatus: string) => {
    if (!activeJob) return;
    setJobStatus(newStatus);

    // 1. Supabase veritabanında işin durumunu anında güncelle
    const { error } = await supabase
      .from("jobs")
      .update({ status: newStatus })
      .eq("id", activeJob.id);
    if (error) console.error("Update Fehler:", error);

    // 2. İş kabul edildiğinde müşteriye SMS gönder (Test Numarası Entegre Edildi)
    if (newStatus === "accepted") {
      try {
        const formData = new FormData();
        // Yatırımcı sunumu için SMS test numarası
        formData.append("customer_phone", "+4917676926684");
        formData.append("tech_name", "Durmuş Ö.");

        await fetch("http://localhost:8000/api/notify-customer", {
          method: "POST",
          body: formData,
        });
        console.log("Kunden-SMS tetiklendi.");
      } catch (smsError) {
        console.error("SMS Gönderme Hatası:", smsError);
      }
    }
  };

  const completeJob = async () => {
    // İş bitiminde statüyü completed yap ve 3 saniye sonra ekranı sıfırla
    await updateJobStatus("completed");
    setTimeout(() => {
      setActiveJob(null);
      setJobStatus("idle");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 md:p-8 flex justify-center font-sans selection:bg-white selection:text-black">
      <main className="w-full max-w-2xl space-y-6 mt-4">
        {/* Üst Bilgi / Statüs Barı */}
        <header className="bg-black p-5 rounded-[2rem] border border-neutral-800 flex justify-between items-center shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center font-bold text-green-400 border border-green-500/30">
              D
            </div>
            <div className="font-bold text-lg">Durmuş Ö.</div>
          </div>
          <div className="text-green-400 text-sm font-medium flex items-center px-4 py-2 bg-green-400/10 rounded-full border border-green-500/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
            Online
          </div>
        </header>

        {/* Ana Ekran: Radar veya İş Paneli */}
        {!activeJob ? (
          <div className="text-center py-20 text-neutral-500 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-500/50 animate-ping"></div>
            </div>
            <p className="text-lg font-medium">
              System scannt nach Aufträgen in Trier...
            </p>
          </div>
        ) : (
          <div className="bg-neutral-800 p-8 rounded-[2.5rem] border border-neutral-700 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
            {/* 1. Aşama: İşi Görme ve Kabul Etme */}
            {jobStatus === "idle" && (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="px-4 py-1.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-full uppercase tracking-widest border border-red-500/20">
                      {activeJob.urgency || "Priorität"}
                    </span>
                    <h2 className="text-3xl font-black mt-4">
                      {activeJob.category}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-green-400">
                      {activeJob.estimated_price}
                    </p>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">
                      Est. Budget
                    </p>
                  </div>
                </div>

                <div className="bg-neutral-900 p-6 rounded-3xl mb-8 border border-neutral-800">
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    <strong className="text-white block mb-2 uppercase text-xs tracking-widest">
                      KI-Diagnose (Llama 3.2):
                    </strong>
                    {activeJob.detected_issue}
                  </p>
                </div>

                <button
                  onClick={() => updateJobStatus("accepted")}
                  className="w-full bg-white text-black font-extrabold py-5 rounded-full text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  Auftrag Annehmen
                </button>
              </>
            )}

            {/* 2. Aşama: Navigasyon ve Müşteri Bilgilendirme */}
            {jobStatus === "accepted" && (
              <div className="text-center space-y-6">
                <div className="p-5 bg-blue-500/10 rounded-3xl border border-blue-500/20 text-blue-400 text-sm">
                  <span className="block text-2xl mb-2">📱</span>
                  Kunde wurde benachrichtigt.
                  <br />
                  SMS gesendet an:{" "}
                  <strong className="text-white">+49 176 769 266 84</strong>
                </div>
                <button
                  onClick={() => updateJobStatus("en-route")}
                  className="w-full bg-blue-600 text-white font-bold py-5 rounded-full text-xl hover:bg-blue-500 active:scale-95 transition-all flex justify-center items-center shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                >
                  <span className="mr-3 text-2xl">🗺️</span> Navigation Starten
                </button>
              </div>
            )}

            {/* 3. Aşama: Sahada İşi Bitirme (Gelecekteki NFC Ödeme Entegrasyonu İçin Hazırlandı) */}
            {jobStatus === "en-route" && (
              <div className="text-center space-y-6">
                <div className="py-10">
                  <div className="text-6xl mb-4 animate-bounce">📍</div>
                  <h3 className="text-xl font-bold">Sie sind am Zielort</h3>
                </div>
                <button
                  onClick={completeJob}
                  className="w-full bg-green-600 text-white font-bold py-5 rounded-full text-xl hover:bg-green-500 active:scale-95 transition-all shadow-[0_0_30px_rgba(22,163,74,0.3)] flex flex-col items-center"
                >
                  <span>Arbeit Beenden</span>
                  <span className="text-xs font-medium text-green-200 mt-1 uppercase tracking-widest">
                    via NFC Payment abrechnen
                  </span>
                </button>
              </div>
            )}

            {/* 4. Aşama: Başarılı Bitiş Ekranı */}
            {jobStatus === "completed" && (
              <div className="text-center py-12 bg-green-500/10 rounded-[2.5rem] border border-green-500/20 animate-in zoom-in duration-300">
                <div className="text-6xl mb-6">✅</div>
                <h3 className="text-3xl font-black text-green-400">
                  Erfolgreich
                </h3>
                <p className="text-neutral-400 text-sm mt-3">
                  Zahlung bestätigt & verbucht.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
