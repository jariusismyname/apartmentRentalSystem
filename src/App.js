import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import PropertyList from './pages/PropertyList';
import PropertyDetails from './pages/PropertyDetails';
import LandlordDashboard from './pages/LandlordDashboard';
import AddProperty from './pages/AddProperty';
import AdminPayments from './pages/AdminPayments';
import TenantDashboard from './pages/TenantDashboard';
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

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('rental_messages');
    return savedMessages ? JSON.parse(savedMessages) : [
      { id: 1, senderName: 'Alex Tenant', senderEmail: 'user@renthub.com', propertyTitle: 'Downtown Apartment', text: 'Is underground garage parking included in the base rent price?', date: '2026-05-19' }
    ];
  });

  // 1. New Bookmarks Wishlist State Array
  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('rental_favorites');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });

  useEffect(() => {
    if (currentUser) localStorage.setItem('rental_user', JSON.stringify(currentUser));
    else localStorage.removeItem('rental_user');
  }, [currentUser]);

  useEffect(() => localStorage.setItem('rental_properties', JSON.stringify(properties)), [properties]);
  useEffect(() => localStorage.setItem('rental_applications', JSON.stringify(applications)), [applications]);
  useEffect(() => localStorage.setItem('rental_payments', JSON.stringify(payments)), [payments]);
  useEffect(() => localStorage.setItem('rental_messages', JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem('rental_favorites', JSON.stringify(favorites)), [favorites]); // Sync favorites

  const handleLogin = (user) => setCurrentUser(user);
  const handleLogout = () => setCurrentUser(null);

  const addProperty = (newProp) => setProperties(prev => [...prev, { ...newProp, id: Date.now() }]);
  const addApplication = (newApp) => setApplications(prev => [...prev, { ...newApp, id: Date.now(), status: "Pending" }]);
  const updateApplicationStatus = (id, newStatus) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  const addPayment = (newPayment) => {
    setPayments(prev => [{ ...newPayment, id: Date.now(), status: 'Pending' }, ...prev]);
  };

  const updatePaymentStatus = (id, newStatus) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const addMessage = (newMessage) => {
    setMessages(prev => [{ ...newMessage, id: Date.now(), date: new Date().toISOString().split('T')[0] }, ...prev]);
  };

  // 2. State Toggle Core Logic Mapping Utility Function
  const toggleFavorite = (propertyId) => {
    if (!currentUser) return;
    setFavorites(prev => {
      const exists = prev.some(f => f.propertyId === propertyId && f.userEmail === currentUser.email);
      if (exists) {
        return prev.filter(f => !(f.propertyId === propertyId && f.userEmail === currentUser.email));
      } else {
        return [...prev, { id: Date.now(), propertyId, userEmail: currentUser.email }];
      }
    });
  };

  return (
    <Router>
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <Link to="/" style={styles.brand}>🏠 RentHub</Link>
          <div style={styles.links}>
            <Link to="/" style={styles.link}>Find Homes</Link>
            
            {currentUser?.role === 'landlord' && (
              <>
                <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                <Link to="/payments" style={styles.link}>Payments</Link>
                <Link to="/add-property" style={styles.addPropLink}>+ Add Listing</Link>
              </>
            )}

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
        {/* Pass down bookmark properties into main dashboard map layout catalog array hooks */}
        <Route path="/" element={<PropertyList properties={properties} favorites={favorites} toggleFavorite={toggleFavorite} currentUser={currentUser} />} />
        
        <Route path="/property/:id" element={<PropertyDetails properties={properties} addApplication={addApplication} currentUser={currentUser} addMessage={addMessage} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} currentUser={currentUser} />} />
        
        <Route path="/dashboard" element={currentUser?.role === 'landlord' ? <LandlordDashboard applications={applications} updateStatus={updateApplicationStatus} properties={properties} setProperties={setProperties} messages={messages} /> : <Navigate to="/login" />} />
        <Route path="/add-property" element={currentUser?.role === 'landlord' ? <AddProperty addProperty={addProperty} /> : <Navigate to="/login" />} />
        <Route path="/payments" element={currentUser?.role === 'landlord' ? <AdminPayments payments={payments} updateStatus={updatePaymentStatus} /> : <Navigate to="/login" />} />
        
        {/* Pass downstream links to the Tenant dashboard layer */}
        <Route path="/my-hub" element={currentUser?.role === 'tenant' ? <TenantDashboard currentUser={currentUser} applications={applications} payments={payments} addPayment={addPayment} favorites={favorites} toggleFavorite={toggleFavorite} properties={properties} /> : <Navigate to="/login" />} />
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