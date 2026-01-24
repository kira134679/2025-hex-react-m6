export default function ProductModal({
  mode,
  tempProduct,
  handleModalInputChange,
  handleModalImagesChange,
  handleAddImage,
  handleDeleteImage,
  updateProduct,
  deleteProduct,
  hideModal,
}) {
  return (
    <div id="productModal" className="modal fade" tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
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
  );
}
