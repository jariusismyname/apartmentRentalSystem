import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProperties } from '../mockData';

// 1. NOTICE THIS: We are accepting the addApplication function here
export default function PropertyDetails({ addApplication }) {
  const { id } = useParams();
  const property = mockProperties.find((p) => p.id === parseInt(id));

  const [showForm, setShowForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    moveInDate: '',
    message: ''
  });

  if (!property) return <h2 style={{ textAlign: 'center', marginTop: '40px' }}>Property not found!</h2>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 2. THIS IS THE CRITICAL PART: 
    // We package the data and send it to App.jsx so it saves to localStorage
    if (addApplication) {
      addApplication({
        propertyId: property.id,
        propertyName: property.title,
        ...formData
      });
    } else {
      console.error("addApplication function is missing!");
    }

    setIsSubmitted(true);
  };

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>← Back to Search</Link>
      
      <img src={property.image} alt={property.title} style={styles.heroImage} />
      
      <h1 style={styles.title}>{property.title}</h1>
      <p style={styles.location}>📍 {property.location}</p>
      <h2 style={styles.price}>${property.price} / month</h2>
      
      <div style={styles.detailsGrid}>
        <div style={styles.specBox}>🛏️ <strong>{property.bedrooms}</strong> Beds</div>
        <div style={styles.specBox}>🛁 <strong>{property.bathrooms}</strong> Baths</div>
        <div style={styles.specBox}>📐 <strong>{property.area}</strong> sq ft</div>
      </div>

      <hr style={styles.divider} />

      {!showForm && !isSubmitted && (
        <button style={styles.actionButton} onClick={() => setShowForm(true)}>
          Apply for this Apartment
        </button>
      )}

      {showForm && !isSubmitted && (
        <div style={styles.formContainer}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Rental Application Form</h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleInputChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Target Move-in Date</label>
              <input type="date" name="moveInDate" required value={formData.moveInDate} onChange={handleInputChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Message to Landlord</label>
              <textarea name="message" rows="4" value={formData.message} onChange={handleInputChange} style={{...styles.input, resize: 'vertical'}}></textarea>
            </div>
            <div style={styles.btnGroup}>
              <button type="button" onClick={() => setShowForm(false)} style={styles.cancelButton}>Cancel</button>
              <button type="submit" style={styles.submitButton}>Submit Application</button>
            </div>
          </form>
        </div>
      )}

      {isSubmitted && (
        <div style={styles.successMessage}>
          🎉 <strong>Application Submitted Successfully!</strong>
          <p>Thank you, {formData.fullName}. You can now view this in the Landlord Dashboard.</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '750px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  backLink: { display: 'inline-block', marginBottom: '20px', color: '#007bff', textDecoration: 'none', fontWeight: 'bold' },
  heroImage: { width: '100%', height: '380px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  title: { marginTop: '24px', marginBottom: '8px', color: '#333' },
  location: { margin: '0 0 16px 0', color: '#666', fontSize: '1.05rem' },
  price: { color: '#28a745', margin: '0 0 24px 0' },
  detailsGrid: { display: 'flex', gap: '20px', marginBottom: '24px' },
  specBox: { backgroundColor: '#f0f2f5', padding: '10px 20px', borderRadius: '8px', fontSize: '0.95rem', color: '#444' },
  divider: { border: '0', borderTop: '1px solid #ddd', margin: '30px 0' },
  actionButton: { width: '100%', padding: '15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' },
  formContainer: { backgroundColor: '#fff', border: '1px solid #e1e4e8', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' },
  inputGroup: { display: 'flex', flexDirection: 'column', marginBottom: '16px' },
  label: { fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px', color: '#444' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', fontFamily: 'inherit' },
  btnGroup: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' },
  cancelButton: { padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  submitButton: { padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  successMessage: { backgroundColor: '#d4edda', color: '#155724', padding: '20px', borderRadius: '8px', border: '1px solid #c3e6cb', textAlign: 'center', fontSize: '1.05rem' }
};