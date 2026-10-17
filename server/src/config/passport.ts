import passport from 'passport'
import { Strategy as DiscordStrategy, type Profile } from 'passport-discord'
import 'dotenv/config';
import database from '../database/database.js';
import User from '../types/User.js';
import trackLogin from '../utils/trackLogin.js';

const createUser = async (profile: Profile) => {
  const insertUser = async (username: string) => {
    const newUser = await database.query("INSERT INTO users (username, discord_id) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING RETURNING id, username;", [username, profile.id])
    return newUser.rows[0]
  }

  // Discord display names aren't unique, so if one is taken fall back to the unique Discord username
  if(profile.global_name != null && profile.global_name !== ''){
    const newUser = await insertUser(profile.global_name)
    if(newUser)
      return newUser
  }

  // The Discord username can still clash with someone else's display name, so add a numeric suffix until it's free
  let newUser = await insertUser(profile.username)
  for(let suffix = 2; !newUser; suffix++){
    const tail = `_${suffix}`
    newUser = await insertUser(profile.username.slice(0, 28 - tail.length) + tail)
  }
  return newUser
}

const configurePassport = () => {
  const scopes = ['identify'];

  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser((obj: any, done) => {
    done(null, obj)
  })

  if(process.env.DISCORD_CLIENT_ID){
    passport.use('discord', new DiscordStrategy({
        clientID: process.env.DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_SECRET!,
        callbackURL: process.env.DISCORD_CALLBACK_URL,
        scope: scopes
      },
      async function(accessToken, refreshToken, profile, cb) {
          try {
            const result = await database.query("SELECT id, username FROM users WHERE discord_id = $1;", [profile.id])
            const existingUser = result.rows[0]
            const user = existingUser ?? await createUser(profile)

            trackLogin(Number(user.id), !existingUser)
              .catch(err => console.error('PostHog tracking error: ', err))

            return cb(null, user)
          } catch (err) {
            console.log(err)
            return cb(err)
          }
      })
    );
  }
}

export default configurePassport