import { NavLink, Outlet } from 'react-router';

const navItems = [
  { path: '/', name: '首頁' },
  { path: '/products', name: '產品列表' },
  { path: '/cart', name: '購物車' },
];

export default function FrontendLayout() {
  return (
    <>
      <header className="sticky-top bg-white">
        <nav className="py-2 shadow">
          <ul className="list-unstyled d-flex justify-content-center gap-3">
            {navItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    ['text-decoration-none', isActive ? 'text-danger fw-bold' : null].join(' ')
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <div className="py-1 mt-4">
        <Outlet />
      </div>
    </>
  );
}
