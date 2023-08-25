import type { NextPage } from "next";
//import { BugAntIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import VotingContractCard from "~~/components/VotingContractCard";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center ">
            <span className="block text-2xl mb-1">Voting Contact</span>
            <span className="block text-4xl font-bold">Dashboard</span>
          </h1>
        </div>
      </div>
      <div>
        <center>
          <h1 className="text-neutral bg-base-300 p-4  ">View</h1>
          <VotingContractCard />
        </center>
      </div>
    </>
  );
};

export default Home;
