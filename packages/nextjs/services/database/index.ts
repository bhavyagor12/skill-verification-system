import { User } from "../../types/commontypes";

export const getUserById = async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  const user = await response.json();
  return user;
};

export const updateUser = async (id: string, data: Partial<User>) => {
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const user = await response.json();
  return user;
};

export const deleteUser = async (id: string) => {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
  });
  const user = await response.json();
  return user;
};

export const createUser = async (data: Partial<User>) => {
  const response = await fetch(`/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const user = await response.json();
  return user;
};

export const getAllUsers = async () => {
  const response = await fetch(`/api/users`);
  const users = await response.json();
  return users;
};
