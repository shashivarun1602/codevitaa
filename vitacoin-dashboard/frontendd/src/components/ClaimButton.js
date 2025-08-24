import React from 'react';

const ClaimButton = ({ email, onClaim, coins }) => {
	const handleClick = () => {
		// Simulate claiming coins
		const newCoins = coins + 5;
		onClaim(newCoins);
	};
	return (
		<button onClick={handleClick} style={{ background: '#ffd700', color: '#222', fontWeight: 'bold', borderRadius: '8px', padding: '10px 24px', fontSize: '1.1em' }}>
			Claim Daily Coins
		</button>
	);
};

export default ClaimButton;
