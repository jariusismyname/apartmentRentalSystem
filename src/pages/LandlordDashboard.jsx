import React, { useState } from 'react';

export default function LandlordDashboard({ applications, updateStatus, properties, setProperties, messages = [] }) {
  const [activeTab, setActiveTab] = useState('applications');
  
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', price: '', location: '', bedrooms: '' });

  const handleDeleteProperty = (id) => {
    if (window.confirm("Are you certain you want to permanently delete this listing? All unsaved data will vanish.")) {
      setProperties(prev => prev.filter(prop => prop.id !== id));
    }
  };

  const handleStartEdit = (property) => {
    setEditingPropertyId(property.id);
    setEditFormData({
      title: property.title,
      price: property.price,
      location: property.location,
      bedrooms: property.bedrooms
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setProperties(prev => prev.map(prop => 
      prop.id === editingPropertyId 
        ? { ...prop, title: editFormData.title, price: Number(editFormData.price), location: editFormData.location, bedrooms: Number(editFormData.bedrooms) }
        : prop
    ));
    setEditingPropertyId(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: '4px', color: '#333' }}>Landlord Command Center</h1>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '24px' }}>Control your tenant approval funnels and optimize property metrics.</p>

      {/* Tab Switcher Toolbar */}
      <div style={styles.tabBar}>
        <button 
          onClick={() => setActiveTab('applications')} 
          style={{ ...styles.tabBtn, borderBottom: activeTab === 'applications' ? '3px solid #007bff' : '3px solid transparent', color: activeTab === 'applications' ? '#007bff' : '#666' }}
        >
          📄 Applications ({applications.length})
        </button>
        <button 
          onClick={() => setActiveTab('properties')} 
          style={{ ...styles.tabBtn, borderBottom: activeTab === 'properties' ? '3px solid #007bff' : '3px solid transparent', color: activeTab === 'properties' ? '#007bff' : '#666' }}
        >
          🏢 Manage Listings ({properties.length})
        </button>
        <button 
          onClick={() => setActiveTab('messages')} 
          style={{ ...styles.tabBtn, borderBottom: activeTab === 'messages' ? '3px solid #e28743' : '3px solid transparent', color: activeTab === 'messages' ? '#e28743' : '#666' }}
        >
          📥 Inbound Inquiries ({messages.length})
        </button>
      </div>

      {/* --- TAB 1: APPLICATIONS --- */}
      {activeTab === 'applications' && (
        <div style={styles.tableContainer}>
          {applications.length === 0 ? (
            <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No submitted tenant profiles are floating in queue.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>Applicant</th>
                  <th style={styles.th}>Target Home</th>
                  <th style={styles.th}>Email Address</th>
                  <th style={styles.th}>Current Status</th>
                  <th style={styles.th}>Decision Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} style={styles.tableRow}>
                    <td style={styles.td}><strong>{app.name}</strong></td>
                    <td style={styles.td}>{app.propertyTitle}</td>
                    <td style={styles.td}>{app.email}</td>
                    <td style={styles.td}>
                      <span style={{ 
                        ...styles.badge, 
                        backgroundColor: app.status === 'Approved' ? '#d4edda' : app.status === 'Rejected' ? '#f8d7da' : '#fff3cd',
                        color: app.status === 'Approved' ? '#155724' : app.status === 'Rejected' ? '#721c24' : '#856404'
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {app.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => updateStatus(app.id, 'Approved')} style={styles.approveBtn}>Approve</button>
                          <button onClick={() => updateStatus(app.id, 'Rejected')} style={styles.rejectBtn}>Deny</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* --- TAB 2: MANAGE PROPERTIES --- */}
      {activeTab === 'properties' && (
        <div>
          {editingPropertyId && (
            <div style={styles.editOverlay}>
              <form onSubmit={handleSaveEdit} style={styles.editForm}>
                <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Edit Listing Metadata</h3>
                <label style={styles.formLabel}>Listing Headline</label>
                <input type="text" value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} style={styles.formInput} required />
                <div style={{ display: 'flex', gap: '12px' }}><div style={{ flex: 1 }}><label style={styles.formLabel}>Monthly Rent ($)</label><input type="number" value={editFormData.price} onChange={(e) => setEditFormData({...editFormData, price: e.target.value})} style={styles.formInput} required /></div><div style={{ flex: 1 }}><label style={styles.formLabel}>Bedrooms</label><input type="number" value={editFormData.bedrooms} onChange={(e) => setEditFormData({...editFormData, bedrooms: e.target.value})} style={styles.formInput} required /></div></div>
                <label style={styles.formLabel}>Address Location</label>
                <input type="text" value={editFormData.location} onChange={(e) => setEditFormData({...editFormData, location: e.target.value})} style={styles.formInput} required />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}><button type="button" onClick={() => setEditingPropertyId(null)} style={styles.cancelBtn}>Discard</button><button type="submit" style={styles.saveBtn}>Commit Changes</button></div>
              </form>
            </div>
          )}

          <div style={styles.grid}>
            {properties.map(property => (
              <div key={property.id} style={styles.propCard}>
                <div style={styles.propDetails}>
                  <span style={styles.propPrice}>${property.price.toLocaleString()}/mo</span>
                  <h4 style={styles.propTitle}>{property.title}</h4>
                  <p style={styles.propMeta}>📍 {property.location} | 🛏️ {property.bedrooms} Beds</p>
                </div>
                <div style={styles.actionColumn}>
                  <button onClick={() => handleStartEdit(property)} style={styles.editInlineBtn}>✏️ Edit</button>
                  <button onClick={() => handleDeleteProperty(property.id)} style={styles.deleteInlineBtn}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: NEW INBOUND MESSAGES INBOX --- */}
      {activeTab === 'messages' && (
        <div style={styles.msgStack}>
          {messages.length === 0 ? (
            <p style={{ padding: '30px', textAlign: 'center', color: '#666', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e1e4e8' }}>
              No incoming messages or property inquiries found.
            </p>
          ) : (
            messages.map(msg => (
              <div key={msg.id} style={styles.msgCard}>
                <div style={styles.msgHeader}>
                  <div>
                    <span style={styles.msgSender}>👤 {msg.senderName}</span>
                    <a href={`mailto:${msg.senderEmail}`} style={styles.msgEmail}>({msg.senderEmail})</a>
                  </div>
                  <span style={styles.msgDate}>{msg.date}</span>
                </div>
                <div style={styles.msgTarget}>
                  Regarding Listing: <strong>{msg.propertyTitle}</strong>
                </div>
                <p style={styles.msgText}>"{msg.text}"</p>
                <a href={`mailto:${msg.senderEmail}?subject=Reply: Inquiry regarding ${encodeURIComponent(msg.propertyTitle)}`} style={styles.replyLink}>
                  ✉️ Reply via Email Client
                </a>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif' },
  tabBar: { display: 'flex', gap: '30px', borderBottom: '1px solid #dee2e6', marginBottom: '24px' },
  tabBtn: { background: 'none', border: 'none', padding: '10px 5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' },
  tableContainer: { backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e1e4e8', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHead: { backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' },
  th: { padding: '14px', fontSize: '0.85rem', color: '#444' },
  tableRow: { borderBottom: '1px solid #e1e4e8' },
  td: { padding: '14px', fontSize: '0.95rem', color: '#333' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' },
  approveBtn: { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' },
  rejectBtn: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' },
  
  grid: { display: 'flex', flexDirection: 'column', gap: '15px' },
  propCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #e1e4e8', padding: '20px', borderRadius: '8px' },
  propDetails: { display: 'flex', flexDirection: 'column', gap: '4px' },
  propPrice: { fontSize: '1.2rem', fontWeight: 'bold', color: '#007bff' },
  propTitle: { margin: 0, fontSize: '1.05rem', color: '#333' },
  propMeta: { margin: 0, fontSize: '0.85rem', color: '#666' },
  actionColumn: { display: 'flex', gap: '12px' },
  editInlineBtn: { padding: '8px 14px', backgroundColor: '#f0f2f5', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' },
  deleteInlineBtn: { padding: '8px 14px', backgroundColor: '#fff0f0', border: '1px solid #f5c6cb', color: '#721c24', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' },
  
  editOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  editForm: { backgroundColor: '#fff', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '450px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' },
  formLabel: { display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#555', marginBottom: '4px', marginTop: '12px', textTransform: 'uppercase' },
  formInput: { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '0.95rem' },
  cancelBtn: { padding: '8px 14px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  saveBtn: { padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },

  // Messaging styles
  msgStack: { display: 'flex', flexDirection: 'column', gap: '15px' },
  msgCard: { backgroundColor: '#fff', border: '1px solid #e1e4e8', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.01)' },
  msgHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f2f5', paddingBottom: '8px', marginBottom: '10px' },
  msgSender: { fontWeight: 'bold', color: '#333', fontSize: '0.95rem' },
  msgEmail: { marginLeft: '8px', color: '#007bff', fontSize: '0.85rem', textDecoration: 'none' },
  msgDate: { color: '#888', fontSize: '0.8rem' },
  msgTarget: { fontSize: '0.85rem', color: '#555', backgroundColor: '#f8f9fa', padding: '6px 12px', borderRadius: '4px', display: 'inline-block' },
  msgText: { color: '#444', fontStyle: 'italic', fontSize: '0.95rem', margin: '14px 0' },
  replyLink: { color: '#e28743', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem', display: 'inline-block' }
};