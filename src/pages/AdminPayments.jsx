import React from 'react';

export default function AdminPayments({ payments, updateStatus }) {
  
  // Calculate total completed revenue
  const totalRevenue = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  // Calculate pending revenue
  const pendingRevenue = payments
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: '8px', color: '#333' }}>Payment Transactions</h1>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '24px' }}>Manage rent collections and track your property revenue.</p>

      {/* Analytics Cards */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricTitle}>Total Collected</div>
          <div style={{ ...styles.metricValue, color: '#28a745' }}>${totalRevenue.toLocaleString()}</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricTitle}>Pending Funds</div>
          <div style={{ ...styles.metricValue, color: '#f5a623' }}>${pendingRevenue.toLocaleString()}</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricTitle}>Total Transactions</div>
          <div style={{ ...styles.metricValue, color: '#007bff' }}>{payments.length}</div>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={styles.tableContainer}>
        {payments.length === 0 ? (
          <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No payment records found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>Transaction ID</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Tenant Name</th>
                <th style={styles.th}>Property</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id} style={styles.tableRow}>
                  <td style={styles.td}>#{payment.id}</td>
                  <td style={styles.td}>{payment.date}</td>
                  <td style={styles.td}><strong>{payment.tenantName}</strong></td>
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
                  <td style={styles.td}>
                    {payment.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => updateStatus(payment.id, 'Completed')} style={styles.approveBtn}>Mark Paid</button>
                        <button onClick={() => updateStatus(payment.id, 'Failed')} style={styles.rejectBtn}>Fail</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif' },
  metricsGrid: { display: 'flex', gap: '20px', marginBottom: '30px' },
  metricCard: { flex: 1, backgroundColor: '#fff', border: '1px solid #e1e4e8', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
  metricTitle: { fontSize: '0.9rem', color: '#666', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' },
  metricValue: { fontSize: '2rem', fontWeight: 'bold' },
  tableContainer: { backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e1e4e8', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHead: { backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' },
  th: { padding: '14px', fontSize: '0.85rem', color: '#444', textTransform: 'uppercase' },
  tableRow: { borderBottom: '1px solid #e1e4e8' },
  td: { padding: '14px', fontSize: '0.95rem', color: '#333' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' },
  approveBtn: { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' },
  rejectBtn: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }
};