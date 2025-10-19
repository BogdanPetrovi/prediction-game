import matchesExampleArray from "@/utils/matchesExampleArray";
import Matchup from "../components/Matchup"

export default function Home() {
  return (
    <div className="w-3/5 mx-auto h-[calc(100vh-7.5rem)] flex flex-col pt-20 items-center gap-10">
      {
        // index only while testing, later every match will have unique id
        matchesExampleArray.map((match, index) => (
          <Matchup
            match={match}
            key={index}
          />
        ))
      }
    </div>
  );
}
