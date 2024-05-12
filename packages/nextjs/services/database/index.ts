export const getUserById = async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  try {
    const user = await response.json();
    console.log(user)
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsers = async () => {
  const response = await fetch(`/api/users`);
  const users = await response.json();
  return users;
};
