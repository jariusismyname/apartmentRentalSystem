import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  // 1. ADDED 'id' to this line so property.id exists
  const { id, title, price, location, image, bedrooms, bathrooms, area } = property;

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img src={image} alt={title} style={styles.image} />
        <span style={styles.priceTag}>${price}/mo</span>
      </div>
      
      <div style={styles.detailsContainer}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.location}>📍 {location}</p>
        
        <hr style={styles.divider} />
        
        <div style={styles.specs}>
          <span>🛏️ {bedrooms} Beds</span>
          <span>🛁 {bathrooms} Baths</span>
          <span>📐 {area} sq ft</span>
        </div>
        
        {/* 2. FIXED: Removed the <button> tag. Using Link as the button. */}
        <Link to={`/property/${id}`} style={styles.button}>
          View Details
        </Link>
      </div> 
    </div>
  );
};

const styles = {
  card: {
    width: '300px',
    height: '400px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
    transition: 'transform 0.2s',
  },
  imageContainer: {
    position: 'relative',
    height: '200px', // Set a fixed height for consistency
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  priceTag: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  detailsContainer: {
    padding: '16px',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '1.2rem',
    color: '#333',
  },
  location: {
    margin: '0 0 12px 0',
    color: '#666',
    fontSize: '0.9rem',
  },
  divider: {
    border: '0',
    borderTop: '1px solid #eee',
    margin: '12px 0',
  },
  specs: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#555',
    marginBottom: '16px',
  },
  button: {
    display: 'block', // Makes the Link behave like a button
    width: '100%',
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none', // Removes the blue underline from the Link
    textAlign: 'center',    // Centers the text
    boxSizing: 'border-box' // Ensures padding doesn't break width
  }
};

export default PropertyCard;