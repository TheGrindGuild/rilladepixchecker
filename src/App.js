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
  
    // Validate the tokenId to make sure it's a number
    if (isNaN(parsedTokenId) || parsedTokenId <= 0) {
      setMessage('Please enter a valid NFT edition number');
      return;
    }
  
    setLoading(true);
  
    try {
      console.log('Calling hasTwinMap with tokenId:', parsedTokenId);
  
      // Call the 'hasTwinMap' function with the token ID
      const result = await contract.hasTwinMap(parsedTokenId);
  
      console.log('Contract call result:', result);
  
      // Handle the response properly, even if it's 0x (false)
      if (result === false) {
        setMessage('This token does not have a twin map.');
      } else if (result === true) {
        setMessage('This token has a twin map.');
      } else {
        setMessage('Unexpected result from contract call.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage(`Error: ${error.message}`);
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
