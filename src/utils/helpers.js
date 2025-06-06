export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const formatAmount = (amount, decimals = 4) => {
  return parseFloat(amount).toFixed(decimals);
};

export const getBscScanUrl = (hash, type = 'tx') => {
  return `https://testnet.bscscan.com/${type}/${hash}`;
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

export const getCurrentNetwork = async (web3) => {
  try {
    const networkId = await web3.eth.net.getId();
    switch(networkId) {
      case 56: return 'BSC Mainnet';
      case 97: return 'BSC Testnet';
      default: return `Unknown Network (${networkId})`;
    }
  } catch (error) {
    return 'Not Connected';
  }
};
