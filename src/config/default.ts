import Pino from 'pino'
import KoaCors from '@koa/cors'

export const name = 'd2r'

export interface ServerOptions {
  host: string
  port: number
}

export const server: ServerOptions = {
  host: 'localhost',
  port: 8081
}

export const pino: Pino.LoggerOptions = {
  name,
  level: 'debug'
}

export const cors: KoaCors.Options = {}
