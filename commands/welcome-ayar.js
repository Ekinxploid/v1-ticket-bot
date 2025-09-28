const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'welcome-ayar',
    description: 'Welcome mesajları için kanal ayarla',
    
    async execute(message, args) {
        // Kanal ID'sini args'tan al
        const channelId = args[0];
        
        if (!channelId) {
            return message.reply('❌ Kullanım: `.welcome-ayar #kanal` veya `.welcome-ayar <kanal-id>`');
        }

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
        
        // Welcome channel ID'sini güncelle
        configContent = configContent.replace(
            /welcomeChannelId:\s*'[^']*'/,
            `welcomeChannelId: '${cleanChannelId}'`
        );
        
        fs.writeFileSync(configPath, configContent);

        try {
            // Test welcome mesajı gönder
            const testEmbed = new EmbedBuilder()
                .setTitle('🎉 Welcome Sistemi Aktif!')
                .setDescription(`Welcome mesajları artık ${channel} kanalına gönderilecek.\n\n**Test mesajı:**`)
                .setColor('#808080') // Gri tema
                .setFooter({ text: 'Bu bir test mesajıdır' })
                .setTimestamp();

            await channel.send({ embeds: [testEmbed] });
            
            // Test welcome mesajı fonksiyonunu çağır
            const { sendWelcomeMessage } = require('../index.js');
            await sendWelcomeMessage(message.guild, message.author, 'Test Welcome Mesajı');
            
            await message.reply(`✅ Welcome kanalı başarıyla ${channel} olarak ayarlandı!`);
        } catch (error) {
            console.error('Welcome kanal ayarlama hatası:', error);
            await message.reply('❌ Welcome kanalı ayarlanırken bir hata oluştu! Kanal izinlerini kontrol edin.');
        }
    },
};
