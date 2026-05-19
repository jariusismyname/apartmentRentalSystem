import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProperties } from '../mockData';

const PropertyDetails = () => {
  const { id } = useParams();
  const property = mockProperties.find((p) => p.id === parseInt(id));

  if (!property) return <h2>Property not found!</h2>;

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>← Back to Search</Link>
      <img src={property.image} alt={property.title} style={styles.heroImage} />
      <h1>{property.title}</h1>
      <p style={styles.location}>📍 {property.location}</p>
      <h2 style={styles.price}>${property.price} / month</h2>
      
      <div style={styles.detailsGrid}>
        <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
        <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
        <p><strong>Area:</strong> {property.area} sq ft</p>
      </div>

      <button style={styles.bookButton}>Apply for this Apartment</button>
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '40px auto', padding: '20px' },
  heroImage: { width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px' },
  backLink: { display: 'inline-block', marginBottom: '20px', color: '#007bff', textDecoration: 'none' },
  price: { color: '#28a745' },
  detailsGrid: { display: 'flex', gap: '30px', margin: '20px 0' },
  bookButton: { padding: '15px 30px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem' }
};

export default PropertyDetails;