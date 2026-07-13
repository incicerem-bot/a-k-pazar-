# AçıkPazar MVP — Supabase Canlı Sürüm

Bu paket GitHub → Vercel → Supabase canlı yayın akışı için hazırlanmıştır. Vercel üzerinde `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` değişkenleri tanımlandığında gerçek kullanıcı, ilan, teklif, favori, bildirim ve fotoğraf verileriyle çalışır.

## Hızlı başlangıç

```bash
npm install
npm run dev
```

Tarayıcı: `http://localhost:3000`

Supabase bağlantısı için `SUPABASE-KURULUM.md` dosyasındaki adımları uygula.

## Üretim derlemesi

```bash
npm run build
npm start
```

## Önemli dosyalar

- `app/page.tsx`: uygulama ve Supabase akışları
- `lib/supabase.ts`: tarayıcı Supabase istemcisi
- `supabase/schema.sql`: veritabanı, RLS, RPC, Storage ve Realtime kurulumu
- `.env.example`: gerekli çevre değişkenleri örneği
