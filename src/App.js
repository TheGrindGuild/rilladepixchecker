import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

// Replace with your Alchemy API URL
const ALCHEMY_API_URL = 'https://eth-mainnet.alchemyapi.io/v2/O-OqvTh3I6T03IO6PM_KaqGLAK_lKsKF'; // Replace with your Alchemy API Key

// Contract details
const contractAddress = '0xa128ECdb362786512aF9E8b16fC3bb5F96fF78e8'; // Replace with your contract address
const contractABI = [
  // ABI fragment with tokenURI function
  {
    "constant": true,
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

function App() {
  const [tokenId, setTokenId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Create a provider using Alchemy
  const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API_URL); // Set up a provider with your Alchemy URL
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  const checkEdition = async () => {
    if (!tokenId) {
      setMessage('Please enter a valid token ID');
      return;
    }

    setLoading(true);
    try {
      // Fetch the tokenURI for the given tokenId
      const tokenUri = await contract.tokenURI(tokenId);
      
      // Now fetch the metadata (assuming it's a JSON object)
      const metadataResponse = await fetch(tokenUri);
      const metadata = await metadataResponse.json();

      // Assume the metadata contains a field like "usedForEvolution"
      if (metadata.usedForEvolution) {
        setMessage('This Rilla has already been used for evolution');
      } else {
        setMessage('Ready for Depixelation!');
      }
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      setMessage('Failed to fetch token data');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>NFT Edition Cross-Reference</h1>
        <input
          type="number"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          placeholder="Enter NFT edition number"
        />
        <button onClick={checkEdition} disabled={loading}>
          {loading ? 'Loading...' : 'Check Edition'}
        </button>
        {message && <p>{message}</p>}
      </header>
    </div>
  );
}

export default App;
