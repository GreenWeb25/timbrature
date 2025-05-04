import { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import './ReportTimbrature.css';
import * as XLSX from 'xlsx'; // Importa la libreria xlsx

const ReportTimbrature = () => {
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = auth.currentUser;

  const isAdmin = user && user.email === 'greenhomesolutionsrl@gmail.com'; // <<-- Assicurati che l'email sia corretta

  useEffect(() => {
    const fetchTimbrature = async () => {
      setLoading(true);
      setError(null);

      try {
        const snapshot = await getDocs(collection(db, 'timbrature'));
        const allTimbrature = snapshot.docs.map(doc => doc.data());

        const filtered = isAdmin
          ? allTimbrature
          : allTimbrature.filter(t => t.uid === user?.uid);

        const grouped = {};

        filtered.forEach(t => {
          const date = new Date(t.data);
          const giorno = date.toLocaleDateString('it-IT');
          const mese = date.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
          const uid = t.uid;
          const keyUtente = isAdmin ? `${uid}-${t.cognome}` : 'me';

          if (!grouped[keyUtente]) grouped[keyUtente] = {};
          if (!grouped[keyUtente][mese]) grouped[keyUtente][mese] = {};
          if (!grouped[keyUtente][mese][giorno]) grouped[keyUtente][mese][giorno] = [];

          grouped[keyUtente][mese][giorno].push(t);
        });

        setReport(grouped);
      } catch (err) {
        console.error("Errore:", err);
        setError("Errore durante il caricamento delle timbrature.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTimbrature();
    }
  }, [user]);

  const calcolaOre = (eventi) => {
    const ingresso = eventi.find(e => e.tipo === 'ingresso');
    const uscita = eventi.find(e => e.tipo === 'uscita');
    if (ingresso && uscita) {
      const inTime = new Date(ingresso.data);
      const outTime = new Date(uscita.data);
      const diff = outTime - inTime;
      const ore = Math.floor(diff / (1000 * 60 * 60));
      const minuti = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${ore}h ${minuti}m`;
    }
    return '—';
  };

  // Funzione per esportare i dati in Excel
  const esportaExcel = () => {
    const data = [];

    Object.keys(report).forEach(utente => {
      Object.keys(report[utente]).forEach(mese => {
        Object.keys(report[utente][mese]).forEach(giorno => {
          const eventi = report[utente][mese][giorno];
          const ingresso = eventi.find(e => e.tipo === 'ingresso');
          const uscita = eventi.find(e => e.tipo === 'uscita');
          const nome = ingresso?.cognome || uscita?.cognome || '—';
          const indirizzo = ingresso?.indirizzo || uscita?.indirizzo || '—';
          const ore = calcolaOre(eventi);

          data.push({
            Data: giorno,
            'Nome e Cognome': nome,
            Indirizzo: indirizzo,
            'Ora Ingresso': ingresso ? new Date(ingresso.data).toLocaleTimeString('it-IT') : '—',
            'Ora Uscita': uscita ? new Date(uscita.data).toLocaleTimeString('it-IT') : '—',
            'Ore Lavorate': ore,
          });
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report Timbrature');
    XLSX.writeFile(wb, 'report_timbrature.xlsx');
  };

  return (
    <div className="report-container">
      <h2>Report Timbrature</h2>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Caricamento...</p>
      ) : (
        <>
          <button onClick={esportaExcel} className="export-btn">Esporta in Excel</button>
          {Object.keys(report).map(utente => (
            <div key={utente} className="utente-section">
              {isAdmin && (
                <h3>Dipendente: {utente.split('-')[1] || 'Sconosciuto'}</h3>
              )}
              {Object.keys(report[utente]).map(mese => (
                <div key={mese} className="mese-block">
                  <h4>{mese.toUpperCase()}</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Nome e Cognome</th>
                        <th>Indirizzo</th>
                        <th>Ora Ingresso</th>
                        <th>Ora Uscita</th>
                        <th>Ore Lavorate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(report[utente][mese]).map(giorno => {
                        const eventi = report[utente][mese][giorno];
                        const ingresso = eventi.find(e => e.tipo === 'ingresso');
                        const uscita = eventi.find(e => e.tipo === 'uscita');
                        const nome = ingresso?.cognome || uscita?.cognome || '—';
                        const indirizzo = ingresso?.indirizzo || uscita?.indirizzo || '—';
                        const ore = calcolaOre(eventi);

                        return (
                          <tr key={giorno}>
                            <td>{giorno}</td>
                            <td>{nome}</td>
                            <td>{indirizzo}</td>
                            <td>{ingresso ? new Date(ingresso.data).toLocaleTimeString('it-IT') : '—'}</td>
                            <td>{uscita ? new Date(uscita.data).toLocaleTimeString('it-IT') : '—'}</td>
                            <td>{ore}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ReportTimbrature;
