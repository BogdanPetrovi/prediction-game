import passport from 'passport'
import { Strategy as DiscordStrategy } from 'passport-discord'
import 'dotenv/config';
import database from '../database/database.js';
import User from '../types/User.js';

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
            if(result.rows.length !== 0)
              return cb(null, result.rows[0])

            const newUser = await database.query("INSERT INTO users (username, discord_id) VALUES ($1, $2) RETURNING id, username;", [profile.global_name, profile.id])

            return cb(null, newUser.rows[0])
          } catch (err) {
            console.log(err)
            return cb(err)
          }
      })
    );
  }
}

export default configurePassport