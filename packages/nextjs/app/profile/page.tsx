"use client";

import { UserProfileModal } from "./_components/UserProfileModal";
import { Divider } from "@mui/material";
import type { NextPage } from "next";
import { SocialIcon } from "react-social-icons";
import SkillRenderer from "~~/components/SkillRenderer";
import { Address } from "~~/components/scaffold-eth";
import { useUserHook } from "~~/providers/UserProvider";
import { Skill, User } from "~~/types/commontypes";
import { notification } from "~~/utils/scaffold-eth";

const UserData: User = {
  name: "John Doe",
  address: "0xE42297a87b9882526FF2E5Ea0B190d3e8de6f793",
  image: "https://avatars.githubusercontent.com/u/56181880?v=4",
  github: "https://github.com/johndoe",
  twitter: "https://twitter.com/johndoe",
  discord: "https://discord.com/johndoe",
  telegram: "https://t.me/johndoe",
  linkedin: "https://linkedin.com/johndoe",
  skills: [
    {
      name: "JavaScript",
      self_rating: 8,
      peer_rating: 7,
      proof_of_work: ["Project 1", "Project 2"],
      verifiers: ["Jane Smith", "Bob Johnson"],
    },
    {
      name: "React",
      self_rating: 9,
      peer_rating: 8,
      proof_of_work: ["Project 3", "Project 4"],
      verifiers: ["Alice Brown", "Tom Green"],
    },
  ],
};

const SocialIconRenderer = ({ url }: { url: string }) => {
  return (
    <SocialIcon
      url={url}
      style={{
        width: 30,
        height: 30,
      }}
    />
  );
};

const Skills: Skill[] = [
  {
    name: "JavaScript",
    self_rating: 4,
    peer_rating: 3,
    proof_of_work: ["Project 1", "Project 2"],
    verifiers: ["Jane Smith", "Bob Johnson"],
  },
  {
    name: "React",
    self_rating: 5,
    peer_rating: 4,
    proof_of_work: ["Project 3", "Project 4"],
    verifiers: ["Alice Brown", "Tom Green"],
  },
  {
    name: "TypeScript",
    self_rating: 6,
    peer_rating: 5,
    proof_of_work: ["Project 5", "Project 6"],
    verifiers: ["Charlie White", "David Black"],
  },
  {
    name: "HTML",
    self_rating: 7,
    peer_rating: 6,
    proof_of_work: ["Project 7", "Project 8"],
    verifiers: ["Eve Red", "Frank Blue"],
  },
  {
    name: "CSS",
    self_rating: 8,
    peer_rating: 7,
    proof_of_work: ["Project 9", "Project 10"],
    verifiers: ["Grace Yellow"],
  },
  {
    name: "Tailwind CSS",
    self_rating: 9,
    peer_rating: 8,
    proof_of_work: ["Project 11", "Project 12"],
    verifiers: ["Hank Purple"],
  },
  {
    name: "Bootstrap",
    self_rating: 10,
    peer_rating: 9,
    proof_of_work: ["Project 13", "Project 14"],
    verifiers: ["Ivy Orange"],
  },
  {
    name: "Material-UI",
    self_rating: 10,
    peer_rating: 10,
    proof_of_work: ["Project 15", "Project 16"],
    verifiers: ["Jack Brown"],
  },
  {
    name: "Chakra UI",
    self_rating: 10,
    peer_rating: 10,
    proof_of_work: ["Project 17", "Project 18"],
    verifiers: ["Kelly Green"],
  },
];

const Profile: NextPage = () => {
  const { user } = useUserHook();
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
              <img src={UserData.image} alt="Profile" className="w-44 h-40 object-cover" />
            </div>{" "}
            <div className="text-4xl font-bold">{UserData.name}</div>
            <Address address={UserData.address} />
            <Divider className="w-full" />
            <div className="flex items-center gap-2">
              <SocialIconRenderer url={UserData.github as string} />
              <SocialIconRenderer url={UserData.twitter as string} />
              <SocialIconRenderer url={UserData.discord as string} />
              <SocialIconRenderer url={UserData.telegram as string} />
              <SocialIconRenderer url={UserData.linkedin as string} />
            </div>
            <Divider className="w-full" />
          </div>
          <div>
            <button className="btn btn-primary rounded-md uppercase">Edit Profile</button>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="w-4/5 p-4 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">Skills</div>
          <button className="btn btn-primary rounded-md uppercase">Add New Skill</button>
        </div>
        <div className="grid grid-cols-3 gap-6 pt-4 ">
          {Skills.map((skill: Skill) => (
            <SkillRenderer
              key={skill.name}
              name={skill.name}
              selfRating={skill.self_rating as number}
              peerRating={skill.peer_rating}
              verifications={skill.verifiers.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
