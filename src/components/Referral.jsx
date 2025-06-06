import React, { useState, useEffect } from 'react';
import { getGOINContract, getWeb3 } from '../utils/web3';

const Referral = ({ account }) => {
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [referralBonus, setReferralBonus] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inputCode, setInputCode] = useState('');

  useEffect(() => {
    const loadReferralData = async () => {
      if (!account) return;
      
      const contract = getGOINContract();
      
      try {
        const code = await contract.methods.getReferralCode(account).call();
        setReferralCode(code);
        
        const count = await contract.methods.getReferralCount(account).call();
        setReferralCount(count);
        
        const bonus = await contract.methods.getReferralBonus(account).call();
        const web3 = getWeb3();
        setReferralBonus(web3.utils.fromWei(bonus, 'ether'));
      } catch (error) {
        console.error("Error loading referral data:", error);
      }
    };
    
    loadReferralData();
  }, [account]);

  const generateReferralCode = async () => {
    if (!account) return;
    
    setLoading(true);
    const contract = getGOINContract();
    
    try {
      await contract.methods.generateReferralCode().send({ from: account });
      const code = await contract.methods.getReferralCode(account).call();
      setReferralCode(code);
    } catch (error) {
      console.error("Error generating referral code:", error);
    } finally {
      setLoading(false);
    }
  };

  const useReferralCode = async () => {
    if (!account || !inputCode.trim()) return;
    
    setLoading(true);
    const contract = getGOINContract();
    
    try {
      await contract.methods.useReferralCode(inputCode).send({ from: account });
      alert('Referral code applied successfully!');
      setInputCode('');
    } catch (error) {
      console.error("Error using referral code:", error);
      alert('Failed to apply referral code: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const claimReferralBonus = async () => {
    if (!account) return;
    
    setLoading(true);
    const contract = getGOINContract();
    
    try {
      await contract.methods.claimReferralBonus().send({ from: account });
      const bonus = await contract.methods.getReferralBonus(account).call();
      const web3 = getWeb3();
      setReferralBonus(web3.utils.fromWei(bonus, 'ether'));
      alert('Referral bonus claimed successfully!');
    } catch (error) {
      console.error("Error claiming referral bonus:", error);
      alert('Failed to claim referral bonus: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="referral-container">
      <h2>Referral Program</h2>
      
      <div className="referral-stats">
        <p>Your Referral Code: {referralCode || 'Not generated'}</p>
        <p>Total Referrals: {referralCount}</p>
        <p>Referral Bonus: {referralBonus} GOIN</p>
      </div>
      
      <div className="referral-actions">
        {!referralCode ? (
          <button onClick={generateReferralCode} disabled={loading}>
            {loading ? 'Processing...' : 'Generate Referral Code'}
          </button>
        ) : (
          <div className="referral-link">
            <p>Your referral link:</p>
            <input 
              type="text" 
              value={`${window.location.origin}?ref=${referralCode}`} 
              readOnly 
            />
            <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}?ref=${referralCode}`)}>
              Copy Link
            </button>
          </div>
        )}
        
        <div className="use-referral">
          <input 
            type="text" 
            placeholder="Enter referral code" 
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
          <button onClick={useReferralCode} disabled={loading || !inputCode.trim()}>
            {loading ? 'Processing...' : 'Use Referral Code'}
          </button>
        </div>
        
        <button 
          onClick={claimReferralBonus} 
          disabled={loading || parseFloat(referralBonus) <= 0}
        >
          {loading ? 'Processing...' : 'Claim Referral Bonus'}
        </button>
      </div>
    </div>
  );
};

export default Referral;
