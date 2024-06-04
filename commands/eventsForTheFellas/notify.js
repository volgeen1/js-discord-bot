const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('notify')
        .setDescription('Get notified when a new event happens!'),
    async execute(interaction) {
        await interaction.reply('Hello World!');
    },
}