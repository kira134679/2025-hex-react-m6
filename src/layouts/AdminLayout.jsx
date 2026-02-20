import { Outlet } from 'react-router';

export default function AdminLayout() {
  return (
    <>
      <header>
        <div className="container">後台</div>
      </header>
      <Outlet />
    </>
  );
}
