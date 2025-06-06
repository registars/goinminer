import Web3 from 'web3';
import GOIN_ABI from '../contracts/GOIN.json';

const GOIN_CONTRACT_ADDRESS = '0xF202f380d4E244D2B1b0c6F3DE346A1Ce154CC7a';
const BSC_TESTNET_RPC = 'https://data-seed-prebsc-1-s1.binance.org:8545/';

let web3;
let goinContract;

export const initWeb3 = async () => {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Initialize contract
      goinContract = new web3.eth.Contract(GOIN_ABI, GOIN_CONTRACT_ADDRESS);
      
      return web3;
    } catch (error) {
      console.error("User denied account access");
    }
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider(BSC_TESTNET_RPC));
  }
  
  goinContract = new web3.eth.Contract(GOIN_ABI, GOIN_CONTRACT_ADDRESS);
  return web3;
};

export const getGOINContract = () => {
  return goinContract;
};

export const getWeb3 = () => {
  return web3;
};
