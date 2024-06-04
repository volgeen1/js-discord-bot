const { Events, Client, ModalBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId === 'suggesttime') {
            const time = interaction.fields.getTextInputValue('time');
            const description = interaction.fields.getTextInputValue('description');
            console.log(time, description);

            await interaction.reply({ content: 'Thank you for your suggestion!', ephemeral: true });
        }
    }
}