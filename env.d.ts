declare module 'bun' {
  interface Env {
    CHATBOT_URL: string
    DECAPI_TOKEN: string
    DISCORD_WEBHOOK: string
    PORT: number
    RUNNEL_COOKIE: string
    RUNNEL_STREAM: string
    TWITCH_CLIENT_ID: string
    TWITCH_OAUTH: string
  }
}
