"use client";

import { useRouter } from "next/navigation";
import { UsersTable } from "./_components/UsersTable";
import type { NextPage } from "next";
import { useUserHook } from "~~/providers/UserProvider";

const Users: NextPage = () => {
  const { users } = useUserHook();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <UsersTable
          users={users}
          onRowClick={(address: string) => {
            router.push(`/users/${address}`);
          }}
        />
      </div>
    </>
  );
};

export default Users;
