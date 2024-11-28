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
