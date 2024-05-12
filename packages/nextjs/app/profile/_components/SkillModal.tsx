import { useEffect, useState } from "react";
import { Skill } from "~~/types/commontypes";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSkill: Skill;
}

const SkillModal: React.FC<ModalProps> = ({ isOpen, onClose, initialSkill }) => {
  console.log({initialSkill})
  const [skill, setSkill] = useState<Skill>(initialSkill);

  const handleProofOfWorkChange = (index: number, value: string) => {
    const updatedProofOfWork = [...(skill.proof_of_work as string[])];
    updatedProofOfWork[index] = value;
    setSkill({ ...skill, proof_of_work: updatedProofOfWork });
  };

  const handleAddProofOfWork = () => {
    if (skill?.proof_of_work.length >= 3) return;
    setSkill({ ...skill, proof_of_work: [...(skill.proof_of_work as string[]), ""] });
  };
  const handleClose = () => {
    setSkill({
      name: "",
      self_rating: 0,
      peer_rating: 0,
      proof_of_work: [""],
      verifiers: [""],
    });
    onClose();
  };

  useEffect(() => {
    setSkill(initialSkill);
  }, []);
  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? "block" : "hidden"}`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 relative">
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
            <div className="mt-2">
              <div className="flex flex-col mt-2 gap-2">
                <label className="block text-sm font-medium text-gray-700">NAME</label>
                <input
                  type="text"
                  value={skill.name || ""}
                  onChange={e => setSkill({ ...skill, name: e.target.value })}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="flex flex-col mt-2 gap-2">
                <label className="block text-sm font-medium text-gray-700">SELF RATING</label>
                <input
                  type="number"
                  value={skill.self_rating || 1}
                  min={1}
                  max={5}
                  onChange={e => setSkill({ ...skill, self_rating: parseInt(e.target.value) })}
                  className="input input-bordered w-full"
                />
              </div>
              {skill.proof_of_work?.map((work, index) => (
                <div key={index} className="flex flex-col mt-2 gap-2">
                  <label className="block text-sm font-medium text-gray-700">PROOF OF WORK</label>
                  <input
                    type="text"
                    value={work}
                    onChange={e => handleProofOfWorkChange(index, e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
              ))}
              {skill.proof_of_work.length <= 3 && (
                <button onClick={handleAddProofOfWork} type="button" className="btn btn-primary rounded-md mt-4">
                  Add Proof of Work
                </button>
              )}
            </div>
          </>
          <div className="mt-5 sm:mt-6">
            <button onClick={() => { }} type="button" className="btn btn-primary rounded-md w-full">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SkillModal };
