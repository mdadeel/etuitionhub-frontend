/**
 * Pagination Component
 * 
 * Reusable pagination controls
 */

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    showPageNumbers = true
}) => {
    if (totalPages <= 1) return null;

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center mt-8">
            <div className="join">
                <button
                    className="join-item btn btn-sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    «
                </button>

                {showPageNumbers && pageNumbers.map(page => (
                    <button
                        key={page}
                        className={`join-item btn btn-sm ${currentPage === page ? 'btn-active bg-teal-600 text-white' : ''}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    className="join-item btn btn-sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    »
                </button>
            </div>
        </div>
    );
};

export default Pagination;
