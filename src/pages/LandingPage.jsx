export default function LandingPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--primary)' }}>
        ברוכים הבאים ל-JuniorMatch! 🎯
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#475569', lineHeight: '1.6' }}>
        נמאס לכם שמתעלמים מקורות החיים שלכם? <br />
        בואו למצוא עבודה בזכות הפרויקטים שבניתם.
      </p>
      <button style={{ 
        backgroundColor: 'var(--primary)', 
        color: 'white', 
        padding: '12px 24px', 
        fontSize: '1.1rem', 
        border: 'none', 
        borderRadius: '8px', 
        marginTop: '30px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        הצטרפו עכשיו
      </button>
    </div>
  );
}
