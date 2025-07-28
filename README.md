# 🎓 Blockchain-Based Student Credential System

A decentralized web application (DApp) that enables secure, tamper-proof issuing, updating, verifying, and deleting of student credentials using Ethereum blockchain and smart contracts.

## 🔒 Problem Statement

Traditional credential systems (marksheets, certificates) are:
- Easy to forge
- Hard to verify
- Prone to loss/damage (especially on paper)

Our goal is to ensure student credentials are:
- Tamper-proof
- Verifiable by any institution/employer
- Easily shareable

---

## 🛠️ Tech Stack

| Component          | Technology Used                               |
| ------------------ | --------------------------------------------- |
| Smart Contracts    | Solidity                                      |
| Blockchain Network | Ethereum                                      |
| DApp Framework     | Truffle                                       |
| Frontend           | React.js                                      |
| Wallet Integration | MetaMask                                      |
| Web3 Interaction   | Ethers.js                                     |
| Local Blockchain   | Ganache                                       |

---

## ⚙️ Features

- 🆕 **ADD**: Add a new student credential to the blockchain.
- ✏️ **Update**: Modify existing credentials.
- ✅ **Verify**: Authenticate credentials in real time.
- ❌ **Delete**: Remove credentials permanently.
- 🌗 **Dark Mode**: Toggle between light and dark themes.
- 🔄 **Live Feedback**: Real-time transaction updates and user-friendly error handling.

---

## 🚀 Getting Started

### 1️⃣ Prerequisites

- [Node.js & NPM](https://nodejs.org/) (LTS Recommended)
- [Truffle](https://trufflesuite.com/) (Smart Contract Framework)
- [Ganache](https://trufflesuite.com/ganache/) – for local blockchain testing
- MetaMask Extension (for wallet connectivity)

### 2️⃣ Install Global Dependencies

```bash
npm install -g truffle
npm install -g ganache
```

### 3️⃣ Clone the Repository

```bash
git clone https://github.com/Chiragjogi04/Blockchain_Based_Student_Credential_System.git
cd Blockchain_Based_Student_Credential_System
```

### 4️⃣ Smart Contract Deployment

```bash
truffle compile
truffle migrate --network development
Edit truffle-config.js to configure your Ethereum network
```

### 5️⃣ Frontend Setup

```bash
cd client
npm install
Copy the ABI from build/contracts/StudentCredentials.json into client/src/StudentCredentials.json.
Update the contract address in client/src/App.js.
```

### 6️⃣ Run the Frontend

```bash
npm start
```

#### Open http://localhost:3000 in your browser.
