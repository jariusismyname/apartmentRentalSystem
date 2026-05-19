import React from 'react';
import PropertyCard from './components/PropertyCard';

function App() {
  const sampleApartment = {
    title: "Modern Downtown Loft",
    price: 1850,
    location: "123 Main St, Metro City",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400", // Sample rental image
    bedrooms: 2,
    bathrooms: 1.5,
    area: 950
  };

  return (
    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <PropertyCard property={sampleApartment} />
    </div>
  );
}

export default App;