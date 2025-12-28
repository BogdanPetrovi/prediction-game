import passport from 'passport'
import { Strategy as DiscordStrategy } from 'passport-discord'
import 'dotenv/config';

const configurePassport = () => {
  const scopes = ['identify'];

  passport.serializeUser((user: any, done) => {
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
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile)
        cb(null, profile)
    }));
  }
}

export default configurePassport