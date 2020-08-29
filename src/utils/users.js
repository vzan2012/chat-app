const users = [];

// 4 functions
// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username and room are required !!!",
    };
  }

  // Check for the existing user
  const existingUser = users.find(
    (user) => user.room === room && user.username === username
  );

  // Validating username
  if (existingUser) {
    return {
      error: "Username is in use !!!",
    };
  }

  // Store the user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

// Remove the user
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

// Get User
const getUser = (id) => users.find((user) => user.id === id);

// Get Users in room
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
