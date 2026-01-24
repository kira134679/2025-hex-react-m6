import { Modal } from 'bootstrap';
import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { authApi, productsApi } from './api';
import Login from './components/Login';
import Pagination from './components/Pagination';
import ProductModal from './components/ProductModal';

const TEMP_PRODUCT_DATA = {
  title: '',
  category: '',
  origin_price: '',
  price: '',
  unit: '',
  description: '',
  content: '',
  is_enabled: false,
  imageUrl: '',
  imagesUrl: [],
};

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(TEMP_PRODUCT_DATA);

  const productModalRef = useRef(null);

  const [mode, setMode] = useState('');

  const [pagination, setPagination] = useState({});

  // form start

  const handleModalInputChange = e => {
    const { name, value, type, checked } = e.target;
    setTempProduct(prevData => ({ ...prevData, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleModalImagesChange = (idx, url) => {
    setTempProduct(prev => {
      const newImagesUrl = [...prev.imagesUrl];
      newImagesUrl[idx] = url;
      return { ...prev, imagesUrl: newImagesUrl };
    });
  };

  const handleAddImage = () => {
    setTempProduct(prev => {
      const newImagesUrl = [...prev.imagesUrl];
      newImagesUrl.push('');
      return { ...prev, imagesUrl: newImagesUrl };
    });
  };

  const handleDeleteImage = () => {
    setTempProduct(prev => {
      const newImagesUrl = [...prev.imagesUrl];
      newImagesUrl.pop('');
      return { ...prev, imagesUrl: newImagesUrl };
    });
  };

  // form end

  // model start

  const showModal = (mode, preFillData) => {
    setMode(mode);
    // NOTICE: 以上一次的狀態來合併資料，若有差異時可能會造成不正確的合併。
    // 所以用初始狀態來合併。
    setTempProduct({ ...TEMP_PRODUCT_DATA, ...preFillData });
    productModalRef.current.show();
  };

  const hideModal = () => {
    setMode('');
    productModalRef.current.hide();
  };

  // modal end

  // product start

  const getProducts = async (params = {}) => {
    try {
      const result = await productsApi.getProducts(params);

      setProducts(result?.products);
      setPagination(result?.pagination);
    } catch (error) {
      toast.error(error);
    }
  };

  const updateProduct = async id => {
    let res;
    const payload = {
      ...tempProduct,
      origin_price: Number(tempProduct.origin_price),
      price: Number(tempProduct.price),
      is_enabled: tempProduct.is_enabled ? 1 : 0,
      imagesUrl: [...tempProduct.imagesUrl.filter(url => url !== '')], // 淺拷貝 tempProduct.imagesUrl 再把 filter 結果賦予回去
    };

    try {
      if (mode === 'edit') {
        res = await productsApi.updateProduct(id, payload);
      } else if (mode === 'create') {
        res = await productsApi.createProduct(payload);
      } else {
        throw new Error('未預期的錯誤!');
      }
      getProducts(); // 重新取得資料
      hideModal();
      toast.success(res.message);
    } catch (error) {
      toast.error(error.join('\n'));
    }
  };

  const deleteProduct = async id => {
    try {
      const res = await productsApi.deleteProduct(id);
      getProducts();
      hideModal();
      toast.success(res.message);
    } catch (error) {
      toast.error(error);
    }
  };

  // product end

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await authApi.check();
        setIsAuth(!!res?.success);
      } catch (error) {
        setIsAuth(false);
        toast.error(error);
      } finally {
        setIsAuthChecked(true);
      }
    };

    verify();
  }, []);

  useEffect(() => {
    if (!isAuth) return;

    productModalRef.current = new Modal('#productModal', { keyboard: false });

    // Modal 關閉時移除焦點
    document.querySelector('#productModal').addEventListener('hide.bs.modal', () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });

    getProducts();
  }, [isAuth]);

  if (!isAuthChecked) return <>載入中...</>;

  return (
    <>
      <Toaster />
      {isAuth ? (
        <div>
          <div className="container">
            <div className="text-end mt-4">
              <button className="btn btn-primary" onClick={() => showModal('create', TEMP_PRODUCT_DATA)}>
                建立新的產品
              </button>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th width="120">分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="100">是否啟用</th>
                  <th width="120">編輯</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.category}</td>
                    <td>{product.title}</td>
                    <td className="text-end">{product.origin_price}</td>
                    <td className="text-end">{product.price}</td>
                    <td>{product.is_enabled ? <span className="text-success">啟用</span> : <span>未啟用</span>}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => showModal('edit', product)}
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => showModal('delete', product)}
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pagination && <Pagination pagination={pagination} onChangePage={getProducts} />}
          </div>
        </div>
      ) : (
        <Login setIsAuth={setIsAuth} setIsAuthChecked={setIsAuthChecked} />
      )}
      <ProductModal
        mode={mode}
        tempProduct={tempProduct}
        handleModalInputChange={handleModalInputChange}
        handleModalImagesChange={handleModalImagesChange}
        handleAddImage={handleAddImage}
        handleDeleteImage={handleDeleteImage}
        updateProduct={updateProduct}
        deleteProduct={deleteProduct}
        hideModal={hideModal}
      />
    </>
  );
}

export default App;
