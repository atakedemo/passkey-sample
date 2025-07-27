// app/page.tsx
import Link from 'next/link';
import React from 'react';

const Home: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to Next.js on AWS Amplify!</h1>
      <Link href="/about">Go to About Page</Link>
    </div>
  );
};

const styles: { container: React.CSSProperties } = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
};

export default Home;
