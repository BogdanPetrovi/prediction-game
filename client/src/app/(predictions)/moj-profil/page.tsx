import Profile from "@/components/Profile"
import ProfileHistory from "@/components/ProfileHistory"

const MyPredictionsPage = () => {
  return (
    <div className="min-h-[calc(100vh-9.5rem)] max-w-3xl mx-3 md:mx-auto">
      <Profile />
      <ProfileHistory />
    </div>
  )
}
export default MyPredictionsPage