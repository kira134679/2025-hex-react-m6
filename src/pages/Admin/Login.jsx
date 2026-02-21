import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router';
import * as z from 'zod';
import Loading from '../../components/Loading';
import { login, selectIsAuth, selectIsAuthChecked, verifyAuth } from '../../slice/authSlice';

const adminAuthSchema = z.object({
  username: z.email({ error: 'Email 格式錯誤' }),
  password: z
    .string()
    .min(6, { error: '長度至少6個字元' })
    .max(16, { error: '長度最多16個字元' })
    .refine(pwd => /[A-Z]/.test(pwd), { error: '至少包含1個大寫字母' })
    .refine(pwd => /[a-z]/.test(pwd), { error: '至少包含1個小寫字母' })
    .refine(pwd => /\d/.test(pwd), { error: '至少包含1位數字' }),
});

export default function Login() {
  const isAuth = useSelector(selectIsAuth);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(adminAuthSchema), criteriaMode: 'all' });

  const navigate = useNavigate();
  const onSubmit = async submitData => {
    try {
      const res = await dispatch(login(submitData)).unwrap();
      const { success, token, expired } = res;

      if (success) {
        Cookies.set('hex_token', token, { expires: new Date(expired) });
        navigate('/admin/products');
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const dispatch = useDispatch();
  useEffect(() => {
    const verify = async () => {
      try {
        await dispatch(verifyAuth()).unwrap();
      } catch (error) {
        toast.error(error);
      }
    };
    verify();
  }, [dispatch]);

  if (isAuth) return <Navigate to="/admin/products" replace />;

  return (
    <>
      <Loading isLoading={!isAuthChecked || isSubmitting} />
      <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
        <div className="row justify-content-center">
          <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
          <div className="col-8">
            <form id="form" className="form-signin" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="name@example.com"
                  {...register('username', { required: true, autoFocus: true })}
                />
                <label htmlFor="username">Email address</label>
              </div>
              <p className="text-danger">{errors.username?.message}</p>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Password"
                  {...register('password', { required: true })}
                />
                <label htmlFor="password">Password</label>
              </div>
              {errors.password?.types && (
                <ul className="list-unstyled d-flex flex-column gap-1">
                  {Object.values(errors.password.types)
                    .flatMap(item => (Array.isArray(item) ? item : [item]))
                    .map((item, idx) => (
                      <li key={idx} className="text-danger">
                        {item}
                      </li>
                    ))}
                </ul>
              )}
              <button className="btn btn-lg btn-primary w-100 mt-3" type="submit" disabled={isSubmitting}>
                登入
              </button>
            </form>
          </div>
        </div>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>
    </>
  );
}
