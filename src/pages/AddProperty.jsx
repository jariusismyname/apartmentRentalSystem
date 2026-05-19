import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddProperty({ addProperty }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80' // High-quality fallback home image
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert numeric strings into correct data types before saving
    addProperty({
      title: formData.title,
      price: parseInt(formData.price),
      location: formData.location,
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      area: parseInt(formData.area),
      image: formData.image
    });

    // Bounce the landlord instantly back to the catalog feed to view their new card!
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h2>List a New Rental Property</h2>
      <p style={{ color: '#666', marginTop: '-10px', marginBottom: '30px' }}>Fill out the details below to add a new home to the public marketplace feed.</p>
      
      <form onSubmit={handleSubmit} style={styles.formContainer}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Listing Title</label>
          <input type="text" name="title" required placeholder="e.g., Luxury Penthouse Suite" value={formData.title} onChange={handleInputChange} style={styles.input} />
        </div>

        <div style={styles.row}>
          <div style={{ ...styles.inputGroup, flex: 1 }}>
            <label style={styles.label}>Monthly Rent ($)</label>
            <input type="number" name="price" required placeholder="2400" value={formData.price} onChange={handleInputChange} style={styles.input} />
          </div>
          <div style={{ ...styles.inputGroup, flex: 2 }}>
            <label style={styles.label}>Location Address / City</label>
            <input type="text" name="location" required placeholder="Downtown, Chicago" value={formData.location} onChange={handleInputChange} style={styles.input} />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Bedrooms</label>
            <input type="number" name="bedrooms" required placeholder="2" value={formData.bedrooms} onChange={handleInputChange} style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Bathrooms</label>
            <input type="number" name="bathrooms" required placeholder="1.5" value={formData.bathrooms} onChange={handleInputChange} style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Square Footage (sq ft)</label>
            <input type="number" name="area" required placeholder="1100" value={formData.area} onChange={handleInputChange} style={styles.input} />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Property Showcase Image Link (URL)</label>
          <input type="url" name="image" placeholder="Paste an unsplash picture URL or leave blank for default photo" value={formData.image === 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80' ? '' : formData.image} onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80' }))} style={styles.input} />
        </div>

        <button type="submit" style={styles.submitBtn}>Publish Property Listing</button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: '650px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif' },
  formContainer: { backgroundColor: '#fff', border: '1px solid #e1e4e8', borderRadius: '12px', padding: '26px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' },
  inputGroup: { display: 'flex', flexDirection: 'column', marginBottom: '18px' },
  row: { display: 'flex', gap: '16px' },
  label: { fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px', color: '#444' },
  input: { padding: '11px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.95rem' },
  submitBtn: { width: '100%', padding: '14px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', marginTop: '10px' }
};