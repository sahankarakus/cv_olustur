# 🚀 CVita - Her Meslek İçin Ücretsiz & ATS Uyumlu CV Stüdyosu

**CVita**, sadece yazılımcılar için değil; **avukatlar, doktorlar, sağlık çalışanları, satış uzmanları, yeni mezunlar, finansçılar ve tasarımcılar** dahil her meslek grubunun saniyeler içinde ATS tarayıcılarına %100 uyumlu, profesyonel özgeçmişler hazırlamasını sağlayan **sıfır sunucu (zero-backend)** maliyetli modern bir web uygulamasıdır.

---

## 🌟 Öne Çıkan Gelişmiş Özellikler

### 1. 🎯 7 Farklı Sektör İçin Hazır Örnek Profiller
Tek tıkla sektörünüze özel terminoloji, unvan ve yetkinlikleri yükleyin:
- 💻 **Yazılım & Bilişim:** Mikroservis, Bulut, CI/CD, Frontend/Backend
- ⚖️ **Hukuk & Avukatlık:** Baro Sicil No, M&A Danışmanlığı, KVKK, Ticaret Hukuku, Dava Dosyaları
- 🏥 **Sağlık & Tıp:** Tescil No, Klinik Deneyim, Yoğun Bakım, ACLS Sertifikası, Poliklinik
- 💼 **Satış & Pazarlama:** Satış Kotaları, Gelir Yönetimi (ARR), Churn Azaltma, B2B Müzakere
- 🎓 **Yeni Mezun & Öğrenci:** Eğitim en üstte, Kulüp Liderlikleri, Stajlar, Vaka Analizleri, GNO
- 📊 **Finans & Muhasebe:** SMMM Ruhsatı, IFRS Standartları, Bütçe & Varyans, SAP FI/CO
- 🎨 **Tasarım & Mimarlık:** Konsept Tasarım, Revit/BIM, 3D Görselleştirme, Şantiye, Portfolyo

### 2. 🏛️ 4 Profesyonel Şablon
- **Klasik ATS (Ivy League):** Harvard/Oxford ve uluslararası kurumsal şirketlerin 1 numaralı tercihi (Arial/Serif, kompakt, net yatay çizgiler, tarihler sağda, 100% ATS garantisi).
- **Kurumsal ATS:** Resmi tek sütunlu ve keskin bölücülü kurumsal düzen.
- **Modern:** İki sütunlu, görsel sol kenar çubuğu, rozet etiketler ve renk temalı.
- **Minimalist:** Şık editoryal tipografi ve ferah beyaz alanlar.

### 3. 🔀 Dinamik Bölüm Sıralama & Yeniden Adlandırma
- Her bölümün yanında yer alan **▲ / ▼** butonları ile bölümlerin sırasını dilediğiniz gibi değiştirin (Örn: Yeni mezunlar **Eğitim**i en üste alabilir).
- **✏️ Başlık Düzenleme:** Bölüm başlıklarını mesleğinize göre özelleştirin (*"İş Deneyimi"* yerine *"Klinik Deneyim"* veya *"Projeler"* yerine *"Önemli Davalar"*).

### 4. 🌐 Tek Tıkla TR ⟷ EN Dil Desteği
- Yurt dışı başvuruları için tek tıkla başlıkları ve tarih formatını İngilizceye çevirin (`Work Experience`, `Education`, `Present` vb.).

### 5. 📊 Canlı ATS Uyumluluk Puanlayıcısı (0-100)
- Yazdığınız metindeki ölçülebilir metrikleri (% oranlar, rakamlar, bütçe), güçlü aksiyon fiillerini ve iletişim bilgilerini anlık tarayarak ATS puanınızı hesaplar ve tavsiyeler sunar.

### 6. 📐 "Sayfaya Sığdır" Kompaktlık Ayarı
- Tek tıkla kenar boşluklarını ve satır aralıklarını daraltarak içeriği 1 A4 sayfasına kilitler (*Kompakt*, *Normal*, *Ferah* modları).

### 7. 🔗 Sunucusuz (Zero-Backend) URL ile Paylaşma & QR Kod
- CV verileriniz URL hash'ine (`#cv=...`) şifrelenir. Karşı tarafa gönderdiğinizde hiçbir sunucuya veya veritabanına ihtiyaç duymadan CV'nizi anında açar. Otomatik mobil karekod üretilir.

### 8. ⚡ PWA (Çevrimdışı Çalışma)
- Masaüstü veya telefonunuza uygulama gibi yüklenebilir; metroda veya internetsizken dahi CV düzenleyebilirsiniz.

---

## ☁️ Cloudflare Pages ile Ücretsiz Subdomain Yayını (`cv.siteniz.com`)

Bu proje **%100 Client-Side** (yalnızca HTML, CSS, Vanilla JS) olduğu için hiçbir sunucu veya backend gerektirmez. Cloudflare üzerinde ömür boyu **0 TL** maliyetle yayınlayabilirsiniz:

### Adım Adım Kurulum Rehberi:

1. **Projeyi GitHub'a Yükleyin:**
   ```bash
   git add .
   git commit -m "feat: CVZirve v2 yayına hazır"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADINIZ/cv_olusturucu.git
   git push -u origin main
   ```

2. **Cloudflare Pages'e Bağlayın:**
   - [Cloudflare Dashboard](https://dash.cloudflare.com)'a girin.
   - Sol menüden **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git** adımlarını izleyin.
   - `cv_olusturucu` deponuzu seçin.
   - **Build settings:**
     - Framework preset: `None`
     - Build command: *(Boş bırakın)*
     - Build output directory: `.` *(kök dizin)*
   - **Save and Deploy** butonuna tıklayın. Siteniz 10 saniye içinde `*.pages.dev` üzerinde yayına girer.

3. **Özel Subdomain Bağlama (`cv.siteniz.com`):**
   - Cloudflare Pages projenizin içinden **Custom domains** sekmesine girin.
   - **Set up a custom domain** butonuna basarak `cv.alanadiniz.com` yazın.
   - Alan adınız zaten Cloudflare'de olduğu için DNS CNAME kaydı tek tıkla **otomatik olarak** tanımlanır ve SSL sertifikası anında aktif olur!

---

## 📁 Proje Dosya Yapısı

```
cv_olusturucu/
├── index.html              # Ana UI, 4 şablon ve modal diyalogları
├── manifest.json           # PWA uygulama tanımlayıcısı
├── sw.js                   # Çevrimdışı Service Worker önbelleklemesi
├── README.md               # Proje ve Cloudflare kurulum rehberi
├── css/
│   ├── main.css            # Tasarım sistemi, dark UI, modaller ve renkler
│   ├── editor.css          # Form paneli, sıralama butonları ve kartlar
│   ├── preview.css         # Canlı A4 kağıt sahnesi ve zoom araç çubuğu
│   ├── templates.css       # Ivy League, Modern, ATS ve Minimal stilleri
│   └── print.css           # Vektörel A4 PDF çıktı kuralları (@media print)
└── js/
    ├── sample-data.js      # 7 sektör için hazır veriler ve aksiyon fiilleri
    ├── templates.js        # Şablon render motoru ve dil sözlüğü
    ├── export.js           # PDF yazdırma ve JSON içe/dışa aktarım
    └── app.js              # Durum yönetimi, sıralama, ATS puanlayıcı ve paylaşım
```

---

## 📄 Lisans
MIT Lisansı - Açık kaynaklı ve tamamen ücretsizdir.
