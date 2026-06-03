import { useEffect, useState } from 'react';
import api from '../api';
import { Car, Layers, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import SubDashboard from '../components/SubDashboard';

function Dashboard() {
  const [stats, setStats] = useState({ vehicles: 0, slots: 0, payments: 0 });
  const [activeVehicles, setActiveVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [revRes, vehiclesRes, slotsRes, allVehiclesRes] = await Promise.all([
        api.get('/analytics/daily-revenue'),
        api.get('/analytics/active-vehicles'),
        api.get('/slots/all'),
        api.get('/vehicles/all')
      ]);

      let totalP = 0;
      if (revRes.data.success && revRes.data.data.length > 0) {
        const revenueData = revRes.data.data;
        totalP = revenueData.reduce((sum, item) => sum + (item.totalPayments || 0), 0);
      }

      const actV = vehiclesRes.data.success ? vehiclesRes.data.data : [];
      const totSlots = slotsRes.data.success ? slotsRes.data.data.length : 0;
      const totVehicles = allVehiclesRes.data.success ? allVehiclesRes.data.data.length : 0;

      setStats({ vehicles: totVehicles, slots: totSlots, payments: totalP });
      setActiveVehicles(actV);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(activeVehicles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activeVehicles.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <div className="page-header pb-15">
        <h2 className="dashboard-title m-0">Dashboard</h2>
      </div>

      <div className="grid-3 mb-15">
        <div className="stat-card mb-0">
          <div className="stat-icon stat-icon-indigo">
            <Car size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Vehicles</h3>
            <p>{stats.vehicles}</p>
          </div>
        </div>

        <div className="stat-card mb-0">
          <div className="stat-icon stat-icon-amber">
            <Layers size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Slots</h3>
            <p>{stats.slots}</p>
          </div>
        </div>

        <div className="stat-card mb-0">
          <div className="stat-icon stat-icon-emerald">
            <CreditCard size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Payments</h3>
            <p>{stats.payments}</p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card card-flex-col">
          <div className="card-header">
            <h3 className="card-title">Active Booking Table</h3>
          </div>
          <div className="table-container flex-1-col table-scroll-400">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vehicle No.</th>
                  <th>Type</th>
                  <th>Slot</th>
                  <th>Entry Time</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((v, i) => (
                    <tr key={i}>
                      <td className="fw-500">{v.vehicleNumber}</td>
                      <td><span className="badge badge-info">{v.vehicleType}</span></td>
                      <td>{v.slotNumber}</td>
                      <td>{new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center-p2 text-slate-500 p-2rem">No active bookings</td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Prev
                </button>
                <span className="pagination-text">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card card-flex-col">
          <div className="card-header">
            <h3 className="card-title">Payment Graph</h3>
          </div>
          <div className="card-body">
            <SubDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
