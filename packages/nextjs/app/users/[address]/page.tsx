"use client";

import { useParams } from "next/navigation";
import type { NextPage } from "next";
import SkillRenderer from "~~/components/SkillRenderer";
import UserRenderer from "~~/components/UserRenderer";
import { useUserHook } from "~~/providers/UserProvider";
import { Skill } from "~~/types/commontypes";

const User: NextPage = () => {
  const { users } = useUserHook();
  const { address } = useParams();
  const user = users.find(user => user.address === address);
  if (!user) return <div>User not found</div>;
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start md:mx-20 my-10 gap-4 ">
      {/* Left section */}
      <div className="md:w-1/5 p-4 border-2 border-secondary">
        <div className="flex items-center flex-col justify-between h-full gap-4">
          <UserRenderer user={user} />
        </div>
      </div>

      {/* Right section */}
      <div className="w-4/5 p-4 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-2xl font-bold">Skills</div>
        </div>
        <div className="grid  grid-cols-1 md:grid-cols-3 gap-6 pt-4 ">
          {user.skills.map((skill: Skill) => (
            <SkillRenderer key={skill.name} skill={skill} canEdit={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default User;
