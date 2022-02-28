import { Command } from '../../structures/Command'

export default new Command({
  name: 'ping',
  description: 'show client ping',
  run: async ({ interaction }) => {
    interaction.followUp('Pong')
  },
})
