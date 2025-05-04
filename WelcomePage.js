import React from 'react';
import './WelcomePage.css';

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Benvenuto su Green Home Solution</h1>
        <p>Gestisci le timbrature dei tuoi dipendenti in modo semplice e veloce.</p>
        <img
          src="https://images.unsplash.com/photo-1604014237744-bd8f1b26c212?auto=format&fit=crop&w=800&q=80"
          alt="Benvenuto"
          className="welcome-image"
        />
      </div>
    </div>
  );
};

export default WelcomePage;
