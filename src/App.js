import React, { useState } from 'react';
import { ethers } from 'ethers'; // Import ethers.js
import './App.css';

const contractAddress = "0xa128ECdb362786512aF9E8b16fC3bb5F96fF78e8"; // Your contract address
const alchemyApiKey = "O-OqvTh3I6T03IO6PM_KaqGLAK_lKsKF"; // Your Alchemy API key

// The ABI you provided
const contractABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "hasTwinMap",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

function App() {
  const [tokenId, setTokenId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const checkTwinMap = async () => {
    // Validate the token ID input
    const parsedTokenId = parseInt(tokenId, 10);

    if (isNaN(parsedTokenId) || tokenId.trim() === '') {
      setMessage('Please enter a valid NFT edition number');
      return;
    }

    setLoading(true);

    try {
      // Connect to Alchemy's provider
      const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`);
      
      // Create contract instance
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      // Call the `hasTwinMap` function with the tokenId
      const result = await contract.hasTwinMap(parsedTokenId);

      // Set message based on the result
      if (result) {
        setMessage('This token has a twin map!');
      } else {
        setMessage('This token does not have a twin map.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error fetching data, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>NFT Edition Twin Map Checker</h1>
        <input
          type="number"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          placeholder="Enter NFT edition number"
        />
        <button onClick={checkTwinMap} disabled={loading}>
          {loading ? 'Loading...' : 'Check Twin Map'}
        </button>
        {message && <p>{message}</p>}
      </header>
    </div>
  );
}

export default App;
