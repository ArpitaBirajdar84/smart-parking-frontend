import { useState, useEffect, useMemo } from 'react';
import api from '../api';
import { BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import { useQueryClient } from '@tanstack/react-query';

function Bookings() {
  const queryClient = useQueryClient();
  const [vehicles, setVehicles] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [formData, setFormData] = useState({ vehicleId: '' });

  // State for the exit confirmation modal
  const [exitModal, setExitModal] = useState({ isOpen: false, bookingId: null });

  useEffect(() => {
    fetchVehicles();
    fetchActiveBookings();
    fetchCompletedBookings();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles/all');
      if (res.data.success) {
        setVehicles(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles');
    }
  };

  const fetchActiveBookings = async () => {
    try {
      const res = await api.get('/analytics/active-vehicles');
      if (res.data.success) {
        setActiveBookings(res.data.data || []);
        return res.data.data || [];
      }
    } catch (error) {
      console.error('Error fetching active bookings:', error);
      toast.error('Failed to load active bookings');
    }
    return [];
  };

  const fetchCompletedBookings = async () => {
    try {
      const res = await api.get('/analytics/completed-vehicles');
      if (res.data.success) {
        setCompletedBookings(res.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching completed bookings:', error);
    }
  };

  const generateAndPrintQR = async (booking) => {
    try {
      const qrData = JSON.stringify({
        bookingId: booking._id,
        vehicleNumber: booking.vehicleNumber,
        slotNumber: booking.slotNumber,
        entryTime: booking.entryTime
      });

      const qrImage = await QRCode.toDataURL(qrData);

      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Parking Ticket</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
              
              body { 
                font-family: 'Outfit', sans-serif; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                min-height: 100vh;
                margin: 0; 
                background-color: #f1f5f9;
                padding: 40px 20px;
                box-sizing: border-box;
              }
              
              .ticket-wrapper { 
                background: white; 
                width: 100%; 
                max-width: 380px;
                border-radius: 12px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                padding: 40px 30px;
                text-align: center;
                position: relative;
                border: 1px solid #e2e8f0;
              }
              
              h2 { 
                margin-top: 0; 
                font-size: 26px;
                font-weight: 700;
                color: #0f172a;
                letter-spacing: 1px;
                text-transform: uppercase;
                margin-bottom: 30px;
                border-bottom: 2px dashed #cbd5e1;
                padding-bottom: 20px;
              }
              
              .qr-container {
                background: #f8fafc;
                padding: 15px;
                border-radius: 12px;
                display: inline-block;
                margin-bottom: 30px;
                border: 1px solid #e2e8f0;
              }
              
              img { 
                width: 160px;
                height: 160px;
                display: block;
              }
              
              .details { 
                text-align: left; 
                font-size: 15px; 
                line-height: 1.6;
                color: #334155;
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
              }
              
              .details p { 
                margin: 8px 0; 
                display: flex;
                justify-content: space-between;
                border-bottom: 1px dashed #e2e8f0;
                padding-bottom: 8px;
              }
              
              .details p:last-child {
                border-bottom: none;
                padding-bottom: 0;
                margin-bottom: 0;
              }
              
              .details strong {
                color: #0f172a;
                font-weight: 600;
              }
              
              .print-btn {
                margin-top: 40px;
                padding: 14px 32px;
                background-color: #2563eb;
                color: white;
                border: none;
                border-radius: 50px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
              }
              
              .print-btn:hover {
                background-color: #1d4ed8;
                transform: translateY(-2px);
                box-shadow: 0 6px 8px -1px rgba(37, 99, 235, 0.3);
              }
              
              .print-btn:active {
                transform: translateY(0);
              }
              
              @media print {
                body {
                  background-color: white;
                  padding: 0;
                  align-items: flex-start;
                  justify-content: flex-start;
                }
                .ticket-wrapper {
                  box-shadow: none;
                  border: none;
                  padding: 0;
                  max-width: 100%;
                  border-radius: 0;
                }
                .qr-container, .details {
                  border: none;
                  background: transparent;
                }
                .no-print {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body>
            <div class="ticket-wrapper">
              <h2>PARKING TICKET</h2>
              <div class="qr-container">
                <img src="${qrImage}" alt="QR Code" />
              </div>
              <div class="details">
                <p><strong>Booking ID:</strong> <span>${booking._id}</span></p>
                <p><strong>Vehicle:</strong> <span>${booking.vehicleNumber}</span></p>
                <p><strong>Slot:</strong> <span>${booking.slotNumber}</span></p>
                <p><strong>Entry:</strong> <span>${new Date(booking.entryTime).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: true
                })}</span></p>
              </div>
            </div>
            <button class="print-btn no-print" onclick="window.print()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Print Ticket
            </button>
          </body>
        </html>
      `);
      printWindow.document.close();

    } catch (error) {
      console.error('Error generating QR:', error);
      toast.error('Failed to generate ticket');
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/bookings/entry', formData);
      if (res.data.success) {
        toast.success('Booking created successfully!');
        setFormData({ vehicleId: '' });
        const updatedBookings = await fetchActiveBookings();
        const newBookingInfo = updatedBookings.find(b => b._id === res.data.data._id);
        if (newBookingInfo) {
          generateAndPrintQR(newBookingInfo);
        } else {
          generateAndPrintQR({ ...res.data.data, vehicleNumber: 'N/A', slotNumber: 'N/A' });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating booking');
    }
  };

  const confirmExit = async () => {
    try {
      const res = await api.post(`/bookings/exit/${exitModal.bookingId}`);
      if (res.data.success) {
        toast.success(`Vehicle exited. Amount: ₹${res.data.amount}`);
        setExitModal({ isOpen: false, bookingId: null });
        fetchActiveBookings();
        fetchCompletedBookings();
        queryClient.invalidateQueries({ queryKey: ['total-revenue'] });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error completing booking');
    }
  };

  const { filteredBookings, totalPages, currentBookings } = useMemo(() => {
    const base = activeTab === 'ACTIVE' ? activeBookings : completedBookings;
    const filtered = base.filter(b =>
      b.vehicleNumber && b.vehicleNumber.toLowerCase().includes(search.toLowerCase())
    );
    const total = Math.ceil(filtered.length / itemsPerPage);
    const current = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return { filteredBookings: filtered, totalPages: total, currentBookings: current };
  }, [activeTab, activeBookings, completedBookings, search, currentPage, itemsPerPage]);

  return (
    <div>
      <div className="page-header">
        <h2 className="fw-600">Manage Parking Bookings</h2>
        <span className="badge badge-info badge-large">
          <BookOpen size={16} className="mr-05" /> Active: {activeBookings.length}
        </span>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Create Booking (Entry)</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreateBooking}>
              <div className="form-group">
                <label className="form-label">Select Vehicle</label>
                <select
                  className="form-input"
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ vehicleId: e.target.value })}
                  required
                >
                  <option value="">-- Select a Vehicle --</option>
                  {vehicles.map((v) => (
                    <option key={v._id} value={v._id}>{v.vehicleNumber} ({v.vehicleType})</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-full-mt05">
                Create Booking
              </button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header card-header-flex">
            <h3 className="card-title card-title-bold">Bookings</h3>
            <div className="flex-wrap-gap05">
              <input
                type="text"
                placeholder="MH13AS0987"
                className="form-input search-input-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button
                className={`btn tab-btn ${activeTab === 'ACTIVE' ? 'tab-btn-active' : ''}`}
                onClick={() => { setActiveTab('ACTIVE'); setCurrentPage(1); }}
              >
                Active Bookings ({activeBookings.length})
              </button>
              <button
                className={`btn tab-btn ${activeTab === 'COMPLETED' ? 'tab-btn-active' : ''}`}
                onClick={() => { setActiveTab('COMPLETED'); setCurrentPage(1); }}
              >
                Completed Bookings ({completedBookings.length})
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="th-primary">VEHICLE NUMBER</th>
                    <th className="th-primary">SLOT NUMBER</th>
                    <th className="th-primary">ENTRY TIME</th>
                    <th className="th-primary"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map((b) => (
                    <tr key={b._id}>
                      <td className="fw-500 text-slate-600">{b.vehicleNumber}</td>
                      <td className="text-slate-600">{b.slotNumber}</td>
                      <td className="text-slate-600">
                        {new Date(b.entryTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="text-right">
                        {activeTab === 'ACTIVE' ? (
                          <button
                            className="btn-exit"
                            onClick={() => setExitModal({ isOpen: true, bookingId: b._id })}
                          >
                            Exit
                          </button>
                        ) : (
                          <span className="text-sm-slate">
                            Exited: {new Date(b.exitTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {currentBookings.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center-muted p-2rem">
                        No bookings found
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

      {/* Exit Modal */}
      {exitModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content-danger">
            <div className="flex-center-gap12">
              <div className="icon-circle-dark">?</div>
              <span className="modal-text-slate">
                Do you want to exit this booking ?
              </span>
            </div>

            <div className="modal-actions-gap48">
              <button
                onClick={confirmExit}
                className="btn-confirm-yes"
              >
                YES
              </button>
              <button
                onClick={() => setExitModal({ isOpen: false, bookingId: null })}
                className="btn-confirm-no"
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;
