const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const config = require('./config.js');

// Bot client'ını oluştur
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Komut koleksiyonu
client.commands = new Collection();

// Bot hazır olduğunda
client.once('ready', () => {
    console.log(`✅ ${client.user.tag} olarak giriş yapıldı!`);
    console.log(`📊 ${client.guilds.cache.size} sunucuda aktif`);
});

// Yeni üye geldiğinde welcome mesajı
client.on('guildMemberAdd', async (member) => {
    await sendWelcomeMessage(member.guild, member.user, 'Yeni üye katıldı!');
});

// Welcome mesajı fonksiyonu
async function sendWelcomeMessage(guild, user, title) {
    try {
        // Kullanıcının sunucuya katılma tarihini al
        const member = await guild.members.fetch(user.id);
        const joinDate = member.joinedAt;
        
        // Sunucu kuruluş tarihi
        const guildCreatedAt = guild.createdAt;

        // Dinamik görsel API URL'si oluştur
        const avatarUrl = user.displayAvatarURL({ extension: 'png', size: 512 });
        const backgroundUrl = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=400&fit=crop&crop=center&auto=format&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
        const welcomeImageUrl = `https://rudsdev.xyz/api/hgbb?avatar=${encodeURIComponent(avatarUrl)}&arkaplan=${encodeURIComponent(backgroundUrl)}&yazi1=${encodeURIComponent('🎉 Hoş Geldin!')}&yazi2=${encodeURIComponent(user.username)}&yazi3=${encodeURIComponent('Sunucuya katıldı')}&baslikhex=808080&usernamehex=ffffff&footerhex=cccccc`;

        // Welcome embed'i oluştur (basit gri tema)
        const welcomeEmbed = new EmbedBuilder()
            .setTitle(`🎉 ${title}`)
            .setDescription(`**Kullanıcı:** ${user}\n**Sunucu:** ${guild.name}`)
            .setColor('#808080') // Gri tema
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setImage(welcomeImageUrl)
            .addFields(
                {
                    name: '📅 Tarih Bilgileri',
                    value: `🏗️ **Sunucu Kuruluş:** <t:${Math.floor(guildCreatedAt.getTime() / 1000)}:F>\n👤 **Katılma Tarihi:** <t:${Math.floor(joinDate.getTime() / 1000)}:F>`,
                    inline: false
                }
            )
            .setFooter({ 
                text: `${guild.name} • ${new Date().toLocaleString('tr-TR')}`,
                iconURL: guild.iconURL({ dynamic: true })
            })
            .setTimestamp();

        // Welcome kanalını bul (önce config'den, sonra otomatik arama)
        let welcomeChannel = null;
        
        if (config.welcomeChannelId && config.welcomeChannelId !== 'YOUR_WELCOME_CHANNEL_ID_HERE') {
            welcomeChannel = guild.channels.cache.get(config.welcomeChannelId);
        }
        
        // Eğer config'de kanal yoksa otomatik bul
        if (!welcomeChannel) {
            welcomeChannel = guild.channels.cache.find(channel => 
                channel.type === ChannelType.GuildText && 
                (channel.name.includes('welcome') || channel.name.includes('genel') || channel.name.includes('hoşgeldin'))
            );
        }

        if (welcomeChannel) {
            await welcomeChannel.send({ 
                content: `🎉 ${user} sunucuya hoş geldin!`,
                embeds: [welcomeEmbed] 
            });
        }
    } catch (error) {
        console.error('Welcome mesajı hatası:', error);
    }
}

// Prefix komut işleyici
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith('.')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error('Komut hatası:', error);
        await message.reply('❌ Komut çalıştırılırken bir hata oluştu!');
    }
});

// Select menu işleyici (ticket açma)
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId === 'ticket_select') {
        const selectedValue = interaction.values[0];
        const member = interaction.member;
        const guild = interaction.guild;

        // Ticket kanalı oluştur
        const channelName = `ticket-${member.user.username}`;
        
        try {
            // Kategori bul
            const category = guild.channels.cache.get(config.ticketCategoryId);
            if (!category) {
                return interaction.reply({ 
                    content: '❌ Ticket kategorisi bulunamadı! Lütfen config.js dosyasını kontrol edin.', 
                    ephemeral: true 
                });
            }

            // Ticket kanalı oluştur
            const ticketChannel = await guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                parent: category,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: member.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                    },
                    {
                        id: config.staffRoleId,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                    }
                ]
            });

            // Ticket embed'i (gri tema)
            const ticketEmbed = new EmbedBuilder()
                .setTitle('🎫 Ticket Açıldı')
                .setDescription(`**Ticket Türü:** ${selectedValue}\n**Açan:** ${member}\n**Tarih:** <t:${Math.floor(Date.now() / 1000)}:F>`)
                .setColor('#808080') // Gri tema
                .setFooter({ text: 'Ticket yönetimi için aşağıdaki butonları kullanın' });

            // Ticket açıldığında sadece log gönder (welcome değil)
            await sendLogMessage(guild, 'Açıldı', member.user, ticketChannel, selectedValue);

            // Yönetim butonları
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('Kapat')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒'),
                    new ButtonBuilder()
                        .setCustomId('claim_ticket')
                        .setLabel('Üstlen')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('👤')
                );

            await ticketChannel.send({ 
                content: `${member}`, 
                embeds: [ticketEmbed], 
                components: [row] 
            });

            await interaction.reply({ 
                content: `✅ Ticket başarıyla oluşturuldu! ${ticketChannel}`, 
                ephemeral: true 
            });

        } catch (error) {
            console.error('Ticket oluşturma hatası:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ 
                    content: '❌ Ticket oluşturulurken bir hata oluştu!', 
                    ephemeral: true 
                });
            } else {
                await interaction.followUp({ 
                    content: '❌ Ticket oluşturulurken bir hata oluştu!', 
                    ephemeral: true 
                });
            }
        }
    }
});

// Buton işleyici (kapat/üstlen)
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const member = interaction.member;
    const guild = interaction.guild;
    const channel = interaction.channel;

    // Yetki kontrolü
    if (!member.roles.cache.has(config.staffRoleId)) {
        return interaction.reply({ 
            content: '❌ Bu işlemi yapmak için yetkiniz yok!', 
            ephemeral: true 
        });
    }

    try {
        if (interaction.customId === 'close_ticket') {
            // Ticket kapatma
            const closeEmbed = new EmbedBuilder()
                .setTitle('🔒 Ticket Kapatıldı')
                .setDescription(`**Kapatıldığı tarih:** <t:${Math.floor(Date.now() / 1000)}:F>\n**Kapatan:** ${member}`)
                .setColor('#808080'); // Gri tema

            await interaction.reply({ embeds: [closeEmbed] });
            
            // Ticket kapatıldığında log gönder
            await sendLogMessage(guild, 'Kapatıldı', interaction.user, channel, 'Bilinmiyor', member);
            
            // 5 saniye sonra kanalı sil
            setTimeout(async () => {
                try {
                    await channel.delete();
                } catch (error) {
                    console.error('Kanal silme hatası:', error);
                }
            }, 5000);

        } else if (interaction.customId === 'claim_ticket') {
            // Ticket üstlenme
            const claimEmbed = new EmbedBuilder()
                .setTitle('👤 Ticket Üstlenildi')
                .setDescription(`**Üstlenen:** ${member}\n**Tarih:** <t:${Math.floor(Date.now() / 1000)}:F>`)
                .setColor('#808080'); // Gri tema

            await interaction.reply({ embeds: [claimEmbed] });
            
            // Ticket üstlenildiğinde log gönder
            await sendLogMessage(guild, 'Üstlenildi', interaction.user, channel, 'Bilinmiyor', member);
        }
    } catch (error) {
        console.error('Buton işleme hatası:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ 
                content: '❌ İşlem gerçekleştirilirken bir hata oluştu!', 
                ephemeral: true 
            });
        }
    }
});

// Komutları yükle
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Log mesajı fonksiyonu
async function sendLogMessage(guild, action, user, ticketChannel, ticketType, staffMember = null) {
    try {
        // Log kanalını bul
        let logChannel = null;
        
        if (config.logChannelId && config.logChannelId !== 'YOUR_LOG_CHANNEL_ID_HERE') {
            logChannel = guild.channels.cache.get(config.logChannelId);
        }
        
        // Eğer config'de kanal yoksa otomatik bul
        if (!logChannel) {
            logChannel = guild.channels.cache.find(channel => 
                channel.type === ChannelType.GuildText && 
                (channel.name.includes('log') || channel.name.includes('kayıt') || channel.name.includes('ticket-log'))
            );
        }

        if (!logChannel) return;

        // Log embed'i oluştur
        const logEmbed = new EmbedBuilder()
            .setTitle(`📋 Ticket ${action}`)
            .setColor(action === 'Açıldı' ? '#00ff00' : '#ff0000')
            .addFields(
                {
                    name: '👤 Kullanıcı',
                    value: `${user} (${user.tag})`,
                    inline: true
                },
                {
                    name: '🎫 Ticket Türü',
                    value: ticketType,
                    inline: true
                },
                {
                    name: '📁 Kanal',
                    value: ticketChannel ? `${ticketChannel}` : 'Silinmiş',
                    inline: true
                },
                {
                    name: '⏰ Tarih',
                    value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
                    inline: true
                }
            )
            .setTimestamp();

        // Eğer kapatma işlemiyse ve staff member varsa ekle
        if (action === 'Kapatıldı' && staffMember) {
            logEmbed.addFields({
                name: '🔒 Kapatan',
                value: `${staffMember} (${staffMember.user.tag})`,
                inline: true
            });
        }

        // Eğer üstlenme işlemiyse ve staff member varsa ekle
        if (action === 'Üstlenildi' && staffMember) {
            logEmbed.addFields({
                name: '👤 Üstlenen',
                value: `${staffMember} (${staffMember.user.tag})`,
                inline: true
            });
        }

        await logChannel.send({ embeds: [logEmbed] });
    } catch (error) {
        console.error('Log mesajı hatası:', error);
    }
}

// sendWelcomeMessage fonksiyonunu export et
module.exports = { sendWelcomeMessage, sendLogMessage };

// Bot'u başlat
client.login(config.token);
