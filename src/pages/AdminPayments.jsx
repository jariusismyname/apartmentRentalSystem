import React from 'react';

export default function AdminPayments({ payments, updateStatus, isMobile }) {
  // Calculate top-level metrics
  const totalRevenue = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCount = payments.filter(p => p.status === 'Pending').length;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Financial Ledger</h2>
      
      {/* Responsive KPI Stat Blocks */}
      <div style={{ ...styles.statsRow, flexDirection: isMobile ? 'column' : 'row' }}>
        <div style={styles.statBox}>
          <span style={styles.statLabel}>Total Collected Revenue</span>
          <span style={styles.statValue}>${totalRevenue.toLocaleString()}</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statLabel}>Pending Transactions</span>
          <span style={styles.statValue}>{pendingCount}</span>
        </div>
      </div>

      <div style={styles.ledgerWrapper}>
        {isMobile ? (
          /* =========================================
             MOBILE VIEW: Card Layout
          ========================================= */
          <div style={styles.mobileList}>
            {payments.map(payment => (
              <div key={payment.id} style={styles.mobileCard}>
                <div style={styles.mobileCardHeader}>
                  <strong style={{ fontSize: '1.05rem', color: '#1e293b' }}>{payment.tenantName}</strong>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: payment.status === 'Completed' ? '#d1fae5' : '#fef3c7',
                    color: payment.status === 'Completed' ? '#065f46' : '#92400e'
                  }}>
                    {payment.status}
                  </span>
                </div>
                
                <div style={styles.mobileCardBody}>
                  <div style={styles.mobileDataRow}><span>🏢 Property:</span> <span>{payment.propertyName}</span></div>
                  <div style={styles.mobileDataRow}><span>📅 Date:</span> <span>{payment.date}</span></div>
                  <div style={styles.mobileDataRow}><span>🧾 Invoice:</span> <span>#{payment.id}</span></div>
                  
                  <div style={styles.mobileAmountRow}>
                    <span>Amount Due</span>
                    <strong>${payment.amount.toLocaleString()}</strong>
                  </div>
                </div>

                {payment.status === 'Pending' && (
                  <button 
                    onClick={() => updateStatus(payment.id, 'Completed')}
                    style={styles.actionBtnFull}
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* =========================================
             DESKTOP VIEW: Traditional Table
          ========================================= */
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Invoice ID</th>
                <th style={styles.th}>Tenant Name</th>
                <th style={styles.th}>Property</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id} style={styles.tr}>
                  <td style={styles.td}>
                    <span style={styles.idBadge}>#{payment.id}</span>
                  </td>
                  <td style={styles.td}><strong>{payment.tenantName}</strong></td>
                  <td style={styles.td}>{payment.propertyName}</td>
                  <td style={styles.td}><strong>${payment.amount.toLocaleString()}</strong></td>
                  <td style={styles.td}>{payment.date}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: payment.status === 'Completed' ? '#d1fae5' : '#fef3c7',
                      color: payment.status === 'Completed' ? '#065f46' : '#92400e'
                    }}>
                      {payment.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {payment.status === 'Pending' ? (
                      <button 
                        onClick={() => updateStatus(payment.id, 'Completed')}
                        style={styles.actionBtn}
                      >
                        Mark Paid
                      </button>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {payments.length === 0 && (
          <div style={styles.emptyState}>No transactions recorded yet.</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' },
  header: { fontSize: '1.5rem', color: '#0f172a', marginBottom: '20px', marginTop: 0 },
  
  // Stats Row
  statsRow: { display: 'flex', gap: '20px', marginBottom: '30px' },
  statBox: { flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
  statLabel: { fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' },
  statValue: { fontSize: '2rem', color: '#0f172a', fontWeight: 'bold' },

  ledgerWrapper: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  
  // Desktop Table Styles
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '16px', backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.85rem', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' },
  td: { padding: '16px', color: '#334155', fontSize: '0.95rem', verticalAlign: 'middle' },
  idBadge: { backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace' },
  statusBadge: { display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' },
  actionBtn: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500', transition: 'background-color 0.2s' },
  
  // Mobile Card Styles
  mobileList: { display: 'flex', flexDirection: 'column', padding: '10px' },
  mobileCard: { border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '12px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  mobileCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' },
  mobileCardBody: { display: 'flex', flexDirection: 'column', gap: '8px' },
  mobileDataRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569' },
  mobileAmountRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '12px', borderTop: '1px dashed #e2e8f0', fontSize: '1.1rem', color: '#0f172a' },
  actionBtnFull: { width: '100%', marginTop: '16px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '10px 0', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' },

  emptyState: { padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '0.95rem' }
};