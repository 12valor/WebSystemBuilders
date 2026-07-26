"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Array<{
    profile_id: string;
    display_name: string;
    bio: string | null;
    country: string | null;
    portfolio_url: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    status: string;
    submitted_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSellers() {
      const supabase = createClient();
      const { data } = await supabase
        .from("seller_profiles")
        .select("profile_id, display_name, bio, country, portfolio_url, github_url, linkedin_url, status, submitted_at")
        .order("submitted_at", { ascending: false });

      if (data) setSellers(data);
      setLoading(false);
    }

    loadSellers();
  }, []);

  const handleReview = async (profileId: string, newStatus: "approved" | "rejected") => {
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc("review_seller_application", {
        p_profile_id: profileId,
        p_new_status: newStatus,
        p_admin_notes: `Reviewed by admin to ${newStatus}`,
      });

      if (!error) {
        setSellers((prev) =>
          prev.map((s) => (s.profile_id === profileId ? { ...s, status: newStatus } : s))
        );
      }
    } catch {
      // ignore
    }
  };

  return (
    <main className="p-6 sm:p-10 max-w-7xl mx-auto font-sans text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Admin Control</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">Seller Applications</h1>
          <p className="text-xs text-slate-500 mt-1">Review developer profiles applying for Seller permission.</p>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 text-xs text-slate-500">Loading seller applications...</div>
      ) : sellers.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
          No seller applications submitted yet.
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[0.68rem] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-4">Developer / Studio</th>
                <th className="p-4">Bio & Links</th>
                <th className="p-4">Country</th>
                <th className="p-4">Status</th>
                <th className="p-4">Submitted</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sellers.map((seller) => (
                <tr key={seller.profile_id} className="align-top">
                  <td className="p-4 font-bold text-slate-900">{seller.display_name}</td>
                  <td className="p-4 max-w-xs">
                    <p className="text-slate-600 line-clamp-2">{seller.bio || "No bio"}</p>
                    <div className="mt-2 flex gap-3 text-[0.68rem] font-semibold text-blue-600">
                      {seller.github_url && <a href={`https://${seller.github_url}`} target="_blank" rel="noreferrer">GitHub ↗</a>}
                      {seller.portfolio_url && <a href={seller.portfolio_url} target="_blank" rel="noreferrer">Portfolio ↗</a>}
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{seller.country || "N/A"}</td>
                  <td className="p-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[0.68rem] font-bold capitalize ${
                      seller.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : seller.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    }`}>
                      {seller.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{new Date(seller.submitted_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    {seller.status === "pending_review" ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleReview(seller.profile_id, "approved")}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[0.68rem] font-bold text-white shadow hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReview(seller.profile_id, "rejected")}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[0.68rem] font-bold text-red-600 hover:bg-red-100"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[0.68rem] text-slate-400">Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
