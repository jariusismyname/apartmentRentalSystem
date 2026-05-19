import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, Link } from 'react-router-dom';
import PropertyList from './pages/PropertyList';
import PropertyDetails from './pages/PropertyDetails';
import LandlordDashboard from './pages/LandlordDashboard';
import AddProperty from './pages/AddProperty';
import AdminPayments from './pages/AdminPayments';
import TenantDashboard from './pages/TenantDashboard';
import Login from './pages/Login';
import { mockProperties } from './mockData';

export default function App() {
  // --- Layout State ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile drawer state

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false); // Auto-close drawer if resizing to desktop
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Data & Auth State ---
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

  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('rental_favorites');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });

  // --- Persistence Effects ---
  useEffect(() => {
    if (currentUser) localStorage.setItem('rental_user', JSON.stringify(currentUser));
    else localStorage.removeItem('rental_user');
  }, [currentUser]);

  useEffect(() => localStorage.setItem('rental_properties', JSON.stringify(properties)), [properties]);
  useEffect(() => localStorage.setItem('rental_applications', JSON.stringify(applications)), [applications]);
  useEffect(() => localStorage.setItem('rental_payments', JSON.stringify(payments)), [payments]);
  useEffect(() => localStorage.setItem('rental_messages', JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem('rental_favorites', JSON.stringify(favorites)), [favorites]);

  // --- Handlers ---
  const handleLogin = (user) => setCurrentUser(user);
  const handleLogout = () => { setCurrentUser(null); setIsSidebarOpen(false); };
  const addProperty = (newProp) => setProperties(prev => [...prev, { ...newProp, id: Date.now() }]);
  const addApplication = (newApp) => setApplications(prev => [...prev, { ...newApp, id: Date.now(), status: "Pending" }]);
  const updateApplicationStatus = (id, newStatus) => setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
  const addPayment = (newPayment) => setPayments(prev => [{ ...newPayment, id: Date.now(), status: 'Pending' }, ...prev]);
  const updatePaymentStatus = (id, newStatus) => setPayments(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  const addMessage = (newMessage) => setMessages(prev => [{ ...newMessage, id: Date.now(), date: new Date().toISOString().split('T')[0] }, ...prev]);

  const toggleFavorite = (propertyId) => {
    if (!currentUser) return;
    setFavorites(prev => {
      const exists = prev.some(f => f.propertyId === propertyId && f.userEmail === currentUser.email);
      if (exists) return prev.filter(f => !(f.propertyId === propertyId && f.userEmail === currentUser.email));
      return [...prev, { id: Date.now(), propertyId, userEmail: currentUser.email }];
    });
  };

  // --- Helper for Enterprise Nav Links ---
  const getNavStyle = ({ isActive }) => ({
    ...styles.navLink,
    backgroundColor: isActive ? '#1e293b' : 'transparent',
    color: isActive ? '#ffffff' : '#94a3b8',
    borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent'
  });

  return (
    <Router>
      <div style={styles.appWrapper}>
        
        {/* Mobile Sidebar Overlay */}
        {isMobile && isSidebarOpen && (
          <div style={styles.overlay} onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Enterprise Sidebar */}
        <aside style={{
          ...styles.sidebar,
          transform: isMobile ? (isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
          position: isMobile ? 'fixed' : 'relative',
          zIndex: 1000
        }}>
          {/* Brand Header */}
          <div style={styles.brandBox}>
            <div style={styles.brandLogo}>RH</div>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>RentHub Pro</span>
          </div>

          {/* Navigation Links */}
          <nav style={styles.navMenu}>
            <div style={styles.navLabel}>DIRECTORY</div>
            <NavLink to="/" style={getNavStyle} onClick={() => setIsSidebarOpen(false)}>
              <span style={styles.navIcon}>🏠</span> Find Homes
            </NavLink>

            {currentUser?.role === 'landlord' && (
              <>
                <div style={styles.navLabel}>MANAGEMENT</div>
                <NavLink to="/dashboard" style={getNavStyle} onClick={() => setIsSidebarOpen(false)}>
                  <span style={styles.navIcon}>📊</span> Dashboard
                </NavLink>
                <NavLink to="/payments" style={getNavStyle} onClick={() => setIsSidebarOpen(false)}>
                  <span style={styles.navIcon}>💳</span> Payments
                </NavLink>
                <NavLink to="/add-property" style={getNavStyle} onClick={() => setIsSidebarOpen(false)}>
                  <span style={styles.navIcon}>➕</span> Add Property
                </NavLink>
              </>
            )}

            {currentUser?.role === 'tenant' && (
              <>
                <div style={styles.navLabel}>TENANT PORTAL</div>
                <NavLink to="/my-hub" style={getNavStyle} onClick={() => setIsSidebarOpen(false)}>
                  <span style={styles.navIcon}>🗂️</span> My Hub
                </NavLink>
              </>
            )}
          </nav>

          {/* User Profile / Auth Footer */}
          <div style={styles.sidebarFooter}>
            {currentUser ? (
              <div style={styles.userCard}>
                <div style={styles.avatar}>{currentUser.name.charAt(0)}</div>
                <div style={styles.userInfo}>
                  <div style={styles.userName}>{currentUser.name}</div>
                  <div style={styles.userRole}>{currentUser.role.toUpperCase()}</div>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn} title="Log Out">🚪</button>
              </div>
            ) : (
              <Link to="/login" style={styles.loginBtn} onClick={() => setIsSidebarOpen(false)}>
                Sign In to Portal
              </Link>
            )}
          </div>
        </aside>

        {/* Main Content Workspace */}
        <div style={styles.mainWorkspace}>
          
          {/* Topbar (Primarily for mobile menu toggle, but gives structure) */}
          <header style={styles.topbar}>
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(true)} style={styles.hamburgerBtn}>
                ☰ Menu
              </button>
            )}
            <div style={{ marginLeft: 'auto', fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
              {currentUser ? `Welcome back, ${currentUser.name.split(' ')[0]}` : 'Secure Guest Access'}
            </div>
          </header>

          {/* Scrolling Content Canvas */}
          <main style={styles.contentCanvas}>
            <Routes>
              <Route path="/" element={<PropertyList properties={properties} favorites={favorites} toggleFavorite={toggleFavorite} currentUser={currentUser} isMobile={isMobile} />} />
              <Route path="/property/:id" element={<PropertyDetails properties={properties} addApplication={addApplication} currentUser={currentUser} addMessage={addMessage} isMobile={isMobile} />} />
              <Route path="/login" element={<Login onLogin={handleLogin} currentUser={currentUser} />} />
              
              <Route path="/dashboard" element={currentUser?.role === 'landlord' ? <LandlordDashboard applications={applications} updateStatus={updateApplicationStatus} properties={properties} setProperties={setProperties} messages={messages} isMobile={isMobile} /> : <Navigate to="/login" />} />
              <Route path="/add-property" element={currentUser?.role === 'landlord' ? <AddProperty addProperty={addProperty} /> : <Navigate to="/login" />} />
              <Route path="/payments" element={currentUser?.role === 'landlord' ? <AdminPayments payments={payments} updateStatus={updatePaymentStatus} isMobile={isMobile} /> : <Navigate to="/login" />} />
              
              <Route path="/my-hub" element={currentUser?.role === 'tenant' ? <TenantDashboard currentUser={currentUser} applications={applications} payments={payments} addPayment={addPayment} favorites={favorites} toggleFavorite={toggleFavorite} properties={properties} isMobile={isMobile} /> : <Navigate to="/login" />} />
            </Routes>
          </main>

        </div>
      </div>
    </Router>
  );
}

// --- Enterprise Inline Styles ---
const styles = {
  appWrapper: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f8fafc', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif' },
  overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 },
  
  // Sidebar
  sidebar: { width: '260px', height: '100%', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '4px 0 15px rgba(0,0,0,0.1)' },
  brandBox: { height: '70px', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '12px', borderBottom: '1px solid #1e293b' },
  brandLogo: { width: '32px', height: '32px', backgroundColor: '#3b82f6', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' },
  
  // Navigation Menu
  navMenu: { flex: 1, padding: '24px 0', overflowY: 'auto' },
  navLabel: { fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', margin: '16px 24px 8px 24px', letterSpacing: '0.05em' },
  navLink: { display: 'flex', alignItems: 'center', padding: '12px 24px', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'all 0.2s ease' },
  navIcon: { marginRight: '12px', fontSize: '1.2rem', opacity: 0.8 },
  
  // User Footer
  sidebarFooter: { padding: '20px', borderTop: '1px solid #1e293b', backgroundColor: '#0b1120' },
  userCard: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' },
  userInfo: { flex: 1, overflow: 'hidden' },
  userName: { color: '#f8fafc', fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' },
  userRole: { color: '#34d399', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.05em' },
  logoutBtn: { backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem', padding: '4px', borderRadius: '4px' },
  loginBtn: { display: 'block', width: '100%', textAlign: 'center', backgroundColor: '#3b82f6', color: '#fff', textDecoration: 'none', padding: '12px 0', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem' },

  // Main Content
  mainWorkspace: { flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  topbar: { height: '70px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 24px', zIndex: 10 },
  hamburgerBtn: { backgroundColor: 'transparent', border: 'none', fontSize: '1.1rem', cursor: 'pointer', fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 },
  contentCanvas: { flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#f8fafc' },
};