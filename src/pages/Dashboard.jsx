import { useEffect, useState } from 'react';
import api from '../api';
import { Car, Layers, CreditCard } from 'lucide-react';

function Dashboard() {
  const [slots, setSlots] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log("Loading data from:", api.defaults.baseURL);
      
      const slotsResponse = await api.get('/api/slots');
      const vehiclesResponse = await api.get('/api/vehicles');
      
      console.log("Slots data:", slotsResponse.data);
      console.log("Vehicles data:", vehiclesResponse.data);
      
      setSlots(slotsResponse.data || []);
      setVehicles(vehiclesResponse.data || []);
    } catch (error) {
      console.error("Error:", error.message);
      console.error("Full error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading dashboard data...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Total Vehicles</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{vehicles.length}</p>
        </div>
        
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Total Slots</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{slots.length}</p>
        </div>
        
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Total Payments</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>₹0</p>
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>Slots List</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Slot ID</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {slots.slice(0, 5).map((slot, idx) => (
              <tr key={idx}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{slot.slotNumber || slot._id}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{slot.status || 'Available'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div>
        <h3>Debug Info</h3>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
          Backend URL: {api.defaults.baseURL}
          Slots Count: {slots.length}
          Vehicles Count: {vehicles.length}
        </pre>
      </div>
    </div>
  );
}

export default Dashboard;