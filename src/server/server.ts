import Config from 'config'
import Pino from 'pino'
import Http from 'http'
import KoaLogger from 'koa-pino-logger'
import Koa from 'koa'
import Cors from '@koa/cors'
import { ServerOptions } from '../config/default'

import D2r from './d2r'

export type ServerContextState = Koa.DefaultState & {
  config: Config.IConfig
  name: string
  production: boolean
}

export type ServerContext = Koa.ParameterizedContext<ServerContextState>

export default class Server {
  private readonly app: Koa<Koa.DefaultState, Koa.DefaultContext>
  server: Http.Server | undefined
  stopping: boolean
  constructor (private readonly config: Config.IConfig, private readonly logger: Pino.Logger) {
    this.app = new Koa()
    this.stopping = false
    this.server = undefined
  }

  async start (): Promise<void> {
    try {
      const name: string = this.config.get('name')
      this.logger.info('%s server start called', name)
      this.app.use(KoaLogger({ logger: this.logger }))
      this.app.use(async (ctx: ServerContext, next) => {
        ctx.state.config = this.config
        ctx.state.name = name
        ctx.state.production = process.env.NODE_ENV === 'production'
        await next()
      })
      this.app.use(Cors(this.config.get('cors')))
      this.app.use(D2r())
      const serverOptions: ServerOptions = this.config.get('server')
      this.server = this.app.listen(serverOptions.port, serverOptions.host, () => {
        this.logger.info(
        `${name} server running at http://${serverOptions.host}:${serverOptions.port}`
        )
      })
    } catch (error: any) {
      this.logger.error('failed to start server: %s', error.message)
      this.logger.error(error)
    }
  }

  async stop (): Promise<void> {
    if (!this.stopping) {
      this.stopping = true
      return await new Promise((resolve, reject) => {
        if (this.server == null) {
          reject(new Error('no server to stop.'))
        } else {
          this.server.close((err) => {
            if (err != null) {
              reject(err)
            } else {
              resolve()
            }
          })
        }
      })
    }
  }
}
