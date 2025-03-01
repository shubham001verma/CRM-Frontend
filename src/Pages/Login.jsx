import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AiOutlineMail, AiOutlineLock, AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // React Icons
import API_BASE_URL from "../components/Config";
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, formData);
      console.log(response)
      if (response.data.user) {
        sessionStorage.setItem('useridsrmapp', response.data.user._id);
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        return navigate('/dashboard');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'User login failed. Please check your credentials.' });
    }

    try {
      const response2 = await axios.post(`${API_BASE_URL}/team/teamlogin`, formData);
      
      if (response2.data.teamMember) {
        sessionStorage.setItem('loggedInUserId', response2.data.teamMember._id); // Store logged-in user ID
    sessionStorage.setItem('useridsrmapp', response2.data.teamMember.createdby); // Store created-by user ID
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        return navigate('/teamdashboard');
      }
    } catch (err2) {
      setMessage({ type: 'error', text: 'Team login failed. Please check your credentials.' });
    }

    try {
      const response3 = await axios.post(`${API_BASE_URL}/client/loginclient`, formData);
      
      if (response3.data.client) {
        sessionStorage.setItem('useridsrmapp', response3.data.client._id);
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        return navigate('/clientdashboard');
      }
    } catch (err3) {
      setMessage({ type: 'error', text: 'Client login failed. Please check your credentials.' });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: '#f0f3fc' }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 d-none d-md-block text-center">
            <img src='/login-bg.svg' alt="Login" className="img-fluid"  style={{width:'550px'}}/>
          </div>
          <div className="col-md-6 d-flex justify-content-center">
            <div className="card p-4 py-5" style={{ width: '400px', borderRadius: '15px' }}>
              <div className="text-center">
                <img src="/Main.png" className="img-fluid" alt="Main" style={{ width: '80px', marginBottom: '20px' }} />
                <h4 className="mb-4">Login</h4>
              </div>
              {message.text && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                  {message.text}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className='mb-2'>Email Address</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your Email" required style={{ borderRadius: '10px', padding: '10px' }} />
                </div>
                <div className="mb-3 position-relative">
                  <label className='mb-2'>Password</label>
                  <input type={showPassword ? 'text' : 'password'} className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required style={{ borderRadius: '10px', padding: '10px' }} />
                  <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', top: '70%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer', color: '#3a86de', fontSize: '20px' }}>
                    {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </span>
                </div>
                <button type="submit" className="submitbtn w-100 my-3">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
