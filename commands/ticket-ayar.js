const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'ticket-ayar',
    description: 'Ticket paneli için kanal ayarla',
    
    async execute(message, args) {
        // Kanal ID'sini args'tan al
        const channelId = args[0];
        const imageUrl = args[1]; // Resim URL'si
        
        if (!channelId) {
            return message.reply('❌ Kullanım: `.ticket-ayar #kanal [resim-url]` veya `.ticket-ayar <kanal-id> [resim-url]`');
        }

        // Kanal ID'sini temizle (<#123456789> formatından 123456789'a)
        const cleanChannelId = channelId.replace(/[<#>]/g, '');
        const channel = message.guild.channels.cache.get(cleanChannelId);
        
        if (!channel) {
            return message.reply('❌ Geçerli bir kanal bulunamadı!');
        }
        
        // Embed oluştur (gri tema)
        const panelEmbed = new EmbedBuilder()
            .setTitle('🎫 Destek Sistemi')
            .setDescription('Aşağıdaki menüden ihtiyacınız olan destek türünü seçin ve ticket açın.')
            .setColor('#808080') // Gri tema
            .addFields(
                {
                    name: '📋 Destek Türleri',
                    value: '• **Satış Öncesi Destek** - Ürün hakkında bilgi almak için\n• **Satış Sonrası Destek** - Satın aldığınız ürünle ilgili yardım için',
                    inline: false
                },
                {
                    name: 'ℹ️ Bilgi',
                    value: 'Ticket açtığınızda sadece siz ve yetkili personel görebilecektir.',
                    inline: false
                }
            )
            .setFooter({ text: 'Destek ekibimiz en kısa sürede size yardımcı olacaktır.' })
            .setTimestamp();

        // Eğer resim URL'si verilmişse embed'e ekle
        if (imageUrl) {
            panelEmbed.setImage(imageUrl);
        }

        // Select menu oluştur
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('ticket_select')
            .setPlaceholder('Destek türünü seçin...')
            .addOptions([
                {
                    label: 'Satış Öncesi Destek',
                    description: 'Ürün hakkında bilgi almak için',
                    value: 'Satış Öncesi Destek',
                    emoji: '🛒'
                },
                {
                    label: 'Satış Sonrası Destek',
                    description: 'Satın aldığınız ürünle ilgili yardım için',
                    value: 'Satış Sonrası Destek',
                    emoji: '🔧'
                },
                {
                    label: 'Log',
                    description: 'Log dosyası veya kayıt talebi için',
                    value: 'Log',
                    emoji: '📋'
                },
                {
                    label: 'Sorun ve Şikayetim Var',
                    description: 'Sorun bildirimi veya şikayet için',
                    value: 'Sorun ve Şikayetim Var',
                    emoji: '⚠️'
                }
            ]);

        const row = new ActionRowBuilder()
            .addComponents(selectMenu);

        try {
            // Panel'i belirtilen kanala gönder
            await channel.send({ 
                embeds: [panelEmbed], 
                components: [row] 
            });

            await message.reply(`✅ Ticket paneli başarıyla ${channel} kanalına gönderildi!`);

        } catch (error) {
            console.error('Panel gönderme hatası:', error);
            await message.reply('❌ Panel gönderilirken bir hata oluştu! Kanal izinlerini kontrol edin.');
        }
    },
};
