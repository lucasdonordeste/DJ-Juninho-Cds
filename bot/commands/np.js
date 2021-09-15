const discord = require('discord.js');
const { queues } = require('..');
const { msToHMS } = require('../utils');

module.exports = {
    /**
     *
     * @param {string[]} args
     * @param {discord.Message} message
     */
    run: async (args, message) => {
        if(!queues[message.guild.id]) return message.channel.send('Não esta tocando nada');

        const song = queues[message.guild.id].currentlyPlaying;

        message.channel.send(
            new discord.MessageEmbed()
                .setTitle("🎶 Tocando nesse momento: " + song.info.title)
                .addFields([
                    { inline: true, name: "Cantor(a)", value: song.info.author },
                    { inline: true, name: "Tamanho", value: msToHMS(song.info.length) },
                    { inline: true, name: "Link", value: song.info.uri }
                ])
                .setColor("00ff00")
        );
    },

    command: 'np'
}