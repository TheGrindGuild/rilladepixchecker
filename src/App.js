import React, { useState } from 'react';
import './App.css';
import { ethers } from 'ethers';

function App() {
  const [tokenId, setTokenId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to check if the tokenId has been used or is ready for depixelation
  const checkEdition = async () => {
    const parsedTokenId = parseInt(tokenId, 10);

    // Validate the input tokenId to ensure it's a number
    if (isNaN(parsedTokenId) || tokenId.trim() === '') {
      setMessage('Please enter a valid NFT edition number');
      return;
    }

    setLoading(true);
    try {
      // Fetch the metadata for the given tokenId using the tokenURI function
      const tokenMetadata = await getTokenMetadata(parsedTokenId);

      // Check if the token has been used for evolution (based on metadata)
      if (tokenMetadata && tokenMetadata.usedForEvolution) {
        setMessage('This Rilla has already been used for evolution');
      } else {
        setMessage('Ready for Depixelation!');
      }
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      setMessage('Error fetching data, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch the token metadata from the contract using tokenURI
  const getTokenMetadata = async (tokenId) => {
    // Alchemy API URL (replace with your actual Alchemy API URL)
    const alchemyUrl = 'https://eth-mainnet.alchemyapi.io/v2/O-OqvTh3I6T03IO6PM_KaqGLAK_lKsKF';
    const provider = new ethers.JsonRpcProvider(alchemyUrl);

    // Contract address and ABI (replace with your contract's address and ABI)
    const contractAddress = '0xa128ECdb362786512aF9E8b16fC3bb5F96fF78e8';
    const abi = [
      "function tokenURI(uint256 tokenId) public view returns (string memory)"
    ];

    const contract = new ethers.Contract(contractAddress, abi, provider);

    try {
      // Call the tokenURI function to get the metadata URI for the given tokenId
      const metadataURI = await contract.tokenURI(tokenId);

      // Fetch the metadata (assuming it's a JSON file)
      const metadataResponse = await fetch(metadataURI);
      const metadata = await metadataResponse.json();

      return metadata;
    } catch (error) {
      throw new Error('Error fetching token metadata: ' + error.message);
    }
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
