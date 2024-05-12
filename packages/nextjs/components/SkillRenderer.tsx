import { useState } from "react";
import StarRating from "./StarRating";
import { Skill } from "~~/types/commontypes";
import { SkillModal } from "~~/app/profile/_components/SkillModal";

const SkillRenderer = ({ skill }: { skill: Skill }) => {
  const { name, self_rating: selfRating, peer_rating: peerRating, verifiers: verifications } = skill;
  const [open, setOpen] = useState(false);
  const avgRating = (selfRating + peerRating) / 2;
  return (
    <div className="flex flex-col bg-base-100 p-6 rounded-3xl items-center" onClick={() => { setOpen(!open) }}>
      <span className="font-bold text-xl lg:text-3xl">{name}</span>
      <div className="flex items-center justify-center gap-2">
        <StarRating score={avgRating} color="#000" />
        <span className="text-md mt-[2px]">({verifications})</span>
      </div>
      <SkillModal isOpen={open} onClose={() => setOpen(false)} initialSkill={skill} />
    </div>
  );
};

export default SkillRenderer;
