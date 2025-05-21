// InsertForm.jsx
import React, { useState } from "react";

const InsertForm = () => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost/api/insert.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nama, email })
    });

    const data = await response.json();
    alert(data.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Nama" value={nama} onChange={(e) => setNama(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Kirim</button>
    </form>
  );
};

export default InsertForm;
