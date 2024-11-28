import React, { useState } from 'react';
import './App.css';
import { ethers } from 'ethers';

function App() {
  const [tokenId, setTokenId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Use the contract address and ABI
  const contractAddress = '0xa128ECdb362786512aF9E8b16fC3bb5F96fF78e8';
  const contractABI = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "hasTwinMap",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // Initialize the provider and contract
  const provider = new ethers.JsonRpcProvider('https://eth-mainnet.alchemyapi.io/v2/O-OqvTh3I6T03IO6PM_KaqGLAK_lKsKF');
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  const checkEdition = async () => {
    const parsedTokenId = parseInt(tokenId, 10);

    if (isNaN(parsedTokenId) || tokenId.trim() === '') {
      setMessage('Please enter a valid NFT edition number');
      return;
    }

    setLoading(true);

    try {
      // Call the 'hasTwinMap' function with the token ID
      const result = await contract.hasTwinMap(parsedTokenId);

      // Check if the token has a twin map
      if (result) {
        setMessage('This token has a twin map.');
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
        <button onClick={checkEdition}>Check Twin Map</button>
        {loading && <p>Loading...</p>}
        {message && <p>{message}</p>}
      </header>
    </div>
  );
}

export default App;
