const { SlashCommandBuilder, ComponentType, Client, roleMention, AllowedMentionsTypes } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event')
        .setDescription('Creates an Event')
        .addStringOption(option =>
            option
                .setName('title')
                .setDescription('The Title of the Event')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('month')
                .setDescription('The Month of the Event')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('day')
                .setDescription('The Day of the Event')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('time')
                .setDescription('Written as HH:MM')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('description')
                .setDescription('The Description of the Event')
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option
                .setName('year')
                .setDescription('Uses the current year if left blank')
                .setRequired(false)
        ),

    async execute(interaction) {
        const year = interaction.options.getInteger('year') || new Date().getFullYear();
        const month = interaction.options.getInteger('month');
        const day = interaction.options.getInteger('day');
        const time = interaction.options.getString('time');

        const timestamp = timemaker(year, month, day, time);
        var role = interaction.guild.roles.cache.find(role => role.name === 'Event Notification');
        // if no role exists, create one
        if (!role) {
            console.log('Cant find role, creating one...');
            await interaction.guild.roles.create({ name: 'Event Notification', color: 'Yellow', mentionable: true, reason: 'Event Notification' });
            role = interaction.guild.roles.cache.find(role => role.name === 'Event Notification');
        }

        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('attend')
                    .setLabel('Attend')
                    .setStyle(ButtonStyle.Success),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('unattend')
                    .setLabel('Unattend')
                    .setStyle(ButtonStyle.Danger),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('event-notify')
                    .setLabel('Get Notified')
                    .setStyle(ButtonStyle.Secondary),
            );

        await interaction.reply({ content: `${roleMention(role.id)}`, embeds: [makeEmbed(interaction, timestamp)], components: [actionRow], allowedMentions: { parse: ['roles'], repliedUser: false } });
    }
}

function timemaker(year, month, day, time) {
    const dateStr = `${year}-${('0' + (month)).slice(-2)}-${('0' + day).slice(-2)}T${time.split(':')[0]}:${time.split(':')[1]}`;
    const date = new Date(Date.parse(dateStr));
    console.log(date);
    return `<t:${Math.floor(date.getTime() / 1000)}>`;
}

function makeEmbed(interaction, timestamp) {
    const embed = new EmbedBuilder()
        .setTitle(interaction.options.getString('title'))
        .setDescription(interaction.options.getString('description'))
        .setFooter({ text: "Want to get notified when a new event happens? Press 'Get Notified'" })
        .addFields(
            { name: 'Time:', value: `${timestamp}`, inline: true },
            { name: 'Organizer:', value: `${interaction.user}`, inline: true },
            { name: 'Attendees:', value: 'None' },
        )
        .setColor(0xDA70D6);
    return embed;
}


