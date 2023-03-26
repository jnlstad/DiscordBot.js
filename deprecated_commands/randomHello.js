const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random_hello')
        .setDescription('Replies with a random Hello!'),
    async execute(interaction) {
        console.log(interaction.member.voice);
        await interaction.reply({content: new randomHello(interaction.user.username).reply, ephemeral: true});
    },
};


class randomHello {
    constructor(username) {

        const replies = [
            `Hiya Cowboy!`,
            `Heya Weirdo`,
            `Whassup Bro?`,
            `What's Up, ${username}!`,
        ]

        this.reply = replies[Math.floor(Math.random()*replies.length)];

    }
}