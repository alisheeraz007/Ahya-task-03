export default function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange, isloading, setIsLoading }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1 || isloading) return null;

    const handlePrev = () => {
        setIsLoading(true)
        if (currentPage > 0) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        setIsLoading(true)
        if (currentPage < totalPages - 1) onPageChange(currentPage + 1);
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
            <button
                onClick={handlePrev}
                disabled={currentPage === 0}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => {
                        setIsLoading(true)
                        onPageChange(i)
                    }}
                    className={`px-3 py-1 border rounded ${currentPage === i ? "bg-blue-500 text-white" : ""
                        }`}
                >
                    {i + 1}
                </button>
            ))}

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}