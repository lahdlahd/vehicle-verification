"use client";
import { useState } from "react";

interface AIRiskAssistantProps {
  vin: string;
  status: string;
  description: string;
}

const SUGGESTED_QUESTIONS = [
  "Is this car safe to buy?",
  "What problems can I expect?",
  "Should I be worried about this damage?",
  "What is the estimated repair cost?",
];

export default function AIRiskAssistant({ vin, status, description }: AIRiskAssistantProps) {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (q?: string) => {
    const finalQuestion = q || question.trim();
    if (!finalQuestion) return;

    setLoading(true);
    setError(null);
    setResponse(null);
    setQuestion(finalQuestion);

    try {
      const res = await fetch("/api/ai-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vin, status, description, question: finalQuestion }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResponse(data.response);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAsk();
  };

  // Format markdown-style bold text
  const formatResponse = (text: string) => {
    return text.split("\n").map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return (
        <p
          key={i}
          className={`text-sm leading-relaxed ${line.startsWith("**") ? "text-white font-semibold mt-3" : "text-zinc-400"} ${line === "" ? "mt-2" : ""}`}
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
          <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">AI Risk Assistant</p>
          <p className="text-xs text-zinc-500">Powered by Claude</p>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-5">
        {/* Suggested questions */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Suggested Questions</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleAsk(q)}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-full bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white hover:border-violet-500/40 hover:bg-violet-500/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about this vehicle..."
            disabled={loading}
            className="flex-1 bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all duration-200 disabled:opacity-50"
          />
          <button
            onClick={() => handleAsk()}
            disabled={question.trim().length === 0 || loading}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold text-sm rounded-lg transition-all duration-200 shrink-0 active:scale-95 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.269 20.876L5.999 12zm0 0h7.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <svg className="w-3.5 h-3.5 animate-spin text-violet-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Analyzing vehicle record...
            </div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`h-3 bg-zinc-800 rounded animate-pulse ${i === 3 ? "w-2/3" : "w-full"}`} />
              ))}
            </div>
          </div>
        )}

        {/* Response */}
        {response && !loading && (
          <div className="bg-zinc-950 border border-white/5 rounded-lg p-5 flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs text-violet-400 font-semibold">AI Risk Analysis</span>
            </div>
            {formatResponse(response)}
          </div>
        )}
      </div>
    </div>
  );
}