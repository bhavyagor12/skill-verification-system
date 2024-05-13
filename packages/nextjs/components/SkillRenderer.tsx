import { useState } from "react";
import StarRating from "./StarRating";
import { PencilIcon } from "@heroicons/react/24/outline";
import { SkillModal } from "~~/app/profile/_components/SkillModal";
import { Skill } from "~~/types/commontypes";

const SkillRenderer = ({ skill, canEdit }: { skill: Skill; canEdit: boolean }) => {
  const { name, self_rating: selfRating, peer_rating: peerRating, verifiers } = skill;
  const [open, setOpen] = useState(false);
  let avgRating = (selfRating + peerRating) / 2;
  if (verifiers.length === 0) {
    avgRating = selfRating;
  }

  return (
    <div className="flex flex-col bg-base-100 p-6 rounded-3xl items-center relative">
      {canEdit && (
        <PencilIcon
          onClick={() => setOpen(true)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-600 focus:outline-none w-8 h-4"
        />
      )}
      <span className="font-bold text-xl lg:text-3xl">{name}</span>
      <div className="flex items-center justify-center gap-2">
        <StarRating score={avgRating} color="#000" />
        <span className="text-md mt-[2px]">({verifiers.length})</span>
      </div>
      {open && <SkillModal isOpen={open} onClose={() => setOpen(false)} initialSkill={skill} />}
    </div>
  );
};

export default SkillRenderer;
