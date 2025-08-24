import React from "react";

const Profile = () => {
  // Sample user profile data
  const user = {
    name: "John Doe",
    email: "john@example.com",
    coins: 50,
    badges: ["Starter", "Achiever"],
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Coins:</strong> {user.coins}</p>
      <p><strong>Badges:</strong> {user.badges.join(", ")}</p>
    </div>
  );
};

export default Profile;
