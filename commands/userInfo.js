const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('user_info')
        .setDescription('Replies with your user information!'),
    async execute(interaction) {
        await interaction.reply({content: `Your UserID is **${interaction.user.id}**\nyour username and #discriminator is **${interaction.user.username}#${interaction.user.discriminator}**`, ephemeral: false});
        
        ///TEST
        await bot.guilds.fetch()
        .then(guilds => {
            guilds.forEach(guild => {
                console.log(guild.id);
            })
        })
    },
};