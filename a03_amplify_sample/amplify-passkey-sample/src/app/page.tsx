// app/page.tsx
import React from 'react';
import AuthContainer from '../components/AuthContainer';

const Home: React.FC = () => {
  return (
    <div style={styles.container}>
      <AuthContainer />
    </div>
  );
};

const styles: { container: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    padding: '1rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
  },
};

export default Home;
