import { env, serve } from 'bun'

import { t } from 'try'
import { default as axios } from 'axios'
import { scheduleJob } from 'node-schedule'
import { Client, type ChatUserstate } from 'tmi.js'
import { sendDiscordWebhook } from 'send-discord-webhook'

import * as messages from './messages'
import { Twitch } from './twitchAPI'

const TWITCH_ID: Record<string, number> = {
  satellitemoe: 1198464206,
  chromevt: 155702183,
  eclipsenoctis: 916473359,
  itsyamivt: 641499175,
  magicgladius: 131183360,
  sebascontre: 36026178,
}

const twitch = new Twitch(env.TWITCH_CLIENT_ID, env.TWITCH_OAUTH)

const chat = new Client({
  options: { debug: true },
  identity: { username: 'satellitemoe', password: env.TWITCH_OAUTH },
  channels: env.IS_DEV ? ['satellitemoe', 'sebascontre'] : Object.keys(TWITCH_ID),
})

chat.on('raided', (channel: string, username: string, viewers: number) => {
  if (channel !== '#satellitemoe') return
  chat.say(channel, messages.raidFrom(username))
})

chat.on('message', async (channel: string, tags: ChatUserstate, message: string, self: boolean): Promise<void> => {
  if (self) return
  let msg: string[] = message.toLowerCase().split(/\s+/)
  const command = msg.find((word) => word.startsWith('!'))
  if (!command) return

  const globalCommands: Record<string, () => Promise<[string]> | void> = {
    '!satellite': () => chat.say(channel, messages.checkSatellite[channel.replace('#', '')] || ''),
  }

  if (globalCommands[command]) {
    await globalCommands[command]()
    return
  }

  const channelCommands: Record<string, Record<string, () => Promise<[string]> | Promise<void>>> = {
    '#satellitemoe': {
      '!hola': () => chat.say(channel, `¡Hola ${tags['display-name']}! ¿Cómo estás?`),
      '!redes': () => chat.say(channel, messages.redes),
      '!kofi': () => chat.say(channel, messages.kofi),
      '!followage': async () => chat.say(channel, await messages.followAge(tags)),

      '!!!shoutout': async () => chat.say(channel, await messages.shoutout(tags)),
    },
  }

  if (channelCommands[channel]?.[command]) {
    await channelCommands[channel][command]()
    return
  }
})

serve({
  port: env.PORT,
  routes: {
    '/': Response.json({ hello: 'world' }) as Response,
    '/ping': Response.json({ ping: 'pong' }) as Response,
    '/shout': Response.json({ shout: 'not_done' }) as Response,
  },
  fetch(req: Request): Response {
    return new Response('Not Found', { status: 404 })
  },
})

chat.on('pong', async (latency: number): Promise<void> => {
  const [ok, error, value] = await t(axios.get(`${env.CHATBOT_URL}/ping`))
  console.log('PONG enviado! Latencia: ' + latency)
})

chat.connect()

scheduleJob('35 */3 * * *', async () => {
  console.log('Shoutout automático cada 3 horas?')
  chat.emit('chat', '#satellitemoe', { mod: true } as ChatUserstate, '!!!shoutout', false)
})
