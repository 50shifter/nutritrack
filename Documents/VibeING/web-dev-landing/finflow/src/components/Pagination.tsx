import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

/** Generate page numbers with ellipsis for large page counts */
function getPageNumbers(current: number, total: number): Array<number | "..."> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: Array<number | "..."> = [1];

  // Left window
  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  // Right window
  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}

export default function Pagination({ page, totalPages, totalItems, perPage, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="flex items-center justify-between p-4 border-t border-white/5">
      <p className="text-xs text-white/30">
        Показано {(page - 1) * perPage + 1}–{Math.min(page * perPage, totalItems)} из {totalItems}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-20 disabled:cursor-not-allowed text-white/40"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-20 disabled:cursor-not-allowed text-white/40"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pageNumbers.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-1 text-white/20 select-none">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                page === p
                  ? "bg-white/15 text-white"
                  : "text-white/30 hover:text-white/60 hover:bg-white/5"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-20 disabled:cursor-not-allowed text-white/40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-20 disabled:cursor-not-allowed text-white/40"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
