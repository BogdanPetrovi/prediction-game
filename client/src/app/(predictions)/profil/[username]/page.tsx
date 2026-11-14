import UserProfile from "@/components/predictions-pages/profil/UserProfile"
import Footer from "@/components/layout/footer/Footer"

const decodeUsername = (username: string) => {
  try {
    return decodeURIComponent(username)
  } catch {
    return username
  }
}

const KorisnikProfil = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params

  return (
    <>
      <div className="min-h-[calc(100vh-11.5rem)] max-w-3xl mx-3 md:mx-auto">
        <UserProfile username={decodeUsername(username)} />
      </div>
      <Footer />
    </>
  )
}

export default KorisnikProfil
