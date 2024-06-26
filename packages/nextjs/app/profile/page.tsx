"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SkillModal } from "./_components/SkillModal";
import { UserProfileModal } from "./_components/UserProfileModal";
import { Divider } from "@mui/material";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import SkillRenderer from "~~/components/SkillRenderer";
import UserRenderer from "~~/components/UserRenderer";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useUserHook } from "~~/providers/UserProvider";
import { Skill } from "~~/types/commontypes";
import { notification } from "~~/utils/scaffold-eth";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

const Profile: NextPage = () => {
  const { address } = useAccount();
  const contracts = getAllContracts();
  const router = useRouter();
  const { userQuery } = useUserHook();
  const user = userQuery.data;
  const loading = userQuery.isLoading;
  const [open, setOpen] = useState(false);
  const [openSkill, setOpenSkill] = useState(false);
  const { data, refetch } = useScaffoldReadContract({
    contractName: "SkillVerification",
    functionName: "getTokenId",
    // @ts-ignore
    args: [address],
  });
  useEffect(() => {
    if (!address) return;
    refetch();
  }, [address, refetch]);
  console.log({ data });
  const { writeContractAsync } = useScaffoldWriteContract("SkillVerification");
  if (loading) return <span className="loading loading-dots loading-lg"></span>;
  if (!user || user.name === "")
    return (
      <UserProfileModal
        isOpen={true}
        onClose={() => {
          notification.info("Please create a profile first.");
          router.push("/");
        }}
      />
    );

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start md:mx-20 my-10 gap-4 ">
      {/* Left section */}
      <div className="md:w-1/5 p-4 border-2 border-secondary">
        <div className="flex items-center flex-col justify-between h-full gap-4">
          <UserRenderer user={user} />
          <div className="flex flex-col gap-4">
            <button
              className="btn btn-primary rounded-md uppercase"
              onClick={() => {
                setOpen(!open);
              }}
            >
              Edit Profile
            </button>
            <button
              onClick={() => {
                if (data) {
                  writeContractAsync({
                    functionName: "updateTokenURI",
                  });
                  return;
                }
                console.log("calls this");
                writeContractAsync({
                  functionName: "mint",
                });
              }}
              className="btn btn-primary rounded-md uppercase"
            >
              Mint
            </button>
            {data && (
              <div className="flex flex-col gap-2">
                <Divider className="w-1/2" />
                <span className="text-center">Token ID: {Number(data)}</span>
                <span className="text-center">
                  Contract Address:
                  <Address address={contracts.SkillVerification.address} size="sm" />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="w-4/5 p-4 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-2xl font-bold">Skills</div>
          <button className="btn btn-primary rounded-md uppercase" onClick={() => setOpenSkill(!openSkill)}>
            Add New Skill
          </button>
        </div>
        <div className="grid  md:grid-cols-3 gap-6 pt-4 ">
          {user.skills?.map((skill: Skill) => (
            <SkillRenderer key={skill.name} skill={skill} canEdit={true} />
          ))}
        </div>
      </div>
      <UserProfileModal isOpen={open} onClose={() => setOpen(false)} />
      <SkillModal
        isOpen={openSkill}
        onClose={() => setOpenSkill(false)}
        initialSkill={
          {
            skillId: user.skills?.length || 0,
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
