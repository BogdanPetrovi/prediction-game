import Pool from 'pg-pool'

const pool = new Pool()

export default {
  query: (text: string, params?: any) => pool.query(text, params),

  transaction: async <T>(fn: (client:any) => Promise<T>): Promise<T> => {
      const client = await pool.connect()
      try {
        await client.query('BEGIN')
        const result = await fn(client)
        await client.query('COMMIT')
        return result
      } catch (err){
        await client.query('ROLLBACK')
        throw err
      } finally {
        client.release()
      }
  }
}