import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PropertyList({ properties, favorites = [], toggleFavorite, currentUser, isMobile }) {  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBedrooms, setMinBedrooms] = useState('any');

  const handleResetFilters = () => {
    setSearchTerm('');
    setMaxPrice('');
    setMinBedrooms('any');
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = maxPrice ? property.price <= Number(maxPrice) : true;
    const matchesBeds = minBedrooms === 'any' ? true : property.bedrooms >= Number(minBedrooms);
    return matchesSearch && matchesPrice && matchesBeds;
  });

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={{ margin: '0 0 6px 0', color: '#333' }}>Find Your Next Home</h1>
        <p style={{ margin: 0, color: '#666' }}>Discover verified listings matching your lifestyle criteria.</p>
      </header>

<div style={{
     ...styles.filterConsole, 
     gridTemplateColumns: isMobile ? '1fr' : '2fr 2fr 1.5fr 0.8fr',
     gap: isMobile ? '15px' : '20px'
   }}>
            <div style={styles.filterGroup}>
          <label style={styles.label}>Where are you looking?</label>
          <input type="text" placeholder="e.g., Downtown, Austin, Studio..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.input} />
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Max Monthly Budget {maxPrice && `($${Number(maxPrice).toLocaleString()})`}</label>
          <input type="range" min="500" max="5000" step="100" value={maxPrice || '5000'} onChange={(e) => setMaxPrice(e.target.value)} style={styles.slider} />
          <div style={styles.sliderLabels}><span>$500</span><span>$5,000</span></div>
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Bedrooms Needed</label>
          <select value={minBedrooms} onChange={(e) => setMinBedrooms(e.target.value)} style={styles.select}>
            <option value="any">Any Layout</option>
            <option value="1">1+ Bedrooms</option>
            <option value="2">2+ Bedrooms</option>
            <option value="3">3+ Bedrooms</option>
          </select>
        </div>
        <div style={styles.btnGroup}><button onClick={handleResetFilters} style={styles.resetBtn}>Reset</button></div>
      </div>

      <p style={styles.resultsCounter}>Showing <strong>{filteredProperties.length}</strong> matching options</p>

      {filteredProperties.length === 0 ? (
        <div style={styles.noResultsCard}>
          <h3>No matches found</h3>
          <p>Try expanding your search radius, lowering bedroom demands, or lifting budget restraints.</p>
          <button onClick={handleResetFilters} style={styles.clearLinkBtn}>Reset Filters</button>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredProperties.map(property => {
            // Check if this property has been favorited by the logged in tenant
            const isFavorited = favorites.some(f => f.propertyId === property.id && f.userEmail === currentUser?.email);

            return (
              <div key={property.id} style={styles.card}>
                                  <img style={styles.imagePlaceholder} src={property.image} alt="" style={styles.heroImage} />
                      <div >
                   {/* Floating Action Button Layer */}
                  {currentUser?.role === 'tenant' && (
                    <button 
                      onClick={() => toggleFavorite(property.id)} 
                      style={styles.favFloatingBtn}
                      title={isFavorited ? "Remove from Saved" : "Save this Home"}
                    >
                      {isFavorited ? '❤️' : '🤍'}
                    </button>
                  )}
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.priceTag}>${property.price.toLocaleString()}<span style={{fontSize: '0.8rem', color:'#666'}}>/mo</span></div>
                  <h3 style={styles.cardTitle}>{property.title}</h3>
                  <p style={styles.cardLoc}>📍 {property.location}</p>
                  <div style={styles.specsRow}>
                    <span style={styles.specItem}>🛏️ {property.bedrooms} Bed</span>
                    <span style={styles.specItem}>🛁 {property.bathrooms || 1} Bath</span>
                  </div>
                  <Link to={`/property/${property.id}`} style={styles.viewBtn}>View Details</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif' },
  header: { marginBottom: '30px' },
  filterConsole: { backgroundColor: '#fff', border: '1px solid #e1e4e8', borderRadius: '12px', padding: '20px', display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 0.8fr', gap: '20px', alignItems: 'end', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.8rem', fontWeight: 'bold', color: '#555', textTransform: 'uppercase' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box' },
  select: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.95rem', backgroundColor: '#fff', cursor: 'pointer' },
  slider: { margin: '12px 0 4px 0', cursor: 'pointer', accentColor: '#007bff' },
  sliderLabels: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888' },
  btnGroup: { display: 'flex', justifyContent: 'flex-end' },
  resetBtn: { padding: '10px 14px', backgroundColor: '#f0f2f5', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#555', fontSize: '0.9rem', width: '100%' },
  resultsCounter: { fontSize: '0.9rem', color: '#666', margin: '24px 0 16px 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '25px' },
  card: { backgroundColor: '#fff', border: '1px solid #e1e4e8', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
  imagePlaceholder: { height: '160px', backgroundColor: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#666', borderBottom: '1px solid #e1e4e8', position: 'relative' },
  
  // New Floating Heart Action Layout Style
  favFloatingBtn: { position: 'absolute', top: '12px', right: '12px', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#ffffff', border: '1px solid #e1e4e8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', transition: 'transform 0.1s' },
  
  cardBody: { padding: '18px' },
  priceTag: { fontSize: '1.3rem', fontWeight: 'bold', color: '#007bff', marginBottom: '4px' },
  cardTitle: { margin: '0 0 6px 0', fontSize: '1.1rem', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  cardLoc: { margin: '0 0 12px 0', fontSize: '0.85rem', color: '#666' },
  specsRow: { display: 'flex', gap: '15px', borderTop: '1px solid #f0f2f5', paddingTop: '10px', marginBottom: '16px' },
  specItem: { fontSize: '0.85rem', color: '#555', fontWeight: '500' },
  viewBtn: { display: 'block', textAlign: 'center', backgroundColor: '#007bff', color: '#fff', padding: '10px 0', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' },
  noResultsCard: { textAlign: 'center', padding: '40px 20px', border: '1px dashed #ccc', borderRadius: '12px', backgroundColor: '#fafbfc', color: '#555' },
  clearLinkBtn: { backgroundColor: 'transparent', border: 'none', color: '#007bff', textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem', marginTop: '10px' }
};