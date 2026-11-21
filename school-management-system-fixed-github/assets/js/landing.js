/**
 * School Management System — Landing Page Scripts (Standalone & Vercel)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mainNav.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#mainHeader')) {
                mainNav.classList.remove('open');
            }
        });
    }

    // 2. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    if (mainNav) mainNav.classList.remove('open');
                    const offset = 80;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = target.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 3. Populate Notices on Landing Page from Data Store
    renderLandingNotices();

    // 4. Contact Form Submission
    const contactForm = document.getElementById('smsPublicContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const alertBox = document.getElementById('smsContactAlert');
            const origText = btn.innerHTML;

            btn.disabled = true;
            btn.innerHTML = 'Sending...';

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = origText;
                if (alertBox) {
                    alertBox.className = 'sms-form-alert success';
                    alertBox.textContent = SMS_I18n.__('msg_sent_success');
                    alertBox.style.display = 'block';
                }
                contactForm.reset();
            }, 600);
        });
    }
});

function renderLandingNotices() {
    const container = document.getElementById('landingNoticesContainer');
    if (!container) return;

    const db = SMSData.get();
    const publicNotices = db.notices.filter(n => n.target_role === 'all' || n.target_role === 'public');

    if (publicNotices.length === 0) {
        container.innerHTML = `<p class="text-muted">${SMS_I18n.__('no_notices')}</p>`;
        return;
    }

    let html = '';
    publicNotices.slice(0, 4).forEach(n => {
        const isUrgent = n.priority === 'urgent';
        html += `
            <div class="sms-notice-card ${isUrgent ? 'urgent-border' : ''}">
                <div class="notice-meta">
                    <span class="notice-date"><i class="dashicons dashicons-calendar-alt"></i> ${n.publish_date}</span>
                    ${isUrgent ? `<span class="sms-badge badge-urgent">${SMS_I18n.__('urgent')}</span>` : `<span class="sms-badge badge-normal">${SMS_I18n.__('normal')}</span>`}
                </div>
                <h3 class="notice-title">${escapeHTML(n.title)}</h3>
                <p class="notice-snippet">${escapeHTML(n.content)}</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
