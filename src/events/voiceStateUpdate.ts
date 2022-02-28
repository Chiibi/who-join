import { Event } from '../structures/Event'

export default new Event('voiceStateUpdate', (oldVoiceState, newVoiceState) => {
  // Return when user just mute or deaf channel (include mute/deaf via server)
  if (
    newVoiceState.selfMute ||
    newVoiceState.selfDeaf ||
    oldVoiceState.selfMute ||
    oldVoiceState.selfDeaf ||
    newVoiceState.serverMute ||
    newVoiceState.serverDeaf ||
    oldVoiceState.serverMute ||
    oldVoiceState.serverDeaf
  )
    return

  if (newVoiceState.channel) {
    // The member connected to a channel.
    console.log(`${newVoiceState.member.user.tag} connected to ${newVoiceState.channel.name}.`)
  } else if (oldVoiceState.channel) {
    // The member disconnected from a channel.
    console.log(`${oldVoiceState.member.user.tag} disconnected from ${oldVoiceState.channel.name}.`)
  }
})
