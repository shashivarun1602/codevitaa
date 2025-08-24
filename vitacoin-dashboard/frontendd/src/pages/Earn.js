import React from "react";

const Earn = () => {
  // Example tasks and quizzes
  const tasks = [
    { id: 1, type: "Quiz", title: "Math Quiz", coins: 20 },
    { id: 2, type: "Task", title: "Forum Post", coins: 10 },
    { id: 3, type: "Assignment", title: "Upload Assignment", coins: 30 },
  ];

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, borderRadius: 12, boxShadow: "0 2px 12px #eee", background: "#fff" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Earn Coins</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: 18, padding: 12, borderRadius: 8, background: "#f9f9f9", boxShadow: "0 1px 4px #eee" }}>
            <strong>{task.type}:</strong> {task.title} <br />
            <span style={{ color: "#ffd700", fontWeight: "bold" }}>+{task.coins} coins</span>
            <button style={{ marginLeft: 16, padding: "6px 12px", borderRadius: 6, background: "#ffd700", color: "#222", border: "none", fontWeight: "bold" }}>Attempt</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Earn;
