import { useState, useEffect } from 'react';
import api from '../api';
import { IndianRupee, Search, Calendar, CreditCard, BarChart2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

function Payments() {
  const [paymentsData, setPaymentsData] = useState([]);
  const [totalPaymentsCount, setTotalPaymentsCount] = useState(0);
  const [filters, setFilters] = useState({
    date: '',
    vehicleNumber: '',
    paymentMethod: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1
  });

  useEffect(() => {
    fetchPayments();
  }, [filters, pagination.page]);

  const fetchPayments = async () => {
    try {
      // Build query string
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit
      });
      if (filters.date) params.append('date', filters.date);
      if (filters.vehicleNumber) params.append('vehicleNumber', filters.vehicleNumber);
      if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);

      const res = await api.get(`/analytics/payments?${params.toString()}`);
      if (res.data.success) {
        setPaymentsData(res.data.data);
        setPagination(prev => ({
          ...prev,
          totalPages: res.data.pagination.pages
        }));
        setTotalPaymentsCount(res.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div>
      <div className="page-header page-header-flex">
        <h2 className="fw-600">Parking Payments</h2>
        <div className="header-stats-bold">
          <BarChart2 className="text-primary" />
          <span>{totalPaymentsCount}</span>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body filter-container">
          <div className="form-group filter-group">
            <label className="form-label filter-label">
              <Calendar size={16} /> Date
            </label>
            <input 
              type="date" 
              className="form-input" 
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="form-group filter-group">
            <label className="form-label filter-label">
              <Search size={16} /> Vehicle Number
            </label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search vehicle..."
              name="vehicleNumber"
              value={filters.vehicleNumber}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group filter-group">
            <label className="form-label filter-label">
              <CreditCard size={16} /> Payment Method
            </label>
            <select 
              className="form-input"
              name="paymentMethod"
              value={filters.paymentMethod}
              onChange={handleFilterChange}
            >
              <option value="">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
              <option value="CASH">Cash</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle Number</th>
                <th>Total Hours</th>
                <th>Total Payment</th>
                <th>Payment Date</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {paymentsData.map((payment) => (
                <tr key={payment._id}>
                  <td className="fw-600">{payment.vehicleNumber || 'N/A'}</td>
                  <td>{payment.totalHours || 'N/A'} hrs</td>
                  <td className="text-success-bold">
                    <IndianRupee size={14} className="icon-valign-mr2"/>
                    {payment.amount}
                  </td>
                  <td>{new Date(payment.paymentDate).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${payment.paymentMethod === 'UPI' ? 'badge-primary' : payment.paymentMethod === 'CARD' ? 'badge-info' : 'badge-warning'}`}>
                      {payment.paymentMethod}
                    </span>
                  </td>
                </tr>
              ))}
              {paymentsData.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center-p2">No payment records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {pagination.totalPages > 1 && (
          <div className="pagination-container pagination-payments">
            <span className="text-muted">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="pagination-buttons pagination-btns-wrapper">
              <button 
                className="btn btn-outline btn-outline-sm" 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button 
                className="btn btn-outline btn-outline-sm" 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payments;
