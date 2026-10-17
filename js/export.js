/**
 * CVZirve - Dışa Aktarma ve İçe Aktarma Modülü
 * - Vektörel PDF Çıktısı (window.print() ve @media print optimizasyonları ile)
 * - JSON Yedekleme (Dışa aktarma)
 * - JSON Yükleme (Kaldığın yerden devam etme)
 */

const Exporter = {
    /**
     * Kullanıcıya PDF kaydetme diyaloğunu açar.
     */
    printToPdf() {
        // Yazdırma öncesi sayfa başlığını kişinin adına göre geçici güncelle (PDF dosya adı için)
        const oldTitle = document.title;
        const fullName = (window.appState && window.appState.cvData && window.appState.cvData.personal.fullName) 
            ? window.appState.cvData.personal.fullName.trim() 
            : 'Ozgecmis';
        const sanitized = fullName.replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ\s_-]/g, '').replace(/\s+/g, '_');
        document.title = `${sanitized}_CV`;

        // Tarayıcı yazdırma ekranını tetikle
        window.print();

        // Başlığı eski haline getir
        setTimeout(() => {
            document.title = oldTitle;
        }, 1000);
    },

    /**
     * Mevcut CV verilerini JSON dosyası olarak indirir.
     */
    downloadJson(data) {
        try {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            const fullName = (data.personal && data.personal.fullName) ? data.personal.fullName.trim().replace(/\s+/g, '_') : 'cv';
            downloadAnchor.setAttribute("download", `${fullName}_yedek.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            return true;
        } catch (err) {
            console.error("JSON dışa aktarma hatası:", err);
            return false;
        }
    },

    /**
     * Seçilen JSON dosyasını okuyup nesneye çevirir.
     */
    readJsonFile(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                return reject(new Error("Dosya seçilmedi"));
            }
            if (!file.name.endsWith('.json')) {
                return reject(new Error("Lütfen geçerli bir .json dosyası seçin"));
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsed = JSON.parse(e.target.result);
                    resolve(parsed);
                } catch (err) {
                    reject(new Error("JSON dosyası ayrıştırılamadı. Format bozuk olabilir."));
                }
            };
            reader.onerror = () => reject(new Error("Dosya okuma hatası"));
            reader.readAsText(file);
        });
    }
};
