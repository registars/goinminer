import React, { useEffect, useState } from 'react';
import { getGOINContract, getWeb3 } from '../utils/web3';

const Dashboard = ({ account, contractData }) => {
  const [userStats, setUserStats] = useState({
    miningPower: 0,
    referralCount: 0,
    totalMined: 0
  });

  useEffect(() => {
    const loadUserStats = async () => {
      if (!account) return;
      
      const contract = getGOINContract();
      try {
        const miningPower = await contract.methods.getMiningPower(account).call();
        const referralCount = await contract.methods.getReferralCount(account).call();
        const totalMined = await contract.methods.getMinedAmount(account).call();
        const web3 = getWeb3();
        
        setUserStats({
          miningPower,
          referralCount,
          totalMined: web3.utils.fromWei(totalMined, 'ether')
        });
      } catch (error) {
        console.error("Error loading user stats:", error);
      }
    };
    
    loadUserStats();
  }, [account]);

  return (
    <div className="dashboard-container">
      <h2>Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>GOIN Balance</h3>
          <p>{contractData.totalSupply} GOIN</p>
        </div>
        
        <div className="stat-card">
          <h3>Mining Power</h3>
          <p>{userStats.miningPower}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Mined</h3>
          <p>{userStats.totalMined} GOIN</p>
        </div>
        
        <div className="stat-card">
          <h3>Referrals</h3>
          <p>{userStats.referralCount}</p>
        </div>
      </div>
      
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button>Start Mining</button>
          <button>Claim Rewards</button>
          <button>Invite Friends</button>
        </div>
      </div>
      
      <div className="network-info">
        <h3>Network Information</h3>
        <p>Mining Rate: {contractData.miningRate} GOIN/block</p>
        <p>Referral Bonus: {contractData.referralBonus}%</p>
        <p>Connected to: BSC Testnet</p>
      </div>
    </div>
  );
};

export default Dashboard;
