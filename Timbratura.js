// src/Timbratura.js
import React, { useState } from "react";

function Timbratura({ user }) {
  const [stato, setStato] = useState("");

  const timbra = (tipo) => {
    const ora = new Date().toLocaleString();
    setStato(`Hai timbrato ${tipo} alle ${ora}`);
    // Puoi salvare su Firestore qui se vuoi
  };

  return (
    <div>
      <h2>Benvenuto, {user.displayName}</h2>
      <button onClick={() => timbra("INGRESSO")}>Timbra Ingresso</button>
      <button onClick={() => timbra("USCITA")}>Timbra Uscita</button>
      {stato && <p>{stato}</p>}
    </div>
  );
}

export default Timbratura;
