import React, { useEffect, useState } from 'react';

export default function StudentDashboard({ contract }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contract) return;
    console.log('Contract methods:', Object.keys(contract));

    (async () => {
      try {
        let countBN;
        if (typeof contract.getCredentialCount === 'function') {
          countBN = await contract.getCredentialCount();
        } else if (typeof contract.credentialCount === 'function') {
          countBN = await contract.credentialCount();
        } else {
          throw new Error('No credential count method on contract');
        }

        // Convert to JS number
        const count = typeof countBN.toNumber === 'function' ? countBN.toNumber() : Number(countBN);
        console.log('Credential count:', count);

        const all = [];
        // Determine which fetch method to use
        const fetchCredential = typeof contract.getCredential === 'function'
          ? contract.getCredential.bind(contract)
          : typeof contract.credentials === 'function'
            ? contract.credentials.bind(contract)
            : null;
        if (!fetchCredential) {
          throw new Error('No credential fetch method on contract');
        }

        for (let i = 0; i < count+1; i++) {
          try {
            const res = await fetchCredential(i);
            all.push({
              id: i,
              name: res[0],
              degree: res[1],
              institution: res[2],
              wallet: res[4],
              valid: res[5]
            });
          } catch (innerErr) {
            console.warn(`Failed to fetch credential ${i}:`, innerErr);
          }
        }

        const validCredentials = all.filter(c => c.valid);
        console.log('Valid credentials:', validCredentials);
        setStudents(validCredentials);
      } catch (e) {
        console.error('Fetch error', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [contract]);

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="dashboard-card card">
      <div className="dashboard-header">
        <h2>Student Dashboard</h2>
      </div>
      <div className="table-container">
        {students.length > 0 ? (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Degree</th>
                <th>Institution</th>
                <th>Wallet</th>
                <th>Valid</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.degree}</td>
                  <td>{s.institution}</td>
                  <td>{s.wallet}</td>
                  <td>{s.valid ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">No valid credentials found.</div>
        )}
      </div>
    </div>
  );
}
