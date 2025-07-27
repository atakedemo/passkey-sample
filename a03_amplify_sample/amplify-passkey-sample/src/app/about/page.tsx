// app/about/page.tsx
import Link from 'next/link';
import React from 'react';

const About: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>About Page</h1>
      <p>This is a statically generated about page of our Next.js app hosted on AWS Amplify.</p>
      <Link href="/">Go back to Home</Link>
    </div>
  );
};

const styles: { container: React.CSSProperties } = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
};

export default About;
