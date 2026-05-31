import Profile from "@/components/predictions-pages/profil/Profile"
import ProfileHistory from "@/components/predictions-pages/profil/ProfileHistory"

const Profil = () => {
  return (
    <div className="min-h-[calc(100vh-9.5rem)] max-w-3xl mx-3 md:mx-auto">
      <Profile />
      <ProfileHistory />
    </div>
  )
}
export default Profil