"use client";

import { useRouter } from "next/navigation";
import { StringTable } from "./_components/StringTable";
import type { NextPage } from "next";
import { useUserHook } from "~~/providers/UserProvider";

const Users: NextPage = () => {
  const { users } = useUserHook();
  const router = useRouter();
  const usersAddresses = users.map(user => user.address);
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <StringTable
          strings={usersAddresses}
          onRowClick={address => {
            router.push(`/users/${address}`);
          }}
          title="Users"
        />
      </div>
    </>
  );
};

export default Users;
