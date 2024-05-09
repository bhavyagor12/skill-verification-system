export const getUserById = async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  const user = await response.json();
  return user;
};

export const getAllUsers = async () => {
  const response = await fetch(`/api/users`);
  const users = await response.json();
  return users;
};
