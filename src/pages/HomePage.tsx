
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="page home-page">
      <h1>Welcome to Cloutzy</h1>
      <p>Discover and connect with creators and content you love.</p>
      
      <section className="trending-section">
        <h2>Trending Now</h2>
        <div className="content-grid">
          {/* Trending content will go here */}
          <p>Loading trending content...</p>
        </div>
      </section>
      
      <section className="recommended-section">
        <h2>Recommended for You</h2>
        <div className="content-grid">
          {/* Recommended content will go here */}
          <p>Loading recommendations...</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
