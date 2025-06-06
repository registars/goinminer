import React, { useState, useEffect } from 'react';
import { getGOINContract, getWeb3 } from '../utils/web3';

const Mining = ({ account }) => {
  const [miningStatus, setMiningStatus] = useState(false);
  const [minedAmount, setMinedAmount] = useState(0);
  const [withdrawable, setWithdrawable] = useState(0);
  const [lastClaim, setLastClaim] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMiningData = async () => {
      if (!account) return;
      
      const contract = getGOINContract();
      
      try {
        const mined = await contract.methods.getMinedAmount(account).call();
        const web3 = getWeb3();
        setMinedAmount(web3.utils.fromWei(mined, 'ether'));
        
        const canWithdraw = await contract.methods.getWithdrawableAmount(account).call();
        setWithdrawable(web3.utils.fromWei(canWithdraw, 'ether'));
        
        const lastClaimTime = await contract.methods.getLastClaimTime(account).call();
        setLastClaim(new Date(lastClaimTime * 1000).toLocaleString());
        
        const isMining = await contract.methods.isMining(account).call();
        setMiningStatus(isMining);
      } catch (error) {
        console.error("Error loading mining data:", error);
      }
    };
    
    loadMiningData();
  }, [account]);

  const startMining = async () => {
    if (!account) return;
    
    setLoading(true);
    const contract = getGOINContract();
    const web3 = getWeb3();
    
    try {
      await contract.methods.startMining().send({ from: account });
      setMiningStatus(true);
    } catch (error) {
      console.error("Error starting mining:", error);
    } finally {
      setLoading(false);
    }
  };

  const stopMining = async () => {
    if (!account) return;
    
    setLoading(true);
    const contract = getGOINContract();
    
    try {
      await contract.methods.stopMining().send({ from: account });
      setMiningStatus(false);
    } catch (error) {
      console.error("Error stopping mining:", error);
    } finally {
      setLoading(false);
    }
  };

  const claimMined = async () => {
    if (!account) return;
    
    setLoading(true);
    const contract = getGOINContract();
    
    try {
      await contract.methods.claimMined().send({ from: account });
      // Refresh data
      const mined = await contract.methods.getMinedAmount(account).call();
      const web3 = getWeb3();
      setMinedAmount(web3.utils.fromWei(mined, 'ether'));
      setWithdrawable('0');
    } catch (error) {
      console.error("Error claiming mined tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mining-container">
      <h2>GOIN Mining</h2>
      
      <div className="mining-stats">
        <p>Mining Status: {miningStatus ? 'Active' : 'Inactive'}</p>
        <p>Total Mined: {minedAmount} GOIN</p>
        <p>Withdrawable: {withdrawable} GOIN</p>
        <p>Last Claim: {lastClaim || 'Never'}</p>
      </div>
      
      <div className="mining-actions">
        {!miningStatus ? (
          <button onClick={startMining} disabled={loading}>
            {loading ? 'Processing...' : 'Start Mining'}
          </button>
        ) : (
          <button onClick={stopMining} disabled={loading}>
            {loading ? 'Processing...' : 'Stop Mining'}
          </button>
        )}
        
        <button 
          onClick={claimMined} 
          disabled={loading || parseFloat(withdrawable) <= 0}
        >
          {loading ? 'Processing...' : 'Claim Mined GOIN'}
        </button>
      </div>
    </div>
  );
};

export default Mining;
