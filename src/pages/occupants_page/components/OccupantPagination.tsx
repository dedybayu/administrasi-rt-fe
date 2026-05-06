import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OccupantPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function OccupantPagination({
  page,
  totalPages,
  onPageChange
}: OccupantPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-3 mt-12">
      <button 
        className="btn btn-sm btn-outline btn-square" 
        onClick={() => onPageChange(Math.max(1, page - 1))} 
        disabled={page === 1}
      >
        <ChevronLeft size={18} />
      </button>
      <div className="join">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`join-item btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button 
        className="btn btn-sm btn-outline btn-square" 
        onClick={() => onPageChange(Math.min(totalPages, page + 1))} 
        disabled={page === totalPages}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
