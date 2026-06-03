import { useState, useEffect, useMemo } from 'react';
import api from '../api';
import { Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

function Slots() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [formData, setFormData] = useState({ slotNumber: '', floor: '', slotType: '' });

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const fetchSlots = async () => {
    const res = await api.get('/slots/all');
    if (!res.data.success) {
      throw new Error(res.data.message || 'Failed to load slots');
    }
    return res.data.data;
  };

  const { data: slots = [], isLoading, isError, error } = useQuery({
    queryKey: ['slots'],
    queryFn: fetchSlots,
  });

  const { filteredSlots, totalPages, currentSlots } = useMemo(() => {
    const filtered = slots.filter(slot => filter === 'ALL' || slot.status === filter);
    const total = Math.ceil(filtered.length / itemsPerPage);
    const current = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return { filteredSlots: filtered, totalPages: total, currentSlots: current };
  }, [slots, filter, currentPage, itemsPerPage]);

  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner-card">
          <div className="spinner"></div>
          <p className="text-muted fw-500">Fetching your slots...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h3 className="error-title">Error Loading Slots</h3>
          <p>{error.message || 'An unexpected error occurred while fetching slots.'}</p>
        </div>
      </div>
    );
  }

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/slots/create', formData);
      if (res.data.success) {
        toast.success('Slot added successfully');
        setFormData({ slotNumber: '', floor: '', slotType: 'CAR' });
        queryClient.invalidateQueries({ queryKey: ['slots'] });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding slot');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="fw-600">Manage Your Parking Slots</h2>
        <div className="flex-gap-1">
          <span className="badge badge-info badge-large">
            <Layers size={16} className="mr-05" /> Total: {slots.length}
          </span>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Add Your Parking Slot</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddSlot}>
              <div className="form-group">
                <label className="form-label">Slot Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.slotNumber}
                  onChange={(e) => setFormData({ ...formData, slotNumber: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Floor</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Slot Type</label>
                <select
                  className="form-input"
                  value={formData.slotType}
                  onChange={(e) => setFormData({ ...formData, slotType: e.target.value })}
                >
                  <option value="">Select Slot Type</option>
                  <option value="BIKE">BIKE</option>
                  <option value="CAR">CAR</option>
                  <option value="TRUCK">TRUCK</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-full-mt05">
                Add Slot
              </button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Your Slots</h3>
            <select
              className="form-input select-auto"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
            </select>
          </div>
          <div className="card-body p-0">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="th-primary">SLOT NUMBER</th>
                    <th className="th-primary">FLOOR NUMBER</th>
                    <th className="th-primary">SLOT TYPE</th>
                    <th className="th-primary">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSlots.map((slot) => (
                    <tr key={slot._id}>
                      <td className="fw-500">{slot.slotNumber}</td>
                      <td>{slot.floor}</td>
                      <td>{slot.slotType}</td>
                      <td>
                        <span className={`badge ${slot.status === 'AVAILABLE' ? 'badge-success' : 'badge-danger'}`}>
                          {slot.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {currentSlots.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center-muted p-2rem">
                        No slots available
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

export default Slots;
