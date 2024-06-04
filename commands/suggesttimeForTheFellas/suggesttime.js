const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggesttime')
        .setDescription('Suggest a time for the event'),
    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('suggesttime')
            .setTitle('Suggest Time');

        const timeInput = new TextInputBuilder()
            .setCustomId('time')
            .setLabel('Time')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const descriptionInput = new TextInputBuilder()
            .setCustomId('description')
            .setLabel('Description')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        const firstActionRow = new ActionRowBuilder().addComponents(timeInput);
        const secondActionRow = new ActionRowBuilder().addComponents(descriptionInput);
        modal.addComponents(firstActionRow, secondActionRow);

        await interaction.showModal(modal);
    }
}