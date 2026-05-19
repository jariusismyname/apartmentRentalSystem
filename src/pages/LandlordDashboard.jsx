import React from 'react';
import { Link } from 'react-router-dom';

export default function LandlordDashboard({ applications, updateStatus }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={{ margin: 0 }}>Landlord Portal</h1>
          <p style={{ color: '#666', margin: '4px 0 0 0' }}>Manage incoming applications and property leases.</p>
        </div>
        <Link to="/" style={styles.navLink}>← Back to Listings</Link>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <h3>{applications.filter(a => a.status === 'Pending').length}</h3>
          <p>Pending Review</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={{ color: '#28a745' }}>{applications.filter(a => a.status === 'Approved').length}</h3>
          <p>Approved</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={{ color: '#dc3545' }}>{applications.filter(a => a.status === 'Rejected').length}</h3>
          <p>Rejected</p>
        </div>
      </div>

      <h2>Incoming Applications</h2>

      {applications.length === 0 ? (
        <p style={{ color: '#888' }}>No applications received yet.</p>
      ) : (
        <div style={styles.listContainer}>
          {applications.map(app => (
            <div key={app.id} style={styles.appCard}>
              <div style={styles.appHeader}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0' }}>{app.fullName}</h3>
                  <span style={styles.propertyLabel}>Applied For: <strong>{app.propertyName}</strong></span>
                </div>
                <span style={{
                  ...styles.statusBadge, 
                  backgroundColor: app.status === 'Approved' ? '#d4edda' : app.status === 'Rejected' ? '#f8d7da' : '#fff3cd',
                  color: app.status === 'Approved' ? '#155724' : app.status === 'Rejected' ? '#721c24' : '#856404'
                }}>
                  {app.status}
                </span>
              </div>

              <div style={styles.appDetails}>
                <p>📧 {app.email} | 📞 {app.phone}</p>
                <p>📅 <strong>Target Move-In:</strong> {app.moveInDate}</p>
                {app.message && (
                  <p style={styles.messageBox}>
                    <strong>Message:</strong> "{app.message}"
                  </p>
                )}
              </div>

              {app.status === 'Pending' && (
                <div style={styles.actionRow}>
                  <button 
                    onClick={() => updateStatus(app.id, 'Rejected')} 
                    style={styles.rejectBtn}
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => updateStatus(app.id, 'Approved')} 
                    style={styles.approveBtn}
                  >
                    Approve Applicant
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' },
  navLink: { color: '#007bff', textDecoration: 'none', fontWeight: 'bold' },
  statsRow: { display: 'flex', gap: '20px', marginBottom: '30px' },
  statCard: { flex: 1, backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #e1e4e8', textAlign: 'center' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '20px' },
  appCard: { backgroundColor: '#fff', border: '1px solid #e1e4e8', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
  appHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  propertyLabel: { fontSize: '0.9rem', color: '#555' },
  statusBadge: { padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid currentColor' },
  appDetails: { fontSize: '0.95rem', color: '#333', borderTop: '1px solid #f1f1f1', paddingTop: '12px', marginBottom: '12px' },
  messageBox: { backgroundColor: '#f0f2f5', padding: '10px', borderRadius: '6px', fontStyle: 'italic', margin: '8px 0 0 0' },
  actionRow: { display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid #f1f1f1', paddingTop: '12px' },
  rejectBtn: { padding: '8px 16px', backgroundColor: '#fff', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  approveBtn: { padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};