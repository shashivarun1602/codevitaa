import React from 'react';

const Transactions = ({ userId }) => {
	// Sample transaction data
	const transactions = [
		{ id: 1, type: "Earn", amount: 10, date: "2024-06-01" },
		{ id: 2, type: "Claim", amount: 5, date: "2024-06-02" },
		{ id: 3, type: "Penalty", amount: -2, date: "2024-06-03" },
	];
	return (
		<table style={{ width: "100%", borderCollapse: "collapse" }}>
			<thead>
				<tr>
					<th>Date</th>
					<th>Type</th>
					<th>Amount</th>
				</tr>
			</thead>
			<tbody>
				{transactions.map((tx) => (
					<tr key={tx.id}>
						<td>{tx.date}</td>
						<td>{tx.type}</td>
						<td>{tx.amount}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default Transactions;
