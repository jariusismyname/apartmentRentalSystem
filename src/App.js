import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import PropertyList from './pages/PropertyList';
import PropertyDetails from './pages/PropertyDetails';
import LandlordDashboard from './pages/LandlordDashboard';
import AddProperty from './pages/AddProperty';
import AdminPayments from './pages/AdminPayments';
import TenantDashboard from './pages/TenantDashboard'; // New Page
import Login from './pages/Login';
import { mockProperties } from './mockData';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('rental_user');
    return savedUser ? JSON.parse(savedUser) : null; 
  });

  const [properties, setProperties] = useState(() => {
    const savedProperties = localStorage.getItem('rental_properties');
    return savedProperties ? JSON.parse(savedProperties) : mockProperties;
  });

  const [applications, setApplications] = useState(() => {
    const savedApps = localStorage.getItem('rental_applications');
    return savedApps ? JSON.parse(savedApps) : [
      // Mock application for the tenant so there's data to see immediately
      { id: 1, name: 'Alex Tenant', email: 'user@renthub.com', propertyTitle: 'Downtown Apartment', status: 'Approved' }
    ];
  });

  const [payments, setPayments] = useState(() => {
    const savedPayments = localStorage.getItem('rental_payments');
    return savedPayments ? JSON.parse(savedPayments) : [
      { id: 101, tenantName: 'Alex Tenant', propertyName: 'Downtown Apartment', amount: 1500, date: '2026-05-01', status: 'Completed' },
      { id: 102, tenantName: 'Maria Garcia', propertyName: 'Sunny Studio', amount: 900, date: '2026-05-18', status: 'Pending' }
    ];
  });

  useEffect(() => {
    if (currentUser) localStorage.setItem('rental_user', JSON.stringify(currentUser));
    else localStorage.removeItem('rental_user');
  }, [currentUser]);

  useEffect(() => localStorage.setItem('rental_properties', JSON.stringify(properties)), [properties]);
  useEffect(() => localStorage.setItem('rental_applications', JSON.stringify(applications)), [applications]);
  useEffect(() => localStorage.setItem('rental_payments', JSON.stringify(payments)), [payments]);

  const handleLogin = (user) => setCurrentUser(user);
  const handleLogout = () => setCurrentUser(null);

  const addProperty = (newProp) => setProperties(prev => [...prev, { ...newProp, id: Date.now() }]);
  const addApplication = (newApp) => setApplications(prev => [...prev, { ...newApp, id: Date.now(), status: "Pending" }]);
  const updateApplicationStatus = (id, newStatus) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  // 1. New function for tenants to submit payments
  const addPayment = (newPayment) => {
    setPayments(prev => [{ ...newPayment, id: Date.now(), status: 'Pending' }, ...prev]);
  };

  const updatePaymentStatus = (id, newStatus) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  return (
    <Router>
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <Link to="/" style={styles.brand}>🏠 RentHub</Link>
          <div style={styles.links}>
            <Link to="/" style={styles.link}>Find Homes</Link>
            
            {/* Admin Links */}
            {currentUser?.role === 'landlord' && (
              <>
                <Link to="/dashboard" style={styles.link}>Applications</Link>
                <Link to="/payments" style={styles.link}>Payments</Link>
                <Link to="/add-property" style={styles.addPropLink}>+ Add Listing</Link>
              </>
            )}

            {/* Tenant Links */}
            {currentUser?.role === 'tenant' && (
              <Link to="/my-hub" style={styles.link}>My Hub</Link>
            )}

            {currentUser ? (
              <div style={styles.userBadgeZone}>
                <span style={styles.userLabel}>
                  {currentUser.role === 'landlord' ? '👑 Admin' : '👤 User'}: {currentUser.name}
                </span>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
              </div>
            ) : (
              <Link to="/login" style={styles.loginLink}>Login</Link>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<PropertyList properties={properties} />} />
        <Route path="/property/:id" element={<PropertyDetails properties={properties} addApplication={addApplication} currentUser={currentUser} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} currentUser={currentUser} />} />
        
        {/* Landlord Routes */}
      {/* Replace the old /dashboard line with this: */}
<Route 
  path="/dashboard" 
  element={
    currentUser?.role === 'landlord' ? (
      <LandlordDashboard 
        applications={applications} 
        updateStatus={updateApplicationStatus} 
        properties={properties} // Pass down the properties list
        setProperties={setProperties} // Pass down the updater hook
      />
    ) : (
      <Navigate to="/login" />
    )
  } 
/>
        <Route path="/add-property" element={currentUser?.role === 'landlord' ? <AddProperty addProperty={addProperty} /> : <Navigate to="/login" />} />
        <Route path="/payments" element={currentUser?.role === 'landlord' ? <AdminPayments payments={payments} updateStatus={updatePaymentStatus} /> : <Navigate to="/login" />} />
        
        {/* Tenant Route */}
        <Route path="/my-hub" element={currentUser?.role === 'tenant' ? <TenantDashboard currentUser={currentUser} applications={applications} payments={payments} addPayment={addPayment} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

const styles = {
  navbar: { backgroundColor: '#ffffff', borderBottom: '1px solid #e1e4e8', padding: '15px 0', position: 'sticky', top: 0, zIndex: 100 },
  navContainer: { maxWidth: '1000px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontSize: '1.3rem', fontWeight: 'bold', color: '#333', textDecoration: 'none' },
  links: { display: 'flex', gap: '20px', alignItems: 'center' },
  link: { color: '#555', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem' },
  addPropLink: { color: '#fff', backgroundColor: '#28a745', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' },
  loginLink: { color: '#fff', backgroundColor: '#007bff', padding: '6px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' },
  userBadgeZone: { display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid #ddd', paddingLeft: '12px' },
  userLabel: { fontSize: '0.85rem', color: '#444', fontWeight: 'bold' },
  logoutBtn: { backgroundColor: 'transparent', border: '1px solid #dc3545', color: '#dc3545', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }
};

export default App;