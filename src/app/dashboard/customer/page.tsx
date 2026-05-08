"use client";
import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CustomerDashboard() {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [savedJobId, setSavedJobId] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!description && !file)
      return alert(
        "Bitte beschreiben Sie das Problem oder laden Sie ein Foto hoch.",
      );
    setIsLoading(true);

    try {
      let publicUrl = "";

      // 1. Eğer dosya seçildiyse Supabase Storage'a yükle
      if (file) {
        const fileName = `${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("nexar-photos")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Dosyanın dışarıdan erişilebilir linkini al
        const { data: linkData } = supabase.storage
          .from("nexar-photos")
          .getPublicUrl(fileName);
        publicUrl = linkData.publicUrl;
      }

      // 2. Python Backend'e (Llama 3.2 Vision) gönder (Dinamik URL - Vercel Uyumlu)
      const formData = new FormData();
      formData.append("description", description);
      if (publicUrl) formData.append("image_url", publicUrl);

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/api/analyze-issue`, {
        method: "POST",
        body: formData,
      });

      const aiData = await response.json();
      setResult(aiData);

      // 3. Veritabanına kaydet ve kaydedilen işin ID'sini al (Ödeme sistemi için)
      const { data: insertedData, error: insertError } = await supabase
        .from("jobs")
        .insert([
          {
            description,
            category: aiData.analysis.category,
            detected_issue: aiData.analysis.detected_issue,
            estimated_price: aiData.analysis.estimated_price,
            status: "pending",
          },
        ])
        .select();

      if (insertError) throw insertError;
      if (insertedData && insertedData.length > 0) {
        setSavedJobId(insertedData[0].id);
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Ein Fehler ist aufgetreten.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      // Stripe Checkout API'sine istek at
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 20, jobId: savedJobId || "temp-id" }),
      });
      const { url } = await res.json();

      // Stripe'ın güvenli ödeme sayfasına yönlendir
      if (url) window.location.href = url;
    } catch (error) {
      console.error("Ödeme başlatılamadı:", error);
      alert("Zahlungssystem ist derzeit nicht verfügbar.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex font-sans">
      <aside className="w-64 bg-white border-r p-6 hidden md:block">
        <Link href="/" className="text-2xl font-black italic">
          NEXAR.
        </Link>
        <nav className="mt-10">
          <div className="p-4 bg-black text-white rounded-2xl text-center font-bold">
            Anfrage stellen
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8 md:p-12">
        <h1 className="text-3xl font-bold mb-8">Neuen Auftrag erstellen</h1>

        <div className="max-w-2xl bg-white p-8 rounded-[2.5rem] shadow-sm border border-neutral-200">
          {result ? (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
              <div className="p-6 bg-green-50 rounded-3xl border border-green-100">
                <h2 className="text-green-700 font-bold text-xl mb-4">
                  KI-Diagnose Ergebnis:
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded-xl border font-medium">
                    Kategorie: {result.analysis.category}
                  </div>
                  <div className="bg-white p-3 rounded-xl border font-medium">
                    Preis: {result.analysis.estimated_price}
                  </div>
                  <div className="col-span-2 bg-white p-3 rounded-xl border font-medium">
                    Problem: {result.analysis.detected_issue}
                  </div>
                </div>
              </div>

              {/* Stripe Depozito Ödeme Butonu */}
              <button
                onClick={handlePayment}
                className="w-full bg-blue-600 text-white font-bold py-5 rounded-3xl hover:bg-blue-700 active:scale-95 transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] flex justify-center items-center"
              >
                <span className="mr-2 text-xl">💳</span> 20€ Anzahlung & Auftrag
                Bestätigen
              </button>

              <button
                onClick={() => {
                  setResult(null);
                  setSavedJobId(null);
                }}
                className="w-full text-neutral-400 text-sm underline mt-2"
              >
                Neues Foto scannen
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <textarea
                className="w-full p-5 rounded-2xl bg-neutral-50 border focus:ring-0 outline-none"
                placeholder="Beschreiben Sie das Problem..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="relative group">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) =>
                    setFile(e.target.files ? e.target.files[0] : null)
                  }
                />
                <div className="border-2 border-dashed border-neutral-200 rounded-3xl p-12 text-center group-hover:bg-neutral-50 transition-all">
                  <p className="text-neutral-500 font-medium">
                    {file
                      ? `Ausgewählt: ${file.name}`
                      : "Klicken Sie hier, um ein Foto hochzuladen"}
                  </p>
                  <p className="text-xs text-neutral-400 mt-2">
                    Llama 3.2 Vision scannt das Bild automatisch
                  </p>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full bg-black text-white font-bold py-5 rounded-3xl hover:bg-neutral-800 disabled:bg-neutral-400 transition-all"
              >
                {isLoading ? "Llama scannt das Foto..." : "Problem analysieren"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
