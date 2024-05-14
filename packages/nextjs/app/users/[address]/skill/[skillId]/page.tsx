"use client";

import { useParams, useRouter } from "next/navigation";
import type { NextPage } from "next";
import { UsersTable } from "~~/app/users/_components/UsersTable";
import { useUserHook } from "~~/providers/UserProvider";
import { User } from "~~/types/commontypes";

const Skill: NextPage = () => {
  const router = useRouter();
  const { users } = useUserHook();
  const { address, skillId } = useParams();
  const user = users.find(user => user.address === address);
  const skill = user?.skills.find(skill => skill.skillId === parseInt(skillId as string));
  const verifiers = skill?.verifiers.map(address => users.find(user => user.address === address));
  if (!user || !verifiers) return <div>User not found</div>;
  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <span className="text-3xl font-bold">List of verifiers</span>
      <UsersTable
        users={verifiers as User[]}
        onRowClick={(address: string) => {
          router.push(`/users/${address}`);
        }}
      />
    </div>
  );
};

export default Skill;
