import { Modal } from 'bootstrap';
import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { authApi, productsApi } from './api';
import Login from './components/Login';

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
  const productModal = useRef(null);

  const [mode, setMode] = useState('');

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
    productModal.current.show();
  };

  const hideModal = () => {
    setMode('');
    productModal.current.hide();
  };

  // modal end

  // product start

  const getProducts = async () => {
    try {
      const result = await productsApi.getProducts();

      setProducts(result?.products);
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

    productModal.current = new Modal(productModalRef.current);

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
          </div>
        </div>
      ) : (
        <Login setIsAuth={setIsAuth} setIsAuthChecked={setIsAuthChecked} />
      )}
      <div
        id="productModal"
        ref={productModalRef}
        className="modal fade"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content border-0">
            <div className="modal-header bg-dark text-white">
              <h5 id="productModalLabel" className="modal-title">
                <span>{mode === 'delete' ? '刪除產品' : mode === 'edit' ? '編輯產品' : '新增產品'}</span>
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {mode === 'delete' ? (
                <p className="h5">
                  確定要刪除<span className="fw-bold text-danger">{tempProduct.title}</span>嗎?
                </p>
              ) : (
                <div className="row">
                  <div className="col-sm-4">
                    <div className="mb-2">
                      <div className="mb-3">
                        <label htmlFor="imageUrl" className="form-label">
                          輸入主圖網址
                        </label>
                        <input
                          id="imageUrl"
                          name="imageUrl"
                          type="text"
                          className="form-control"
                          placeholder="請輸入主圖連結"
                          value={tempProduct.imageUrl}
                          onChange={handleModalInputChange}
                        />
                      </div>
                      {tempProduct.imageUrl && <img className="img-fluid" src={tempProduct.imageUrl} alt="主圖" />}
                    </div>
                    {tempProduct.imagesUrl.map((url, idx) => (
                      <div className="mb-3" key={idx}>
                        <label htmlFor={`imagesUrl${idx}`} className="form-label">
                          輸入圖片網址
                        </label>
                        <input
                          id={`imagesUrl${idx}`}
                          type="text"
                          className="form-control"
                          placeholder="請輸入圖片連結"
                          value={url}
                          onChange={e => handleModalImagesChange(idx, e.target.value)}
                        />
                        {url && <img className="img-fluid" src={url} alt={`圖片${idx + 1}`} />}
                      </div>
                    ))}
                    <div>
                      <button className="btn btn-outline-primary btn-sm d-block w-100" onClick={handleAddImage}>
                        新增圖片
                      </button>
                    </div>
                    <div>
                      <button className="btn btn-outline-danger btn-sm d-block w-100" onClick={handleDeleteImage}>
                        刪除圖片
                      </button>
                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        標題
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        className="form-control"
                        placeholder="請輸入標題"
                        value={tempProduct.title}
                        onChange={handleModalInputChange}
                      />
                    </div>

                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="category" className="form-label">
                          分類
                        </label>
                        <input
                          id="category"
                          name="category"
                          type="text"
                          className="form-control"
                          placeholder="請輸入分類"
                          value={tempProduct.category}
                          onChange={handleModalInputChange}
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="unit" className="form-label">
                          單位
                        </label>
                        <input
                          id="unit"
                          name="unit"
                          type="text"
                          className="form-control"
                          placeholder="請輸入單位"
                          value={tempProduct.unit}
                          onChange={handleModalInputChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="origin_price" className="form-label">
                          原價
                        </label>
                        <input
                          id="origin_price"
                          name="origin_price"
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder="請輸入原價"
                          value={tempProduct.origin_price}
                          onChange={handleModalInputChange}
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="price" className="form-label">
                          售價
                        </label>
                        <input
                          id="price"
                          name="price"
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder="請輸入售價"
                          value={tempProduct.price}
                          onChange={handleModalInputChange}
                        />
                      </div>
                    </div>
                    <hr />

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        產品描述
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        placeholder="請輸入產品描述"
                        value={tempProduct.description}
                        onChange={handleModalInputChange}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="content" className="form-label">
                        說明內容
                      </label>
                      <textarea
                        id="content"
                        name="content"
                        className="form-control"
                        placeholder="請輸入說明內容"
                        value={tempProduct.content}
                        onChange={handleModalInputChange}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          id="is_enabled"
                          className="form-check-input"
                          name="is_enabled"
                          type="checkbox"
                          checked={tempProduct.is_enabled}
                          onChange={handleModalInputChange}
                        />
                        <label className="form-check-label" htmlFor="is_enabled">
                          是否啟用
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={hideModal}>
                取消
              </button>
              {mode === 'delete' ? (
                <button type="button" className="btn btn-danger" onClick={() => deleteProduct(tempProduct.id)}>
                  刪除
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={() => updateProduct(tempProduct.id)}>
                  確認
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
