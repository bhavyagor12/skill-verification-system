import Link from "next/link";
import {
  CheckBadgeIcon,
  IdentificationIcon,
  PresentationChartBarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export const Banner = () => (
  <div className="container max-w-[90%] lg:py-12 py-0 xl:max-w-7xl xl:pl-4 m-auto pt-4 pb-8 flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-0">
    <div className="space-y-2 lg:max-w-[55%] flex flex-col items-center lg:items-start">
      <div className="relative">
        <h2 className="text-3xl md:text-4xl lg:leading-[1.2] text-center lg:text-left font-bold">
          Skill Verification System <br /> <p className="text-lg md:text-xl font-normal">Peer to Peer Verification</p>
        </h2>
      </div>
      <div className="text-center font-spaceMono px-1 max-w-lg lg:max-w-none lg:w-4/5 lg:px-0 lg:text-left space-y-5">
        <div className="bg-base-300 p-4 rounded-2xl">
          <p className="m-0 text-xs md:text-sm lg:text-base">
            Skill Verify is a peer-to-peer verification system that allows users to verify the skills of other users
            through a decentralized network.
          </p>
        </div>
        <Link
          href="/get-started"
          className="btn btn-primary btn-md border-1 border-black hover:border-black hover:border-1 rounded-2xl px-14 font-bold shadow-none"
        >
          Get Started
        </Link>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6">
      <div className="flex flex-col bg-base-100 p-6 rounded-3xl items-center">
        <IdentificationIcon className="h-8 w-8 fill-secondary" />
        <p className="mt-4 text-center">Build your profile and allow others to verify your skills</p>
      </div>
      <div className="flex flex-col bg-base-100 p-6 rounded-3xl items-center">
        <CheckBadgeIcon className="h-8 w-8 fill-secondary" />
        <p className="mt-4 text-center">Proof of Work based verification that leads to more trust </p>
      </div>
      <div className="flex flex-col bg-base-100 p-6 rounded-3xl items-center">
        <PresentationChartBarIcon className="h-8 w-8 fill-secondary" />
        <p className="mt-4 text-center">Mint a NFT to display your top 9 verified skills</p>
      </div>
      <div className="flex flex-col bg-base-100 p-6 rounded-3xl items-center">
        <UserGroupIcon className="h-8 w-8 fill-secondary" />
        <p className="mt-4 text-center">Connect with others and grow together and foster development</p>
      </div>
    </div>{" "}
  </div>
);
