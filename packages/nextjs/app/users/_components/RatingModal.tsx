import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { Rating } from "@mui/material";
import { toBig } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useUserHook } from "~~/providers/UserProvider";
import { getUserById } from "~~/services/database";
import { Skill, User } from "~~/types/commontypes";
import { notification } from "~~/utils/scaffold-eth";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill;
  userAddress: string;
}

const RatingModal: React.FC<ModalProps> = ({ isOpen, onClose, skill, userAddress }) => {
  const { address } = useAccount();
  const [stars, setStars] = useState<number>(1);
  const { writeContractAsync } = useScaffoldWriteContract("SkillVerification");
  const handleClose = () => {
    onClose();
  };
  const { updateUser, users } = useUserHook();
  const user = users.find(user => user.address === userAddress);
  if (!user) return null;
  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? "block" : "hidden"}`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-[80%] md:w-full sm:p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-600 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <>
            <div className="flex flex-col gap-2">
              <div>
                <h3 className="text-lg font-bold">Proof of work</h3>
                {skill?.proof_of_work.map((proof, index) => (
                  <Link key={index} className="text-lg font-medium text-primary ml-4" href={proof} target="_blank">
                    Proof {index + 1}
                  </Link>
                ))}
              </div>
              <h3 className="text-lg font-bold">Rate: 1-5</h3>
              <Rating
                size="large"
                name="simple-controlled"
                value={stars}
                onChange={(event, newValue) => {
                  setStars(newValue as number);
                }}
                className="w-full"
              />
            </div>
          </>

          <div className="mt-5 sm:mt-6">
            <button
              onClick={() => {
                writeContractAsync({
                  functionName: "verifySkill",
                  args: [userAddress, BigInt(skill.skillId), stars],
                });
                user.skills = user.skills.map(userSkill => {
                  if (userSkill.skillId === skill.skillId) {
                    userSkill.verifiers.push(address as string);
                    userSkill.peer_rating = (userSkill.peer_rating + stars) / userSkill.verifiers.length;
                  }
                  return userSkill;
                });
                updateUser.mutateAsync({
                  ...user,
                  address: userAddress,
                });
                notification.success("Skill verified successfully");
                onClose();
              }}
              type="button"
              className="btn btn-primary rounded-md w-full"
            >
              Verify{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { RatingModal };
