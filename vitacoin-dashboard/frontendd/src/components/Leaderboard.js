import React from 'react';

const Leaderboard = ({ leaderboard }) => {
	const data = leaderboard || [
		{ rank: 1, name: "Alice", coins: 120 },
		{ rank: 2, name: "Bob", coins: 110 },
		{ rank: 3, name: "Charlie", coins: 100 },
	];
	return (
		<table style={{ width: "100%", borderCollapse: "collapse" }}>
			<thead>
				<tr>
					<th>Rank</th>
					<th>Name</th>
					<th>Coins</th>
				</tr>
			</thead>
			<tbody>
				{data.map((user) => (
					<tr key={user.rank}>
						<td>{user.rank}</td>
						<td>{user.name}</td>
						<td>{user.coins}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default Leaderboard;
