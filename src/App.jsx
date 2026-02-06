import { Outlet } from 'react-router';
import FrontendLayout from './layouts/FrontendLayout';

export default function App() {
  return (
    <FrontendLayout>
      <Outlet />
    </FrontendLayout>
  );
}
