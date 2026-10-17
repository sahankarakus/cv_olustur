/**
 * CVZirve - Kapsamlı Uygulama Mantığı & Durum Yönetimi (v2)
 * Çok Sektörlü Altyapı, Ivy League ATS, Bölüm Sıralama, Dil Değiştirici ve Canlı ATS Puanlayıcı
 */

// Uygulama Durumu (State)
const appState = {
    cvData: null,
    settings: {
        template: 'ivy', // Şahan Karakuş & Ivy League ATS şablonu varsayılan
        primaryColor: '#0f172a',
        fontFamily: 'font-inter',
        zoom: 0.85,
        compactness: 'normal', // 'tight' | 'normal' | 'loose'
        isAutoFit: true
    }
};

window.appState = appState;

// ==========================================
// Başlangıç & Yerel Depolama (Storage)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    loadSavedData();
    checkUrlSharedData(); // URL üzerinden paylaşılan CV kontrolü
    setupEventListeners();
    populateFormFromData();
    applySettings();
    renderPreview();
    updateCompleteness();
    updateAtsScore();
    autoFitPreview();
}

/**
 * URL Hash kontrolü: #cv= ile gelen veriyi yükler (Veritabanısız paylaşım)
 */
function checkUrlSharedData() {
    try {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#cv=')) {
            const encoded = hash.substring(4);
            const decoded = decodeURIComponent(escape(atob(encoded)));
            const parsed = JSON.parse(decoded);
            if (parsed && (parsed.personal || parsed.experience)) {
                appState.cvData = parsed;
                showToast("Paylaşılan CV başarıyla görüntülendi!", "success");
            }
        }
    } catch (e) {
        console.warn("URL hash verisi ayrıştırılamadı:", e);
    }
}

function loadSavedData() {
    try {
        const savedData = localStorage.getItem('cvzirve_data');
        const savedSettings = localStorage.getItem('cvzirve_settings');

        if (savedData) {
            appState.cvData = JSON.parse(savedData);
            // Eksik olabilecek alanları garantiye al
            if (!appState.cvData.sectionOrder) {
                appState.cvData.sectionOrder = ["summary", "experience", "education", "skills", "projects", "certificates", "languages"];
            }
            if (!appState.cvData.sectionTitles) {
                appState.cvData.sectionTitles = {};
            }
        } else {
            // İlk açılışta zengin örnek veriyi yükle
            appState.cvData = JSON.parse(JSON.stringify(SAMPLE_CV_DATA));
        }

        if (savedSettings) {
            appState.settings = { ...appState.settings, ...JSON.parse(savedSettings) };
        }
    } catch (e) {
        console.error("Kayıtlı veri yükleme hatası:", e);
        appState.cvData = JSON.parse(JSON.stringify(SAMPLE_CV_DATA));
    }
}

function saveData() {
    try {
        localStorage.setItem('cvzirve_data', JSON.stringify(appState.cvData));
        localStorage.setItem('cvzirve_settings', JSON.stringify(appState.settings));
    } catch (e) {
        console.warn("Veri kaydedilemedi:", e);
    }
}

// ==========================================
// Canlı Önizleme & Render
// ==========================================
function renderPreview() {
    const paper = document.getElementById('cvPaper');
    if (!paper) return;

    // Şablon HTML'ini oluştur
    const html = TemplateEngine.render(appState.settings.template, appState.cvData);
    paper.innerHTML = html;

    // Renk değişkenini ve Font sınıfını kağıda uygula
    paper.style.setProperty('--cv-primary', appState.settings.primaryColor);
    paper.style.setProperty('--cv-primary-light', hexToRgba(appState.settings.primaryColor, 0.12));

    // Font sınıflarını temizle ve yenisini ekle
    paper.classList.remove('font-inter', 'font-jakarta', 'font-outfit', 'font-merriweather');
    paper.classList.add(appState.settings.fontFamily);

    // Kompaktlık sınıfı
    paper.classList.remove('cv-compact-tight', 'cv-compact-loose');
    if (appState.settings.compactness === 'tight') {
        paper.classList.add('cv-compact-tight');
    } else if (appState.settings.compactness === 'loose') {
        paper.classList.add('cv-compact-loose');
    }
}

function hexToRgba(hex, alpha) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

// ==========================================
// Form Doldurma & Form Olayları
// ==========================================
function populateFormFromData() {
    const d = appState.cvData;
    const p = d.personal || {};

    setVal('inputFullName', p.fullName);
    setVal('inputTitle', p.title);
    setVal('inputEmail', p.email);
    setVal('inputPhone', p.phone);
    setVal('inputLocation', p.location);
    setVal('inputWebsite', p.website);
    setVal('inputLinkedin', p.linkedin);
    setVal('inputGithub', p.github);

    updatePhotoPreviewInEditor(p.photo);
    setVal('inputSummary', d.summary);

    renderExperienceEditorList();
    renderEducationEditorList();
    renderSkillsPills();
    renderLanguagesEditorList();
    renderProjectsEditorList();
    renderCertificatesEditorList();

    updateSectionOrderUI();
    updateSectionTitleBadges();
}

function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
}

// ==========================================
// Bölüm Sıralaması (Section Reordering)
// ==========================================
function updateSectionOrderUI() {
    const container = document.querySelector('.editor-content');
    if (!container) return;

    const order = appState.cvData.sectionOrder || ["summary", "experience", "education", "skills", "projects", "certificates", "languages"];

    // Her bölüm öğesini sıraya göre DOM'da yeniden konumlandır
    order.forEach(key => {
        const secEl = document.querySelector(`.editor-section[data-section="${key}"]`);
        if (secEl) {
            container.appendChild(secEl);
        }
    });

    // Akıllı tavsiye kartını en alta bırak
    const tipsCard = document.querySelector('.smart-tips-card');
    if (tipsCard) container.appendChild(tipsCard);
}

window.moveSection = function(key, direction, event) {
    if (event) event.stopPropagation();
    const order = appState.cvData.sectionOrder;
    const idx = order.indexOf(key);
    if (idx === -1) return;

    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= order.length) return;

    // Sırayı takas et
    const temp = order[idx];
    order[idx] = order[newIdx];
    order[newIdx] = temp;

    updateSectionOrderUI();
    renderPreview();
    saveData();
    showToast("Bölüm sırası güncellendi.", "info");
};

function updateSectionTitleBadges() {
    const d = appState.cvData;
    const keys = ["summary", "experience", "education", "skills", "projects", "certificates", "languages"];
    keys.forEach(k => {
        const titleEl = document.getElementById(`titleLabel_${k}`);
        if (titleEl) {
            titleEl.textContent = TemplateEngine.getTitle(d, k);
        }
    });
}

window.editSectionTitle = function(key, event) {
    if (event) event.stopPropagation();
    const current = TemplateEngine.getTitle(appState.cvData, key);
    const newTitle = prompt(`"${current}" bölümü için yeni başlık girin:`, current);
    if (newTitle !== null && newTitle.trim()) {
        if (!appState.cvData.sectionTitles) appState.cvData.sectionTitles = {};
        appState.cvData.sectionTitles[key] = newTitle.trim();
        updateSectionTitleBadges();
        renderPreview();
        saveData();
        showToast("Bölüm başlığı güncellendi.", "success");
    }
};

// ==========================================
// Dinamik Liste Editörleri (CRUD)
// ==========================================

// --- İŞ DENEYİMİ ---
function renderExperienceEditorList() {
    const container = document.getElementById('experienceList');
    if (!container) return;
    const items = appState.cvData.experience || [];
    updateBadgeCount('expCountBadge', items.length);

    container.innerHTML = items.map((exp, index) => `
        <div class="item-card" data-index="${index}">
            <div class="item-card-header" onclick="toggleCardBody(this)">
                <div>
                    <div class="item-card-title">${TemplateEngine.escapeHtml(exp.role || 'Yeni Pozisyon')}</div>
                    <div class="item-card-sub">${TemplateEngine.escapeHtml(exp.company || 'Şirket/Kurum')}</div>
                </div>
                <div class="item-card-actions" onclick="event.stopPropagation()">
                    <button type="button" class="btn-icon danger" onclick="removeExperience(${index})" title="Sil">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
            <div class="item-card-body">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Pozisyon / Ünvan</label>
                        <input type="text" class="form-input" value="${TemplateEngine.escapeHtml(exp.role || '')}" 
                               oninput="updateExperienceField(${index}, 'role', this.value)" placeholder="Örn: Kıdemli Avukat / Yazılım Mühendisi / Doktor">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Şirket / Kurum / Büro</label>
                        <input type="text" class="form-input" value="${TemplateEngine.escapeHtml(exp.company || '')}" 
                               oninput="updateExperienceField(${index}, 'company', this.value)" placeholder="Örn: ABC Holding / Florence Nightingale / Baro">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Başlangıç Tarihi</label>
                        <input type="month" class="form-input" value="${exp.startDate || ''}" 
                               oninput="updateExperienceField(${index}, 'startDate', this.value)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Bitiş Tarihi</label>
                        <input type="month" class="form-input" value="${exp.endDate || ''}" 
                               ${exp.current ? 'disabled' : ''} 
                               id="expEndInput_${index}"
                               oninput="updateExperienceField(${index}, 'endDate', this.value)">
                        <label class="form-checkbox-label">
                            <input type="checkbox" class="form-checkbox" ${exp.current ? 'checked' : ''} 
                                   onchange="toggleExpCurrent(${index}, this.checked)">
                            Halen devam ediyor
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Konum</label>
                    <input type="text" class="form-input" value="${TemplateEngine.escapeHtml(exp.location || '')}" 
                           oninput="updateExperienceField(${index}, 'location', this.value)" placeholder="Örn: İstanbul / Ankara">
                </div>
                <div class="form-group">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <label class="form-label">Görevler & Ölçülebilir Başarılar</label>
                        <button type="button" class="btn btn-ghost" style="padding: 2px 8px; font-size: 0.72rem;" onclick="openActionVerbsModal(${index})">
                            💡 Hazır Cümleler
                        </button>
                    </div>
                    <textarea class="form-textarea" rows="4" 
                              id="expDesc_${index}"
                              oninput="updateExperienceField(${index}, 'description', this.value)" 
                              placeholder="• Süreçleri optimize ederek operasyon süresini %30 kısalttım.&#10;• 5 kişilik ekibi başarıyla koordine ettim.">${TemplateEngine.escapeHtml(exp.description || '')}</textarea>
                </div>
            </div>
        </div>
    `).join('');
}

window.addExperience = function() {
    if (!appState.cvData.experience) appState.cvData.experience = [];
    appState.cvData.experience.unshift({
        id: 'exp_' + Date.now(),
        role: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
    });
    renderExperienceEditorList();
    renderPreview();
    saveData();
    updateCompleteness();
    updateAtsScore();
};

window.removeExperience = function(index) {
    appState.cvData.experience.splice(index, 1);
    renderExperienceEditorList();
    renderPreview();
    saveData();
    updateCompleteness();
    updateAtsScore();
};

window.updateExperienceField = function(index, field, value) {
    if (appState.cvData.experience[index]) {
        appState.cvData.experience[index][field] = value;
        renderPreview();
        saveData();
        updateCompleteness();
        updateAtsScore();
    }
};

window.toggleExpCurrent = function(index, isCurrent) {
    if (appState.cvData.experience[index]) {
        appState.cvData.experience[index].current = isCurrent;
        if (isCurrent) appState.cvData.experience[index].endDate = '';
        renderExperienceEditorList();
        renderPreview();
        saveData();
    }
};

// --- EĞİTİM ---
function renderEducationEditorList() {
    const container = document.getElementById('educationList');
    if (!container) return;
    const items = appState.cvData.education || [];
    updateBadgeCount('eduCountBadge', items.length);

    container.innerHTML = items.map((edu, index) => `
        <div class="item-card" data-index="${index}">
            <div class="item-card-header" onclick="toggleCardBody(this)">
                <div>
                    <div class="item-card-title">${TemplateEngine.escapeHtml(edu.school || 'Yeni Okul/Üniversite')}</div>
                    <div class="item-card-sub">${TemplateEngine.escapeHtml(edu.field || 'Bölüm')}</div>
                </div>
                <div class="item-card-actions" onclick="event.stopPropagation()">
                    <button type="button" class="btn-icon danger" onclick="removeEducation(${index})" title="Sil">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
            <div class="item-card-body">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Okul / Üniversite / Fakülte</label>
                        <input type="text" class="form-input" value="${TemplateEngine.escapeHtml(edu.school || '')}" 
                               oninput="updateEducationField(${index}, 'school', this.value)" placeholder="Örn: İstanbul Üniversitesi">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Derece</label>
                        <input type="text" class="form-input" value="${TemplateEngine.escapeHtml(edu.degree || '')}" 
                               oninput="updateEducationField(${index}, 'degree', this.value)" placeholder="Örn: Lisans / Yüksek Lisans / Tıpta Uzmanlık">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Bölüm / Alan</label>
                        <input type="text" class="form-input" value="${TemplateEngine.escapeHtml(edu.field || '')}" 
                               oninput="updateEducationField(${index}, 'field', this.value)" placeholder="Örn: Hukuk / Tıp / İşletme">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Not Ortalaması (GNO)</label>
                        <input type="text" class="form-input" value="${TemplateEngine.escapeHtml(edu.gpa || '')}" 
                               oninput="updateEducationField(${index}, 'gpa', this.value)" placeholder="Örn: 3.65 / 4.00">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Başlangıç</label>
                        <input type="month" class="form-input" value="${edu.startDate || ''}" 
                               oninput="updateEducationField(${index}, 'startDate', this.value)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Mezuniyet</label>
                        <input type="month" class="form-input" value="${edu.endDate || ''}" 
                               oninput="updateEducationField(${index}, 'endDate', this.value)">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Ek Açıklama / Bitirme Tezi</label>
                    <input type="text" class="form-input" value="${TemplateEngine.escapeHtml(edu.description || '')}" 
                           oninput="updateEducationField(${index}, 'description', this.value)" placeholder="Örn: Onur derecesi, Tez başlığı...">
                </div>
            </div>
        </div>
    `).join('');
}

window.addEducation = function() {
    if (!appState.cvData.education) appState.cvData.education = [];
    appState.cvData.education.unshift({
        id: 'edu_' + Date.now(),
        school: '',
        degree: 'Lisans',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: ''
    });
    renderEducationEditorList();
    renderPreview();
    saveData();
    updateCompleteness();
    updateAtsScore();
};

window.removeEducation = function(index) {
    appState.cvData.education.splice(index, 1);
    renderEducationEditorList();
    renderPreview();
    saveData();
    updateCompleteness();
    updateAtsScore();
};

window.updateEducationField = function(index, field, value) {
    if (appState.cvData.education[index]) {
        appState.cvData.education[index][field] = value;
        renderPreview();
        saveData();
        updateCompleteness();
    }
};

// --- YETENEKLER ---
function renderSkillsPills() {
    const container = document.getElementById('skillsPills');
    if (!container) return;
    const skills = appState.cvData.skills || [];
    updateBadgeCount('skillsCountBadge', skills.length);

    container.innerHTML = skills.map((skill, index) => `
        <span class="skill-pill">
            <span>${TemplateEngine.escapeHtml(skill)}</span>
            <span class="skill-pill-remove" onclick="removeSkill(${index})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
            </span>
        </span>
    `).join('');
}

window.addSkillFromInput = function() {
    const input = document.getElementById('newSkillInput');
    if (!input) return;
    const val = input.value.trim();
    if (!val) return;

    if (!appState.cvData.skills) appState.cvData.skills = [];
    if (!appState.cvData.skills.includes(val)) {
        appState.cvData.skills.push(val);
        input.value = '';
        renderSkillsPills();
        renderPreview();
        saveData();
        updateCompleteness();
        updateAtsScore();
    }
};

window.quickAddSkill = function(skillName) {
    if (!appState.cvData.skills) appState.cvData.skills = [];
    if (!appState.cvData.skills.includes(skillName)) {
        appState.cvData.skills.push(skillName);
        renderSkillsPills();
        renderPreview();
        saveData();
        updateCompleteness();
        updateAtsScore();
        showToast(`"${skillName}" eklendi`, 'info');
    }
};

window.removeSkill = function(index) {
    appState.cvData.skills.splice(index, 1);
    renderSkillsPills();
    renderPreview();
    saveData();
    updateCompleteness();
    updateAtsScore();
};

// --- DİLLER ---
function renderLanguagesEditorList() {
    const container = document.getElementById('languagesList');
    if (!container) return;
    const items = appState.cvData.languages || [];

    container.innerHTML = items.map((lang, index) => `
        <div class="item-card" data-index="${index}">
            <div class="item-card-body" style="border-top: none; padding: 10px;">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Dil Adı</label>
                        <input type="text" class="form-input" value="${TemplateEngine.escapeHtml(lang.name || '')}" 
                               oninput="updateLanguageField(${index}, 'name', this.value)" placeholder="Örn: İngilizce / Almanca">
                    </div>
                    <div class="form-group">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <label class="form-label">Seviye</label>
                            <button type="button" class="btn-icon danger" onclick="removeLanguage(${index})" title="Sil" style="padding: 2px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <input type="text" class="form-input" value="${TemplateEngine.escapeHtml(lang.level || '')}" 
                               oninput="updateLanguageField(${index}, 'level', this.value)" placeholder="Örn: C1 - İleri / Anadil">
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

window.addLanguage = function() {
    if (!appState.cvData.languages) appState.cvData.languages = [];
    appState.cvData.languages.push({ name: '', level: 'C1 - İleri Seviye' });
    renderLanguagesEditorList();
    renderPreview();
    saveData();
};

window.removeLanguage = function(index) {
    appState.cvData.languages.splice(index, 1);
    renderLanguagesEditorList();
    renderPreview();
    saveData();
};

window.updateLanguageField = function(index, field, value) {
    if (appState.cvData.languages[index]) {
        appState.cvData.languages[index][field] = value;
        renderPreview();
        saveData();
    }
};

// --- PROJELER ---
function renderProjectsEditorList() {
    const container = document.getElementById('projectsList');
    if (!container) return;
    const items = appState.cvData.projects || [];

    container.innerHTML = items.map((prj, index) => `
        <div class="item-card" data-index="${index}">
            <div class="item-card-header" onclick="toggleCardBody(this)">
                <div>
                    <div class="item-card-title">${TemplateEngine.escapeHtml(prj.title || 'Yeni Proje / Dosya')}</div>
                </div>
                <div class="item-card-actions" onclick="event.stopPropagation()">
                    <button type="button" class="btn-icon danger" onclick="removeProject(${index})" title="Sil">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
            <div class="item-card-body">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Başlık / Dosya Adı</label>
                        <input type="text" class="form-input" value="${TemplateEngine.escapeHtml(prj.title || '')}" 
                               oninput="updateProjectField(${index}, 'title', this.value)" placeholder="Örn: 25M$ Yatırım M&A Danışmanlığı / Konut Renovasyonu">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Bağlantı (Opsiyonel)</label>
                        <input type="text" class="form-input" value="${TemplateEngine.escapeHtml(prj.link || '')}" 
                               oninput="updateProjectField(${index}, 'link', this.value)" placeholder="Örn: behance.net/proje veya link">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Açıklama</label>
                    <textarea class="form-textarea" rows="2" 
                              oninput="updateProjectField(${index}, 'description', this.value)" 
                              placeholder="Kapsam, rolünüz ve elde edilen somut sonuç...">${TemplateEngine.escapeHtml(prj.description || '')}</textarea>
                </div>
            </div>
        </div>
    `).join('');
}

window.addProject = function() {
    if (!appState.cvData.projects) appState.cvData.projects = [];
    appState.cvData.projects.unshift({ id: 'prj_' + Date.now(), title: '', link: '', description: '' });
    renderProjectsEditorList();
    renderPreview();
    saveData();
};

window.removeProject = function(index) {
    appState.cvData.projects.splice(index, 1);
    renderProjectsEditorList();
    renderPreview();
    saveData();
};

window.updateProjectField = function(index, field, value) {
    if (appState.cvData.projects[index]) {
        appState.cvData.projects[index][field] = value;
        renderPreview();
        saveData();
    }
};

// --- SERTİFİKALAR ---
function renderCertificatesEditorList() {
    const container = document.getElementById('certificatesList');
    if (!container) return;
    const items = appState.cvData.certificates || [];

    container.innerHTML = items.map((cert, index) => `
        <div class="item-card" data-index="${index}">
            <div class="item-card-body" style="border-top: none; padding: 10px;">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Sertifika / Ruhsat Adı</label>
                        <input type="text" class="form-input" value="${TemplateEngine.escapeHtml(cert.title || '')}" 
                               oninput="updateCertificateField(${index}, 'title', this.value)" placeholder="Örn: Avukatlık Ruhsatı / SMMM / ACLS">
                    </div>
                    <div class="form-group">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <label class="form-label">Kurum / Yıl</label>
                            <button type="button" class="btn-icon danger" onclick="removeCertificate(${index})" title="Sil" style="padding: 2px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div style="display:grid; grid-template-columns: 2fr 1fr; gap: 6px;">
                            <input type="text" class="form-input" value="${TemplateEngine.escapeHtml(cert.issuer || '')}" 
                                   oninput="updateCertificateField(${index}, 'issuer', this.value)" placeholder="Kurum (Örn: Baro / Bakanlık)">
                            <input type="text" class="form-input" value="${TemplateEngine.escapeHtml(cert.date || '')}" 
                                   oninput="updateCertificateField(${index}, 'date', this.value)" placeholder="Yıl">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

window.addCertificate = function() {
    if (!appState.cvData.certificates) appState.cvData.certificates = [];
    appState.cvData.certificates.push({ title: '', issuer: '', date: '' });
    renderCertificatesEditorList();
    renderPreview();
    saveData();
};

window.removeCertificate = function(index) {
    appState.cvData.certificates.splice(index, 1);
    renderCertificatesEditorList();
    renderPreview();
    saveData();
};

window.updateCertificateField = function(index, field, value) {
    if (appState.cvData.certificates[index]) {
        appState.cvData.certificates[index][field] = value;
        renderPreview();
        saveData();
    }
};

// ==========================================
// Akordeon & Kart Açıp/Kapatma
// ==========================================
window.toggleSection = function(headerEl) {
    const section = headerEl.closest('.editor-section');
    if (section) section.classList.toggle('collapsed');
};

window.toggleCardBody = function(headerEl) {
    const card = headerEl.closest('.item-card');
    const body = card.querySelector('.item-card-body');
    if (body) body.style.display = (body.style.display === 'none') ? 'flex' : 'none';
};

function updateBadgeCount(id, count) {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
}

// ==========================================
// Fotoğraf Yükleyici & Önizleme
// ==========================================
function updatePhotoPreviewInEditor(photoDataUrl) {
    const preview = document.getElementById('photoPreviewContainer');
    const removeBtn = document.getElementById('btnRemovePhoto');
    if (!preview) return;

    if (photoDataUrl) {
        preview.innerHTML = `<img src="${photoDataUrl}" alt="Profil Fotoğrafı">`;
        if (removeBtn) removeBtn.style.display = 'inline-flex';
    } else {
        preview.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
        if (removeBtn) removeBtn.style.display = 'none';
    }
}

window.handlePhotoUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast("Lütfen bir görsel dosyası seçin (JPG, PNG).", "warn");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const base64 = e.target.result;
        appState.cvData.personal.photo = base64;
        updatePhotoPreviewInEditor(base64);
        renderPreview();
        saveData();
        showToast("Fotoğraf yüklendi.", "success");
    };
    reader.readAsDataURL(file);
};

window.removePhoto = function() {
    appState.cvData.personal.photo = '';
    updatePhotoPreviewInEditor('');
    const fileInput = document.getElementById('photoFileInput');
    if (fileInput) fileInput.value = '';
    renderPreview();
    saveData();
    showToast("Fotoğraf kaldırıldı.", "info");
};

// ==========================================
// 7 Sektör Değiştirici (Multi-Sector Profiles)
// ==========================================
window.openSectorModal = function() {
    const modal = document.getElementById('sectorModal');
    if (modal) modal.classList.add('active');
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
};

window.selectSector = function(sectorKey) {
    const profile = SECTOR_PROFILES[sectorKey];
    if (!profile) return;

    if (confirm(`"${profile.name}" sektörüne ait hazır profesyonel örnek profil yüklensin mi?`)) {
        appState.cvData = JSON.parse(JSON.stringify(profile));
        populateFormFromData();
        renderPreview();
        saveData();
        updateCompleteness();
        updateAtsScore();
        closeModal('sectorModal');
        showToast(`"${profile.name}" profili yüklendi!`, "success");
    }
};

// ==========================================
// TR ⟷ EN Dil Değiştirici
// ==========================================
window.toggleLanguage = function() {
    const current = appState.cvData.lang || 'tr';
    const next = (current === 'tr') ? 'en' : 'tr';
    appState.cvData.lang = next;

    // Başlık etiketlerini güncelle
    const defs = TemplateEngine.getDefaultTitles(next);
    if (!appState.cvData.sectionTitles) appState.cvData.sectionTitles = {};
    Object.keys(defs).forEach(k => {
        appState.cvData.sectionTitles[k] = defs[k];
    });

    const langBtn = document.getElementById('btnLangToggle');
    if (langBtn) {
        langBtn.textContent = (next === 'en') ? 'EN 🇬🇧' : 'TR 🇹🇷';
    }

    updateSectionTitleBadges();
    renderPreview();
    saveData();
    showToast(`CV dili ${next.toUpperCase()} olarak ayarlandı.`, "info");
};

// ==========================================
// Sayfaya Sığdır / Kompaktlık Ayarı
// ==========================================
window.setCompactness = function(level) {
    appState.settings.compactness = level;
    document.querySelectorAll('.compactness-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.compactness-btn[data-level="${level}"]`);
    if (btn) btn.classList.add('active');

    renderPreview();
    saveData();
    showToast(`Aralık boyutu: ${level === 'tight' ? 'Kompakt (Sığdır)' : (level === 'loose' ? 'Ferah' : 'Normal')}`, "info");
};

// ==========================================
// Canlı ATS Uyumluluk Puanlayıcısı (0-100)
// ==========================================
function updateAtsScore() {
    const d = appState.cvData;
    if (!d) return;

    let score = 0;
    const checks = [];

    // 1. İletişim Bilgileri (20 Puan)
    const p = d.personal || {};
    const hasEmail = Boolean(p.email && p.email.includes('@'));
    const hasPhone = Boolean(p.phone && p.phone.length > 7);
    const hasLocation = Boolean(p.location && p.location.length > 2);
    if (hasEmail && hasPhone && hasLocation) {
        score += 20;
        checks.push({ passed: true, text: "İletişim bilgileri eksiksiz (E-posta, telefon ve konum mevcut)." });
    } else {
        checks.push({ passed: false, text: "Eksik iletişim bilgisi: İK uzmanının size ulaşabilmesi için e-posta, telefon ve şehir zorunludur." });
    }

    // 2. Ölçülebilir Metrikler ve Sayısal Kanıtlar (25 Puan)
    const allDesc = (d.experience || []).map(e => e.description || '').join(' ');
    const hasMetrics = /[\d%M\$\+]+/.test(allDesc);
    if (hasMetrics) {
        score += 25;
        checks.push({ passed: true, text: "Somut başarı metrikleri tespit edildi (% oranlar, ekip boyutu, bütçe veya rakamlar)." });
    } else {
        checks.push({ passed: false, text: "Deneyimlerinizde somut rakam veya % oranı eksik (Örn: '%25 verim artışı', '10 kişilik ekip')." });
    }

    // 3. Güçlü Aksiyon Fiilleri (25 Puan)
    const actionWords = ["yönet", "optimize", "geliştir", "tasarla", "uygula", "analiz", "koordine", "artır", "azalt", "lider", "planla", "entegre"];
    const foundVerbs = actionWords.filter(w => allDesc.toLowerCase().includes(w));
    if (foundVerbs.length >= 2) {
        score += 25;
        checks.push({ passed: true, text: `Güçlü eylem fiilleri kullanılmış (${foundVerbs.slice(0, 3).join(', ')}...).` });
    } else {
        checks.push({ passed: false, text: "Daha fazla aksiyon fiili kullanın ('Yönetti', 'Optimize etti', 'Entegre etti' vb.)." });
    }

    // 4. Profesyonel Özet (15 Puan)
    if (d.summary && d.summary.length >= 40 && d.summary.length <= 500) {
        score += 15;
        checks.push({ passed: true, text: "Profesyonel özet uzunluğu ideal (40-500 karakter)." });
    } else {
        checks.push({ passed: false, text: "Hakkımda/Özet bölümü 2-3 güçlü cümleyle kariyer hedefinizi ve uzmanlığınızı anlatmalıdır." });
    }

    // 5. Yetkinlik Çeşitliliği (15 Puan)
    if (d.skills && d.skills.length >= 4) {
        score += 15;
        checks.push({ passed: true, text: `En az 4 ana yetkinlik listelenmiş (${d.skills.length} adet).` });
    } else {
        checks.push({ passed: false, text: "ATS anahtar kelimeleri için en az 4 yetkinlik/araç eklemeniz tavsiye edilir." });
    }

    // Arayüzü güncelle
    const badge = document.getElementById('atsScoreBadge');
    if (badge) {
        badge.textContent = `ATS: ${score}/100`;
        badge.style.borderColor = (score >= 80) ? 'var(--accent-emerald)' : ((score >= 50) ? '#f59e0b' : 'var(--accent-rose)');
        badge.style.color = (score >= 80) ? 'var(--accent-emerald)' : ((score >= 50) ? '#f59e0b' : 'var(--accent-rose)');
    }

    // Modal içerik güncelle
    window.lastAtsChecklist = checks;
    window.lastAtsScore = score;
}

window.openAtsScoreModal = function() {
    updateAtsScore();
    const score = window.lastAtsScore || 70;
    const checks = window.lastAtsChecklist || [];

    const circle = document.getElementById('modalAtsCircle');
    const text = document.getElementById('modalAtsScoreText');
    const list = document.getElementById('modalAtsChecklist');

    if (circle) circle.style.setProperty('--score-pct', score);
    if (text) text.textContent = `${score}`;

    if (list) {
        list.innerHTML = checks.map(c => `
            <div class="ats-check-item ${c.passed ? 'passed' : 'failed'}">
                ${c.passed 
                    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>` 
                    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
                }
                <span>${c.text}</span>
            </div>
        `).join('');
    }

    const modal = document.getElementById('atsScoreModal');
    if (modal) modal.classList.add('active');
};

// ==========================================
// Aksiyon Fiilleri & Cümle Bankası Modalı
// ==========================================
window.activeExpIndexForInsert = null;

window.openActionVerbsModal = function(expIndex = null) {
    window.activeExpIndexForInsert = expIndex;
    const modal = document.getElementById('actionVerbsModal');
    if (modal) modal.classList.add('active');
};

window.insertActionBullet = function(bulletText) {
    if (window.activeExpIndexForInsert !== null && appState.cvData.experience[window.activeExpIndexForInsert]) {
        const exp = appState.cvData.experience[window.activeExpIndexForInsert];
        exp.description = exp.description ? (exp.description.trim() + '\n• ' + bulletText) : ('• ' + bulletText);
        renderExperienceEditorList();
        renderPreview();
        saveData();
        updateAtsScore();
        closeModal('actionVerbsModal');
        showToast("İfade deneyime eklendi!", "success");
    } else {
        // Panoya kopyala
        navigator.clipboard.writeText('• ' + bulletText);
        showToast("İfade panoya kopyalandı!", "info");
    }
};

// ==========================================
// Veritabanısız (Serverless) URL ile Paylaşma
// ==========================================
window.openShareModal = function() {
    try {
        const jsonStr = JSON.stringify(appState.cvData);
        const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
        const shareUrl = `${window.location.origin}${window.location.pathname}#cv=${encoded}`;

        const input = document.getElementById('shareUrlInput');
        if (input) input.value = shareUrl;

        // Karekod SVG oluştur
        const qrBox = document.getElementById('qrCodeContainer');
        if (qrBox) {
            qrBox.innerHTML = `
                <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">Mobil Cihazla Tara:</div>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}" alt="CV Karekod" style="width:140px; height:140px; border-radius: 6px;">
            `;
        }

        const modal = document.getElementById('shareModal');
        if (modal) modal.classList.add('active');
    } catch (e) {
        showToast("Paylaşım linki üretilemedi.", "warn");
    }
};

window.copyShareUrl = function() {
    const input = document.getElementById('shareUrlInput');
    if (input) {
        input.select();
        navigator.clipboard.writeText(input.value);
        showToast("Paylaşım linki panoya kopyalandı!", "success");
    }
};

// ==========================================
// Zoom Kontrolleri & Otomatik Sığdırma
// ==========================================
window.changeZoom = function(delta) {
    let newZoom = Math.round((appState.settings.zoom + delta) * 100) / 100;
    newZoom = Math.min(Math.max(newZoom, 0.4), 1.5);
    appState.settings.isAutoFit = false;
    applyZoom(newZoom);
};

window.resetZoom = function() {
    appState.settings.isAutoFit = false;
    applyZoom(1.0);
};

window.autoFitPreview = function() {
    const stage = document.getElementById('previewStage');
    if (!stage) return;
    const availableWidth = stage.clientWidth - 48;
    const a4PixelWidth = 794;
    
    if (availableWidth > 0) {
        let fitScale = Math.min(Math.max(availableWidth / a4PixelWidth, 0.45), 1.1);
        fitScale = Math.round(fitScale * 100) / 100;
        appState.settings.isAutoFit = true;
        applyZoom(fitScale);
    }
};

function applyZoom(scale) {
    appState.settings.zoom = scale;
    const wrap = document.getElementById('cvPaperWrap');
    const zoomText = document.getElementById('zoomLevelText');
    if (wrap) wrap.style.transform = `scale(${scale})`;
    if (zoomText) zoomText.textContent = `${Math.round(scale * 100)}%`;
}

// ==========================================
// Doluluk Oranı
// ==========================================
function updateCompleteness() {
    const d = appState.cvData;
    let score = 0;
    let total = 6;

    if (d.personal && d.personal.fullName && d.personal.email) score++;
    if (d.personal && d.personal.phone && d.personal.location) score++;
    if (d.summary && d.summary.length > 30) score++;
    if (d.experience && d.experience.length > 0) score++;
    if (d.education && d.education.length > 0) score++;
    if (d.skills && d.skills.length >= 3) score++;

    const percent = Math.round((score / total) * 100);
    const fillEl = document.getElementById('progressFill');
    const badgeEl = document.getElementById('completionBadge');

    if (fillEl) fillEl.style.width = `${percent}%`;
    if (badgeEl) badgeEl.textContent = `%${percent} Dolu`;
}

// ==========================================
// Genel Eylemler
// ==========================================
window.clearAllData = function() {
    if (confirm("Tüm bilgileri temizlemek istediğinizden emin misiniz?")) {
        appState.cvData = {
            lang: "tr",
            sectionOrder: ["summary", "experience", "education", "skills", "projects", "certificates", "languages"],
            sectionTitles: {},
            personal: { fullName: "", title: "", email: "", phone: "", location: "", website: "", linkedin: "", github: "", photo: "" },
            summary: "",
            experience: [],
            education: [],
            skills: [],
            languages: [],
            projects: [],
            certificates: []
        };
        populateFormFromData();
        renderPreview();
        saveData();
        updateCompleteness();
        updateAtsScore();
        showToast("Tüm alanlar temizlendi.", "info");
    }
};

window.exportCvJson = function() {
    const ok = Exporter.downloadJson(appState.cvData);
    if (ok) showToast("Yedek JSON dosyası indirildi.", "success");
};

window.triggerJsonUpload = function() {
    const input = document.getElementById('jsonFileInput');
    if (input) input.click();
};

window.printCv = function() {
    Exporter.printToPdf();
};

// ==========================================
// Olay Dinleyicileri (Event Listeners)
// ==========================================
function setupEventListeners() {
    const personalFields = [
        { id: 'inputFullName', key: 'fullName' },
        { id: 'inputTitle', key: 'title' },
        { id: 'inputEmail', key: 'email' },
        { id: 'inputPhone', key: 'phone' },
        { id: 'inputLocation', key: 'location' },
        { id: 'inputWebsite', key: 'website' },
        { id: 'inputLinkedin', key: 'linkedin' },
        { id: 'inputGithub', key: 'github' }
    ];

    personalFields.forEach(item => {
        const el = document.getElementById(item.id);
        if (el) {
            el.addEventListener('input', (e) => {
                if (!appState.cvData.personal) appState.cvData.personal = {};
                appState.cvData.personal[item.key] = e.target.value;
                renderPreview();
                saveData();
                updateCompleteness();
                updateAtsScore();
            });
        }
    });

    const summaryEl = document.getElementById('inputSummary');
    if (summaryEl) {
        summaryEl.addEventListener('input', (e) => {
            appState.cvData.summary = e.target.value;
            renderPreview();
            saveData();
            updateCompleteness();
            updateAtsScore();
        });
    }

    const skillInput = document.getElementById('newSkillInput');
    if (skillInput) {
        skillInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkillFromInput();
            }
        });
    }

    // Şablon butonları
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            appState.settings.template = btn.dataset.template;
            renderPreview();
            saveData();
            showToast(`Şablon: ${btn.textContent.trim()}`, 'info');
        });
    });

    // Renk noktaları
    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            appState.settings.primaryColor = dot.dataset.color;
            renderPreview();
            saveData();
        });
    });

    // Font seçimi
    const fontSelect = document.getElementById('fontSelector');
    if (fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            appState.settings.fontFamily = e.target.value;
            renderPreview();
            saveData();
        });
    }

    // JSON İçe Aktarma
    const jsonFileInput = document.getElementById('jsonFileInput');
    if (jsonFileInput) {
        jsonFileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                const importedData = await Exporter.readJsonFile(file);
                if (importedData && (importedData.personal || importedData.experience)) {
                    appState.cvData = importedData;
                    populateFormFromData();
                    renderPreview();
                    saveData();
                    updateCompleteness();
                    updateAtsScore();
                    showToast("CV yedeği başarıyla yüklendi!", "success");
                }
            } catch (err) {
                showToast(err.message, "warn");
            }
            jsonFileInput.value = '';
        });
    }

    window.addEventListener('resize', () => {
        if (appState.settings.isAutoFit) autoFitPreview();
    });
}

function applySettings() {
    const activeTplBtn = document.querySelector(`.template-btn[data-template="${appState.settings.template}"]`);
    if (activeTplBtn) {
        document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('active'));
        activeTplBtn.classList.add('active');
    }

    const activeDot = document.querySelector(`.color-dot[data-color="${appState.settings.primaryColor}"]`);
    if (activeDot) {
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        activeDot.classList.add('active');
    }

    const fontSelect = document.getElementById('fontSelector');
    if (fontSelect && appState.settings.fontFamily) {
        fontSelect.value = appState.settings.fontFamily;
    }

    applyZoom(appState.settings.zoom);
}

// ==========================================
// Mobil Sekmeler
// ==========================================
window.switchMobileTab = function(tabName) {
    const editorPanel = document.querySelector('.editor-panel');
    const previewPanel = document.querySelector('.preview-panel');
    const tabBtns = document.querySelectorAll('.mobile-tab-btn');

    tabBtns.forEach(b => b.classList.remove('active'));

    if (tabName === 'editor') {
        editorPanel.classList.remove('tab-hidden');
        previewPanel.classList.add('tab-hidden');
        document.getElementById('tabBtnEditor').classList.add('active');
    } else {
        editorPanel.classList.add('tab-hidden');
        previewPanel.classList.remove('tab-hidden');
        document.getElementById('tabBtnPreview').classList.add('active');
        autoFitPreview();
    }
};

// ==========================================
// Toast Bildirimleri
// ==========================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}
