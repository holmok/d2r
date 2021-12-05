import Config from 'config'
import Pino from 'pino'
import Server from './server'

async function stopServer (server: Server): Promise<void> {
  try {
    await server.stop()
    console.warn('server stopped')
  } catch (error) {
    console.error('failed to stop server')
    throw error
  }
}

export async function start (): Promise<void> {
  const logger = Pino(Config.get('pino'))
  const server: Server = new Server(Config, logger)
  process.once('SIGTERM', () => {
    console.warn('SIGTERM received...')
    stopServer(server).catch(console.error)
  })
  process.once('SIGINT', () => {
    console.warn('SIGINT received...')
    stopServer(server).catch(console.error)
  })
  server.start().catch(logger.error)
}
