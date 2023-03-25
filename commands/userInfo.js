const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('user_info')
        .setDescription('Replies with your user information!'),
    async execute(interaction) {
        // console.log(interaction.guild.member.cache.get(interaction.member.user.id).voice.channelId);
        // console.log(interaction.member.voice.channelId);
        console.log(interaction.member.voice);
        await interaction.reply({content: `Your UserID is **${interaction.user.id}**\nyour username and #discriminator is **${interaction.user.username}#${interaction.user.discriminator}**`, ephemeral: false});
    },
};