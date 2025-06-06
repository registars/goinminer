import { ethers } from 'ethers';

export const generateWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase
  };
};

export const importWallet = (privateKeyOrMnemonic) => {
  try {
    // Check if it's a mnemonic (multiple words)
    if (privateKeyOrMnemonic.split(' ').length > 1) {
      const wallet = ethers.Wallet.fromMnemonic(privateKeyOrMnemonic);
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: privateKeyOrMnemonic
      };
    } else {
      // Assume it's a private key
      const wallet = new ethers.Wallet(privateKeyOrMnemonic);
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: null
      };
    }
  } catch (error) {
    console.error("Error importing wallet:", error);
    return null;
  }
};

export const connectMetamask = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      return { address, provider, signer };
    } catch (error) {
      console.error("User denied account access");
      return null;
    }
  } else {
    console.error("Metamask not detected");
    return null;
  }
};
