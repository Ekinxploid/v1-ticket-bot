# Discord Ticket Bot

Discord.js v14 kullanılarak geliştirilmiş gelişmiş ticket sistemi botu.

## 🚀 Özellikler

- **Ticket Paneli**: Embed içinde görsel ve select menu ile ticket açma
- **4 Farklı Ticket Türü**: Satış Öncesi, Satış Sonrası, Log, Sorun ve Şikayet
- **Otomatik Kanal Oluşturma**: Ticket açıldığında otomatik olarak özel kanal oluşturur
- **Yetki Kontrolü**: Sadece yetkili kullanıcılar ticket yönetimi yapabilir
- **Ticket Yönetimi**: Kapatma ve üstlenme butonları
- **Güvenli Erişim**: Ticket kanalları sadece açan kullanıcı ve yetkililer tarafından görülebilir
- **Log Sistemi**: Tüm ticket işlemleri log kanalına kaydedilir
- **Welcome Sistemi**: Yeni üye geldiğinde dinamik welcome mesajı
- **Gri Tema**: Tüm embedler tutarlı gri tema tasarımı

## 📋 Gereksinimler

- Node.js v16.9.0 veya üzeri
- Discord.js v14
- Discord Bot Token
- Discord Sunucu ID'si

## 🛠️ Kurulum

1. **Projeyi indirin**
   ```bash
   git clone <repository-url>
   cd discord-ticket-bot
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Konfigürasyonu ayarlayın**
   - `config.example.js` dosyasını `config.js` olarak kopyalayın
   - Gerekli bilgileri doldurun:
     ```javascript
     module.exports = {
         token: 'YOUR_BOT_TOKEN_HERE',
         clientId: 'YOUR_BOT_CLIENT_ID_HERE',
         guildId: 'YOUR_GUILD_ID_HERE',
         ticketCategoryId: 'YOUR_TICKET_CATEGORY_ID_HERE',
         staffRoleId: 'YOUR_STAFF_ROLE_ID_HERE'
     };
     ```

4. **Bot'u başlatın**
   ```bash
   npm start
   ```

## 🎯 Komutlar

### `.ticket-ayar #kanal [resim-url]`
Belirtilen kanala ticket panelini gönderir. Panel şunları içerir:
- Embed içinde görsel (opsiyonel resim URL'si)
- Select menu ile destek türü seçimi
- 4 farklı ticket türü:
  - 🛒 Satış Öncesi Destek
  - 🔧 Satış Sonrası Destek
  - 📋 Log
  - ⚠️ Sorun ve Şikayetim Var

### `.welcome-ayar #kanal`
Welcome mesajları için kanal ayarlar. Yeni üye geldiğinde ve ticket açıldığında bu kanala mesaj gönderilir.

### `.log-ayar #kanal`
Ticket logları için kanal ayarlar. Tüm ticket işlemleri bu kanala kaydedilir.

### `.welcome-test [@kullanıcı]`
Welcome mesajını test eder. Belirtilen kullanıcı için test welcome mesajı gönderir.

### `.roller`
Sunucudaki tüm rolleri listeler. Yetkili rol ID'sini bulmak için kullanılır.

## 🔧 Konfigürasyon

### Gerekli ID'ler

1. **Bot Token**: Discord Developer Portal'dan alın
2. **Client ID**: Bot'un uygulama ID'si
3. **Guild ID**: Sunucu ID'si
4. **Ticket Category ID**: Ticket kanallarının oluşturulacağı kategori
5. **Staff Role ID**: Ticket yönetimi yapabilecek rol (`.roller` komutu ile bulun)
6. **Welcome Channel ID**: Welcome mesajlarının gönderileceği kanal
7. **Log Channel ID**: Ticket loglarının gönderileceği kanal
8. **Owner ID**: Bot sahibi ID'si

### Bot İzinleri

Bot'un aşağıdaki izinlere sahip olması gerekir:
- Send Messages
- Manage Channels
- Manage Roles
- Read Message History
- Use Slash Commands

## 📱 Kullanım

### 1. **İlk Kurulum**
```bash
# Bağımlılıkları yükle
npm install

# Bot'u başlat
npm start
```

### 2. **Kanal Ayarları**
```bash
# Ticket paneli oluştur
.ticket-ayar #destek-kanalı
.ticket-ayar #destek-kanalı https://example.com/image.png

# Welcome kanalı ayarla
.welcome-ayar #hoşgeldin-kanalı

# Log kanalı ayarla
.log-ayar #ticket-log-kanalı
```

### 3. **Rol Ayarları**
```bash
# Sunucudaki rolleri listele
.roller

# Config.js dosyasında staffRoleId'yi güncelle
staffRoleId: 'BULDUĞUNUZ_ROL_ID'
```

### 4. **Ticket Kullanımı**
- Paneldeki select menüden destek türünü seçin
- Otomatik olarak `ticket-kullanıcıadı` formatında kanal oluşturulur
- **Kapat**: Ticket'ı kapatır (5 saniye sonra silinir)
- **Üstlen**: Ticket'ı üstlenir

### 5. **Test Komutları**
```bash
# Welcome mesajını test et
.welcome-test
.welcome-test @kullanıcı
```

## 🛡️ Güvenlik

- Ticket kanalları sadece açan kullanıcı ve yetkili personel tarafından görülebilir
- Tüm yönetim işlemleri yetki kontrolü ile korunur
- Kanal silme işlemi 5 saniye gecikme ile yapılır
- Log sistemi ile tüm işlemler kayıt altına alınır

## 🎨 Tasarım

- **Gri Tema**: Tüm embedler tutarlı gri renk paleti (`#808080`)
- **Dinamik Görseller**: Welcome mesajları için API entegrasyonu
- **Responsive Tasarım**: Farklı ekran boyutlarına uyumlu
- **Emoji Kullanımı**: Görsel zenginlik için emoji desteği

## 📝 Notlar

- Bot Discord.js v14 ile uyumludur
- Node.js v16.9.0 veya üzeri gereklidir
- Tüm komutlar prefix (`.`) ile çalışır
- Panel embed'inde görsel URL'si değiştirilebilir
- Log sistemi otomatik kanal bulma özelliği içerir

## 🐛 Sorun Giderme

### Yaygın Hatalar

1. **"Ticket kategorisi bulunamadı"**
   - `config.js` dosyasındaki `ticketCategoryId` değerini kontrol edin

2. **"Bu işlemi yapmak için yetkiniz yok"**
   - `.roller` komutu ile doğru rol ID'sini bulun
   - `config.js` dosyasındaki `staffRoleId` değerini güncelleyin
   - Kullanıcının ilgili role sahip olduğundan emin olun

3. **"Log kanalı bulunamadı"**
   - `.log-ayar #kanal` komutu ile log kanalını ayarlayın
   - Kanal adında "log", "kayıt" veya "ticket-log" kelimesi olsun

4. **"Welcome mesajı gönderilmiyor"**
   - `.welcome-ayar #kanal` komutu ile welcome kanalını ayarlayın
   - Bot'un kanala mesaj gönderme izni olduğundan emin olun

5. **"Bot komutları çalışmıyor"**
   - Bot token'ının doğru olduğundan emin olun
   - Bot'un sunucuda olduğundan emin olun
   - Bot'un gerekli izinlere sahip olduğundan emin olun

## 📄 Lisans

MIT License
