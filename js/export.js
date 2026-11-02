/**
 * CVZirve - Dışa Aktarma Modülü
 * Tek tıkla (diyalogsuz) PDF indirme:
 *  - CV tasarımı birebir (html2pdf ile) PDF'e basılır,
 *  - Üzerine görünmez bir METİN KATMANI eklenir (seçilebilir, kopyalanabilir, aranabilir, ATS okunabilir),
 *  - Mail / telefon / web linkleri tıklanabilir PDF bağlantıları olur.
 */

const Exporter = {
    _fontBase64: null,

    async _loadFont() {
        if (this._fontBase64) return this._fontBase64;
        const res = await fetch('fonts/Roboto-Regular.ttf');
        if (!res.ok) throw new Error('Font dosyası yüklenemedi.');
        const bytes = new Uint8Array(await res.arrayBuffer());
        let binary = '';
        const chunk = 0x8000;
        for (let i = 0; i < bytes.length; i += chunk) {
            binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
        }
        this._fontBase64 = btoa(binary);
        return this._fontBase64;
    },

    /**
     * Kağıttaki tüm kelimeleri konumlarıyla birlikte görünmez metin olarak PDF'e ekler.
     */
    async _addTextLayer(pdf, paper) {
        const b64 = await this._loadFont();
        pdf.addFileToVFS('Roboto-Regular.ttf', b64);
        pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        pdf.setFont('Roboto', 'normal');

        const paperRect = paper.getBoundingClientRect();
        const mmPerPx = 210 / paperRect.width;
        const pageHeightPx = 297 / mmPerPx;
        const totalPages = pdf.internal.getNumberOfPages();

        const walker = document.createTreeWalker(paper, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                const el = node.parentElement;
                if (!el || el.closest('.page-break-line') || el.closest('script,style')) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        const range = document.createRange();
        let node;
        while ((node = walker.nextNode())) {
            const el = node.parentElement;
            const style = window.getComputedStyle(el);
            if (style.visibility === 'hidden' || style.display === 'none') continue;
            const fontPt = parseFloat(style.fontSize) * 0.75 * (mmPerPx * 96 / 25.4);
            const re = /\S+/g;
            const text = node.nodeValue;
            let m;
            while ((m = re.exec(text))) {
                range.setStart(node, m.index);
                range.setEnd(node, m.index + m[0].length);
                const r = range.getBoundingClientRect();
                if (!r.width || !r.height) continue;

                const topPx = r.top - paperRect.top;
                const pageIdx = Math.min(totalPages, Math.max(1, Math.floor((topPx + r.height / 2) / pageHeightPx) + 1));
                const yOnPagePx = (r.bottom - paperRect.top) - (pageIdx - 1) * pageHeightPx - r.height * 0.2;

                pdf.setPage(pageIdx);
                pdf.setFontSize(fontPt);
                pdf.text(m[0] + ' ', (r.left - paperRect.left) * mmPerPx, yOnPagePx * mmPerPx, { renderingMode: 'invisible' });
            }
        }
    },

    /**
     * "PDF İndir": hiçbir pencere/soru olmadan doğrudan .pdf dosyasını indirir.
     */
    async printToPdf() {
        const btn = document.querySelector('.btn-primary[onclick*="printCv"]');
        const originalBtnHtml = btn ? btn.innerHTML : '';

        const fullName = (window.appState && window.appState.cvData && window.appState.cvData.personal.fullName)
            ? window.appState.cvData.personal.fullName.trim()
            : 'Ozgecmis';
        const sanitized = fullName.replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ\s_-]/g, '').replace(/\s+/g, '_') || 'CVita';
        const fileName = `${sanitized}_CV.pdf`;

        const paper = document.getElementById('cvPaper');
        if (!paper) {
            if (typeof showToast === 'function') showToast("Önizleme alanı bulunamadı", "error");
            return;
        }

        let prevTransform = '';
        let prevOrigin = '';
        let prevShadow = '';
        let pageBreak = null;
        let prevPageBreakDisplay = '';

        try {
            if (btn) {
                btn.disabled = true;
                btn.style.opacity = '0.75';
                btn.innerHTML = `
                    <svg class="spinner-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
                    </svg>
                    <span>İndiriliyor...</span>
                `;
            }

            if (document.fonts && document.fonts.ready) {
                await document.fonts.ready;
            }

            if (typeof html2pdf === 'undefined') {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'js/html2pdf.bundle.min.js';
                    script.onload = resolve;
                    script.onerror = () => reject(new Error("PDF dönüştürücü motor yüklenemedi."));
                    document.head.appendChild(script);
                });
            }

            // 1:1 A4 render için ölçeklendirmeyi ve kılavuz çizgisini geçici olarak sıfırla
            prevTransform = paper.style.transform;
            prevOrigin = paper.style.transformOrigin;
            prevShadow = paper.style.boxShadow;

            pageBreak = paper.querySelector('.page-break-line');
            if (pageBreak) {
                prevPageBreakDisplay = pageBreak.style.display;
                pageBreak.style.display = 'none';
            }

            paper.style.transform = 'none';
            paper.style.transformOrigin = 'top left';
            paper.style.boxShadow = 'none';

            const opt = {
                margin: 0,
                filename: fileName,
                image: { type: 'jpeg', quality: 0.98 },
                enableLinks: true, // Tıklanabilir bağlantılar
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    logging: false,
                    scrollX: 0,
                    scrollY: 0
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['css', 'legacy'] }
            };

            const pdf = await html2pdf().set(opt).from(paper).toPdf().get('pdf');

            // Görünmez metin katmanı (kopyalanabilir / ATS okunabilir)
            try {
                await this._addTextLayer(pdf, paper);
            } catch (textErr) {
                console.warn("Metin katmanı eklenemedi:", textErr);
            }

            pdf.save(fileName);

            if (typeof showToast === 'function') {
                showToast("PDF başarıyla indirildi!", "success");
            }
        } catch (err) {
            console.error("PDF indirme hatası:", err);
            if (typeof showToast === 'function') {
                showToast("PDF indirilemedi: " + (err.message || "Bilinmeyen hata"), "error");
            }
        } finally {
            if (paper) {
                paper.style.transform = prevTransform;
                paper.style.transformOrigin = prevOrigin;
                paper.style.boxShadow = prevShadow;
                if (pageBreak) pageBreak.style.display = prevPageBreakDisplay;
            }
            if (btn) {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.innerHTML = originalBtnHtml;
            }
        }
    }
};
