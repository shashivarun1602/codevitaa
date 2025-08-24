import React from 'react';
import '../GlobalStyles.css';

const Leaderboard = ({ leaderboard }) => {
	const data = leaderboard || [
		{ rank: 1, name: "Alice", coins: 120 },
		{ rank: 2, name: "Bob", coins: 110 },
		{ rank: 3, name: "Charlie", coins: 100 },
		{ rank: 4, name: "David", coins: 95 },
		{ rank: 5, name: "Emma", coins: 88 },
		{ rank: 6, name: "Frank", coins: 82 },
		{ rank: 7, name: "Grace", coins: 75 },
		{ rank: 8, name: "Henry", coins: 70 },
	];
	return (
		<div className="page-container">
			<div className="page-header">
				<h1 className="page-title">
					Vitacoin <span className="page-title-highlight">Leaderboard</span>
				</h1>
			</div>
			<table className="data-table">
				<thead>
					<tr>
						<th>Rank</th>
						<th>Player Name</th>
						<th>Coins Earned</th>
					</tr>
				</thead>
				<tbody>
					{data.map((user) => (
						<tr key={user.rank}>
							<td>#{user.rank}</td>
							<td>{user.name}</td>
							<td className="profile-coins">{user.coins} Coins</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Leaderboard;
