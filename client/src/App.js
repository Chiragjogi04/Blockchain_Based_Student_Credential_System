import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './logo.png';
import { Modal } from './Modal';
import StudentCredentials from './StudentCredentials.json';
import StudentDashboard from './StudentDashboard';

const CONTRACT_ADDRESS = "0x75145af56283c6dC1b63EA40C03351E49d03fa5D";

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeOperation, setActiveOperation] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const [issueForm, setIssueForm] = useState({
    studentName: "",
    degree: "",
    institution: "",
    issuedTo: ""
  });
  const [updateForm, setUpdateForm] = useState({
    credentialId: "",
    studentName: "",
    degree: "",
    institution: "",
    issuedTo: ""
  });
  const [deleteId, setDeleteId] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [credentialData, setCredentialData] = useState(null);

  useEffect(() => {
    document.body.className = theme === 'light' ? '' : 'dark-theme';
  }, [theme]);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask is required");
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const acct = await signer.getAddress();
    setAccount(acct);
    setContract(new ethers.Contract(CONTRACT_ADDRESS, StudentCredentials.abi, signer));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleIssueChange = e =>
    setIssueForm({ ...issueForm, [e.target.name]: e.target.value });
  const handleUpdateChange = e =>
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });

  const issueCredential = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const { studentName, degree, institution, issuedTo } = issueForm;
      const tx = await contract.issueCredential(studentName, degree, institution, issuedTo);
      const receipt = await tx.wait();
      let evt = null;
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);
          if (parsed.name === 'CredentialIssued') {
            evt = parsed;
            break;
          }
        } catch {}
      }
      const id = evt ? Number(evt.args[0]) : null;
      setNotification(
        id
          ? `Credential issued successfully! ID: ${id}`
          : 'Credential issued (no event data).'
      );
      setIssueForm({ studentName: "", degree: "", institution: "", issuedTo: "" });
    } catch (err) {
      console.error(err);
      setNotification("There was an error issuing the credential.");
    } finally {
      setLoading(false);
    }
  };

  const updateCredential = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const { credentialId, studentName, degree, institution, issuedTo } = updateForm;
      const tx = await contract.updateCredential(
        parseInt(credentialId),
        studentName,
        degree,
        institution,
        issuedTo,
        { gasLimit: 1000000 }
      );
      await tx.wait();
      setNotification(`Credential ${credentialId} updated successfully!`);
      setUpdateForm({ credentialId: "", studentName: "", degree: "", institution: "", issuedTo: "" });
      setActiveOperation(null);
    } catch (err) {
      console.error(err);
      setNotification(`Error updating credential: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteCredential = async () => {
    if (!contract || !deleteId) return;
    setLoading(true);
    try {
      const tx = await contract.deleteCredential(parseInt(deleteId), { gasLimit: 1000000 });
      await tx.wait();
      setNotification(`Credential ${deleteId} deleted successfully!`);
      setDeleteId("");
      setActiveOperation(null);
    } catch (err) {
      console.error(err);
      setNotification(`Error deleting credential: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyCredential = async () => {
    if (!contract || !verificationId) return;
    try {
      const res = await contract.verifyCredential(verificationId);
      setCredentialData({
        studentName: res[0],
        degree: res[1],
        institution: res[2],
        dateIssued: new Date(Number(res[3]) * 1000).toLocaleString(),
        issuedTo: res[4],
        valid: res[5]
      });
    } catch (err) {
      console.error(err);
      setNotification("There was an error verifying the credential.");
    }
  };

  const renderModalContent = () => {
    switch (activeOperation) {
      case "update":
        return (
          <div>
            <h2>Update Credential</h2>
            <div className="form-group">
              <label>Credential ID</label>
              <input
                type="number"
                name="credentialId"
                value={updateForm.credentialId}
                onChange={handleUpdateChange}
                placeholder="Credential ID"
              />
            </div>
            <div className="form-group">
              <label>Student Name</label>
              <input
                name="studentName"
                value={updateForm.studentName}
                onChange={handleUpdateChange}
                placeholder="Student Name"
              />
            </div>
            <div className="form-group">
              <label>Degree</label>
              <input
                name="degree"
                value={updateForm.degree}
                onChange={handleUpdateChange}
                placeholder="Degree"
              />
            </div>
            <div className="form-group">
              <label>Institution</label>
              <input
                name="institution"
                value={updateForm.institution}
                onChange={handleUpdateChange}
                placeholder="Institution"
              />
            </div>
            <div className="form-group">
              <label>Student Wallet Address</label>
              <input
                name="issuedTo"
                value={updateForm.issuedTo}
                onChange={handleUpdateChange}
                placeholder="Wallet Address"
              />
            </div>
            <button className="btn primary" onClick={updateCredential}>
              Submit Update
            </button>
          </div>
        );
      case "delete":
        return (
          <div>
            <h2>Delete Credential</h2>
            <div className="form-group">
              <label>Credential ID</label>
              <input
                type="number"
                value={deleteId}
                onChange={e => setDeleteId(e.target.value)}
                placeholder="Enter Credential ID"
              />
            </div>
            <button className="btn secondary" onClick={deleteCredential}>
              Confirm Delete
            </button>
          </div>
        );
      case "verify":
        return (
          <div>
            <h2>Verify Credential</h2>
            <div className="form-group">
              <label>Credential ID</label>
              <input
                type="number"
                value={verificationId}
                onChange={e => setVerificationId(e.target.value)}
                placeholder="Enter Credential ID"
              />
            </div>
            <button className="btn secondary" onClick={verifyCredential}>
              Verify
            </button>
            {credentialData && (
              <div className="credential-details">
                <h4>Credential Details:</h4>
                <p><strong>Student Name:</strong> {credentialData.studentName}</p>
                <p><strong>Degree:</strong> {credentialData.degree}</p>
                <p><strong>Institution:</strong> {credentialData.institution}</p>
                <p><strong>Date Issued:</strong> {credentialData.dateIssued}</p>
                <p><strong>Issued To:</strong> {credentialData.issuedTo}</p>
                <p><strong>Valid Credential?</strong> {credentialData.valid ? "Yes" : "No"}</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <img src={logo} alt="App Logo" className="logo" />
        <h1>Student Credentials Dapp</h1>
        <button className="btn theme-toggle" onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
        {!account ? (
          <button className="btn primary" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <p className="account-info">Connected as: <span>{account}</span></p>
        )}
      </header>

      {/* MAIN PAGE */}
      {account && !showDashboard && (
        <>
          <div className="container">
            {/* Issue Credential Card */}
            <div className="card">
              <h3>Issue Credential</h3>
              <div className="form-group">
                <label>Student Name</label>
                <input
                  name="studentName"
                  value={issueForm.studentName}
                  onChange={handleIssueChange}
                  placeholder="Student Name"
                />
              </div>
              <div className="form-group">
                <label>Degree</label>
                <input
                  name="degree"
                  value={issueForm.degree}
                  onChange={handleIssueChange}
                  placeholder="Degree"
                />
              </div>
              <div className="form-group">
                <label>Institution</label>
                <input
                  name="institution"
                  value={issueForm.institution}
                  onChange={handleIssueChange}
                  placeholder="Institution"
                />
              </div>
              <div className="form-group">
                <label>Student Wallet Address</label>
                <input
                  name="issuedTo"
                  value={issueForm.issuedTo}
                  onChange={handleIssueChange}
                  placeholder="Wallet Address"
                />
              </div>
              <button className="btn primary" onClick={issueCredential}>
                Issue Credential
              </button>
              {loading && <div className="spinner"></div>}
            </div>

            {/* Manage Credentials Card */}
            <div className="manage-card">
              <h3>Manage Credentials</h3>
              <div className="manage-btns">
                <button
                  className="btn primary"
                  onClick={() => {
                    setActiveOperation("update");
                    setCredentialData(null);
                  }}
                >
                  Update Credential
                </button>
                <button
                  className="btn secondary"
                  onClick={() => {
                    setActiveOperation("delete");
                    setCredentialData(null);
                  }}
                >
                  Delete Credential
                </button>
                <button
                  className="btn secondary"
                  onClick={() => {
                    setActiveOperation("verify");
                    setCredentialData(null);
                  }}
                >
                  Verify Credential
                </button>
              </div>
            </div>
          </div>

          <div className="dashboard-launch">
            <button className="btn primary" onClick={() => setShowDashboard(true)}>
              View Dashboard
            </button>
          </div>
        </>
      )}

      {/* DASHBOARD PAGE */}
      {account && showDashboard && (
        <div className="dashboard-view">
          <button className="btn secondary back-btn" onClick={() => setShowDashboard(false)}>
            ← Back
          </button>
          <StudentDashboard contract={contract} />
        </div>
      )}

      {/* MODALS */}
      {activeOperation && (
        <Modal isOpen title="Action" onClose={() => setActiveOperation(null)}>
          {renderModalContent()}
        </Modal>
      )}
      {notification && (
        <Modal isOpen title="Notification" onClose={() => setNotification(null)}>
          <p>{notification}</p>
        </Modal>
      )}
    </div>
  );
}

export default App;
