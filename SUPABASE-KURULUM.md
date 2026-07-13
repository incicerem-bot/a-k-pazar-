# AçıkPazar — Supabase Kurulumu

## 1) Supabase projesi oluştur

1. Supabase Dashboard'u aç ve hesabına giriş yap.
2. **New project** düğmesine bas.
3. Project name: `acikpazar`
4. Güçlü bir database password belirle ve kaydet.
5. Sana uygun bölgeyi seçip **Create new project** düğmesine bas.

## 2) Veritabanını kur

1. Sol menüden **SQL Editor** bölümünü aç.
2. **New query** düğmesine bas.
3. Bu paketteki `supabase/schema.sql` dosyasını Not Defteri veya VS Code ile aç.
4. Dosyanın tamamını kopyala ve SQL Editor'a yapıştır.
5. **Run** düğmesine bas.
6. `Success` mesajı görünmelidir.

Bu SQL; kullanıcı profilleri, ilanlar, teklifler, favoriler, bildirimler, ödeme/kargo tabloları, RLS güvenlik kuralları, canlı güncelleme ve `auction-images` fotoğraf deposunu oluşturur.

## 3) Proje URL ve publishable key'i al

1. Supabase projesinde üst taraftaki **Connect** düğmesine bas.
2. **Project URL** değerini kopyala.
3. **Publishable key** (`sb_publishable_...`) değerini kopyala.
4. Publishable key görünmüyorsa **Settings > API Keys** bölümüne gir.

**Secret key** veya **service_role key** değerini tarayıcı uygulamasına kesinlikle koyma.

## 4) `.env.local` oluştur

Projenin ana klasöründe `package.json` dosyasının yanında `.env.local` adlı yeni bir dosya oluştur.

İçine şunu yaz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJE_KODUN.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxx
```

Kendi değerlerinle değiştir. Eşittir işaretinden sonra boşluk veya tırnak kullanma.

Windows dosyayı yanlışlıkla `.env.local.txt` yaparsa Dosya Gezgini'nde **Görünüm > Göster > Dosya adı uzantıları** seçeneğini aç ve sondaki `.txt` kısmını sil.

## 5) Uygulamayı başlat

Proje klasöründe Komut İstemi aç ve sırayla çalıştır:

```bash
npm install
npm run dev
```

Tarayıcıdan aç:

```text
http://localhost:3000
```

Doğru bağlandıysa üstte **SUPABASE CANLI** yazısı ve kayıt/giriş ekranı görünür.

## 6) İlk kullanıcıyı oluştur

1. Ad soyad, e-posta ve en az 6 karakterli şifre yaz.
2. **Hesabı oluştur** düğmesine bas.
3. E-posta doğrulaması açıksa gelen bağlantıya tıkla, ardından giriş yap.

Test sırasında doğrulama e-postasıyla uğraşmak istemiyorsan Supabase'de **Authentication > Providers > Email** bölümünden **Confirm email** ayarını geçici olarak kapatabilirsin. Gerçek yayın öncesinde yeniden açmak daha güvenlidir.

## 7) İlk canlı testi yap

1. Birinci hesapla ilan oluştur.
2. Profil ekranından çıkış yap.
3. Başka bir e-posta ile ikinci hesap oluştur.
4. İlk hesaptaki ilana teklif ver.
5. Teklif, ilan fiyatı ve bildirimlerin canlı güncellendiğini kontrol et.

## Sorun çözme

### Uygulama hâlâ DEMO yazıyor

- `.env.local` dosyası `package.json` ile aynı klasörde olmalı.
- Dosya adı `.env.local.txt` olmamalı.
- Terminali `Ctrl + C` ile durdurup `npm run dev` komutunu yeniden çalıştır.

### `relation public.auctions does not exist`

`supabase/schema.sql` henüz çalıştırılmamıştır veya yanlış Supabase projesinde çalıştırılmıştır.

### `new row violates row-level security policy`

Kullanıcı oturumu açık değildir veya SQL dosyasının tamamı çalışmamıştır. SQL Editor'da dosyayı yeniden tek parça çalıştır.

### Fotoğraf yüklenmiyor

Storage bölümünde `auction-images` bucket'ının oluştuğunu kontrol et. Dosya 5 MB'den küçük ve JPG, PNG veya WEBP olmalıdır.
