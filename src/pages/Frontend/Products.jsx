import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import Loading from '../../components/Loading';
import { addToCart } from '../../slice/cartSlice';
import { getProducts, selectProductList } from '../../slice/productSlice';

export default function Products() {
  const products = useSelector(selectProductList);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleAddToCart = async id => {
    try {
      setIsLoading(true);
      const res = await dispatch(addToCart({ product_id: id, qty: 1 })).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="container">
        <div className="py-5 row row-cols-3 row-gap-3">
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
                      <button
                        type="button"
                        className="btn btn-primary position-relative"
                        style={{ zIndex: 10 }}
                        onClick={() => handleAddToCart(product.id)}
                      >
                        加入購物車
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
