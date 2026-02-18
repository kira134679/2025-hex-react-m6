import App from '../App';
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
      { index: true, Component: Home },
      { path: 'products', Component: Products },
      { path: 'products/:productId', Component: ProductDetail },
      { path: 'cart', Component: Cart },
    ],
  },
  {
    path: '*',
    Component: NotFound,
  },
];
