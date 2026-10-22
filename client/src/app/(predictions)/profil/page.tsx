import Profile from "@/components/predictions-pages/profil/Profile"
import ProfileHistory from "@/components/predictions-pages/profil/ProfileHistory"
import Footer from "@/components/layout/footer/Footer"

const Profil = () => {
  return (
    <>
      <div className="min-h-[calc(100vh-11.5rem)] max-w-3xl mx-3 md:mx-auto">
        <Profile />
        <ProfileHistory />
      </div>
      <Footer />
    </>
  )
}
export default Profil