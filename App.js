import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { db, auth } from './firebase';
import { setDoc, doc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import ReportTimbrature from './ReportTimbrature';
import './App.css';
import clockImage from './clock.jpg';
import { FaSignInAlt, FaSignOutAlt, FaClock, FaFileAlt, FaDoorOpen, FaDoorClosed } from 'react-icons/fa';

const WelcomePage = () => {
  return (
    <div className="welcome-container" style={{ textAlign: 'center' }}>
      <div className="image-container" style={{ position: 'relative' }}>
        <img src={clockImage} alt="Clock" style={{ width: '20%', maxHeight: '400px', marginTop: '150px' , objectFit: '' }} />
        <div style={{
          position: 'absolute',

          top: '0%',
          left: '46%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontSize: '3rem',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px black'
        }}>

          <FaClock style={{ marginRight: '10px' }} />
          Benvenuto nella Timbratura
        </div>
      </div>
      <div style={{ marginTop: '30px' }}>
        <Link to="/timbratura" className="link-button">Vai alla Timbratura</Link>
      </div>
    </div>
  );
};

const TimbraturaMain = () => {
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  const login = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User logged in: ', result.user.displayName);
    } catch (error) {
      console.error('Login error: ', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error: ', error);
    } finally {
      setLoading(false);
    }
  };

  const timbra = async (tipo) => {
    const user = auth.currentUser;
    if (!user) return;

    const time = new Date();
    const cognome = user.displayName ? user.displayName.split(' ').slice(-2).join(' ') : 'Sconosciuto';

    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const apiKey = 'AIzaSyBs5U2dtfqHAZZdE5Gi39BaYG_z6ENm8kg'; // La tua API Key
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
        );
        const data = await response.json();

        let indirizzo = 'Indirizzo non disponibile';
        if (data.results && data.results.length > 0) {
          indirizzo = data.results[0].formatted_address;
        }

        const timbraturaRef = doc(db, 'timbrature', `${user.uid}-${time.getTime()}`);
        await setDoc(timbraturaRef, {
          tipo: tipo,
          data: time.toISOString(),
          cognome: cognome,
          email: user.email,
          uid: user.uid,
          indirizzo: indirizzo
        });

        alert(`Timbratura ${tipo} registrata alle ${time.toLocaleTimeString()}\nIndirizzo: ${indirizzo}`);
      });
    } catch (error) {
      console.error("Errore timbratura:", error.message);
      alert("Errore durante la timbratura.");
    }
  };

  return (
    <div className="app-container">
      {!user ? (
        <div className="auth-container">
          <button className="auth-button" onClick={login} disabled={loading}>
            {loading ? 'Caricamento...' : <><FaSignInAlt /> Accedi con Google</>}
          </button>
        </div>
      ) : (
        <div className="user-container">
          <h2><FaClock /> Ciao, {user.displayName}</h2>
          <div className="button-container">
            <button className="action-button" onClick={() => timbra('ingresso')} disabled={loading}>
              <FaDoorOpen style={{ marginRight: '8px' }} />
              Timbratura Ingresso
            </button>
            <button className="action-button" onClick={() => timbra('uscita')} disabled={loading}>
              <FaDoorClosed style={{ marginRight: '8px' }} />
              Timbratura Uscita
            </button>
          </div>
          <button className="logout-button" onClick={logout} disabled={loading}>
            <FaSignOutAlt style={{ marginRight: '8px' }} />
            Esci
          </button>
          <br />
          <Link to="/report" className="link-button">
            <FaFileAlt style={{ marginRight: '8px' }} />
            Visualizza Report Timbrature
          </Link>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/timbratura" element={<TimbraturaMain />} />
        <Route path="/report" element={<ReportTimbrature />} />
      </Routes>
    </Router>
  );
};

export default App;
