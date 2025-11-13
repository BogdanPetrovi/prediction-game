import Pool from 'pg-pool'

const pool = new Pool()

export default {
  query: (text: string, params: any) => pool.query(text, params)
}