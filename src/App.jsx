import { useState, useEffect } from "react";
import products from "./data/products.json";

const PAGE_SIZE = 10; // how many products per page

function App() {
  // current page for pagination
  const [page, setPage] = useState(1);

  // selected product for single-page view
  const [selectedProduct, setSelectedProduct] = useState(null);

  // tag search text
  const [tagQuery, setTagQuery] = useState("");

  // filtered list based on tags
  const [filteredProducts, setFilteredProducts] = useState(products);

  // when tagQuery changes, filter products and reset to page 1
  useEffect(() => {
    const q = tagQuery.trim().toLowerCase();

    if (!q) {
      setFilteredProducts(products);
      setPage(1);
      return;
    }

    const next = products.filter((p) =>
      (p.tags || []).some((tag) =>
        String(tag).toLowerCase().includes(q)
      )
    );

    setFilteredProducts(next);
    setPage(1);
  }, [tagQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const start = (page - 1) * PAGE_SIZE;
  const currentProducts = filteredProducts.slice(
    start,
    start + PAGE_SIZE
  );

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  const handleSelectProduct = (product) => setSelectedProduct(product);
  const handleBackToList = () => setSelectedProduct(null);

  // ============== SINGLE PRODUCT VIEW =====================
  if (selectedProduct) {
    const p = selectedProduct;

    return (
      <div className="mw7 center pa4">
        <button
          className="mb3 pa2 br2 ba b--light-gray bg-white dim"
          onClick={handleBackToList}
        >
          ⬅ Back to products
        </button>

        <div className="pa3 ba b--light-gray br2 bg-white shadow-1">
          <h1 className="f3 mb2">{p.name}</h1>
          <p className="f4 b dark-green mb3">${p.price}</p>

          {p.description && (
            <p className="lh-copy mb3">{p.description}</p>
          )}

          {p.category && (
            <p className="mid-gray mb2">Category: {p.category}</p>
          )}

          {p.tags && p.tags.length > 0 && (
            <div className="mt3">
              <span className="b mr2">Tags:</span>
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="dib ph2 pv1 br2 bg-light-gray dark-gray mr2 mb2"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============== LIST VIEW WITH PAGINATION ===============
  return (
    <div className="mw8 center pa4">
      <h1 className="tc f2 mb4">Products</h1>

      {/* Tag search / filter */}
      <div className="mb4 flex items-center">
        <label className="mr2 b">Filter by tag:</label>
        <input
          className="input-reset ba b--light-gray pa2 br2 w-100"
          type="text"
          placeholder="e.g. laptop, phone, gaming…"
          value={tagQuery}
          onChange={(e) => setTagQuery(e.target.value)}
        />
      </div>

      {/* Product list */}
      {currentProducts.length === 0 ? (
        <p className="tc mid-gray">No products match that tag.</p>
      ) : (
        <div className="flex flex-wrap">
          {currentProducts.map((p) => (
            <div
              key={p.id}
              className="ba b--light-gray br2 pa3 ma2 bg-white shadow-1 w-30"
            >
              <h2 className="f4 mb2">{p.name}</h2>
              <p className="mb2 dark-green b">${p.price}</p>

              {p.tags && p.tags.length > 0 && (
                <div className="mb2">
                  {p.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="dib ph2 pv1 br2 bg-light-gray dark-gray mr2 mb2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <button
                className="mt2 f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue"
                onClick={() => handleSelectProduct(p)}
              >
                View details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="tc mt4">
        <button
          className="mr2 pa2 br2 ba b--light-gray bg-white dim"
          disabled={page === 1}
          onClick={handlePrevPage}
        >
          Previous
        </button>

        <span className="ph3">
          Page {page} of {totalPages}
        </span>

        <button
          className="ml2 pa2 br2 ba b--light-gray bg-white dim"
          disabled={page === totalPages}
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
