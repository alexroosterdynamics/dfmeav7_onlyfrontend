// src/components/RequirementsViewport.jsx
import { Cpu, Zap, Wrench, Paperclip, CheckCircle2, AlertTriangle } from "lucide-react";

const ICONS = { Software: Cpu, Electrical: Zap, Mechanical: Wrench };

function Pill({ tone = "neutral", children }) {
  const colors = {
    bad: "bg-amber-50 border-amber-200/70 text-amber-900",
    good: "bg-emerald-50 border-emerald-200/70 text-emerald-900",
    neutral: "bg-[#fbfbfa] border-zinc-200/80 text-zinc-700"
  };
  return (
    <span className={`text-[11px] px-2 py-1 rounded-full border tracking-tight ${colors[tone]}`}>
      {children}
    </span>
  );
}

export default function RequirementsViewport({ data }) {
  const projectName = data?.content?.projectName || "DFMEA Project";
  const requirements = data?.content?.requirements || [];
  
  const buckets = { Software: [], Electrical: [], Mechanical: [] };
  requirements.forEach(r => buckets[r.domainCategory || "Software"].push(r));

  return (
    <div className="pb-24">
      <div className="max-w-6xl mx-auto px-10 pt-12 pb-5">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-[40px] leading-[1.12] font-semibold tracking-tight">Requirements</div>
            <div className="mt-2 text-[13px] text-zinc-600">
              Project • <span className="text-zinc-900 font-medium">{projectName}</span>
            </div>
          </div>
          <div className="pt-2 flex gap-2">
            <button disabled className="rounded-xl px-3 py-2 bg-zinc-900 text-white opacity-70 cursor-not-allowed text-[12px] font-medium">
              Add
            </button>
            <Pill tone="bad"><AlertTriangle size={12} /> 2 flagged</Pill>
            <Pill tone="good"><CheckCircle2 size={12} /> 8/10 frozen</Pill>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-10 space-y-5">
        {Object.entries(buckets).map(([domain, items]) => {
          if (!items.length) return null;
          const Icon = ICONS[domain];
          
          return (
            <div key={domain} className="rounded-xl border border-zinc-200/80 bg-white shadow-[0_1px_0_rgba(0,0,0,0.05),0_14px_40px_rgba(0,0,0,0.06)]">
              <div className="px-4 py-3 border-b border-zinc-200/70 bg-[#fbfbfa] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl border border-zinc-200/80 bg-white grid place-items-center">
                    <Icon size={16} strokeWidth={1.8} className="text-zinc-800" />
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-zinc-900">{domain}</div>
                    <div className="text-[11px] text-zinc-500">{items.length} total</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Pill tone="bad">1 unfrozen</Pill>
                  <Pill tone="good">0 flagged</Pill>
                </div>
              </div>

              <div className="p-4 grid grid-cols-3 gap-4">
                {items.map(r => (
                  <div key={r.id} className="rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_0_rgba(0,0,0,0.05),0_10px_24px_rgba(0,0,0,0.06)] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-[11px] text-zinc-500">{r.id}</div>
                          {r.isComplete ? <CheckCircle2 size={14} className="text-zinc-900" /> : <AlertTriangle size={14} className="text-zinc-600" />}
                        </div>
                        <div className="mt-1 text-[13px] font-semibold text-zinc-900 line-clamp-2">{r.text}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {r.reqType && <Pill>{r.reqType}</Pill>}
                      <Pill>{r.priority || "—"}</Pill>
                      <Pill tone={r.isComplete ? "good" : "neutral"}>{r.isComplete ? "Frozen" : "Incomplete"}</Pill>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
                      <div>{r.ownerRole || "Owner"} • {r.ownerName || "—"}</div>
                      <div className="flex items-center gap-2">
                        <Paperclip size={14} strokeWidth={1.7} />
                        {r.files?.length || 0}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}