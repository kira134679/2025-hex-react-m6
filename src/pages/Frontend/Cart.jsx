import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export default function Cart() {
  const checkoutSchema = z.object({
    name: z.string().min(1, { error: '姓名為必填' }),
    email: z.email({ error: 'Email 格式錯誤' }),
    tel: z.string().refine(tel => /^09\d{8}$/.test(tel), { error: '手機號碼格式錯誤' }),
    address: z.string().min(1, { error: '地址為必填' }),
    message: z.string(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(checkoutSchema) });

  const onCheckout = async data => {
    const payload = {
      user: {
        name: data.name,
        email: data.email,
        tel: data.tel,
        address: data.address,
      },
      message: data.message,
    };
    console.log('checkout', payload);
  };

  return (
    <>
      <div className="container">
        <h2>購物車</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">品項</th>
              <th scope="col">數量</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>John</td>
              <td>Doe</td>
              <td>@social</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="container">
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
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
