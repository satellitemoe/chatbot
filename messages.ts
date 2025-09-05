import { env } from 'bun'

import { t } from 'try'
import { default as axios } from 'axios'
import { type ChatUserstate } from 'tmi.js'

export const redes: string =
  '📡 Síguenos en nuestras redes sociales ➡️ https://www.youtube.com/@satellitemoe ➡️ https://x.com/satellitemoe'

export const kofi: string =
  '🌌 Apoya a nuestro grupo a través de donaciones en Ko-fi! ☕ https://ko-fi.com/satellitemoe'

export const checkSatellite: Record<string, string> = {
  chromevt: '',
  eclipsenoctis: '',
  itsyamivt: '',
  magicgladius: '',
  sebascontre: 'Recuerden viitar la web de Satellite https://satellite.moe',
  satellitemoe: '¡Hola! Somos Satellite. ¡Visita nuestra web en https://satellite.moe para más información! 🌟',
}

export function raidFrom(username: string): string {
  let defaultText: string = `${username}! Le damos la bienvenida a tu comunidad`
  let customTexts: Record<string, string> = {
    chromevt: 'Chrome! Bienvenidos todos los sparkcitos',
    eclipsenoctis: 'Eclipse! Bienvenidas todas las lunitas',
    itsyamivt: 'Yami! Bienvenidos todos los lumis',
    magicgladius: 'Magic! Bienvenidos todos los magorditos',
    sebascontre: 'Seba! Bienvenida toda la gente bonita',
    oshibocchi: 'Oshi! Bienvenidos todos los kumicitos',
  }

  return `¡Muchas gracias por la raid ${customTexts[username.toLowerCase()] || defaultText}, esperamos que disfruten su
  estadia. Por favor recuerden que aquí solo pasamos repeticiones, y todo su apoyo sirve a todo el grupo Satellite.`
}

export async function followAge(tags: ChatUserstate) {
  let [ok, error, value] = await t(
    axios.get(`https://decapi.me/twitch/followage/satellitemoe/${tags.username}?token=${env.DECAPI_TOKEN}`),
  )

  if (ok) {
    let followage = value?.data
      .replace(/\byears?\b/g, (m: string) => (m === 'year' ? 'año' : 'años'))
      .replace(/\bmonths?\b/g, (m: string) => (m === 'month' ? 'mes' : 'meses'))
      .replace(/\bweeks?\b/g, (m: string) => (m === 'week' ? 'semana' : 'semanas'))
      .replace(/\bdays?\b/g, (m: string) => (m === 'day' ? 'día' : 'días'))
      .replace(/\bhours?\b/g, (m: string) => (m === 'hour' ? 'hora' : 'horas'))
      .replace(/\bminutes?\b/g, (m: string) => (m === 'minute' ? 'minuto' : 'minutos'))
      .replace(/\bseconds?\b/g, (m: string) => (m === 'second' ? 'segundo' : 'segundos'))

    return `Increible, ${tags['display-name']} nos lleva siguiendo ${followage}`
  }

  return `No he podido comprobar el followage de ${tags['display-name']}, lo siento :(`
}

export async function shoutout(): Promise<string> {
  let [ok, error, value] = await t(
    axios.get(`https://runnel.live/api/streams/${env.RUNNEL_STREAM}`, {
      headers: { Cookie: `API_KEY=${env.RUNNEL_COOKIE}` },
    }),
  )

  const SHORTNAMES: Record<string, string> = {
    MAGIC: 'magicgladius',
    CHROME: 'chromevt',
    ECLIPSE: 'eclipsenoctis',
    YAMI: 'itsyamivt',
    SEBA: 'sebascontre',
  }

  if (ok && value?.data[0]?.status == 'RUNNING') {
    let queuePosition = value?.data[0]?.queuePosition
    let activeVideo = value?.data[0]?.queue[queuePosition]?.title

    let streamer = activeVideo.split(/\s+/)[0]
    if (SHORTNAMES[streamer]) return SHORTNAMES[streamer]
  }

  return 'satellitemoe'
}
