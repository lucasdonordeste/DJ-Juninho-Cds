const discord = require('discord.js');
const { queues } = require('..');
const Queue = require('../structures/Queue');
const { msToHMS } = require('../utils');

module.exports = {
    /**
     *
     * @param {string[]} args
     * @param {discord.Message} message
     */
    run: async (args, message) => {
        if(!args[0]) return message.channel.send(`Tem que dizer alguma coisa pra mim pesquisar né.`);
        if(!message.member.voice.channel.id) return message.channel.send('Tem que tá num canal de voz.');

        if(!queues[message.guild.id])
            queues[message.guild.id] = new Queue(message.guild.id, message.member.voice.channel.id, message.channel);

        const allSongs = await queues[message.guild.id].search(args.join(' '));
        if(!allSongs || allSongs.length == 0) return message.channel.send(`Não conheço essa música.`);

        const songs = allSongs.slice(0, 5);

        const options = songs.map((song, index) => `${++index}) ${song.info.title} - ${song.info.author} - ${msToHMS(song.info.length)}`);

        const msg = await message.channel.send(
            new discord.MessageEmbed()
                .setTitle("🔎 Encontrei isso aqui")
                .setDescription(`\`\`\`\n${options.join('\n')}\n\`\`\``)
                .setColor("00ff00")
        );

        const chosenSong = (await msg.channel.awaitMessages(msg => msg.author === message.author && ['1','2','3','4','5', 'cancel'].includes(msg.content), { max: 1 })).first().content;
        if(chosenSong === "cancelar") return message.channel.send('Cancelado');

        const song = songs[parseInt(chosenSong) - 1];

        const isAdded = await queues[message.guild.id].play(song);

        if(isAdded) {
            message.channel.send(
                new discord.MessageEmbed()
                    .setTitle("🎶 Vou colocar na lista pra tocar: " + song.info.title)
                    .addFields([
                        { inline: true, name: "Cantor(a)", value: song.info.author },
                        { inline: true, name: "Tamanho", value: msToHMS(song.info.length) },
                        { inline: true, name: "Link", value: song.info.uri }
                    ])
                    .setColor("00ff00")
            )
        }
    },

    command: 'search'
}