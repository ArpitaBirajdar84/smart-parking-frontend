import { User, IndianRupee, Menu, CarFront } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';

function Header({ toggle }) {
  const { data: totalRevenue = 0 } = useQuery({
    queryKey: ['total-revenue'],
    queryFn: async () => {
      const res = await api.get('/analytics/daily-revenue');
      if (res.data.success && res.data.data.length > 0) {
        return res.data.data.reduce((sum, item) => sum + (item.totalRevenue || 0), 0);
      }
      return 0;
    }
  });

  return (
    <header className="top-header p-0">
      <div className="flex-center-h100">
        <div className="header-brand-container">
          <button onClick={toggle} className="btn-icon-toggle">
            <Menu size={24} />
          </button>
          <div className="flex-center-gap05">
            <div className="text-primary-flex">
              <CarFront size={24} />
            </div>
            <span className="brand-text">SPMS</span>
          </div>
        </div>
      </div>
      
      <div className="header-actions">
        <div className="status-online" style={{ color: '#059669' }}>
          <IndianRupee size={18} />
          <span style={{ fontSize: '1.1rem' }}>{totalRevenue.toFixed(2)}</span>
        </div>
        
        <div className="flex-center-gap05">
          <div className="avatar-circle">
            <User size={20} />
          </div>
          <span className="fw-500">Admin</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
