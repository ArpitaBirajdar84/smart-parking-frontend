import { useState, useEffect } from 'react';
import api from '../api';
import { Car } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

function Vehicles() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    ownerName: '',
    mobileNumber: '',
    vehicleType: 'CAR'
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchVehicles = async () => {
    const res = await api.get('/vehicles/all');
    if (!res.data.success) {
      throw new Error(res.data.message || 'Failed to load vehicles');
    }
    return res.data.data;
  };

  const { data: vehicles = [], isLoading, isError, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
  });

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/vehicles/add', formData);
      if (res.data.success) {
        toast.success('Vehicle added successfully');
        setFormData({ vehicleNumber: '', ownerName: '', mobileNumber: '', vehicleType: 'CAR' });
        queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding vehicle');
    }
  };

  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner-card">
          <div className="spinner"></div>
          <p className="text-muted fw-500">Fetching registered vehicles...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h3 className="error-title">Error Loading Vehicles</h3>
          <p>{error.message || 'An unexpected error occurred while fetching vehicles.'}</p>
        </div>
      </div>
    );
  }

  const filteredVehicles = vehicles.filter(v =>
    v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const currentVehicles = filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div className="page-header">
        <h2 className="fw-600">Manage Your Vehicles</h2>
        <span className="badge badge-info badge-large">
          <Car size={16} className="mr-05" /> Total: {vehicles.length}
        </span>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Add Parking Vehicle</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddVehicle}>
              <div className="form-group">
                <label className="form-label">Vehicle Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Owner Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select
                  className="form-input"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                >
                  <option value="BIKE">BIKE</option>
                  <option value="CAR">CAR</option>
                  <option value="TRUCK">TRUCK</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-full-mt05">
                Add Vehicle
              </button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header page-header-flex">
            <h3 className="card-title">Registered Vehicles</h3>
            <input
              type="text"
              placeholder="Search Vehicle No..."
              className="form-input search-input-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="card-body p-0">
            <div className="table-container table-scroll-400">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Vehicle No.</th>
                    <th>Type</th>
                    <th>Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVehicles.map((v) => (
                    <tr key={v._id}>
                      <td className="fw-500">{v.vehicleNumber}</td>
                      <td><span className="badge badge-info">{v.vehicleType}</span></td>
                      <td>{v.ownerName}</td>
                    </tr>
                  ))}
                  {currentVehicles.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center-p2">
                        {vehicles.length === 0 ? 'No vehicles registered' : 'No vehicles found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 0 && (
              <div className="pagination-container-bordered">
                <button
                  className="btn btn-pagination"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span className="font-semibold">{currentPage} / {totalPages}</span>
                <button
                  className="btn btn-pagination"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vehicles;
