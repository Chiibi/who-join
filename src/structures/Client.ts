import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, Intents } from 'discord.js'
import { CommandType } from '../typings/Command'
import glob from 'glob'
import { promisify } from 'util'
import { RegisterCommandsOptions } from '../typings/Client'
import { Event } from './Event'

const globPromise = promisify(glob)

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection()

  constructor() {
    super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] })
  }

  start() {
    this.registerModules()
    this.login(process.env.DISCORD_BOT_TOKEN)
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default
  }

  async registerCommands({ commands, guildID }: RegisterCommandsOptions) {
    if (guildID) {
      console.log(`Registering commands to ${guildID}`)
      this.guilds.cache.get(guildID)?.commands.set(commands)
    } else {
      console.log(`Registering global commands`)
      this.application?.commands.set(commands)
    }
  }

  async registerModules() {
    // Commands
    const slashCommands: ApplicationCommandDataResolvable[] = []
    const commandFiles = await globPromise(`${__dirname}/../commands/*/*.ts`)
    commandFiles.forEach(async (filePath) => {
      const command: CommandType = await this.importFile(filePath)

      if (!command.name) return
      console.log(command)

      this.commands.set(command.name, command)
      slashCommands.push(command)
    })

    this.on('ready', () => {
      this.registerCommands({
        commands: slashCommands,
        guildID: process.env.DISCORD_BOT_GUILDID,
      })
    })

    // Events
    const eventFiles = await globPromise(`${__dirname}/../events/*.ts`)
    eventFiles.forEach(async (filePath) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath)
      this.on(event.event, event.run)
    })
  }
}
