declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_BOT_TOKEN: string
      DISCORD_BOT_GUILDID: string
      ENVIRONMENT: 'dev' | 'production'
    }
  }
}

export {}
