/**
 * CVZirve - 7 Farklı Sektör İçin Zengin ve Gerçekçi Profil Verileri
 * Her meslek grubuna özel terminoloji, unvan ve yetkinlikler içerir.
 */

const SECTOR_PROFILES = {
    // 1. YAZILIM & BİLİŞİM (Software & Tech)
    tech: {
        id: "tech",
        name: "Yazılım & Bilişim",
        icon: "💻",
        personal: {
            fullName: "Adınız Soyadınız",
            title: "Kıdemli Tam Yığın Yazılım Geliştirici",
            email: "ornek@ornek.com",
            phone: "0555 555 55 55",
            location: "Kadıköy, İstanbul",
            website: "ornek.com",
            linkedin: "linkedin.com/in/kullaniciadi",
            github: "github.com/kullaniciadi",
            photo: ""
        },
        sectionTitles: {
            summary: "Profesyonel Özet",
            experience: "İş Deneyimi",
            education: "Eğitim",
            skills: "Teknik Yetkinlikler",
            projects: "Önemli Projeler",
            certificates: "Sertifikalar",
            languages: "Diller"
        },
        sectionOrder: ["summary", "experience", "education", "skills", "projects", "certificates", "languages"],
        summary: "6 yılı aşkın deneyime sahip, ölçeklenebilir bulut mimarileri ve modern web uygulamaları geliştirmede uzman Kıdemli Yazılım Mühendisi. Günlük 2M+ istek alan mikroservis altyapılarını optimize etmiş, çevik takım liderliği ve CI/CD otomasyonunda kanıtlanmış başarı geçmişi.",
        experience: [
            {
                id: "exp-1",
                role: "Kıdemli Yazılım Mühendisi",
                company: "TechNova Çözümleri A.Ş.",
                location: "İstanbul (Hibrit)",
                startDate: "2022-03",
                endDate: "",
                current: true,
                description: "• Node.js ve Redis önbellekleme optimizasyonları ile API yanıt sürelerini %35 oranında düşürdüm.\n• 6 kişilik yazılım geliştirme ekibine teknik mentorluk sağladım ve haftalık kod inceleme süreçlerini yönettim.\n• CI/CD pipeline'larını GitHub Actions ve Docker ile otomatikleştirerek dağıtım süresini 40 dakikadan 6 dakikaya indirdim."
            },
            {
                id: "exp-2",
                role: "Yazılım Geliştirici",
                company: "Dijital Piksel Bilişim",
                location: "İstanbul",
                startDate: "2019-08",
                endDate: "2022-02",
                current: false,
                description: "• React.js, TypeScript ve TailwindCSS kullanarak e-ticaret platformunun ön yüzünü sıfırdan inşa ettim.\n• Web Vitals ve SEO optimizasyonları ile Google Lighthouse performans puanını 62'den 96'ya yükselttim."
            }
        ],
        education: [
            {
                id: "edu-1",
                school: "İstanbul Teknik Üniversitesi",
                degree: "Lisans",
                field: "Bilgisayar Mühendisliği",
                startDate: "2014-09",
                endDate: "2018-06",
                gpa: "3.68 / 4.00",
                description: "Bölüm ikinciliği, Dağıtık Sistemler ve Yapay Zekaya Giriş odaklı bitirme tezi."
            }
        ],
        skills: ["JavaScript / TypeScript", "React.js & Next.js", "Node.js", "Python", "PostgreSQL", "Docker", "AWS Cloud", "Git & CI/CD", "Mikroservisler"],
        languages: [{ name: "Türkçe", level: "Anadil" }, { name: "İngilizce", level: "C1 - Profesyonel Çalışma Dili" }],
        projects: [
            { id: "prj-1", title: "DevPulse - Açık Kaynak Sistem İzleme", link: "github.com/kullaniciadi/proje", description: "Mikroservisler için gecikme metriği toplayan açık kaynaklı gösterge paneli. 1.400+ GitHub yıldızı." }
        ],
        certificates: [
            { id: "cert-1", title: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", date: "2023" }
        ]
    },

    // 2. HUKUK & DANIŞMANLIK (Law & Legal)
    law: {
        id: "law",
        name: "Hukuk & Avukatlık",
        icon: "⚖️",
        personal: {
            fullName: "Adınız Soyadınız",
            title: "Ticaret & Şirketler Hukuku Avukatı",
            email: "ornek@ornek.com",
            phone: "0555 555 55 55",
            location: "Çankaya, Ankara",
            website: "ornek.com",
            linkedin: "linkedin.com/in/kullaniciadi",
            github: "", // Hukukta gerekmez, boş
            photo: ""
        },
        sectionTitles: {
            summary: "Mesleki Profil",
            experience: "Mesleki Deneyim & Dava Geçmişi",
            education: "Hukuk Eğitimi",
            skills: "Uzmanlık Alanları & Baro Bilgisi",
            projects: "Önemli Dava & Sözleşme Dosyaları",
            certificates: "Ruhsat & Sertifikalar",
            languages: "Yabancı Diller"
        },
        sectionOrder: ["summary", "experience", "education", "skills", "projects", "certificates", "languages"],
        summary: "Ankara Barosu'na kayıtlı (Sicil No: 34892), 7 yılı aşkın süredir Şirketler Hukuku, Ticari Sözleşmeler ve KVKK uyum süreçlerinde danışmanlık veren uzman avukat. Ulusal ve uluslararası 40'tan fazla şirketin birleşme/devralma (M&A) süreçlerini, ticari uyuşmazlık arabuluculuklarını başarıyla yönetmiştir.",
        experience: [
            {
                id: "exp-1",
                role: "Kıdemli Avukat / Hukuk Müşaviri",
                company: "Kaya & Ortakları Hukuk Bürosu",
                location: "Ankara",
                startDate: "2020-01",
                endDate: "",
                current: true,
                description: "• 15+ kurumsal şirketin yıllık genel kurul, sözleşme hazırlama ve risk analizi süreçlerini idare ettim.\n• Toplam değeri 80M+ TL olan 6 adet birleşme ve devralma (M&A) dosyasında hukuki inceleme (Due Diligence) liderliği yaptım.\n• Şirketlerin KVKK ve e-ticaret regülasyonlarına %100 uyumunu sağlayan iç denetim kılavuzlarını hazırladım."
            },
            {
                id: "exp-2",
                role: "Avukat",
                company: "Demir Hukuk & Danışmanlık",
                location: "Ankara",
                startDate: "2017-10",
                endDate: "2019-12",
                current: false,
                description: "• Ticaret Mahkemeleri ve İş Mahkemelerinde 120'den fazla duruşmaya bilfiil katıldım; %82 oranında müvekkil lehine sonuç elde ettim.\n• Fikri mülkiyet ve marka tescili itiraz dosyalarını Türk Patent ve Marka Kurumu nezdinde takip ettim."
            }
        ],
        education: [
            {
                id: "edu-1",
                school: "Ankara Üniversitesi Hukuk Fakültesi",
                degree: "Lisans",
                field: "Hukuk",
                startDate: "2012-09",
                endDate: "2016-06",
                gpa: "3.72 / 4.00",
                description: "Onur Derecesi, Uluslararası Ticaret Hukuku ve Tahkim kürsüsü araştırma asistanlığı."
            }
        ],
        skills: ["Ankara Barosu (Sicil: 34892)", "Şirketler & Ticaret Hukuku", "Sözleşmeler Hukuku", "KVKK & GDPR Uyumu", "İş Hukuku Uyuşmazlıkları", "Arabuluculuk", "Tahkim (İSTAC)", "M&A Hukuki İnceleme"],
        languages: [{ name: "Türkçe", level: "Anadil" }, { name: "İngilizce", level: "C1 - Hukuki İngilizce (ILEC Sertifikalı)" }],
        projects: [
            { id: "prj-1", title: "TechStart A.Ş. 25M$ Yatırım Turu Hukuki Danışmanlığı", link: "", description: "Yatırım sözleşmeleri, hissedarlar sözleşmesi (SHA) ve pay devir protokollerinin müzakeresi ve tescili." }
        ],
        certificates: [
            { id: "cert-1", title: "Adalet Bakanlığı Resmi Arabuluculuk Belgesi", issuer: "T.C. Adalet Bakanlığı", date: "2021" },
            { id: "cert-2", title: "Avukatlık Ruhsatnamesi", issuer: "Türkiye Barolar Birliği", date: "2017" }
        ]
    },

    // 3. SAĞLIK & TIP (Healthcare & Medical)
    health: {
        id: "health",
        name: "Sağlık & Tıp",
        icon: "🏥",
        personal: {
            fullName: "Adınız Soyadınız",
            title: "İç Hastalıkları (Dahiliye) Uzmanı",
            email: "ornek@ornek.com",
            phone: "0555 555 55 55",
            location: "Şişli, İstanbul",
            website: "ornek.com",
            linkedin: "linkedin.com/in/kullaniciadi",
            github: "",
            photo: ""
        },
        sectionTitles: {
            summary: "Mesleki Profil",
            experience: "Klinik & Hastane Deneyimi",
            education: "Tıp Eğitimi & Uzmanlık",
            skills: "Klinik Yetkinlikler & Sertifikalar",
            projects: "Akademik Yayınlar & Çalışmalar",
            certificates: "Mesleki Kurs & Lisanslar",
            languages: "Diller"
        },
        sectionOrder: ["summary", "experience", "education", "skills", "projects", "certificates", "languages"],
        summary: "T.C. Sağlık Bakanlığı tescilli (Tescil No: 142859), 8 yıllık klinik ve yataklı servis tecrübesine sahip İç Hastalıkları Uzmanı. Diyabet yönetimi, hipertansiyon, metabolik sendrom ve geriatrik hasta takibinde kapsamlı poliklinik ve yoğun bakım deneyimi.",
        experience: [
            {
                id: "exp-1",
                role: "Uzm. Dr. - İç Hastalıkları",
                company: "İstanbul Florence Nightingale Hastanesi",
                location: "İstanbul",
                startDate: "2021-06",
                endDate: "",
                current: true,
                description: "• Ayda ortalama 450+ poliklinik hastasının tanı ve tedavi protokollerini başarıyla yürüttüm.\n• Dahiliye Yoğun Bakım Ünitesi'nde kritik hasta takibi ve multi-disipliner konsey süreçlerini koordine ettim.\n• Diyabetik hastalarda yaşam tarzı ve insülin uyumunu %40 artıran hasta eğitim programını başlattım."
            },
            {
                id: "exp-2",
                role: "İç Hastalıkları Asistan Doktoru",
                company: "İstanbul Üniversitesi Çapa Tıp Fakültesi Hastanesi",
                location: "İstanbul",
                startDate: "2016-09",
                endDate: "2021-04",
                current: false,
                description: "• Genel Dahiliye, Nefroloji, Endokrinoloji ve Hematoloji servislerinde rotasyonları tamamladım.\n• Acil Servis triyaj ve resüsitasyon süreçlerinde aktif görev alarak 1.000+ kritik hastaya müdahale ettim."
            }
        ],
        education: [
            {
                id: "edu-1",
                school: "İstanbul Üniversitesi İstanbul (Çapa) Tıp Fakültesi",
                degree: "Tıpta Uzmanlık (TUS)",
                field: "İç Hastalıkları Anabilim Dalı",
                startDate: "2016-09",
                endDate: "2021-04",
                gpa: "",
                description: "Tez Konusu: Tip 2 Diyabet Hastalarında Mikroalbüminüri ile Kardiyovasküler Risk Faktörleri Korelasyonu."
            },
            {
                id: "edu-2",
                school: "Hacettepe Üniversitesi Tıp Fakültesi (İngilizce)",
                degree: "Lisans / Tıp Doktoru (MD)",
                field: "Tıp",
                startDate: "2010-09",
                endDate: "2016-06",
                gpa: "3.80 / 4.00",
                description: "Dönem üçüncüsü olarak mezuniyet."
            }
        ],
        skills: ["Tescil No: 142859", "Kronik Hastalık Yönetimi", "Tip 1 & Tip 2 Diyabet", "Hipertansiyon & Dislipidemi", "Gastrointestinal Tanı", "İleri Yaşam Desteği (ACLS)", "Hasta İletişimi", "Tıbbi Etik & Malpraktis Önleme"],
        languages: [{ name: "Türkçe", level: "Anadil" }, { name: "İngilizce", level: "C2 - İleri Seviye (Tıbbi Literatür & Sunum)" }],
        projects: [
            { id: "prj-1", title: "Metabolik Sendrom Erken Tanı Algoritması Çalışması", link: "", description: "Uluslararası hakemli Türk Tıp Dergisi'nde yayınlanan 120 hastalı prospektif klinik çalışma (Ortak Yazar)." }
        ],
        certificates: [
            { id: "cert-1", title: "İleri Kardiyak Yaşam Desteği (ACLS) Sertifikası", issuer: "Resüsitasyon Derneği", date: "2022" },
            { id: "cert-2", title: "Klinik Ultrasonografi (FAST & Abdomen) Eğitimi", issuer: "İç Hastalıkları Uzmanlık Derneği", date: "2020" }
        ]
    },

    // 4. SATIŞ & PAZARLAMA (Sales, Marketing & Business Development)
    sales: {
        id: "sales",
        name: "Satış & Pazarlama",
        icon: "💼",
        personal: {
            fullName: "Adınız Soyadınız",
            title: "Kıdemli Satış & İş Geliştirme Yöneticisi",
            email: "ornek@ornek.com",
            phone: "0555 555 55 55",
            location: "Ataşehir, İstanbul",
            website: "",
            linkedin: "linkedin.com/in/kullaniciadi",
            github: "",
            photo: ""
        },
        sectionTitles: {
            summary: "Profesyonel Özet",
            experience: "Satış & İş Geliştirme Deneyimi",
            education: "Eğitim",
            skills: "Satış & Pazarlama Yetkinlikleri",
            projects: "Başarılı Satış Kampanyaları & Projeler",
            certificates: "Sertifikalar",
            languages: "Diller"
        },
        sectionOrder: ["summary", "experience", "education", "skills", "projects", "certificates", "languages"],
        summary: "B2B SaaS ve teknoloji satışında 8 yılı aşkın kanıtlanmış başarı geçmişine sahip Kıdemli Satış Yöneticisi. Kurumsal müşteri portföyünü sıfırdan oluşturarak yıllık satış kotalarını istikrarlı şekilde %130+ gerçekleştiren, 10 kişilik satış ekibini yönetmiş iş geliştirme lideri.",
        experience: [
            {
                id: "exp-1",
                role: "Kurumsal Satış Müdürü",
                company: "BulutCloud Yazılım A.Ş.",
                location: "İstanbul",
                startDate: "2021-04",
                endDate: "",
                current: true,
                description: "• Yıllık 4.2M$ yeni kurumsal satış (ARR) kotasını %142 oranında aşarak şirket rekoru kırdım.\n• Türkiye'nin en büyük 500 şirketinden 18 kurumsal holdingi portföye katarak churn oranını %1.8'e düşürdüm.\n• 8 kişilik Inside Sales ve Saha Satış ekibini yönettim, yeni satış elemanı oryantasyon süresini 3 aydan 4 haftaya indirdim."
            },
            {
                id: "exp-2",
                role: "B2B Satış Yöneticisi",
                company: "Global Lojistik Çözümleri",
                location: "İstanbul",
                startDate: "2017-09",
                endDate: "2021-03",
                current: false,
                description: "• 80+ KOBİ ve orta ölçekli firmanın sözleşme müzakerelerini yöneterek yıllık ciroya 15M TL katkı sağladım.\n• Salesforce CRM geçişini yöneterek satış hunisi (pipeline) görünürlüğünü %80 artırdım."
            }
        ],
        education: [
            {
                id: "edu-1",
                school: "Boğaziçi Üniversitesi",
                degree: "Lisans",
                field: "İktisat / Ekonomi",
                startDate: "2013-09",
                endDate: "2017-06",
                gpa: "3.52 / 4.00",
                description: "Pazarlama ve Davranışsal İktisat Kulübü Başkanlığı."
            }
        ],
        skills: ["B2B Kurumsal Satış", "Pipeline & Gelir Yönetimi", "Sözleşme Müzakeresi", "Salesforce & HubSpot CRM", "Pazar Araştırması", "Müşteri Sadakati (Retention)", "Sunum & İkna Kabiliyeti", "Ekip Liderliği"],
        languages: [{ name: "Türkçe", level: "Anadil" }, { name: "İngilizce", level: "C1 - Akıcı İş Dili" }],
        projects: [
            { id: "prj-1", title: "Enterprise SaaS Go-To-Market Stratejisi", link: "", description: "Yeni ERP modülünün lansmanında ilk 6 ayda 45 kurumsal anlaşma sağlayan satış stratejisinin oluşturulması." }
        ],
        certificates: [
            { id: "cert-1", title: "HubSpot Inbound Sales Certified", issuer: "HubSpot Academy", date: "2023" },
            { id: "cert-2", title: "Stratejik Müzakere Teknikleri Eğitimi", issuer: "BMI Business School", date: "2021" }
        ]
    },

    // 5. YENİ MEZUN / ÖĞRENCİ (Student / New Graduate)
    student: {
        id: "student",
        name: "Yeni Mezun & Öğrenci",
        icon: "🎓",
        personal: {
            fullName: "Adınız Soyadınız",
            title: "Endüstri Mühendisi / Yönetici Adayı (MT)",
            email: "ornek@ornek.com",
            phone: "0555 555 55 55",
            location: "Beşiktaş, İstanbul",
            website: "",
            linkedin: "linkedin.com/in/kullaniciadi",
            github: "github.com/kullaniciadi",
            photo: ""
        },
        sectionTitles: {
            summary: "Kariyer Hedefi",
            education: "Eğitim Bilgileri", // Yeni mezunda Eğitim en üstte!
            experience: "Staj Deneyimleri",
            projects: "Bitirme Projeleri & Vaka Analizleri",
            skills: "Yetkinlikler & Araçlar",
            certificates: "Sertifikalar & Kulüp Faaliyetleri",
            languages: "Yabancı Diller"
        },
        sectionOrder: ["summary", "education", "experience", "projects", "skills", "certificates", "languages"],
        summary: "İstanbul Teknik Üniversitesi Endüstri Mühendisliği'nden 3.74 GNO ve yüksek onur derecesiyle mezun, veri analitiği, tedarik zinciri optimizasyonu ve süreç iyileştirme alanlarında tutkulu yeni mezun mühendis. FMCG ve e-ticaret sektörlerinde iki kapsamlı stajı başarıyla tamamlamıştır.",
        education: [
            {
                id: "edu-1",
                school: "İstanbul Teknik Üniversitesi (İTÜ)",
                degree: "Lisans",
                field: "Endüstri Mühendisliği",
                startDate: "2020-09",
                endDate: "2024-06",
                gpa: "3.74 / 4.00 (Yüksek Onur)",
                description: "Bitirme Tezi: E-Ticaret Depo Operasyonlarında Genetik Algoritma ile Rota ve Sipariş Toplama Optimizasyonu."
            }
        ],
        experience: [
            {
                id: "exp-1",
                role: "Tedarik Zinciri Uzun Dönem Stajyeri",
                company: "Unilever Türkiye",
                location: "İstanbul",
                startDate: "2023-10",
                endDate: "2024-05",
                current: false,
                description: "• Talep tahmin modellerinde Power BI gösterge paneli geliştirerek stok tutma maliyetlerinde %7 azalma simüle ettim.\n• Haftalık fabrika sevkiyat verilerini Python ile temizleyip otomatik raporlama pipeline'ı kurdum."
            },
            {
                id: "exp-2",
                role: "Süreç İyileştirme Stajyeri",
                company: "Hepsiburada",
                location: "Kocaeli (Operasyon Merkezi)",
                startDate: "2023-06",
                endDate: "2023-09",
                current: false,
                description: "• Depo paketleme istasyonlarında Kaizen ve 5S metodolojisi uygulayarak istasyon başına çevrim süresini %12 düşürdüm."
            }
        ],
        projects: [
            { id: "prj-1", title: "İTÜ Endüstri Mühendisliği Kulübü Vaka Analizi 1.liği", link: "", description: "Türkiye geneli 80 üniversite takımının yarıştığı sürdürülebilir lojistik vaka analizinde 1.'lik ödülü." }
        ],
        skills: ["Veri Analitiği (Python, SQL)", "Power BI & Tableau", "Süreç İyileştirme (Lean / 5S / Kaizen)", "MS Excel (İleri Düzey, VBA)", "Simülasyon (Arena)", "Problem Çözme", "Takım Çalışması"],
        languages: [{ name: "Türkçe", level: "Anadil" }, { name: "İngilizce", level: "C1 - TOEFL IBT: 104" }, { name: "Almanca", level: "A2 - Temel" }],
        certificates: [
            { id: "cert-1", title: "Google Data Analytics Professional Certificate", issuer: "Coursera / Google", date: "2024" },
            { id: "cert-2", title: "Yalın Altı Sigma Sarı Kuşak", issuer: "İTÜ Kalite Kulübü", date: "2023" }
        ]
    },

    // 6. FİNANS & MUHASEBE (Finance, Accounting & Banking)
    finance: {
        id: "finance",
        name: "Finans & Muhasebe",
        icon: "📊",
        personal: {
            fullName: "Adınız Soyadınız",
            title: "Kıdemli Finansal Analist / Mali Müşavir (SMMM)",
            email: "ornek@ornek.com",
            phone: "0555 555 55 55",
            location: "Levent, İstanbul",
            website: "",
            linkedin: "linkedin.com/in/kullaniciadi",
            github: "",
            photo: ""
        },
        sectionTitles: {
            summary: "Profesyonel Özet",
            experience: "Finans & Muhasebe Deneyimi",
            education: "Eğitim",
            skills: "Mali Yetkinlikler & Belgeler",
            projects: "Bütçe & Denetim Projeleri",
            certificates: "Mesleki Lisanslar",
            languages: "Diller"
        },
        sectionOrder: ["summary", "experience", "education", "skills", "projects", "certificates", "languages"],
        summary: "SMMM ruhsatına sahip, 7 yıllık kurumsal finans, bütçe planlama, nakit akışı ve IFRS/TFRS raporlama tecrübesine sahip Kıdemli Finansal Analist. Yıllık 150M+ TL bütçe konsolidasyonu, finansal modelleme ve maliyet optimizasyonu konularında derin uzmanlık.",
        experience: [
            {
                id: "exp-1",
                role: "Kıdemli Finansal Kontrolör",
                company: "Kolektif Holding A.Ş.",
                location: "İstanbul",
                startDate: "2021-02",
                endDate: "",
                current: true,
                description: "• 4 grup şirketinin aylık ve yıllık IFRS konsolide mali tablolarını ve nakit akış tahminlerini hazırladım.\n• Operasyonel harcamalarda (OPEX) uygulanan varyans analizi ile yıllık 6.4M TL maliyet tasarrufu sağladım.\n• SAP FI/CO modülü entegrasyon projesini finans lideri olarak zamanında ve bütçe dahilinde tamamladım."
            },
            {
                id: "exp-2",
                role: "Kıdemli Denetçi (Senior Auditor)",
                company: "KPMG Türkiye",
                location: "İstanbul",
                startDate: "2018-09",
                endDate: "2021-01",
                current: false,
                description: "• Üretim, perakende ve bankacılık sektörlerindeki 12 denetim dosyasında bağımsız denetim raporlamalarını yönettim.\n• Hile denetimi ve iç kontrol sistemlerinin değerlendirilmesinde önemli finansal riskleri tespit ettim."
            }
        ],
        education: [
            {
                id: "edu-1",
                school: "Marmara Üniversitesi",
                degree: "Lisans",
                field: "İktisadi ve İdari Bilimler Fakültesi (İşletme)",
                startDate: "2013-09",
                endDate: "2017-06",
                gpa: "3.60 / 4.00",
                description: "Finans ve Muhasebe Anabilim Dalı Odaklı."
            }
        ],
        skills: ["SMMM Ruhsatı", "IFRS & TFRS Standartları", "Finansal Modelleme & Değerleme", "Bütçe & Varyans Analizi", "SAP FI/CO", "Vergi Hukuku & Beyannameler", "İleri Düzey Excel & Power Query", "Nakit Akış Yönetimi"],
        languages: [{ name: "Türkçe", level: "Anadil" }, { name: "İngilizce", level: "C1 - Finansal İngilizce" }],
        projects: [
            { id: "prj-1", title: "Şirket Değerleme & Halka Arz Hazırlığı (IPO)", link: "", description: "Holding bünyesindeki teknoloji iştirakinin halka arz sürecinde finansal tabloların 3 yıllık geriye dönük IFRS denetiminin koordinasyonu." }
        ],
        certificates: [
            { id: "cert-1", title: "Serbest Muhasebeci Mali Müşavir (SMMM) Ruhsatı", issuer: "TÜRMOB", date: "2021" },
            { id: "cert-2", title: "SPL Düzey 3 Lisansı", issuer: "Sermaye Piyasası Lisanslama Sicil ve Eğitim Kuruluşu", date: "2020" }
        ]
    },

    // 7. MİMARLIK & TASARIM (Architecture & Design)
    design: {
        id: "design",
        name: "Tasarım & Mimarlık",
        icon: "🎨",
        personal: {
            fullName: "Adınız Soyadınız",
            title: "Kıdemli İç Mimar & Proje Yöneticisi",
            email: "ornek@ornek.com",
            phone: "0555 555 55 55",
            location: "Beyoğlu, İstanbul",
            website: "ornek.com",
            linkedin: "linkedin.com/in/kullaniciadi",
            github: "behance.net/kullaniciadi",
            photo: ""
        },
        sectionTitles: {
            summary: "Tasarım Manifestosu / Özet",
            experience: "Tasarım & Şantiye Deneyimi",
            education: "Eğitim",
            skills: "Yazılımlar & Tasarım Yetkinlikleri",
            projects: "Tamamlanan Projeler & Portfolyo",
            certificates: "Ödüller & Sertifikalar",
            languages: "Diller"
        },
        sectionOrder: ["summary", "experience", "education", "skills", "projects", "certificates", "languages"],
        summary: "Konut, otel ve ticari ofis projelerinde 6 yılı aşkın konsept tasarım, ruhsat projesi ve uygulama/şantiye deneyimine sahip Kıdemli İç Mimar. Malzeme bilgisi, sürdürülebilir mimari detaylar ve bütçe odaklı proje yönetiminde uzman; 30+ projeyi anahtar teslim başarıyla yönetmiştir.",
        experience: [
            {
                id: "exp-1",
                role: "Baş Tasarımcı & Proje Yöneticisi",
                company: "Atölye Kolektif Mimarlık",
                location: "İstanbul",
                startDate: "2021-08",
                endDate: "",
                current: true,
                description: "• 4.500 m² karma ofis projesinin konsept tasarımından şantiye teslimine kadar tüm süreçlerini yönettim.\n• AutoCAD ve Revit ile uygulama çizimlerini hazırladım; taşeron ekipleri ve malzeme tedarik zincirini koordine ettim.\n• Akıllı malzeme seçimleri ve aydınlatma otomasyonu ile proje maliyetini bütçenin %8 altında tamamladım."
            },
            {
                id: "exp-2",
                role: "İç Mimar",
                company: "Mono Tasarım & Uygulama",
                location: "İstanbul",
                startDate: "2018-07",
                endDate: "2021-07",
                current: false,
                description: "• Lüks konut ve restoran mekanları için 3ds Max ve Corona Renderer ile fotogerçekçi 3D görselleştirmeler hazırladım.\n• Mobilya detay çizimleri, hakediş ve metraj hesaplamalarını eksiksiz yürüttüm."
            }
        ],
        education: [
            {
                id: "edu-1",
                school: "Mimar Sinan Güzel Sanatlar Üniversitesi (MSGSÜ)",
                degree: "Lisans",
                field: "İç Mimarlık",
                startDate: "2014-09",
                endDate: "2018-06",
                gpa: "3.65 / 4.00",
                description: "Sürdürülebilir Mekan Tasarımı Bitirme Projesi Derecesi."
            }
        ],
        skills: ["AutoCAD", "Autodesk Revit (BIM)", "3ds Max & Corona Renderer", "SketchUp & Enscape", "Adobe Photoshop / InDesign", "Detay & Şantiye Çizimi", "Metraj & Hakediş", "Malzeme & Aydınlatma"],
        languages: [{ name: "Türkçe", level: "Anadil" }, { name: "İngilizce", level: "B2 - İyi Seviye" }],
        projects: [
            { id: "prj-1", title: "Karaköy Boutique Hotel (28 Oda - Restorasyon)", link: "behance.net/kullaniciadi/proje", description: "Tarihi eser tescilli yapının iç mimari renovasyonu ve anahtar teslim şantiye yönetimi." }
        ],
        certificates: [
            { id: "cert-1", title: "Autodesk Certified Professional: Revit for Architectural Design", issuer: "Autodesk", date: "2022" },
            { id: "cert-2", title: "TMMOB İçmimarlar Odası Üyeliği", issuer: "İçmimarlar Odası", date: "2018" }
        ]
    }
};

// Varsayılan ilk veri olarak Finans & Muhasebe (Serdar Yılmaz) profilini ata
const SAMPLE_CV_DATA = SECTOR_PROFILES.finance;

/**
 * Sektörlere Göre Güçlü Aksiyon Fiilleri ve Hazır İfadeler Kütüphanesi
 */
const ACTION_VERBS_LIBRARY = {
    all: [
        { verb: "Yönetti / Koordine Etti", desc: "Takım veya proje yönetimi belirtirken", ex: "5 kişilik ekibi koordine ederek projeyi zamanında teslim ettim." },
        { verb: "Optimize Etti / İyileştirdi", desc: "Performans, hız veya verimlilik artışı için", ex: "Süreçleri optimize ederek operasyon süresini %25 kısalttım." },
        { verb: "Tasarım / İnşa Etti", desc: "Sıfırdan kurulan sistem ve yapılar için", ex: "Mimarisi sıfırdan tasarlayıp devreye aldım." },
        { verb: "Düşürdü / Tasarruf Sağladı", desc: "Maliyet, hata veya kayıp azaltma için", ex: "Bütçe analizleri ile yıllık 200.000 TL tasarruf sağladım." },
        { verb: "Artırdı / Büyüttü", desc: "Satış, ciro, kullanıcı veya verim artışı için", ex: "Müşteri portföyünü %40 büyüterek yeni anlaşmalar imzaladım." },
        { verb: "Entegre Etti / Uyguladı", desc: "Yeni sistem, standart veya regülasyonlar için", ex: "Yeni standartları başarıyla entegre ederek uyumluluk sağladım." }
    ],
    tech: [
        "Mikroservis mimarisini tasarlayarak ölçeklenebilirliği artırdım.",
        "CI/CD otomasyonu kurarak dağıtım sürelerini dakikalara indirdim.",
        "API yanıt sürelerini önbellekleme ve indeksleme ile %40 iyileştirdim."
    ],
    law: [
        "Şirketler hukuku kapsamında birleşme ve devralma (M&A) süreçlerini hukuki incelemeden geçirdim.",
        "KVKK ve ticari sözleşme standartlarını güncel mevzuata tam uyumlu hale getirdim.",
        "Ticaret mahkemelerinde müvekkil haklarını savunarak olumlu uzlaşma sağladım."
    ],
    health: [
        "Yoğun bakım ve poliklinikte kritik hasta tanı ve tedavi protokollerini yönettim.",
        "Hasta bakım kalitesini ve klinik standartları yükselten protokolleri devreye aldım.",
        "Acil müdahale ve triyaj süreçlerinde yüksek başarı oranı ile görev aldım."
    ],
    sales: [
        "Yıllık satış kotalarını %130+ oranında aşarak şirket rekoru kırdım.",
        "B2B müşteri hunisini (pipeline) yapılandırarak churn oranını düşürdüm.",
        "Stratejik iş ortaklıkları kurarak yeni pazar kanalları açtım."
    ],
    student: [
        "Bitirme tezinde veri analizi algoritmaları kullanarak süreç simülasyonu gerçekleştirdim.",
        "Uzun dönem stajyer olarak operasyonel analizlerde aktif rol aldım.",
        "Öğrenci kulübü liderliğinde 500+ katılımcılı ulusal etkinlik organize ettim."
    ],
    finance: [
        "IFRS ve TFRS standartlarında konsolide mali tabloları ve nakit akış tahminlerini hazırladım.",
        "Varyans analizi ile operasyonel giderlerde yıllık tasarruf hedefini aştım.",
        "Finansal modelleme ile yatırım karlılık analizlerini raporladım."
    ],
    design: [
        "Konsept aşamasından anahtar teslim şantiye kontrolüne kadar tüm uygulama çizimlerini yönettim.",
        "3D fotogerçekçi görselleştirmeler ile müşteri onay süreçlerini hızlandırdım.",
        "BIM ve CAD standartlarında ruhsat ve uygulama projelerini eksiksiz çizdim."
    ]
};
