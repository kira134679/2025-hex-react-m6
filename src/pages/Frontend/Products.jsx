import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { guestProductsApi } from '../../api';

export default function Products() {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const res = await guestProductsApi.getProducts();
      setProducts(res.products);
    } catch (error) {
      setProducts([]);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="container">
      <div className="row row-cols-3 row-gap-3">
        {products.length > 0 &&
          products.map(product => (
            <div className="col" key={product.id}>
              <div className="card h-100">
                <img src={product.imageUrl} className="card-img-top images object-fit-cover" alt={product.title} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">
                    <Link
                      to={`/products/${product.id}`}
                      className="stretched-link text-decoration-none"
                      state={{ product }}
                    >
                      {product.title}
                    </Link>
                  </h5>
                  <div className="d-flex">
                    <p className="card-text text-bold">{`NT$${product.price.toLocaleString()}`}</p>
                    {product.price < product.origin_price && (
                      <s className="text-secondary ms-3">{product.origin_price.toLocaleString()}</s>
                    )}
                  </div>
                  <div className="text-end mt-auto">
                    <button type="button" className="btn btn-primary position-relative" style={{ zIndex: 10 }}>
                      加入購物車
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
