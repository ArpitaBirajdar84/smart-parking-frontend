import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
import toast from 'react-hot-toast';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Hardcoded auth as per requirements
    if (username === 'admin@project.com' && password === 'admin@123') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials. Use admin@project.com / admin@123');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-container">
            <Car size={32} />
          </div>
          <h2>Admin Login</h2>
          <p className="form-label mt-05">Enter credentials to login</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="email" 
              className="form-input" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="admin@project.com"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="admin@123"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-auth-full">
            Login
          </button>
        </form>
        
        <div className="auth-footer">
          <button onClick={() => navigate('/set-password')} className="btn-link-primary">
            First time? Set up account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
