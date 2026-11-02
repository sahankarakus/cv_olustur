/**
 * CVZirve - Çoklu Şablon Motoru (Template Engine v2)
 * Desteklenen 4 Profesyonel Şablon:
 * 1. Modern (İki sütunlu, çağdaş kartlar, renk temalı)
 * 2. ATS / Kurumsal (Tek sütunlu, resmi İK formatı)
 * 3. Ivy League / Klasik ATS (Şahan Karakuş & Harvard standardı, tam ATS uyumlu)
 * 4. Minimalist (Zarif editoryal tipografi, ferah boşluklar)
 * 
 * Özellikler:
 * - Dinamik Bölüm Sıralaması (sectionOrder desteği)
 * - Özelleştirilebilir Bölüm Başlıkları (sectionTitles desteği)
 * - TR / EN Dil Desteği
 */

const TemplateEngine = {
    escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    formatDate(dateStr, lang = 'tr') {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length === 2) {
            const year = parts[0];
            const month = parts[1];
            const monthsTR = {
                '01': 'Oca', '02': 'Şub', '03': 'Mar', '04': 'Nis',
                '05': 'May', '06': 'Haz', '07': 'Tem', '08': 'Ağu',
                '09': 'Eyl', '10': 'Eki', '11': 'Kas', '12': 'Ara'
            };
            const monthsEN = {
                '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
                '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
                '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
            };
            const map = (lang === 'en') ? monthsEN : monthsTR;
            return `${map[month] || month} ${year}`;
        }
        return dateStr;
    },

    formatDateRange(start, end, current, lang = 'tr') {
        const startFormatted = this.formatDate(start, lang);
        const presentLabel = (lang === 'en') ? 'Present' : 'Günümüz';
        if (current) {
            return `${startFormatted} – ${presentLabel}`;
        }
        const endFormatted = this.formatDate(end, lang);
        return startFormatted && endFormatted 
            ? `${startFormatted} – ${endFormatted}` 
            : (startFormatted || endFormatted || '');
    },

    formatDescription(text) {
        if (!text) return '';
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const hasBullets = lines.some(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*'));

        if (hasBullets) {
            const listItems = lines.map(line => {
                const cleaned = line.replace(/^[•\-\*]\s*/, '');
                return `<li>${this.escapeHtml(cleaned)}</li>`;
            }).join('');
            return `<ul class="cv-bullet-list">${listItems}</ul>`;
        }

        return lines.map(line => `<p class="cv-paragraph">${this.escapeHtml(line)}</p>`).join('');
    },

    getDefaultTitles(lang = 'tr') {
        if (lang === 'en') {
            return {
                summary: "Professional Summary",
                experience: "Work Experience",
                education: "Education",
                skills: "Skills & Competencies",
                projects: "Key Projects",
                certificates: "Certificates & Licenses",
                languages: "Languages"
            };
        }
        return {
            summary: "Hakkımda / Profesyonel Özet",
            experience: "İş Deneyimi",
            education: "Eğitim Bilgileri",
            skills: "Yetenekler & Uzmanlıklar",
            projects: "Projeler & Portfolyo",
            certificates: "Sertifikalar & Lisanslar",
            languages: "Yabancı Diller"
        };
    },

    getTitle(data, key) {
        const lang = data.lang || 'tr';
        const defaults = this.getDefaultTitles(lang);
        if (data.sectionTitles && data.sectionTitles[key] && data.sectionTitles[key].trim()) {
            return this.escapeHtml(data.sectionTitles[key].trim());
        }
        return defaults[key] || key;
    },

    cleanPhone(phone) {
        if (!phone) return '';
        return String(phone).replace(/[^0-9+]/g, '');
    },

    formatUrl(url, defaultDomain = '') {
        if (!url) return '';
        let trimmed = String(url).trim();
        if (!trimmed) return '';
        if (/^https?:\/\//i.test(trimmed)) return trimmed;
        if (defaultDomain && !trimmed.toLowerCase().includes(defaultDomain)) {
            return `https://${defaultDomain}/${trimmed.replace(/^@/, '')}`;
        }
        return `https://${trimmed}`;
    },

    // SVG İkon Kütüphanesi
    getIcons() {
        return {
            mail: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
            phone: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
            pin: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
            globe: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
            linkedin: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
            github: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
            external: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`
        };
    },

    // ==========================================
    // 1. IVY LEAGUE / KLASİK ATS (Şahan Karakuş Standartı)
    // ==========================================
    renderIvyAts(data) {
        const p = data.personal || {};
        const lang = data.lang || 'tr';
        const icons = this.getIcons();
        const order = data.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects', 'certificates', 'languages'];

        // Üst İletişim Bağlantıları
        const contactLinks = [];
        if (p.phone) contactLinks.push(`<a href="tel:${this.cleanPhone(p.phone)}" class="ivy-contact-item cv-link">${icons.phone}<span>${this.escapeHtml(p.phone)}</span></a>`);
        if (p.email) contactLinks.push(`<a href="mailto:${this.escapeHtml(p.email)}" class="ivy-contact-item cv-link">${icons.mail}<span>${this.escapeHtml(p.email)}</span></a>`);
        if (p.location) contactLinks.push(`<span class="ivy-contact-item">${icons.pin}<span>${this.escapeHtml(p.location)}</span></span>`);
        if (p.linkedin) contactLinks.push(`<a href="${this.formatUrl(p.linkedin, 'linkedin.com/in')}" target="_blank" rel="noopener noreferrer" class="ivy-contact-item cv-link">${icons.linkedin}<span>${this.escapeHtml(p.linkedin)}</span></a>`);
        if (p.github) contactLinks.push(`<a href="${this.formatUrl(p.github, 'github.com')}" target="_blank" rel="noopener noreferrer" class="ivy-contact-item cv-link">${icons.github}<span>${this.escapeHtml(p.github)}</span></a>`);
        if (p.website) contactLinks.push(`<a href="${this.formatUrl(p.website)}" target="_blank" rel="noopener noreferrer" class="ivy-contact-item cv-link">${icons.globe}<span>${this.escapeHtml(p.website)}</span></a>`);

        // Bölüm Oluşturucu Fonksiyonlar
        const renderSection = {
            summary: () => {
                if (!data.summary) return '';
                return `
                    <div class="ivy-section">
                        <div class="ivy-section-title">${this.getTitle(data, 'summary')}</div>
                        <div class="ivy-summary-text">${this.escapeHtml(data.summary)}</div>
                    </div>
                `;
            },
            experience: () => {
                const exps = data.experience || [];
                if (exps.length === 0) return '';
                return `
                    <div class="ivy-section">
                        <div class="ivy-section-title">${this.getTitle(data, 'experience')}</div>
                        <div class="ivy-entries-list">
                            ${exps.map(exp => `
                                <div class="ivy-entry">
                                    <div class="ivy-entry-header">
                                        <span class="ivy-entry-title">${this.escapeHtml(exp.role)}</span>
                                        <span class="ivy-entry-date">${this.formatDateRange(exp.startDate, exp.endDate, exp.current, lang)}</span>
                                    </div>
                                    <div class="ivy-entry-sub">${this.escapeHtml(exp.company)}${exp.location ? ' – ' + this.escapeHtml(exp.location) : ''}</div>
                                    <div class="ivy-entry-body">${this.formatDescription(exp.description)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            },
            education: () => {
                const edus = data.education || [];
                if (edus.length === 0) return '';
                return `
                    <div class="ivy-section">
                        <div class="ivy-section-title">${this.getTitle(data, 'education')}</div>
                        <div class="ivy-entries-list">
                            ${edus.map(edu => `
                                <div class="ivy-entry">
                                    <div class="ivy-entry-header">
                                        <span class="ivy-entry-title">${this.escapeHtml(edu.school)}</span>
                                        <span class="ivy-entry-date">${this.formatDateRange(edu.startDate, edu.endDate, false, lang)}</span>
                                    </div>
                                    <div class="ivy-entry-sub">${this.escapeHtml(edu.degree ? edu.degree + ' – ' : '')}${this.escapeHtml(edu.field)}${edu.gpa ? ' (GNO: ' + this.escapeHtml(edu.gpa) + ')' : ''}</div>
                                    ${edu.description ? `<div class="ivy-entry-body"><p>${this.escapeHtml(edu.description)}</p></div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            },
            skills: () => {
                const skills = data.skills || [];
                if (skills.length === 0) return '';
                return `
                    <div class="ivy-section">
                        <div class="ivy-section-title">${this.getTitle(data, 'skills')}</div>
                        <div class="ivy-skills-block">
                            <div class="ivy-skill-line">${skills.map(s => this.escapeHtml(s)).join(' • ')}</div>
                        </div>
                    </div>
                `;
            },
            projects: () => {
                const prjs = data.projects || [];
                if (prjs.length === 0) return '';
                return `
                    <div class="ivy-section">
                        <div class="ivy-section-title">${this.getTitle(data, 'projects')}</div>
                        <div class="ivy-entries-list">
                            ${prjs.map(prj => `
                                <div class="ivy-entry">
                                    <div class="ivy-entry-header">
                                        <span class="ivy-entry-title">${this.escapeHtml(prj.title)}</span>
                                        ${prj.link ? `<a href="${this.formatUrl(prj.link)}" target="_blank" rel="noopener noreferrer" class="ivy-entry-link cv-link">${this.escapeHtml(prj.link)}</a>` : ''}
                                    </div>
                                    <div class="ivy-entry-body"><p>${this.escapeHtml(prj.description)}</p></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            },
            certificates: () => {
                const certs = data.certificates || [];
                if (certs.length === 0) return '';
                return `
                    <div class="ivy-section">
                        <div class="ivy-section-title">${this.getTitle(data, 'certificates')}</div>
                        <ul class="ivy-cert-list">
                            ${certs.map(c => `
                                <li><strong>${this.escapeHtml(c.title)}</strong> – ${this.escapeHtml(c.issuer)}${c.date ? ' (' + this.escapeHtml(c.date) + ')' : ''}</li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            },
            languages: () => {
                const langs = data.languages || [];
                if (langs.length === 0) return '';
                return `
                    <div class="ivy-section">
                        <div class="ivy-section-title">${this.getTitle(data, 'languages')}</div>
                        <div class="ivy-lang-line">
                            ${langs.map(l => `<strong>${this.escapeHtml(l.name)}:</strong> ${this.escapeHtml(l.level)}`).join('  |  ')}
                        </div>
                    </div>
                `;
            }
        };

        // Sıralamaya göre bölümleri birleştir
        const renderedSections = order.map(k => (renderSection[k] ? renderSection[k]() : '')).join('');

        return `
            <div class="cv-template cv-template-ivy">
                <header class="ivy-header">
                    <h1 class="ivy-name">${this.escapeHtml(p.fullName || 'ADINIZ SOYADINIZ')}</h1>
                    <div class="ivy-contact">
                        ${contactLinks.join('')}
                    </div>
                    <hr class="ivy-divider-top">
                </header>
                <div class="ivy-body">
                    ${renderedSections}
                </div>
            </div>
        `;
    },

    // ==========================================
    // 2. MODERN ŞABLON (İki Sütunlu)
    // ==========================================
    renderModern(data) {
        const p = data.personal || {};
        const lang = data.lang || 'tr';
        const icons = this.getIcons();
        const order = data.sectionOrder || ['summary', 'experience', 'education', 'projects'];

        const photoHtml = p.photo ? `
            <div class="modern-avatar-wrap">
                <img src="${p.photo}" alt="${this.escapeHtml(p.fullName)}" class="modern-avatar">
            </div>
        ` : '';

        const contactItems = [];
        if (p.email) contactItems.push(`<a href="mailto:${this.escapeHtml(p.email)}" class="modern-contact-item cv-link">${icons.mail}<span>${this.escapeHtml(p.email)}</span></a>`);
        if (p.phone) contactItems.push(`<a href="tel:${this.cleanPhone(p.phone)}" class="modern-contact-item cv-link">${icons.phone}<span>${this.escapeHtml(p.phone)}</span></a>`);
        if (p.location) contactItems.push(`<div class="modern-contact-item">${icons.pin}<span>${this.escapeHtml(p.location)}</span></div>`);
        if (p.website) contactItems.push(`<a href="${this.formatUrl(p.website)}" target="_blank" rel="noopener noreferrer" class="modern-contact-item cv-link">${icons.globe}<span>${this.escapeHtml(p.website)}</span></a>`);
        if (p.linkedin) contactItems.push(`<a href="${this.formatUrl(p.linkedin, 'linkedin.com/in')}" target="_blank" rel="noopener noreferrer" class="modern-contact-item cv-link">${icons.linkedin}<span>${this.escapeHtml(p.linkedin)}</span></a>`);
        if (p.github) contactItems.push(`<a href="${this.formatUrl(p.github, 'github.com')}" target="_blank" rel="noopener noreferrer" class="modern-contact-item cv-link">${icons.github}<span>${this.escapeHtml(p.github)}</span></a>`);

        const skills = data.skills || [];
        const skillsHtml = skills.length > 0 ? `
            <div class="modern-side-section">
                <h3 class="modern-side-title">${this.getTitle(data, 'skills')}</h3>
                <div class="modern-skills-grid">
                    ${skills.map(s => `<span class="modern-skill-tag">${this.escapeHtml(s)}</span>`).join('')}
                </div>
            </div>
        ` : '';

        const languages = data.languages || [];
        const languagesHtml = languages.length > 0 ? `
            <div class="modern-side-section">
                <h3 class="modern-side-title">${this.getTitle(data, 'languages')}</h3>
                <div class="modern-lang-list">
                    ${languages.map(l => `
                        <div class="modern-lang-item">
                            <span class="modern-lang-name">${this.escapeHtml(l.name)}</span>
                            <span class="modern-lang-level">${this.escapeHtml(l.level)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        const certificates = data.certificates || [];
        const certificatesHtml = certificates.length > 0 ? `
            <div class="modern-side-section">
                <h3 class="modern-side-title">${this.getTitle(data, 'certificates')}</h3>
                <div class="modern-cert-list">
                    ${certificates.map(c => `
                        <div class="modern-cert-item">
                            <div class="modern-cert-title">${this.escapeHtml(c.title)}</div>
                            <div class="modern-cert-sub">${this.escapeHtml(c.issuer)}${c.date ? ' • ' + this.escapeHtml(c.date) : ''}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        // Sağ sütun blokları
        const rightSections = {
            summary: () => {
                if (!data.summary) return '';
                return `
                    <div class="modern-main-section">
                        <h3 class="modern-main-title"><span class="title-bar"></span>${this.getTitle(data, 'summary')}</h3>
                        <p class="modern-summary-text">${this.escapeHtml(data.summary)}</p>
                    </div>
                `;
            },
            experience: () => {
                const exps = data.experience || [];
                if (exps.length === 0) return '';
                return `
                    <div class="modern-main-section">
                        <h3 class="modern-main-title"><span class="title-bar"></span>${this.getTitle(data, 'experience')}</h3>
                        <div class="modern-timeline">
                            ${exps.map(exp => `
                                <div class="modern-timeline-item">
                                    <div class="modern-item-header">
                                        <div>
                                            <h4 class="modern-role">${this.escapeHtml(exp.role)}</h4>
                                            <div class="modern-company">${this.escapeHtml(exp.company)}${exp.location ? ' • ' + this.escapeHtml(exp.location) : ''}</div>
                                        </div>
                                        <span class="modern-date-badge">${this.formatDateRange(exp.startDate, exp.endDate, exp.current, lang)}</span>
                                    </div>
                                    <div class="modern-item-body">${this.formatDescription(exp.description)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            },
            education: () => {
                const edus = data.education || [];
                if (edus.length === 0) return '';
                return `
                    <div class="modern-main-section">
                        <h3 class="modern-main-title"><span class="title-bar"></span>${this.getTitle(data, 'education')}</h3>
                        <div class="modern-timeline">
                            ${edus.map(edu => `
                                <div class="modern-timeline-item">
                                    <div class="modern-item-header">
                                        <div>
                                            <h4 class="modern-role">${this.escapeHtml(edu.degree ? edu.degree + ' - ' : '')}${this.escapeHtml(edu.field)}</h4>
                                            <div class="modern-company">${this.escapeHtml(edu.school)}${edu.gpa ? ' • GNO: ' + this.escapeHtml(edu.gpa) : ''}</div>
                                        </div>
                                        <span class="modern-date-badge">${this.formatDateRange(edu.startDate, edu.endDate, false, lang)}</span>
                                    </div>
                                    ${edu.description ? `<div class="modern-item-body"><p>${this.escapeHtml(edu.description)}</p></div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            },
            projects: () => {
                const prjs = data.projects || [];
                if (prjs.length === 0) return '';
                return `
                    <div class="modern-main-section">
                        <h3 class="modern-main-title"><span class="title-bar"></span>${this.getTitle(data, 'projects')}</h3>
                        <div class="modern-projects-grid">
                            ${prjs.map(prj => `
                                <div class="modern-project-card">
                                    <div class="modern-project-head">
                                        <h4 class="modern-project-title">${this.escapeHtml(prj.title)}</h4>
                                        ${prj.link ? `<a href="${this.formatUrl(prj.link)}" target="_blank" rel="noopener noreferrer" class="modern-project-link cv-link" title="${this.escapeHtml(prj.link)}">${icons.external}</a>` : ''}
                                    </div>
                                    <p class="modern-project-desc">${this.escapeHtml(prj.description)}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        };

        const renderedRight = order.map(k => (rightSections[k] ? rightSections[k]() : '')).join('');

        return `
            <div class="cv-template cv-template-modern">
                <div class="modern-sidebar">
                    ${photoHtml}
                    <div class="modern-side-section">
                        <h3 class="modern-side-title">İletişim</h3>
                        <div class="modern-contact-list">
                            ${contactItems.join('')}
                        </div>
                    </div>
                    ${skillsHtml}
                    ${languagesHtml}
                    ${certificatesHtml}
                </div>
                <div class="modern-main">
                    <header class="modern-header">
                        <h1 class="modern-fullname">${this.escapeHtml(p.fullName || 'Adınız Soyadınız')}</h1>
                        <p class="modern-jobtitle">${this.escapeHtml(p.title || 'Mesleki Ünvanınız')}</p>
                    </header>
                    ${renderedRight}
                </div>
            </div>
        `;
    },

    // ==========================================
    // 3. ATS / KURUMSAL ŞABLON (Tek Sütunlu)
    // ==========================================
    renderAts(data) {
        const p = data.personal || {};
        const lang = data.lang || 'tr';
        const order = data.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects', 'certificates'];

        const contactBar = [];
        if (p.email) contactBar.push(`<a href="mailto:${this.escapeHtml(p.email)}" class="cv-link"><span>${this.escapeHtml(p.email)}</span></a>`);
        if (p.phone) contactBar.push(`<a href="tel:${this.cleanPhone(p.phone)}" class="cv-link"><span>${this.escapeHtml(p.phone)}</span></a>`);
        if (p.location) contactBar.push(`<span>${this.escapeHtml(p.location)}</span>`);
        if (p.linkedin) contactBar.push(`<a href="${this.formatUrl(p.linkedin, 'linkedin.com/in')}" target="_blank" rel="noopener noreferrer" class="cv-link"><span>${this.escapeHtml(p.linkedin)}</span></a>`);
        if (p.github) contactBar.push(`<a href="${this.formatUrl(p.github, 'github.com')}" target="_blank" rel="noopener noreferrer" class="cv-link"><span>${this.escapeHtml(p.github)}</span></a>`);
        if (p.website) contactBar.push(`<a href="${this.formatUrl(p.website)}" target="_blank" rel="noopener noreferrer" class="cv-link"><span>${this.escapeHtml(p.website)}</span></a>`);

        const renderSection = {
            summary: () => {
                if (!data.summary) return '';
                return `
                    <section class="ats-section">
                        <h2 class="ats-heading">${this.getTitle(data, 'summary').toUpperCase()}</h2>
                        <div class="ats-divider"></div>
                        <p class="ats-summary-text">${this.escapeHtml(data.summary)}</p>
                    </section>
                `;
            },
            experience: () => {
                const exps = data.experience || [];
                if (exps.length === 0) return '';
                return `
                    <section class="ats-section">
                        <h2 class="ats-heading">${this.getTitle(data, 'experience').toUpperCase()}</h2>
                        <div class="ats-divider"></div>
                        <div class="ats-items-list">
                            ${exps.map(exp => `
                                <div class="ats-item">
                                    <div class="ats-item-header">
                                        <div class="ats-left-meta">
                                            <strong class="ats-role">${this.escapeHtml(exp.role)}</strong>
                                            <span class="ats-company"> | ${this.escapeHtml(exp.company)}</span>
                                            ${exp.location ? `<span class="ats-location"> - ${this.escapeHtml(exp.location)}</span>` : ''}
                                        </div>
                                        <span class="ats-date">${this.formatDateRange(exp.startDate, exp.endDate, exp.current, lang)}</span>
                                    </div>
                                    <div class="ats-item-content">${this.formatDescription(exp.description)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                `;
            },
            education: () => {
                const edus = data.education || [];
                if (edus.length === 0) return '';
                return `
                    <section class="ats-section">
                        <h2 class="ats-heading">${this.getTitle(data, 'education').toUpperCase()}</h2>
                        <div class="ats-divider"></div>
                        <div class="ats-items-list">
                            ${edus.map(edu => `
                                <div class="ats-item">
                                    <div class="ats-item-header">
                                        <div class="ats-left-meta">
                                            <strong class="ats-school">${this.escapeHtml(edu.school)}</strong>
                                            <span class="ats-degree"> | ${this.escapeHtml(edu.degree ? edu.degree + ', ' : '')}${this.escapeHtml(edu.field)}</span>
                                            ${edu.gpa ? `<span class="ats-gpa"> (GNO: ${this.escapeHtml(edu.gpa)})</span>` : ''}
                                        </div>
                                        <span class="ats-date">${this.formatDateRange(edu.startDate, edu.endDate, false, lang)}</span>
                                    </div>
                                    ${edu.description ? `<p class="ats-edu-desc">${this.escapeHtml(edu.description)}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </section>
                `;
            },
            skills: () => {
                const skills = data.skills || [];
                const languages = data.languages || [];
                if (skills.length === 0 && languages.length === 0) return '';
                return `
                    <section class="ats-section">
                        <h2 class="ats-heading">${this.getTitle(data, 'skills').toUpperCase()}</h2>
                        <div class="ats-divider"></div>
                        ${skills.length > 0 ? `<p class="ats-skills-line"><strong>Yetkinlikler:</strong> ${skills.map(s => this.escapeHtml(s)).join(' • ')}</p>` : ''}
                        ${languages.length > 0 ? `<p class="ats-skills-line" style="margin-top: 4px;"><strong>Diller:</strong> ${languages.map(l => `${this.escapeHtml(l.name)} (${this.escapeHtml(l.level)})`).join(' • ')}</p>` : ''}
                    </section>
                `;
            },
            projects: () => {
                const prjs = data.projects || [];
                if (prjs.length === 0) return '';
                return `
                    <section class="ats-section">
                        <h2 class="ats-heading">${this.getTitle(data, 'projects').toUpperCase()}</h2>
                        <div class="ats-divider"></div>
                        <div class="ats-items-list">
                            ${prjs.map(prj => `
                                <div class="ats-item">
                                    <div class="ats-item-header">
                                        <strong class="ats-role">${this.escapeHtml(prj.title)}</strong>
                                        ${prj.link ? `<a href="${this.formatUrl(prj.link)}" target="_blank" rel="noopener noreferrer" class="ats-project-link cv-link">${this.escapeHtml(prj.link)}</a>` : ''}
                                    </div>
                                    <p class="ats-project-desc">${this.escapeHtml(prj.description)}</p>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                `;
            },
            certificates: () => {
                const certs = data.certificates || [];
                if (certs.length === 0) return '';
                return `
                    <section class="ats-section">
                        <h2 class="ats-heading">${this.getTitle(data, 'certificates').toUpperCase()}</h2>
                        <div class="ats-divider"></div>
                        <ul class="ats-cert-list">
                            ${certs.map(c => `<li><strong>${this.escapeHtml(c.title)}</strong> – ${this.escapeHtml(c.issuer)}${c.date ? ` (${this.escapeHtml(c.date)})` : ''}</li>`).join('')}
                        </ul>
                    </section>
                `;
            }
        };

        const renderedSections = order.map(k => (renderSection[k] ? renderSection[k]() : '')).join('');

        return `
            <div class="cv-template cv-template-ats">
                <header class="ats-header">
                    <h1 class="ats-name">${this.escapeHtml(p.fullName || 'ADINIZ SOYADINIZ')}</h1>
                    <p class="ats-title">${this.escapeHtml(p.title || 'Mesleki Ünvanınız')}</p>
                    <div class="ats-contact-bar">${contactBar.join(' • ')}</div>
                </header>
                ${renderedSections}
            </div>
        `;
    },

    // ==========================================
    // 4. MİNİMALİST ŞABLON (Zarif Editoryal)
    // ==========================================
    renderMinimal(data) {
        const p = data.personal || {};
        const lang = data.lang || 'tr';
        const order = data.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects', 'certificates'];

        const contactDetails = [];
        if (p.email) contactDetails.push(`<a href="mailto:${this.escapeHtml(p.email)}" class="cv-link">${this.escapeHtml(p.email)}</a>`);
        if (p.phone) contactDetails.push(`<a href="tel:${this.cleanPhone(p.phone)}" class="cv-link">${this.escapeHtml(p.phone)}</a>`);
        if (p.location) contactDetails.push(this.escapeHtml(p.location));
        if (p.website) contactDetails.push(`<a href="${this.formatUrl(p.website)}" target="_blank" rel="noopener noreferrer" class="cv-link">${this.escapeHtml(p.website)}</a>`);

        const renderSection = {
            summary: () => {
                if (!data.summary) return '';
                return `
                    <div class="minimal-row">
                        <div class="minimal-label">${this.getTitle(data, 'summary').toUpperCase()}</div>
                        <div class="minimal-content"><p class="minimal-summary">${this.escapeHtml(data.summary)}</p></div>
                    </div>
                `;
            },
            experience: () => {
                const exps = data.experience || [];
                if (exps.length === 0) return '';
                return `
                    <div class="minimal-row">
                        <div class="minimal-label">${this.getTitle(data, 'experience').toUpperCase()}</div>
                        <div class="minimal-content">
                            ${exps.map(exp => `
                                <div class="minimal-block">
                                    <div class="minimal-block-top">
                                        <span class="minimal-title">${this.escapeHtml(exp.role)}</span>
                                        <span class="minimal-meta">${this.formatDateRange(exp.startDate, exp.endDate, exp.current, lang)}</span>
                                    </div>
                                    <div class="minimal-subtitle">${this.escapeHtml(exp.company)}${exp.location ? ', ' + this.escapeHtml(exp.location) : ''}</div>
                                    <div class="minimal-body">${this.formatDescription(exp.description)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            },
            education: () => {
                const edus = data.education || [];
                if (edus.length === 0) return '';
                return `
                    <div class="minimal-row">
                        <div class="minimal-label">${this.getTitle(data, 'education').toUpperCase()}</div>
                        <div class="minimal-content">
                            ${edus.map(edu => `
                                <div class="minimal-block">
                                    <div class="minimal-block-top">
                                        <span class="minimal-title">${this.escapeHtml(edu.school)}</span>
                                        <span class="minimal-meta">${this.formatDateRange(edu.startDate, edu.endDate, false, lang)}</span>
                                    </div>
                                    <div class="minimal-subtitle">${this.escapeHtml(edu.degree ? edu.degree + ' ' : '')}${this.escapeHtml(edu.field)}${edu.gpa ? ' (GNO: ' + this.escapeHtml(edu.gpa) + ')' : ''}</div>
                                    ${edu.description ? `<p class="minimal-desc">${this.escapeHtml(edu.description)}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            },
            skills: () => {
                const skills = data.skills || [];
                const languages = data.languages || [];
                if (skills.length === 0 && languages.length === 0) return '';
                return `
                    <div class="minimal-row">
                        <div class="minimal-label">${this.getTitle(data, 'skills').toUpperCase()}</div>
                        <div class="minimal-content">
                            <p class="minimal-skills-text">${skills.map(s => this.escapeHtml(s)).join('  /  ')}</p>
                            ${languages.length > 0 ? `<p class="minimal-skills-text" style="margin-top: 6px; font-size: 0.9em; opacity: 0.85;"><strong>Diller:</strong> ${languages.map(l => `${this.escapeHtml(l.name)} (${this.escapeHtml(l.level)})`).join(', ')}</p>` : ''}
                        </div>
                    </div>
                `;
            },
            projects: () => {
                const prjs = data.projects || [];
                if (prjs.length === 0) return '';
                return `
                    <div class="minimal-row">
                        <div class="minimal-label">${this.getTitle(data, 'projects').toUpperCase()}</div>
                        <div class="minimal-content">
                            ${prjs.map(prj => `
                                <div class="minimal-block">
                                    <div class="minimal-block-top">
                                        <span class="minimal-title">${this.escapeHtml(prj.title)}</span>
                                        ${prj.link ? `<a href="${this.formatUrl(prj.link)}" target="_blank" rel="noopener noreferrer" class="minimal-meta cv-link">${this.escapeHtml(prj.link)}</a>` : ''}
                                    </div>
                                    <p class="minimal-desc">${this.escapeHtml(prj.description)}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            },
            certificates: () => {
                const certs = data.certificates || [];
                if (certs.length === 0) return '';
                return `
                    <div class="minimal-row">
                        <div class="minimal-label">${this.getTitle(data, 'certificates').toUpperCase()}</div>
                        <div class="minimal-content">
                            ${certs.map(c => `
                                <div class="minimal-inline-item"><strong>${this.escapeHtml(c.title)}</strong> — ${this.escapeHtml(c.issuer)}${c.date ? ' (' + this.escapeHtml(c.date) + ')' : ''}</div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        };

        const renderedSections = order.map(k => (renderSection[k] ? renderSection[k]() : '')).join('');

        return `
            <div class="cv-template cv-template-minimal">
                <header class="minimal-header">
                    <div class="minimal-header-left">
                        <h1 class="minimal-name">${this.escapeHtml(p.fullName || 'Adınız Soyadınız')}</h1>
                        <p class="minimal-role">${this.escapeHtml(p.title || 'Mesleki Ünvanınız')}</p>
                    </div>
                    <div class="minimal-header-right">
                        ${contactDetails.map(item => `<div>${item}</div>`).join('')}
                    </div>
                </header>
                <div class="minimal-divider-main"></div>
                ${renderedSections}
            </div>
        `;
    },

    /**
     * Şablon Seçici Dağıtım Motoru
     */
    render(templateName, data) {
        switch (templateName) {
            case 'ivy':
                return this.renderIvyAts(data);
            case 'ats':
                return this.renderAts(data);
            case 'minimal':
                return this.renderMinimal(data);
            case 'modern':
            default:
                return this.renderModern(data);
        }
    }
};
