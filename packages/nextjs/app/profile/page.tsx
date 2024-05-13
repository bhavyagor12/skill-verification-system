"use client";

import { useState } from "react";
import { SkillModal } from "./_components/SkillModal";
import { UserProfileModal } from "./_components/UserProfileModal";
import { Divider } from "@mui/material";
import type { NextPage } from "next";
import SkillRenderer from "~~/components/SkillRenderer";
import { SocialIconRenderer } from "~~/components/SocialIconRenderer";
import { Address } from "~~/components/scaffold-eth";
import { useUserHook } from "~~/providers/UserProvider";
import { Skill } from "~~/types/commontypes";
import { notification } from "~~/utils/scaffold-eth";

const Profile: NextPage = () => {
  const { userQuery } = useUserHook();
  const user = userQuery.data;
  const loading = userQuery.isLoading;
  const [open, setOpen] = useState(false);
  const [openSkill, setOpenSkill] = useState(false);
  if (loading) return <span className="loading loading-dots loading-lg"></span>;
  if (!user)
    return (
      <UserProfileModal
        isOpen={true}
        onClose={() => {
          notification.info("Please create a profile first.");
        }}
      />
    );

  return (
    <div className="flex mx-20 my-10 gap-4 ">
      {/* Left section */}
      <div className="w-1/5 p-4 border-2 border-secondary">
        <div className="flex items-center flex-col justify-between h-full gap-4">
          <div className="flex items-center flex-col h-full gap-4">
            <div className="rounded-md overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={user.image} alt="Profile" className="w-44 h-40 object-cover" />
            </div>
            <div className="text-4xl font-bold">{user.name}</div>
            <Address address={user.address} />
            <Divider className="w-full" />
            <div className="flex items-center gap-2">
              <SocialIconRenderer url={user.github as string} type="github" />
              <SocialIconRenderer url={user.twitter as string} type="twitter" />
              <SocialIconRenderer url={user.discord as string} type="discord" />
              <SocialIconRenderer url={user.telegram as string} type="t" />
              <SocialIconRenderer url={user.linkedin as string} type="linkedin" />
            </div>
            <Divider className="w-full" />
          </div>
          <div>
            <button
              className="btn btn-primary rounded-md uppercase"
              onClick={() => {
                setOpen(!open);
              }}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="w-4/5 p-4 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">Skills</div>
          <button className="btn btn-primary rounded-md uppercase" onClick={() => setOpenSkill(!openSkill)}>
            Add New Skill
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6 pt-4 ">
          {user.skills.map((skill: Skill) => (
            <SkillRenderer key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
      <UserProfileModal isOpen={open} onClose={() => setOpen(false)} />
      <SkillModal
        isOpen={openSkill}
        onClose={() => setOpenSkill(false)}
        initialSkill={
          {
            name: "",
            self_rating: 0,
            peer_rating: 0,
            proof_of_work: [""],
            verifiers: [],
          } as Skill
        }
      />
    </div>
  );
};

export default Profile;
