import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useUserHook } from "~~/providers/UserProvider";
import { getUserById } from "~~/services/database";
import { User } from "~~/types/commontypes";
import { notification } from "~~/utils/scaffold-eth";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { address } = useAccount();
  const { createUser } = useUserHook();

  const [user, setUser] = useState<User>({
    address: address as string,
    name: "",
    image: "",
    github: "",
    twitter: "",
    discord: "",
    telegram: "",
    linkedin: "",
    skills: [],
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!address) return;
      const user = await getUserById(address);
      setUser(user);
    };
    fetchUser();
  }, [user, getUserById, address]);
  const handleClose = () => {
    onClose();
  };
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
              {Object.keys(user).map(key => {
                if (key === "address" || key === "skills") return null;
                return (
                  <div key={key} className="flex flex-col mt-2 gap-2">
                    <span className="text-primary">{key.toUpperCase()}</span>
                    <input
                      type="text"
                      placeholder={key}
                      value={user[key as keyof User] as string}
                      onChange={e => setUser({ ...user, [key]: e.target.value })}
                      className="input input-bordered w-full"
                    />
                  </div>
                );
              })}
            </div>
          </>

          <div className="mt-5 sm:mt-6">
            <button
              onClick={() => {
                if (
                  !user.name ||
                  !user.image ||
                  !user.github ||
                  !user.twitter ||
                  !user.discord ||
                  !user.telegram ||
                  !user.linkedin
                ) {
                  notification.error("Please fill all the fields");
                  return;
                }
                createUser.mutateAsync(user);
                notification.success("User created successfully");
              }}
              type="button"
              className="btn btn-primary rounded-md w-full"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserProfileModal };
