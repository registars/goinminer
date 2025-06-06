import React, { useState, useEffect } from 'react';
import { initWeb3, getGOINContract, getWeb3 } from './utils/web3';
import { generateWallet, importWallet } from './utils/wallet';
import Wallet from './components/Wallet';
import Mining from './components/Mining';
import Referral from './components/Referral';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [miningPower, setMiningPower] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [contractData, setContractData] = useState({
    totalSupply: 0,
    miningRate: 0,
    referralBonus: 0
  });

  const OWNER_ADDRESS = '0x4f0412CC1Ea121e553c9cC49B66affA2Ec9F9380';

  useEffect(() => {
    const initialize = async () => {
      const web3 = await initWeb3();
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          checkAdmin(accounts[0]);
          loadData(accounts[0]);
        }
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0]);
          checkAdmin(accounts[0]);
          loadData(accounts[0]);
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
    setIsAdmin(address.toLowerCase() === OWNER_ADDRESS.toLowerCase());
  };

  const loadData = async (account) => {
    const contract = getGOINContract();
    const web3 = getWeb3();
    
    try {
      // Get user balance
      const userBalance = await contract.methods.balanceOf(account).call();
      setBalance(web3.utils.fromWei(userBalance, 'ether'));
      
      // Get mining power
      const power = await contract.methods.getMiningPower(account).call();
      setMiningPower(power);
      
      // Get contract data
      const totalSupply = await contract.methods.totalSupply().call();
      const miningRate = await contract.methods.MINING_RATE().call();
      const referralBonus = await contract.methods.REFERRAL_BONUS().call();
      
      setContractData({
        totalSupply: web3.utils.fromWei(totalSupply, 'ether'),
        miningRate: web3.utils.fromWei(miningRate, 'ether'),
        referralBonus: referralBonus / 100 // Convert to percentage
      });
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleGenerateWallet = () => {
    const wallet = generateWallet();
    console.log("Generated Wallet:", wallet);
    // You might want to display this to the user in a secure way
  };

  const handleImportWallet = (privateKeyOrMnemonic) => {
    const wallet = importWallet(privateKeyOrMnemonic);
    console.log("Imported Wallet:", wallet);
    // You might want to connect this wallet
  };

  return (
    <div className="App">
      <header>
        <h1>GOIN Mining Platform</h1>
        <div className="account-info">
          {account ? (
            <>
              <span>{`${account.substring(0, 6)}...${account.substring(38)}`}</span>
              <span>Balance: {balance} GOIN</span>
              <span>Mining Power: {miningPower}</span>
            </>
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
        {activeTab === 'dashboard' && <Dashboard account={account} contractData={contractData} />}
        {activeTab === 'mining' && <Mining account={account} />}
        {activeTab === 'referral' && <Referral account={account} />}
        {activeTab === 'transactions' && <Transactions account={account} />}
        {activeTab === 'wallet' && (
          <Wallet 
            onGenerate={handleGenerateWallet} 
            onImport={handleImportWallet} 
          />
        )}
        {activeTab === 'admin' && isAdmin && <Admin account={account} />}
      </main>
    </div>
  );
}

export default App;
