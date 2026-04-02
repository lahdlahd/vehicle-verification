"use client";
import { useState } from "react";

type EscrowStatus = "idle" | "pending" | "inspection" | "approved" | "released";

interface EscrowSimulatorProps {
  vin: string;
  status: string;
}

const STEPS: { key: EscrowStatus; label: string; description: string }[] = [
  { key: "pending", label: "Funds Deposited", description: "Payment held securely in escrow" },
  { key: "inspection", label: "Inspection", description: "Vehicle undergoing verification check" },
  { key: "approved", label: "Approved", description: "Inspection passed — ready to release" },
  { key: "released", label: "Funds Released", description: "Payment released to seller" },
];

const STEP_COLORS: Record<EscrowStatus, string> = {
  idle: "bg-zinc-700",
  pending: "bg-amber-500",
  inspection: "bg-blue-500",
  approved: "bg-emerald-500",
  released: "bg-emerald-400",
};

const STEP_ORDER: EscrowStatus[] = ["pending", "inspection", "approved", "released"];

export default function EscrowSimulator({ vin, status }: EscrowSimulatorProps) {
  const [escrowStatus, setEscrowStatus] = useState<EscrowStatus>("idle");
  const [loading, setLoading] = useState(false);
  const [amount] = useState("5,000");

  const currentStepIndex = STEP_ORDER.indexOf(escrowStatus);

  const handleStart = () => setEscrowStatus("pending");

  const handleAdvance = async () => {
    if (loading) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEP_ORDER.length) {
      setEscrowStatus(STEP_ORDER[nextIndex]);
    }
    setLoading(false);
  };

  const handleReset = () => setEscrowStatus("idle");

  const getStepStatus = (stepKey: EscrowStatus) => {
    const stepIndex = STEP_ORDER.indexOf(stepKey);
    if (stepIndex < currentStepIndex) return "completed";
    if (stepIndex === currentStepIndex) return "active";
    return "pending";
  };

  if (status === "write_off") {
    return (
      <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <div>
            <p className="text-red-400 font-semibold text-sm">Purchase Blocked</p>
            <p className="text-zinc-500 text-xs mt-0.5">This vehicle is a write-off and cannot be purchased through this platform.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Secure Escrow</p>
          <p className="text-xs text-zinc-500">Funds protected until approval</p>
        </div>
        {escrowStatus !== "idle" && (
          <button onClick={handleReset} className="ml-auto text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Reset</button>
        )}
      </div>

      <div className="p-6 flex flex-col gap-6">
        {escrowStatus === "idle" && (
          <div className="flex flex-col gap-4">
            <div className="bg-zinc-950 border border-white/5 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Vehicle</p>
                <p className="font-mono text-sm text-zinc-300 mt-1">{vin}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Amount</p>
                <p className="text-lg font-bold text-white mt-1">${amount}</p>
              </div>
            </div>
            <p className="text-xs text-zinc-600 text-center">
              Funds will be held securely in escrow until inspection is complete and approved.
            </p>
            <button
              onClick={handleStart}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Proceed to Purchase
            </button>
          </div>
        )}

        {escrowStatus !== "idle" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              {STEPS.map((step, index) => {
                const stepStatus = getStepStatus(step.key);
                return (
                  <div key={step.key} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                        stepStatus === "completed" ? "bg-emerald-500" :
                        stepStatus === "active" ? STEP_COLORS[step.key] + " animate-pulse" :
                        "bg-zinc-800"
                      }`}>
                        {stepStatus === "completed" ? (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          <span className="text-xs font-bold text-white">{index + 1}</span>
                        )}
                      </div>
                      {index < STEPS.length - 1 && (
                        <div className={`w-0.5 h-6 mt-1 transition-all duration-500 ${
                          stepStatus === "completed" ? "bg-emerald-500" : "bg-zinc-800"
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold transition-colors duration-300 ${
                          stepStatus === "active" ? "text-white" :
                          stepStatus === "completed" ? "text-emerald-400" :
                          "text-zinc-600"
                        }`}>
                          {step.label}
                        </p>
                        {stepStatus === "active" && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STEP_COLORS[step.key]} text-white`}>
                            Active
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 transition-colors duration-300 ${
                        stepStatus === "pending" ? "text-zinc-700" : "text-zinc-500"
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {escrowStatus !== "released" && (
              <button
                onClick={handleAdvance}
                disabled={loading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-bold text-sm rounded-lg transition-all duration-200 active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Processing...
                  </>
                ) : escrowStatus === "approved" ? "Release Funds" : "Advance to Next Step"}
              </button>
            )}

            {escrowStatus === "released" && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
                <p className="text-emerald-400 font-bold text-sm">🎉 Transaction Complete!</p>
                <p className="text-zinc-500 text-xs mt-1">${amount} has been successfully released to the seller.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}