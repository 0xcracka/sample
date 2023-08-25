import React, { useEffect, useState } from "react";
import { useDarkMode } from "usehooks-ts";
import { useAccount } from "wagmi";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

function VotingContractCard() {
  useAccount();
  const [, setIsDarkTheme] = useState(true);
  const { isDarkMode } = useDarkMode();

  // const [owner, setOwner] = useState("");
  // const [candidates, setCandidates] = useState<string[]>([]);
  const [hasVoted] = useState(false);
  const [votingEnded] = useState(false);
  // const [winner, setWinner] = useState("");
  // const [userVote, setUserVote] = useState("");
  // const [alert, setAlert] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<string>(""); // <-- Add this

  const { data: votingStatus } = useScaffoldContractRead({
    contractName: "VotingContract",
    functionName: "votingEnded",
  });

  const { data: fetchedCandidates } = useScaffoldContractRead({
    contractName: "VotingContract",
    functionName: "getCandidates",
  });
  console.log(fetchedCandidates);

  useEffect(() => {
    setIsDarkTheme(isDarkMode);
  }, [isDarkMode]);

  // useEffect(() => {
  //   if (fetchedCandidates && JSON.stringify(fetchedCandidates) !== JSON.stringify(candidates)) {
  //     setCandidates(fetchedCandidates);
  //   }
  // }, [fetchedCandidates]);

  const { data: currentWinner } = useScaffoldContractRead({
    contractName: "VotingContract",
    functionName: "winner",
  });

  // const { data: myVotingHistory, isLoading: isLoadingEvents } = useScaffoldEventHistory({
  //   contractName: "VotingContract",
  //   eventName: "Voted",
  //   fromBlock: process.env.NEXT_PUBLIC_DEPLOY_BLOCK ? BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) : 0n,
  //   // filters: { voter: address },//need to adjust type definitions.
  // });

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "VotingContract",
    functionName: "vote",
    args: [selectedCandidate],
    // value: "0.01",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="card max-w-xl bg-white shadow-lg rounded-lg overflow-hidden bordered">
        <div className="card-body">
          <div className="card-body flex flex-col justify-center items-center">
            <h1 className="card-title text-center">Voting Contract</h1>
          </div>

          <p className="mt-[-30px]">
            Voting Status:
            <br />
            {votingStatus ? (
              <span className="mt-2 bg-red-500 text-white py-1 px-2 rounded-full">Ended</span>
            ) : (
              <span className="mt-2 bg-green-500 text-white py-1 px-2 rounded-full">Ongoing</span>
            )}
          </p>

          {votingStatus && <p>Winner: {currentWinner}</p>}

          {/* <h2>Your Voting History</h2>

          {myVotingHistory &&
            myVotingHistory.map((event, index) => (
              <div key={index}>
                <p>Voted for: {event.userVote}</p>
              </div>
            ))} */}
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-xl font-bold text-center text-blue-600">Available Candidates</h2>
            <ul className="list-decimal list-inside mt-4">
              {fetchedCandidates &&
                fetchedCandidates.map((candidate, index) => (
                  <li key={index} className="font-semibold my-2">
                    {candidate}
                  </li>
                ))}
            </ul>
          </div>

          <div className="font-bold mt-4">
            <h2>Vote for a Candidate:</h2>
            <input
              type="text"
              placeholder="Enter candidate's name"
              value={selectedCandidate}
              onChange={e => setSelectedCandidate(e.target.value)}
              className="border p-2 rounded font-normal"
            />
            <button
              onClick={() => writeAsync()}
              disabled={hasVoted || votingEnded}
              className="ml-2 bg-blue-500 text-white p-2 rounded"
            >
              Vote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VotingContractCard;
