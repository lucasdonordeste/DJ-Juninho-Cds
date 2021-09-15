const discord = require('discord.js');
const { queues } = require('..');

module.exports = {
    /**
     *
     * @param {string[]} args
     * @param {discord.Message} message
     */
    run: async (args, message) => {
        if(!message.member.voice.channel.id) return message.channel.send("Como você quer ouvir se não esta em um canal de voz?!");
        if(!queues[message.guild.id]) return message.channel.send('Não tá tocando nada!');

        queues[message.guild.id]._playNext();
    },

    command: 'skip'
}