"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    completed: 0,
  });

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setJobs(data);
      setStats({
        total: data.length,
        pending: data.filter((j: any) => j.status === "pending").length,
        active: data.filter(
          (j: any) => j.status === "accepted" || j.status === "en-route",
        ).length,
        completed: data.filter((j: any) => j.status === "completed").length,
      });
    }
  };

  useEffect(() => {
    fetchJobs();
    const channel = supabase
      .channel("admin-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "jobs" },
        (payload: any) => {
          console.log("Veritabanı güncellendi:", payload);
          fetchJobs();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">NEXAR Admin</h1>
      </header>
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs uppercase text-neutral-400 border-b border-neutral-100">
              <th className="px-8 py-4 font-semibold">ID</th>
              <th className="px-8 py-4 font-semibold">Kategorie</th>
              <th className="px-8 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-neutral-50">
                <td className="px-8 py-4 text-neutral-400 font-mono text-xs">
                  {job.id.substring(0, 8)}
                </td>
                <td className="px-8 py-4 font-bold">{job.category}</td>
                <td className="px-8 py-4 font-bold">{job.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
