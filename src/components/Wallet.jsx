import React, { useState } from 'react';

const Wallet = ({ onGenerate, onImport }) => {
  const [importMethod, setImportMethod] = useState('privateKey');
  const [importData, setImportData] = useState('');
  const [showGenerated, setShowGenerated] = useState(false);
  const [generatedWallet, setGeneratedWallet] = useState(null);

  const handleGenerate = () => {
    const wallet = onGenerate();
    setGeneratedWallet(wallet);
    setShowGenerated(true);
  };

  const handleImport = () => {
    if (importData.trim()) {
      onImport(importData);
      setImportData('');
    }
  };

  return (
    <div className="wallet-container">
      <h2>Wallet Tools</h2>
      
      <div className="wallet-section">
        <h3>Generate New Wallet</h3>
        <button onClick={handleGenerate}>Generate Wallet</button>
        
        {showGenerated && generatedWallet && (
          <div className="generated-wallet">
            <p><strong>Address:</strong> {generatedWallet.address}</p>
            <p><strong>Private Key:</strong> {generatedWallet.privateKey}</p>
            <p><strong>Mnemonic:</strong> {generatedWallet.mnemonic}</p>
            <p className="warning">
              WARNING: Save this information securely. It cannot be recovered if lost.
            </p>
          </div>
        )}
      </div>
      
      <div className="wallet-section">
        <h3>Import Existing Wallet</h3>
        <div>
          <label>
            <input 
              type="radio" 
              checked={importMethod === 'privateKey'} 
              onChange={() => setImportMethod('privateKey')} 
            />
            Private Key
          </label>
          <label>
            <input 
              type="radio" 
              checked={importMethod === 'mnemonic'} 
              onChange={() => setImportMethod('mnemonic')} 
            />
            Mnemonic Phrase
          </label>
        </div>
        
        {importMethod === 'privateKey' ? (
          <input 
            type="password" 
            placeholder="Enter Private Key" 
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
          />
        ) : (
          <textarea 
            placeholder="Enter Mnemonic Phrase" 
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
          />
        )}
        
        <button onClick={handleImport}>Import Wallet</button>
      </div>
    </div>
  );
};

export default Wallet;
