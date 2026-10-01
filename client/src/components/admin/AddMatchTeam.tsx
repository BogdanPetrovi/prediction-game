import AddMatchInput from "./AddMatchInput"

export interface Team {
  name: string,
  logo: string
}

interface AddMatchTeamProps {
  title: string,
  team: Team,
  setTeam: (team: Team) => void
}

export default function AddMatchTeam({ title, team, setTeam }: AddMatchTeamProps) {
  return (
    <div className="flex flex-col gap-3 flex-1">
      <h3 className="text-xl font-bold">{ title }</h3>
      <AddMatchInput title="Ime tima" placeholder="npr. Natus Vincere" type="text" value={team.name} setValue={(name) => setTeam({ ...team, name })} />
      <AddMatchInput title="Logo tima (opciono)" placeholder="URL loga" type="text" value={team.logo} setValue={(logo) => setTeam({ ...team, logo })} />
    </div>
  )
}
