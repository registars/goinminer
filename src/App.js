import React, { useState, useEffect } from 'react';
import { initWeb3 } from './utils/web3';
import Dashboard from './components/Dashboard';
import Mining from './components/Mining';
import Referral from './components/Referral';
import Transactions from './components/Transactions';
import Wallet from './components/Wallet';
import Admin from './components/Admin';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const web3 = await initWeb3();
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          checkAdmin(accounts[0]);
        }
        
        window.ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0]);
          checkAdmin(accounts[0]);
        });
      }
    };
    
    initialize();
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const checkAdmin = (address) => {
    setIsAdmin(address.toLowerCase() === process.env.REACT_APP_OWNER_ADDRESS.toLowerCase());
  };

  return (
    <div className="App">
      <header>
        <h1>GOIN Mining Platform</h1>
        <div className="account-info">
          {account ? (
            <span>{`${account.substring(0, 6)}...${account.substring(38)}`}</span>
          ) : (
            <button onClick={initWeb3}>Connect Wallet</button>
          )}
        </div>
      </header>
      
      <nav>
        <button onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button onClick={() => setActiveTab('mining')}>Mining</button>
        <button onClick={() => setActiveTab('referral')}>Referral</button>
        <button onClick={() => setActiveTab('transactions')}>Transactions</button>
        <button onClick={() => setActiveTab('wallet')}>Wallet Tools</button>
        {isAdmin && <button onClick={() => setActiveTab('admin')}>Admin</button>}
      </nav>
      
      <main>
        {activeTab === 'dashboard' && <Dashboard account={account} />}
        {activeTab === 'mining' && <Mining account={account} />}
        {activeTab === 'referral' && <Referral account={account} />}
        {activeTab === 'transactions' && <Transactions account={account} />}
        {activeTab === 'wallet' && <Wallet />}
        {activeTab === 'admin' && isAdmin && <Admin account={account} />}
      </main>
    </div>
  );
}

export default App;
