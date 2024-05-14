import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react";
import { UseMutationResult, UseQueryResult, useMutation, useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { getUserById } from "~~/services/database";
import { User } from "~~/types/commontypes";

interface IUser {
  users: User[];
  usersQuery: UseQueryResult<User[], unknown>;
  userQuery: UseQueryResult<User, unknown>;
  createUser: UseMutationResult<User, unknown, Partial<User>, unknown>;
  updateUser: UseMutationResult<User, unknown, Partial<User>, unknown>;
  deleteUser: UseMutationResult<User, unknown, void, unknown>;
}

const UserContext = createContext<IUser | null>(null);

const useUser = () => {
  const { address } = useAccount();
  const [users, setUsers] = useState<User[]>([]);
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(`/api/users`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (usersQuery.data) {
      setUsers(usersQuery.data.users);
    }
  }, [usersQuery]);

  const userQuery = useQuery({
    queryKey: ["user", address],
    queryFn: async () => {
      if (!address) return;
      return getUserById(address);
    },
  });

  const createUser = useMutation({
    mutationFn: async (newUser: User) => {
      if (!address) return;
      const response = await fetch(`/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSuccess: () => {
      usersQuery.refetch();
      userQuery.refetch();
    },
  });

  const updateUser = useMutation({
    mutationFn: async (updateData: Partial<User>) => {
      const address = updateData.address;
      const response = await fetch(`/api/users/${address}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log(response);
      return response.json();
    },
    onSuccess: () => {
      usersQuery.refetch();
      userQuery.refetch();
    },
  });

  const deleteUser = useMutation({
    mutationFn: async () => {
      if (!address) return;
      const response = await fetch(`/api/users/${address}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSuccess: () => {
      usersQuery.refetch();
      userQuery.refetch();
    },
  });

  return {
    users,
    usersQuery,
    userQuery,
    createUser,
    updateUser,
    deleteUser,
  };
};
export function ProvideUser({ children }: PropsWithChildren<any>) {
  const value = useUser();
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUserHook = () => {
  const context = useContext(UserContext);
  if (context == null) {
    throw "Ensure that the component is wrapped inside UserProvider to use this hook.";
  }
  return context;
};
