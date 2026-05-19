import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

export default function Login({ onLogin, currentUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tenant'); // Default choice

  // If already logged in, kick user out back to index
  if (currentUser) {
    return <Navigate to="/" />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate finding/matching a user account profile
    onLogin({
      email: email,
      name: role === 'landlord' ? 'Admin Host' : 'Alex Tenant',
      role: role // 'tenant' or 'landlord'
    });
    navigate('/');
  };

  const handleQuickLogin = (selectedRole) => {
    onLogin({
      email: selectedRole === 'landlord' ? 'admin@renthub.com' : 'user@renthub.com',
      name: selectedRole === 'landlord' ? 'Admin Host' : 'Alex Tenant',
      role: selectedRole
    });
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', margin: '0 0 8px 0', color: '#333' }}>Welcome to RentHub</h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', margin: '0 0 24px 0' }}>Sign in to manage listings or apply for homes.</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input type="email" required placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Select Account Type</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.select}>
              <option value="tenant">Regular User (Tenant)</option>
              <option value="landlord">Admin User (Landlord)</option>
            </select>
          </div>

          <button type="submit" style={styles.submitBtn}>Sign In</button>
        </form>

        <div style={styles.dividerZone}>
          <hr style={styles.line} />
          <span style={styles.dividerText}>OR QUICK TESTING LOGIN</span>
          <hr style={styles.line} />
        </div>

        <div style={styles.quickLoginRow}>
          <button onClick={() => handleQuickLogin('tenant')} style={styles.quickUserBtn}>
            Log In As User
          </button>
          <button onClick={() => handleQuickLogin('landlord')} style={styles.quickAdminBtn}>
            Log In As Admin
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', padding: '20px' },
  card: { width: '100%', maxWidth: '400px', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e1e4e8', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
  inputGroup: { display: 'flex', flexDirection: 'column', marginBottom: '16px' },
  label: { fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px', color: '#444' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.95rem' },
  select: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.95rem', backgroundColor: '#fff', cursor: 'pointer' },
  submitBtn: { width: '100%', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', marginTop: '10px' },
  dividerZone: { display: 'flex', alignItems: 'center', margin: '24px 0', gap: '10px' },
  line: { flex: 1, border: 0, borderTop: '1px solid #e1e4e8' },
  dividerText: { fontSize: '0.75rem', color: '#888', fontWeight: 'bold', whiteSpace: 'nowrap' },
  quickLoginRow: { display: 'flex', gap: '12px' },
  quickUserBtn: { flex: 1, padding: '10px', backgroundColor: '#f0f2f5', border: '1px solid #ccc', color: '#444', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' },
  quickAdminBtn: { flex: 1, padding: '10px', backgroundColor: '#e2f0d9', border: '1px solid #b5d5a6', color: '#2e5b1e', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }
};