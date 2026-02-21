import AdminProducts from '../pages/Admin/Products';
import App from '../App';
import AdminLayout from '../layouts/AdminLayout';
import FrontendLayout from '../layouts/FrontendLayout';
import Login from '../pages/Admin/Login';
import Cart from '../pages/Frontend/Cart';
import Home from '../pages/Frontend/Home';
import NotFound from '../pages/Frontend/NotFound';
import ProductDetail from '../pages/Frontend/ProductDetail';
import Products from '../pages/Frontend/Products';

export const routes = [
  {
    path: '/',
    Component: App,
    children: [
      {
        Component: FrontendLayout,
        children: [
          { index: true, Component: Home },
          { path: 'products', Component: Products },
          { path: 'products/:productId', Component: ProductDetail },
          { path: 'cart', Component: Cart },
          { path: 'login', Component: Login },
        ],
      },
      {
        path: 'admin',
        Component: AdminLayout,
        children: [{ path: 'products', Component: AdminProducts }],
      },
    ],
  },
  {
    path: '*',
    Component: NotFound,
  },
];
