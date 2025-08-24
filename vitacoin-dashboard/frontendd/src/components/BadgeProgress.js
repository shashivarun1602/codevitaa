import React from 'react';

const BadgeProgress = ({ badges }) => (
	<div>
		{badges && badges.length > 0 ? (
			<ul>
				{badges.map((badge, idx) => (
					<li key={idx} style={{ color: '#ffd700', fontWeight: 'bold' }}>{badge}</li>
				))}
			</ul>
		) : (
			<span>No badges yet.</span>
		)}
	</div>
);

export default BadgeProgress;
