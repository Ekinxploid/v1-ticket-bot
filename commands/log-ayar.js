const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'log-ayar',
    description: 'Log mesajları için kanal ayarla',
    
    async execute(message, args) {
        // Kanal ID'sini args'tan al
        const channelId = args[0];
        
        // Kanal ID'sini temizle (<#123456789> formatından 123456789'a)
        const cleanChannelId = channelId.replace(/[<#>]/g, '');
        const channel = message.guild.channels.cache.get(cleanChannelId);
        
        if (!channel) {
            return message.reply('❌ Geçerli bir kanal bulunamadı!');
        }

        // Config dosyasını güncelle
        const fs = require('fs');
        const configPath = './config.js';
        let configContent = fs.readFileSync(configPath, 'utf8');
        
        // Log channel ID'sini güncelle
        configContent = configContent.replace(
            /logChannelId:\s*'[^']*'/,
            `logChannelId: '${cleanChannelId}'`
        );
        
        fs.writeFileSync(configPath, configContent);

        try {
            // Test log mesajı gönder
            const testEmbed = new EmbedBuilder()
                .setTitle('📋 Log Sistemi Aktif!')
                .setDescription(`Ticket logları artık ${channel} kanalına gönderilecek.\n\n**Test mesajı:**`)
                .setColor('#808080') // Gri tema
                .setFooter({ text: 'Bu bir test mesajıdır' })
                .setTimestamp();

            await channel.send({ embeds: [testEmbed] });
            
            // Test log mesajı fonksiyonunu çağır
            const { sendLogMessage } = require('../index.js');
            await sendLogMessage(message.guild, 'Test', message.author, channel, 'Test Log');
            
            await message.reply(`✅ Log kanalı başarıyla ${channel} olarak ayarlandı!`);
        } catch (error) {
            console.error('Log kanal ayarlama hatası:', error);
            await message.reply('❌ Log kanalı ayarlanırken bir hata oluştu! Kanal izinlerini kontrol edin.');
        }
    },
};
