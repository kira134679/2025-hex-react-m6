import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import * as z from 'zod';
import { guestOrderApi } from '../../api/order';
import Loading from '../../components/Loading';
import { deleteCartItem, getCart, selectCartList, selectTotal } from '../../slice/cartSlice';
import { createOrder } from '../../slice/orderSlice';

const checkoutSchema = z.object({
  name: z.string().min(1, { error: '姓名為必填' }),
  email: z.email({ error: 'Email 格式錯誤' }),
  tel: z.string().refine(tel => /^09\d{8}$/.test(tel), { error: '手機號碼格式錯誤' }),
  address: z.string().min(1, { error: '地址為必填' }),
  message: z.string(),
});

export default function Cart() {
  const cartList = useSelector(selectCartList);
  const totalPrice = useSelector(selectTotal);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(checkoutSchema) });

  const onCheckout = async data => {
    try {
      setIsLoading(true);
      const { name, email, tel, address, message } = data;
      const payload = {
        user: {
          name,
          email,
          tel,
          address,
        },
        message,
      };

      const res = await dispatch(createOrder(payload)).unwrap();
      setIsLoading(false);
      navigate('/');

      toast.success(res.message);
    } catch (error) {
      setIsLoading(false);
      toast.error(error);
    }
  };

  const handleDeleteCartItem = async itemId => {
    try {
      setIsLoading(true);
      const res = await dispatch(deleteCartItem(itemId)).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isProductsInCart = cartList.length > 0;

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  if (!isProductsInCart)
    return (
      <div className="container">
        <div className="py-5 d-flex justify-content-center">
          <div className="d-flex flex-column justify-content-center">
            <p className="fs-5 fw-bold mb-3">購物車內無商品。</p>
            <Link to={'/products'} className="btn btn-primary">
              前往選購
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="container">
        <div className="py-5">
          <h2>購物車</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">品項</th>
                <th scope="col">數量</th>
                <th scope="col">小計</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {cartList.map(item => (
                <tr key={item.product.id}>
                  <td>{item.product.title}</td>
                  <td>{item.qty}</td>
                  <td>{`NT$${item.final_total}`}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => handleDeleteCartItem(item.id)}
                    >
                      移除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="2" className="text-end">
                  總計
                </th>
                <td>
                  <p className="fs-5 fw-bold">{`NT$${totalPrice}`}</p>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="container">
        <h3 className="mb-3">付款資料</h3>
        <form onSubmit={handleSubmit(onCheckout)}>
          <div className="d-flex flex-column row-gap-3">
            <div>
              <label htmlFor="name" className="form-label">
                姓名
              </label>
              <strong className="text-danger ms-1">*</strong>
              <input type="text" id="name" className="form-control" placeholder="請輸入姓名" {...register('name')} />
              {errors.name && <p className="text-danger">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <strong className="text-danger ms-1">*</strong>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="example@mail.com"
                {...register('email')}
              />
              {errors.email && <p className="text-danger">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="name" className="form-label">
                聯絡電話(手機)
              </label>
              <strong className="text-danger ms-1">*</strong>
              <input
                type="tel"
                id="tel"
                className="form-control"
                placeholder="請輸入台灣手機號碼(10位數字)。例：0912345678"
                {...register('tel')}
              />
              {errors.tel && <p className="text-danger">{errors.tel.message}</p>}
            </div>
            <div>
              <label htmlFor="address" className="form-label">
                地址
              </label>
              <strong className="text-danger ms-1">*</strong>
              <input
                type="text"
                id="address"
                className="form-control"
                placeholder="請輸入地址"
                {...register('address')}
              />
              {errors.address && <p className="text-danger">{errors.address.message}</p>}
            </div>
            <div>
              <label htmlFor="message" className="form-label">
                留言(選填)
              </label>
              <textarea
                type="text"
                id="message"
                className="form-control"
                placeholder="有其他想說的嗎?"
                {...register('message')}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            送出訂單
          </button>
        </form>
      </div>
    </>
  );
}
