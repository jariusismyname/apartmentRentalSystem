import React from 'react';

const FilterBar = ({ filters, setFilters }) => {
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.filterGroup}>
        <label style={styles.label}>Location</label>
        <input 
          type="text" 
          name="location" 
          placeholder="e.g. Metro City" 
          value={filters.location}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.label}>Max Price ($)</label>
        <input 
          type="number" 
          name="maxPrice" 
          placeholder="Any price" 
          value={filters.maxPrice}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '20px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    marginBottom: '30px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    marginBottom: '6px',
    color: '#444',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  }
};

export default FilterBar;