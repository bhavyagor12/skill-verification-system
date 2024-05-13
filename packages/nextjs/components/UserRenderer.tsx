import { User } from "../types/commontypes";
import { SocialIconRenderer } from "./SocialIconRenderer";
import { Address } from "./scaffold-eth";
import { Divider } from "@mui/material";

const UserRenderer = ({ user }: { user: User }) => {
  return (
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
  );
};

export default UserRenderer;
