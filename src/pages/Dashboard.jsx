import { useEffect, useState } from 'react';
import api from '../api';
import { Car, Layers, CreditCard } from 'lucide-react';
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
      console.log("Fetching dashboard data...");
      
      const slotsRes = await api.get('/api/slots');
      const vehiclesRes = await api.get('/api/vehicles');
      const bookingsRes = await api.get('/api/bookings');

      console.log("Slots response:", slotsRes.data);
      console.log("Vehicles response:", vehiclesRes.data);
      console.log("Bookings response:", bookingsRes.data);

      // Slots data
      const totalSlots = slotsRes.data?.length || 0;
      
      // Vehicles data  
      const totalVehicles = vehiclesRes.data?.length || 0;
      
      // Active bookings
      let activeBookingsList = [];
      if (Array.isArray(bookingsRes.data)) {
        activeBookingsList = bookingsRes.data.filter(b => b.status === 'active');
      }
      
      const activeVehiclesList = activeBookingsList.map(booking => ({
        vehicleNumber: booking.vehicleNumber || 'N/A',
        vehicleType: booking.vehicleType || 'N/A',
        slotNumber: booking.slotNumber || 'N/A',
        entryTime: booking.entryTime || new Date()
      }));

      setStats({ 
        vehicles: totalVehicles, 
        slots: totalSlots, 
        payments: 0 
      });
      setActiveVehicles(activeVehiclesList);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const totalPages = Math.ceil(activeVehicles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activeVehicles.slice(indexOfFirstItem, indexOfLastItem);

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
            <p>₹{stats.payments}</p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card card-flex-col">
          <div className="card-header">
            <h3 className="card-title">Active Booking Table</h3>
          </div>
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
                    <td>{v.vehicleNumber}</td>
                    <td>{v.vehicleType}</td>
                    <td>{v.slotNumber}</td>
                    <td>{new Date(v.entryTime).toLocaleTimeString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No active bookings</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card">
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