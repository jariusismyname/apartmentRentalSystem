import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PropertyList from './pages/PropertyList';
import PropertyDetails from './pages/PropertyDetails';
import LandlordDashboard from './pages/LandlordDashboard';

function App() {
  // 1. Load data from localStorage on startup, or fall back to defaults if empty
  const [applications, setApplications] = useState(() => {
    const savedApps = localStorage.getItem('rental_applications');
    return savedApps ? JSON.parse(savedApps) : [
      {
        id: 101,
        propertyId: 1,
        propertyName: "Modern Downtown Loft",
        fullName: "Jane Doe",
        email: "jane@example.com",
        phone: "555-0192",
        moveInDate: "2026-06-01",
        message: "I love the lighting in this loft! Looking forward to hearing back.",
        status: "Pending"
      }
    ];
  });

  // 2. Automatically save data to localStorage whenever 'applications' updates
  useEffect(() => {
    localStorage.setItem('rental_applications', JSON.stringify(applications));
  }, [applications]);

  const addApplication = (newApp) => {
    setApplications(prev => [...prev, { ...newApp, id: Date.now(), status: "Pending" }]);
  };

  const updateApplicationStatus = (id, newStatus) => {
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
    );
  };

  return (
    <Router>
      {/* 3. Global Navigation Bar so we don't have to re-type the URL */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <Link to="/" style={styles.brand}>🏠 RentHub</Link>
          <div style={styles.links}>
            <Link to="/" style={styles.link}>Find Homes</Link>
            <Link to="/dashboard" style={styles.dashboardLink}>Landlord Dashboard</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<PropertyList />} />
        <Route path="/property/:id" element={<PropertyDetails addApplication={addApplication} />} />
        <Route path="/dashboard" element={<LandlordDashboard applications={applications} updateStatus={updateApplicationStatus} />} />
      </Routes>
    </Router>
  );
}

const styles = {
  navbar: { backgroundColor: '#ffffff', borderBottom: '1px solid #e1e4e8', padding: '15px 0', position: 'sticky', top: 0, zIndex: 100 },
  navContainer: { maxWidth: '940px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontSize: '1.3rem', fontWeight: 'bold', color: '#333', textDecoration: 'none' },
  links: { display: 'flex', gap: '20px', alignItems: 'center' },
  link: { color: '#555', textDecoration: 'none', fontWeight: '500' },
  dashboardLink: { color: '#fff', backgroundColor: '#007bff', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500' }
};

export default App;