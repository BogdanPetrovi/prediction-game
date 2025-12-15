import { matchesGlob } from 'path';
import { createClient } from 'redis';

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
  await redisClient.del(["matches"])
})()

export default redisClient