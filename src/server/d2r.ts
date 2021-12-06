import { Middleware } from 'koa'
import { ServerContext, ServerContextState } from './server'
import Yaml from 'yaml'
import Path from 'path'
import File from 'fs'

interface DetourInfo {
  // do we string the query string or forward it?
  stripQueryString: boolean
  // where we are going to redirect to
  redirect: string
  // the status code we are going to use to redirect (defaults to 301)
  status?: number
}
interface Detours {
  // if no targets match, we will redirect to this
  fallback: DetourInfo
  // a list of regexps that match targets
  targets: Array<{regex: RegExp} & DetourInfo>
}

// LOAD D2R CONFIG
const path = Path.join(__dirname, '../../d2r.yaml')
const yaml = File.readFileSync(path, 'utf8')
const data = Yaml.parse(yaml)
const detours: Detours = {
  fallback: data.fallback,
  targets: data.targets.map((t: {regex: string, flags: string | undefined} & DetourInfo) => {
    return {
      regex: new RegExp(t.regex, t.flags),
      stripQueryString: t.stripQueryString,
      redirect: t.redirect,
      status: t.status
    }
  })
}

export default function d2r (): Middleware<ServerContextState, ServerContext> {
  return async (ctx: ServerContext): Promise<void> => {
    // BUILD INCOMING URL
    const host = ctx.request.host
    const protocol = ctx.request.protocol
    const path = ctx.request.path
    const query = (ctx.request.url).split('?')[1]
    const qs = query != null ? new URLSearchParams(query) : undefined
    const url = `${protocol}://${host}${path}${qs != null ? `?${qs.toString()}` : ''}`

    // TEST URL AGAINST DETOURS
    const target = detours.targets.find((t) => {
      return t.regex.test(url)
    }) ?? detours.fallback

    // FALLBACK OR TARGET
    const { redirect, status, stripQueryString } = target
    const final = `${redirect}${stripQueryString ? '' : `?${qs != null ? qs.toString() : ''}`}`
    ctx.log.info({ redirect: { target: final, request: url, status: status ?? 301 } }, `Redirecting ${url} to ${final}`)

    // REDIRECT
    ctx.status = status ?? 301 // default to permanent redirect
    ctx.redirect(final)
  }
}
