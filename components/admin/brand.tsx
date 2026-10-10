/** "R ReadyKorea" wordmark. */
export function Brand({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center font-bold ${className}`}>
      <span className="mr-1.5 grid size-6.5 place-items-center rounded-[7px] bg-linear-135 from-amber-200 to-amber-400 text-label font-extrabold text-slate-900">
        R
      </span>
      Ready<span className="text-amber-600">Korea</span>
    </span>
  );
}
