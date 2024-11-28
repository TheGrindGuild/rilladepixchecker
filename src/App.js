import { useState } from 'react';
import { ethers } from 'ethers';

const contractAddress = "0xa128ECdb362786512aF9E8b16fC3bb5F96fF78e8";
const alchemyKey = "O-OqvTh3I6T03IO6PM_KaqGLAK_lKsKF";

const App = () => {
  const [tokenId, setTokenId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`);
  const contractABI = [
    {
      "inputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "name": "hasTwinMap",
      "outputs": [
        { "internalType": "bool", "name": "", "type": "bool" }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  const checkTwinMap = async () => {
    setLoading(true);
    setMessage('');

    try {
      const parsedTokenId = parseInt(tokenId, 10);

      // Validate tokenId
      if (isNaN(parsedTokenId) || parsedTokenId <= 0) {
        setMessage('Please enter a valid NFT edition number');
        return;
      }

      // Call hasTwinMap function
      const twinMapStatus = await contract.hasTwinMap(parsedTokenId);

      if (twinMapStatus === true) {
        setMessage('This token has a twin map.');
      } else if (twinMapStatus === false) {
        setMessage('This token does not have a twin map.');
      } else {
        setMessage('Unexpected response from the contract.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error fetching data, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Check your Rillaz</h1>
      <input
        type="number"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        placeholder="Enter NFT edition number"
      />
      <button onClick={checkTwinMap}>Check Status</button>
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default App;
