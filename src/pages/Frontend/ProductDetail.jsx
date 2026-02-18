import { useLocation, useNavigate, useNavigation } from 'react-router';
import NotFound from './NotFound';

export default function ProductDetail() {
  const { state } = useLocation();
  const productData = state.product ?? null;

  if (!productData) {
    return <NotFound />;
  } else {
    return (
      <div className="container">
        <h2>{productData.title}</h2>
      </div>
    );
  }
}
