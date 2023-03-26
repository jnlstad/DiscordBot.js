const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue } = require("discord-player")


module.exports = {
	data: new SlashCommandBuilder()
        .setName("toggle_pause")
        .setDescription("toggles whether the player is paused or not."),

    async execute(interaction) {
        const queue = useQueue(interaction.guild.id);
        queue.node.setPaused(!queue.node.isPaused());//isPaused() returns true if that player is already paused

        if (queue.node.isPaused()) {
            await interaction.reply({content: "Player is now paused", ephemeral: false});
        } else {
            await interaction.reply({content: "Player is now unpaused", ephemeral: false});
        }
    }
}