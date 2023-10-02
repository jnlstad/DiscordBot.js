const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('user_info')
        .setDescription('Replies with your user information!'),
    async execute(interaction) {
        await interaction.reply({content: `Your UserID is **${interaction.user.id}**\nyour username is **${interaction.user.username}**`, ephemeral: false});
        setTimeout(() => interaction.deleteReply(), 20 * 1000)
    },
};