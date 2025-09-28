const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'roller',
    description: 'Sunucudaki tüm rolleri listele',
    
    async execute(message, args) {
        const guild = message.guild;
        const roles = guild.roles.cache
            .filter(role => role.id !== guild.id) // @everyone rolünü hariç tut
            .sort((a, b) => b.position - a.position) // Pozisyona göre sırala
            .map(role => `**${role.name}** - \`${role.id}\``)
            .slice(0, 20); // İlk 20 rolü göster

        const embed = new EmbedBuilder()
            .setTitle('📋 Sunucu Rolleri')
            .setDescription(roles.join('\n'))
            .setColor('#808080')
            .setFooter({ text: 'Yetkili rol ID\'sini kopyalayıp config.js dosyasındaki staffRoleId\'ye yapıştırın' })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    },
};
