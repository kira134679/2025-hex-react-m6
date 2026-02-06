import App from '../App';
import Cart from '../pages/Frontend/Cart';
import Home from '../pages/Frontend/Home';
import ProductDetail from '../pages/Frontend/ProductDetail';
import Products from '../pages/Frontend/Products';

export const routes = [
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: Home },
      { path: 'products', Component: Products },
      { path: 'product/:productId', Component: ProductDetail },
      { path: 'cart', Component: Cart },
    ],
  },
];
