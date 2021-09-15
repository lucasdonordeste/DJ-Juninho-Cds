const discord = require('discord.js');
const { queues } = require('..');
const { msToHMS } = require('../utils');

module.exports = {
    /**
     *
     * @param {string[]} args
     * @param {discord.Message} message
     */
    run: async  (args, message) => {
        if(!queues[message.guild.id]) return message.channel.send('Não tá tocando nada');

        const next = queues[message.guild.id].queue;

        const text = next.map((song, index) => `${++index}) ${song.info.title} - ${song.info.author} - ${msToHMS(song.info.length)}`);

        message.channel.send(
            new discord.MessageEmbed()
                .setTitle("📜 Quer ver o que vai tocar? pois taí.")
                .setDescription(`\`\`\`\n${text || "Não tem nada aqui pra tocar"}\n\`\`\``)
                .setColor("00ff00")
        );
    },

    command: 'queue'
}