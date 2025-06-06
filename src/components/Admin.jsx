import React, { useState } from 'react';
import { getGOINContract, getWeb3 } from '../utils/web3';

const Admin = ({ account }) => {
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalMined: 0,
    contractBalance: 0
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    miningRate: '',
    referralBonus: ''
  });

  const loadAdminStats = async () => {
    if (!account) return;
    
    setLoading(true);
    const contract = getGOINContract();
    const web3 = getWeb3();
    
    try {
      const totalUsers = await contract.methods.totalUsers().call();
      const totalMined = await contract.methods.totalMined().call();
      const balance = await web3.eth.getBalance(contract.options.address);
      
      setAdminStats({
        totalUsers,
        totalMined: web3.utils.fromWei(totalMined, 'ether'),
        contractBalance: web3.utils.fromWei(balance, 'ether')
      });
    } catch (error) {
      console.error("Error loading admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    if (!account) return;
    
    setLoading(true);
    const contract = getGOINContract();
    const web3 = getWeb3();
    
    try {
      if (formData.miningRate) {
        await contract.methods.setMiningRate(
          web3.utils.toWei(formData.miningRate, 'ether')
        ).send({ from: account });
      }
      
      if (formData.referralBonus) {
        await contract.methods.setReferralBonus(
          parseInt(formData.referralBonus)
        ).send({ from: account });
      }
      
      alert('Settings updated successfully!');
      setFormData({ miningRate: '', referralBonus: '' });
      loadAdminStats();
    } catch (error) {
      console.error("Error updating settings:", error);
      alert('Failed to update settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      
      <div className="admin-stats">
        <h3>Contract Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Users</h4>
            <p>{adminStats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h4>Total Mined</h4>
            <p>{adminStats.totalMined} GOIN</p>
          </div>
          <div className="stat-card">
            <h4>Contract Balance</h4>
            <p>{adminStats.contractBalance} BNB</p>
          </div>
        </div>
      </div>
      
      <div className="admin-settings">
        <h3>Update Contract Settings</h3>
        <form onSubmit={handleUpdateSettings}>
          <div className="form-group">
            <label>New Mining Rate (GOIN/block)</label>
            <input 
              type="number" 
              step="0.000001"
              value={formData.miningRate}
              onChange={(e) => setFormData({...formData, miningRate: e.target.value})}
              placeholder="Current mining rate"
            />
          </div>
          
          <div className="form-group">
            <label>New Referral Bonus (%)</label>
            <input 
              type="number" 
              min="0" 
              max="100"
              value={formData.referralBonus}
              onChange={(e) => setFormData({...formData, referralBonus: e.target.value})}
              placeholder="Current referral bonus"
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Settings'}
          </button>
        </form>
      </div>
      
      <div className="admin-actions">
        <h3>Admin Actions</h3>
        <div className="action-buttons">
          <button className="warning">Pause Contract</button>
          <button className="danger">Emergency Withdraw</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
