import TeamNames from "../types/TeamNames.js"
import AppError from "./customErrorHandlers/appError.js"

// Discord rejects embeds with more than 25 fields
const MAX_EMBED_FIELDS = 25

const sendMatchesNotification = async (matches: TeamNames[]) => {
  for(let i = 0; i < matches.length; i += MAX_EMBED_FIELDS) {
    const embedFields = matches.slice(i, i + MAX_EMBED_FIELDS).map(match => ({
      name: "Novi meč",
      value: `${match.team1Name} 🆚 ${match.team2Name}`,
      inline: false
    }))

    const response = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: i === 0 ? "**[Igraj predikcije](<https://predikcije.countersite.gg/igraj?utm_source=discord>)** <@&1496218575428653066>" : undefined,
        embeds: [
          {
            title: "📢 Novi mečevi",
            color: 0xFF0000,
            fields: embedFields,
            footer: {
              text: "Automatska notifikacija"
            },
            timestamp: new Date().toISOString()
          }
        ]
      }),
    })

    if(!response.ok)
      throw new AppError(`Discord webhook responded with status ${response.status}`, 502)
  }
}

export default sendMatchesNotification
