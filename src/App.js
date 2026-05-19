import React, { useState } from 'react';
import PropertyCard from './components/PropertyCard';
import FilterBar from './components/FilterBar';
import { mockProperties } from './mockData';

function App() {
  // State to hold the user's active filter settings
  const [filters, setFilters] = useState({
    location: '',
    maxPrice: ''
  });

  // Logic to filter properties based on state
  const filteredProperties = mockProperties.filter(property => {
    const matchesLocation = property.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesPrice = filters.maxPrice ? property.price <= parseInt(filters.maxPrice) : true;
    
    return matchesLocation && matchesPrice;
  });

  return (
    <div style={{ padding: '40px', backgroundColor: '#f4f6f8', minHeight: '100vh', fontFamily: 'Arial' }}>
      <h1 style={{ marginBottom: '5px' }}>Find Your Next Home</h1>
      <p style={{ color: '#666', marginBottom: '25px' }}>Discover the perfect apartment tailored to your lifestyle.</p>
      
      {/* Pass filter state and setter down */}
      <FilterBar filters={filters} setFilters={setFilters} />

      {/* Grid container to hold our cards */}
      <div style={styles.grid}>
        {filteredProperties.length > 0 ? (
          filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <p style={{ color: '#888', gridColumn: '1/-1', textAlign: 'center', marginTop: '20px' }}>
            No properties match your search criteria. Try adjusting your filters!
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    justifyItems: 'center'
  }
};

export default App;