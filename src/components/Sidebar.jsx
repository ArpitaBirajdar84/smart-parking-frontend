import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CarFront, Car, BookOpen, CreditCard, LogOut } from 'lucide-react';

function Sidebar({ isOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/slots', name: 'Slots', icon: <CarFront size={20} /> },
    { path: '/vehicles', name: 'Vehicles', icon: <Car size={20} /> },
    { path: '/bookings', name: 'Bookings', icon: <BookOpen size={20} /> },
    { path: '/payments', name: 'Payments', icon: <CreditCard size={20} /> },
  ];

  return (
    <div className={`sidebar ${!isOpen ? 'collapsed' : ''} pt-1`}>
      <div className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={!isOpen ? item.name : ''}
          >
            {item.icon}
            {isOpen && <span className="nav-text">{item.name}</span>}
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn btn-danger btn-logout">
          <LogOut size={18} /> 
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
