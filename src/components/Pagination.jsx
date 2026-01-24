export default function Pagination({ pagination, onChangePage }) {
  const handleClick = (e, pageNum) => {
    e.preventDefault();
    onChangePage({ page: pageNum });
  };

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-end">
        <li className={['page-item', !pagination.has_pre ? 'disabled' : null].join(' ')}>
          <a className="page-link" href="/" onClick={e => handleClick(e, pagination.current_page - 1)}>
            Previous
          </a>
        </li>

        {Array.from({ length: pagination.total_pages }, (_, idx) => idx + 1).map(pageNum => (
          <li key={pageNum} className="page-item">
            <a
              className={['page-link', pagination.current_page === pageNum ? 'active pe-none' : null].join(' ')}
              href="/"
              onClick={e => handleClick(e, pageNum)}
            >
              {pageNum}
            </a>
          </li>
        ))}

        <li className={['page-item', !pagination.has_next ? 'disabled' : null].join(' ')}>
          <a className="page-link" href="/" onClick={e => handleClick(e, pagination.current_page + 1)}>
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
}
