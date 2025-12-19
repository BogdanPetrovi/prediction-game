import { matchesGlob } from 'path';
import { createClient } from 'redis';
import database from '../database/database.js';

const redisClient = createClient();

(async () => {
  redisClient.on("error", (err) => { 
    console.error(err)  
  })

  redisClient.on('ready', () => {
    console.log("Redis client is ready!")
  })

  
  await redisClient.connect();
  try {
    const response = await redisClient.ping();
    console.log("Redis server answer to ping: " + response)
  } catch (err) {
    console.error("Ping failed: " + err)
  }
  await redisClient.del(["matches", "active_tournament"])
  const activeTournaments = await database.query("SELECT * FROM events WHERE is_active=true;")
  if(activeTournaments.rows[0])
    await redisClient.set('active_tournament', activeTournaments.rows[0].id)
})()

export default redisClient