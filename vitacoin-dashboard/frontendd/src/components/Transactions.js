import React from 'react';
import '../GlobalStyles.css';

const Transactions = ({ userId }) => {
	// Sample transaction data
	const transactions = [
		{ id: 1, type: "Quiz Completed", amount: 20, date: "2024-08-24", status: "earn" },
		{ id: 2, type: "Daily Login Bonus", amount: 10, date: "2024-08-23", status: "earn" },
		{ id: 3, type: "Task Completion", amount: 15, date: "2024-08-22", status: "earn" },
		{ id: 4, type: "Streak Bonus", amount: 5, date: "2024-08-21", status: "earn" },
		{ id: 5, type: "Assignment Upload", amount: 30, date: "2024-08-20", status: "earn" },
		{ id: 6, type: "Missed Daily Check", amount: -5, date: "2024-08-19", status: "penalty" },
	];
	return (
		<div className="page-container">
			<div className="page-header">
				<h1 className="page-title">
					Vitacoin <span className="page-title-highlight">Transactions</span>
				</h1>
			</div>
			<table className="data-table">
				<thead>
					<tr>
						<th>Date</th>
						<th>Transaction Type</th>
						<th>Amount</th>
					</tr>
				</thead>
				<tbody>
					{transactions.map((tx) => (
						<tr key={tx.id}>
							<td>{new Date(tx.date).toLocaleDateString()}</td>
							<td>{tx.type}</td>
							<td className={tx.status === 'earn' ? 'profile-coins' : 'message-error'}>
								{tx.amount > 0 ? '+' : ''}{tx.amount} Coins
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Transactions;
