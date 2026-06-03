import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
import toast from 'react-hot-toast';

function SetPassword() {
  const navigate = useNavigate();

  const handleSetPassword = (e) => {
    e.preventDefault();
    toast.success('Password set successfully!');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-container">
            <Car size={32} />
          </div>
          <h2>Set up your account !!</h2>
          <p className="form-label mt-05">Create your credentials</p>
        </div>
        
        <form onSubmit={handleSetPassword}>
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input type="text" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Owner Name</label>
            <input type="text" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" className="form-input" required />
          </div>
          <button type="submit" className="btn btn-primary btn-auth-full">
            Set Password
          </button>
        </form>
        
        <div className="auth-footer">
          <button onClick={() => navigate('/login')} className="btn-link-muted">
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetPassword;
