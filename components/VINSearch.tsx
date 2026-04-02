"use client";
import AIRiskAssistant from "@/components/AIRiskAssistant";
import { useState } from "react";

type VehicleStatus = "clean" | "minor_damage" | "write_off";

interface Vehicle {
  id: string;
  vin: string;
  status: VehicleStatus;
  description: string;
  createdAt: string;
  hash: string | null;
}

const STATUS_CONFIG: Record<VehicleStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  clean: { label: "Clean", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", dot: "bg-emerald-400" },
  minor_damage: { label: "Minor Damage", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", dot: "bg-amber-400" },
  write_off: { label: "Write-Off", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", dot: "bg-red-400" },
};

export default function VINSearch() {
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleCheck = async () => {
    const trimmed = vin.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setVehicle(null);
    setSearched(true);
    try {
      const res = await fetch(`/api/vehicle/${trimmed}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setVehicle(data.vehicle);
        setIsVerified(data.isVerified);
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCheck();
  };

  const handleReset = () => {
    setVin("");
    setVehicle(null);
    setError(null);
    setSearched(false);
    setIsVerified(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
      <div className="relative group">
        <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-amber-500/30 via-amber-400/10 to-amber-500/30 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm" />
        <div className="relative bg-zinc-900 border border-white/10 rounded-xl p-6 flex flex-col gap-4">
          <label htmlFor="vin-input" className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Vehicle Identification Number (VIN)
          </label>
          <div className="flex gap-3">
            <input
              id="vin-input"
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              maxLength={17}
              placeholder="e.g. 1HGBH41JXMN109186"
              className="flex-1 bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all duration-200 tracking-widest uppercase"
            />
            <button
              onClick={handleCheck}
              disabled={vin.trim().length === 0 || loading}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-bold text-sm rounded-lg transition-all duration-200 shrink-0 tracking-wide active:scale-95 disabled:cursor-not-allowed min-w-[130px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Checking...
                </>
              ) : "Check Vehicle"}
            </button>
          </div>
          <p className="text-xs text-zinc-600">Enter a 17-character VIN to retrieve immutable vehicle history records.</p>
        </div>
      </div>

      {!searched && !loading && (
        <div className="border border-dashed border-white/10 rounded-xl p-10 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-zinc-800/80 flex items-center justify-center">
            <svg className="w-7 h-7 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <div>
            <p className="text-zinc-400 font-medium text-sm">No vehicle searched yet</p>
            <p className="text-zinc-600 text-xs mt-1">Enter a VIN above to retrieve verified history records</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-red-400 font-semibold text-sm">Record Not Found</p>
            <p className="text-zinc-500 text-xs mt-1">{error}</p>
          </div>
          <button onClick={handleReset} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Clear</button>
        </div>
      )}

      {vehicle && (() => {
        const cfg = STATUS_CONFIG[vehicle.status];
        return (
          <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className="font-mono text-sm text-zinc-300 tracking-widest">{vehicle.vin}</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Verified badge */}
                {isVerified && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    Verified Record
                  </span>
                )}
                <button onClick={handleReset} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Clear</button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Status</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.border} border ${cfg.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">History</span>
                <p className="text-zinc-300 text-sm leading-relaxed">{vehicle.description}</p>
              </div>

              {/* Hash display */}
              {vehicle.hash && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Record Hash</span>
                  <div className="bg-zinc-950 border border-white/5 rounded-lg px-4 py-2.5 flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-zinc-400 truncate">
                      {vehicle.hash.slice(0, 20)}...{vehicle.hash.slice(-8)}
                    </span>
                    <span className="text-[10px] text-zinc-600 shrink-0">SHA256</span>
                  </div>
                  <p className="text-xs text-zinc-600">
                    This hash is computed from the VIN, status, description and timestamp. Any change to the record will invalidate it.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-xs text-zinc-600">
                  Recorded {new Date(vehicle.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
                <span className="text-xs text-zinc-600 font-mono">ID: {vehicle.id.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* AI Risk Assistant — shows after vehicle is found */}
      {vehicle && (
        <AIRiskAssistant
          vin={vehicle.vin}
          status={vehicle.status}
          description={vehicle.description}
        />
      )}

      <div className="text-center"></div>

      <div className="text-center">
        <p className="text-xs text-zinc-600">
          Try:{" "}
          {["1HGBH41JXMN109186", "2T1BURHE0JC043821", "3VWFE21C04M000001"].map((v, i) => (
            <span key={v}>
              <button onClick={() => setVin(v)} className="font-mono text-amber-500/60 hover:text-amber-400 transition-colors">{v}</button>
              {i < 2 && <span className="text-zinc-700"> · </span>}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}