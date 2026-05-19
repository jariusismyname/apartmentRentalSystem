import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// High-fidelity image gallery assets map mapping
const GALLERY_IMAGES = [
  { id: 'img1', url: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQtLvpoO5lWwXkZpxudGOv_T9Wt9J6Jhu6mdLksrdcO1lnNoUntu23Q4L3IgEG010QLHCi4Q9tjqEe4JDM', label: 'Living Room' },
  { id: 'img2', url: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTRGVaJgPkA10uzr0LmpEKsc99OwdIEwLIG9tzgMz7SjPEZd9DF5D0I7ht_wgrjS-i0p8KSmZVG963rmvs', label: 'Kitchen Space' },
  { id: 'img3', url: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcRFRDRGbzVNxa4OFRgVXNArKQC5oJQLuVa_Su4uynalD2MKxlhMGmhkGrCoyo_gDRBnaHBB5-1DzLqauAI', label: 'Master Bedroom' }
];

export default function PropertyDetails({ properties, addApplication, currentUser, addMessage }) {
  const { id } = useParams();
  const property = properties.find(p => p.id === Number(id));

  // Gallery slider state track hook pointer
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Lead processing hooks
  const [isApplied, setIsApplied] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [msgSuccess, setMsgSuccess] = useState(false);

  if (!property) {
    return (
      <div style={styles.errorContainer}>
        <h2>Listing Not Found</h2>
        <p>The property you are trying to view might have been unlisted or removed by the manager.</p>
        <Link to="/" style={styles.backBtn}>Back to Find Homes</Link>
      </div>
    );
  }

  const handleApply = (e) => {
    e.preventDefault();
    if (!currentUser) return alert('Please login as a tenant to submit rental applications.');
    
    addApplication({
      propertyId: property.id,
      propertyTitle: property.title,
      name: currentUser.name,
      email: currentUser.email
    });
    setIsApplied(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    
    addMessage({
      senderName: currentUser ? currentUser.name : 'Anonymous Prospect',
      senderEmail: currentUser ? currentUser.email : 'guest@renthub.com',
      propertyTitle: property.title,
      text: msgText
    });

    setMsgText('');
    setMsgSuccess(true);
    setTimeout(() => setMsgSuccess(false), 4000);
  };

  const nextSlide = () => {
    setActiveImageIdx((prev) => (prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveImageIdx((prev) => (prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1));
  };

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.breadcrumb}>← Back to Marketplace Listings</Link>

      {/* NEW COMPONENT LAYER: INTERACTIVE MEDIA HEADER SLIDER */}
      <div style={styles.galleryContainer}>
        <div style={styles.mainViewerFrame}>
          <img 
            src={GALLERY_IMAGES[activeImageIdx].url} 
            alt={GALLERY_IMAGES[activeImageIdx].label} 
            style={styles.heroImgViewport} 
          />
          <button onClick={prevSlide} style={{ ...styles.sliderArrow, left: '15px' }}>‹</button>
          <button onClick={nextSlide} style={{ ...styles.sliderArrow, right: '15px' }}>›</button>
          <div style={styles.floatingBadgeTag}>
            {GALLERY_IMAGES[activeImageIdx].label} ({activeImageIdx + 1}/{GALLERY_IMAGES.length})
          </div>
        </div>
        
        {/* Thumbnail Select strip */}
        <div style={styles.thumbnailStrip}>
          {GALLERY_IMAGES.map((img, index) => (
            <button 
              key={img.id} 
              onClick={() => setActiveImageIdx(index)}
              style={{
                ...styles.thumbBtn,
                border: activeImageIdx === index ? '3px solid #007bff' : '3px solid transparent',
                opacity: activeImageIdx === index ? '1' : '0.6'
              }}
            >
              <img src={img.url} alt="thumbnail" style={styles.thumbImg} />
            </button>
          ))}
        </div>
      </div>

      <div style={styles.layoutSplitGrid}>
        {/* Left Column: Information specs card detailing the target room parameters */}
        <div>
          <div style={styles.mainTitleBlock}>
            <span style={styles.verifiedBadge}>✓ Verified RentHub Listing</span>
            <h1 style={styles.propTitle}>{property.title}</h1>
            <p style={styles.propLoc}>📍 {property.location}</p>
          </div>

          <div style={styles.specDeckRow}>
            <div style={styles.specCard}><strong>🛏️ {property.bedrooms}</strong><br/><span>Bedrooms</span></div>
            <div style={styles.specCard}><strong>🛁 {property.bathrooms || 1}</strong><br/><span>Bathrooms</span></div>
            <div style={styles.specCard}><strong>📏 {property.sqft || '1,120'}</strong><br/><span>Sq. Footage</span></div>
            <div style={styles.specCard}><strong>⚡ Active</strong><br/><span>Status</span></div>
          </div>

          <h3 style={styles.subHeading}>About this property space</h3>
          <p style={styles.descParagraph}>
            This premium home option offers immediate access to local central transportation corridors, upgraded stainless appliances, high speed fiber optic ready terminal boxes, and open floor planning setups perfectly customized for contemporary living standards. Pet friendly terms are negotiable during application processing.
          </p>

          <h3 style={styles.subHeading}>Amenities Inventory</h3>
          <div style={styles.amenitiesGrid}>
            <div style={styles.amenityChip}>🧺 In-unit Washer/Dryer</div>
            <div style={styles.amenityChip}>🚗 Covered Parking Stall</div>
            <div style={styles.amenityChip}>🐾 Pet Friendly Leases</div>
            <div style={styles.amenityChip}>📶 Centralized Air Systems</div>
          </div>
        </div>

        {/* Right Column: Dynamic Application and Inquiry Forms panels */}
        <div>
          <div style={styles.actionStickyBox}>
            <div style={styles.priceHeader}>
              <span style={styles.bigPrice}>${property.price.toLocaleString()}</span>
              <span style={{ color: '#666', fontSize: '0.95rem' }}> / month base lease</span>
            </div>

            {/* Application Submission Framework Block */}
            {currentUser?.role === 'tenant' ? (
              <div style={{ marginBottom: '25px' }}>
                {isApplied ? (
                  <div style={styles.successNoticeBox}>
                    🎉 <strong>Application Lodged!</strong><br/>
                    Your background profile details were successfully filed. Track progress within your Dashboard Hub row.
                  </div>
                ) : (
                  <button onClick={handleApply} style={styles.primaryActionBtn}>Submit Application Now</button>
                )}
              </div>
            ) : (
              <div style={styles.infoLoginBox}>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#555' }}>Log in using an active Tenant Profile subscription line to request lease holds or submit background portfolios.</p>
                <Link to="/login" style={styles.embeddedLoginLink}>Go to Profile Login</Link>
              </div>
            )}

            {/* Direct Message Core Framework Container Block */}
            <div style={styles.messagingContainerBox}>
              <h4 style={{ margin: '0 0 12px 0', color: '#333', fontSize: '0.95rem' }}>Inquire for Tour Times</h4>
              <form onSubmit={handleSendMessage}>
                <textarea 
                  value={msgText} 
                  onChange={(e) => setMsgText(e.target.value)} 
                  placeholder="Ask about utility distribution bills, parking spaces, move-in timelines..." 
                  style={styles.textInputBox} 
                  required
                />
                <button type="submit" style={styles.secondaryActionBtn}>Send Direct Message</button>
              </form>
              {msgSuccess && (
                <p style={styles.toastAlert}>Message sent securely! The managing landlord will respond shortly.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1000px', margin: '30px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif' },
  breadcrumb: { display: 'inline-block', marginBottom: '20px', color: '#007bff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' },
  
  // NEW STYLING DICTIONARIES FOR RESPONSIVE MEDIA VIEWPORT
  galleryContainer: { backgroundColor: '#1e293b', borderRadius: '12px', padding: '15px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' },
  mainViewerFrame: { height: '420px', position: 'relative', overflow: 'hidden', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' },
  heroImgViewport: { width: '100%', height: '100%', objectFit: 'cover' },
  sliderArrow: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', userSelect: 'none', transition: 'background-color 0.2s' },
  floatingBadgeTag: { position: 'absolute', bottom: '15px', right: '15px', backgroundColor: 'rgba(15, 23, 42, 0.75)', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', backdropFilter: 'blur(4px)' },
  thumbnailStrip: { display: 'flex', gap: '12px', marginTop: '15px', justifyContent: 'center' },
  thumbBtn: { padding: 0, cursor: 'pointer', borderRadius: '6px', overflow: 'hidden', width: '80px', height: '55px', backgroundColor: 'transparent', transition: 'all 0.15s' },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover' },

  layoutSplitGrid: { display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '40px', marginTop: '20px' },
  mainTitleBlock: { borderBottom: '1px solid #e1e4e8', paddingBottom: '20px', marginBottom: '25px' },
  verifiedBadge: { display: 'inline-block', backgroundColor: '#e6f4ea', color: '#137333', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', marginBottom: '10px' },
  propTitle: { margin: '0 0 8px 0', fontSize: '1.8rem', color: '#222' },
  propLoc: { margin: 0, color: '#555', fontSize: '0.95rem' },
  specDeckRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' },
  specCard: { backgroundColor: '#f8f9fa', border: '1px solid #e1e4e8', borderRadius: '8px', padding: '12px', textAlign: 'center', fontSize: '0.85rem', color: '#666' },
  subHeading: { fontSize: '1.2rem', color: '#333', marginBottom: '12px', marginTop: '30px' },
  descParagraph: { color: '#444', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 },
  amenitiesGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '15px' },
  amenityChip: { backgroundColor: '#f1f3f5', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', color: '#444', border: '1px solid #e9ecef', fontWeight: '500' },
  actionStickyBox: { backgroundColor: '#fff', border: '1px solid #e1e4e8', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'sticky', top: '90px' },
  priceHeader: { paddingBottom: '15px', borderBottom: '1px solid #eee', marginBottom: '20px', display: 'flex', alignItems: 'baseline' },
  bigPrice: { fontSize: '2rem', fontWeight: 'bold', color: '#007bff' },
  primaryActionBtn: { width: '100%', backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '14px 0', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(40,167,69,0.2)' },
  successNoticeBox: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '6px', padding: '15px', fontSize: '0.9rem', lineHeight: '1.4' },
  infoLoginBox: { backgroundColor: '#e8f0fe', borderRadius: '6px', padding: '15px', border: '1px solid #d2e3fc', marginBottom: '20px' },
  embeddedLoginLink: { fontSize: '0.85rem', color: '#1a73e8', fontWeight: 'bold', textDecoration: 'underline' },
  messagingContainerBox: { borderTop: '1px solid #eee', paddingTop: '20px' },
  textInputBox: { width: '100%', height: '80px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc', padding: '10px', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'none', marginBottom: '10px' },
  secondaryActionBtn: { width: '100%', backgroundColor: '#fff', color: '#007bff', border: '1px solid #007bff', padding: '10px 0', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' },
  toastAlert: { fontSize: '0.8rem', color: '#28a745', margin: '8px 0 0 0', fontWeight: 'bold', textAlign: 'center' },
  errorContainer: { maxWidth: '500px', margin: '80px auto', textAlign: 'center', fontFamily: 'Arial, sans-serif', padding: '0 20px' },
  backBtn: { display: 'inline-block', marginTop: '15px', backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }
};