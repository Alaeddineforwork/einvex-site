import ScholarConsensusCircle from "./scholar-consensus-circle";
import {
  FinalStatus,
  NormResult,
  formatNormStatus,
  getConsensusCircleColor,
  getConsensusScore,
  getHelperText,
  getStatusStyle,
} from "./screening-data";

type ScreeningSummaryProps = {
  norms: NormResult[];
  finalStatus: FinalStatus;
  className?: string;
};

export default function ScreeningSummary({
  norms,
  finalStatus,
  className = "",
}: ScreeningSummaryProps) {
  const consensusScore = getConsensusScore(norms);
  const helperText = getHelperText(norms);
  const circleColors = getConsensusCircleColor(finalStatus);

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 ${className}`.trim()}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-label">Scholar Consensus</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{helperText}</p>
        </div>

        <ScholarConsensusCircle
          percentage={consensusScore}
          strokeColor={circleColors.stroke}
          trackColor={circleColors.track}
          textClassName={circleColors.text}
          size={76}
          strokeWidth={7}
        />
      </div>

      <details className="mt-4 group">
        <summary className="cursor-pointer list-none py-1.5 text-sm font-medium text-slate-700 transition hover:text-slate-950">
          <span className="inline-flex items-center gap-2">
            <span>View screening sources</span>
            <span className="text-slate-400 transition group-open:rotate-180">v</span>
          </span>
        </summary>

        <div className="mt-4 space-y-3 border-t border-slate-200/80 pt-4">
          {norms.map((norm) => {
            const formattedStatus = formatNormStatus(norm.status);

            return (
              <div key={norm.name} className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{norm.name}</span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                    formattedStatus
                  )}`}
                >
                  {formattedStatus}
                </span>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}
