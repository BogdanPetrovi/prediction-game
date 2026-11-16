import Profile from "@/components/predictions-pages/profil/Profile"
import ProfileHistory from "@/components/predictions-pages/profil/ProfileHistory"
import CurrentPlacement from "@/components/predictions-pages/profil/CurrentPlacement"
import Footer from "@/components/layout/footer/Footer"

const Profil = () => {
  return (
    <>
      <div className="min-h-[calc(100vh-11.5rem)] max-w-3xl mx-3 md:mx-auto">
        <Profile editable belowName={<CurrentPlacement />} />
        <ProfileHistory />
      </div>
      <Footer />
    </>
  )
}
export default Profil