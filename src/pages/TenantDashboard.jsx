import React, { useState } from 'react';

export default function TenantDashboard({ currentUser, applications, payments, addPayment }) {
  const [rentAmount, setRentAmount] = useState(1500);

  // Filter to only show data for the logged-in user
  const myApplications = applications.filter(app => app.name === currentUser.name || app.email === currentUser.email);
  const myPayments = payments.filter(p => p.tenantName === currentUser.name);

  const handlePayRent = (propertyName) => {
    addPayment({
      tenantName: currentUser.name,
      propertyName: propertyName || 'My Rental Property',
      amount: Number(rentAmount),
      date: new Date().toISOString().split('T')[0] // Today's date
    });
    alert(`Payment of $${rentAmount} submitted for ${propertyName || 'property'}! Awaiting landlord approval.`);
  };

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: '8px', color: '#333' }}>Welcome back, {currentUser.name.split(' ')[0]}!</h1>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '30px' }}>Manage your applications and rent payments here.</p>

      {/* Applications Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>My Applications</h2>
        {myApplications.length === 0 ? (
          <p style={styles.emptyText}>You haven't applied to any properties yet.</p>
        ) : (
          <div style={styles.grid}>
            {myApplications.map((app, idx) => (
              <div key={app.id || idx} style={styles.card}>
                <h3 style={styles.cardTitle}>{app.propertyTitle || `Property ID: ${app.propertyId}`}</h3>
                
                <div style={{ margin: '15px 0' }}>
                  <span style={{ 
                    ...styles.badge, 
                    backgroundColor: app.status === 'Approved' ? '#d4edda' : app.status === 'Rejected' ? '#f8d7da' : '#fff3cd',
                    color: app.status === 'Approved' ? '#155724' : app.status === 'Rejected' ? '#721c24' : '#856404'
                  }}>
                    Status: {app.status || 'Pending'}
                  </span>
                </div>

                {/* If approved, show payment controls */}
                {app.status === 'Approved' && (
                  <div style={styles.paymentZone}>
                    <p style={styles.payLabel}>Submit Rent Payment</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="number" 
                        value={rentAmount} 
                        onChange={(e) => setRentAmount(e.target.value)} 
                        style={styles.input}
                        placeholder="Amount"
                      />
                      <button onClick={() => handlePayRent(app.propertyTitle)} style={styles.payBtn}>
                        Pay Rent
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment History Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Payment History</h2>
        {myPayments.length === 0 ? (
          <p style={styles.emptyText}>No payment history found.</p>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Property</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {myPayments.map(payment => (
                  <tr key={payment.id} style={styles.tableRow}>
                    <td style={styles.td}>{payment.date}</td>
                    <td style={styles.td}>{payment.propertyName}</td>
                    <td style={{ ...styles.td, fontWeight: 'bold' }}>${payment.amount}</td>
                    <td style={styles.td}>
                      <span style={{ 
                        ...styles.badge, 
                        backgroundColor: payment.status === 'Completed' ? '#d4edda' : payment.status === 'Failed' ? '#f8d7da' : '#fff3cd',
                        color: payment.status === 'Completed' ? '#155724' : payment.status === 'Failed' ? '#721c24' : '#856404'
                      }}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif' },
  section: { marginBottom: '40px' },
  sectionTitle: { fontSize: '1.4rem', color: '#333', borderBottom: '2px solid #e1e4e8', paddingBottom: '10px', marginBottom: '20px' },
  emptyText: { color: '#666', fontStyle: 'italic', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px dashed #ccc' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#fff', border: '1px solid #e1e4e8', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' },
  cardTitle: { margin: '0 0 10px 0', fontSize: '1.1rem', color: '#333' },
  badge: { padding: '5px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'inline-block' },
  paymentZone: { marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' },
  payLabel: { fontSize: '0.85rem', fontWeight: 'bold', color: '#555', marginBottom: '8px' },
  input: { flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' },
  payBtn: { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  tableContainer: { backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e1e4e8', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHead: { backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' },
  th: { padding: '12px 15px', fontSize: '0.9rem', color: '#555' },
  tableRow: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 15px', fontSize: '0.95rem', color: '#333' }
};