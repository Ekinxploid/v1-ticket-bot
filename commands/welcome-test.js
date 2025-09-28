const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'welcome-test',
    description: 'Welcome mesajını test et',
    
    async execute(message, args) {
        // Test için kullanıcıyı al (args'tan veya mesajı gönderen)
        let targetUser = message.author;
        
        if (args[0]) {
            // Mention veya ID ile kullanıcı belirtilmişse
            const userId = args[0].replace(/[<@!>]/g, '');
            try {
                targetUser = await message.client.users.fetch(userId);
            } catch (error) {
                return message.reply('❌ Geçerli bir kullanıcı bulunamadı!');
            }
        }

        try {
            // Test welcome mesajı gönder
            const { sendWelcomeMessage } = require('../index.js');
            await sendWelcomeMessage(message.guild, targetUser, 'Test Welcome Mesajı');
            
            await message.reply(`✅ ${targetUser} için test welcome mesajı gönderildi!`);
        } catch (error) {
            console.error('Welcome test hatası:', error);
            await message.reply('❌ Test welcome mesajı gönderilirken bir hata oluştu!');
        }
    },
};