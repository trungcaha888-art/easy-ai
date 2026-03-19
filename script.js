/* ============================================
   TẾT FLASH SALE - JavaScript
   Countdown, Particles, Scroll FX
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initParticles();
    initScrollReveal();
    initPopup();
    initLiveStats();
    initSocialProof();
});

/* ---------- Live Stats (Viewers + Registrations) ---------- */
function initLiveStats() {
    const viewerEl = document.getElementById('viewerCount');
    const regEl = document.getElementById('regCount');

    // Fixed daily number 10-18 based on today's date
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const hash = ((seed * 9301 + 49297) % 233280);
    const dailyReg = 10 + (hash % 9); // 10 to 18
    regEl.textContent = dailyReg;

    // Fluctuate viewer count around 300-380
    function updateViewers() {
        const base = 310;
        const variation = Math.floor(Math.random() * 70) - 15;
        viewerEl.textContent = base + variation;
    }

    setInterval(updateViewers, 3000 + Math.random() * 3000);
    updateViewers();
}

/* ---------- Countdown Timer (15-min loop) ---------- */
function initCountdown() {
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    if (!minutesEl || !secondsEl) return;

    const TOTAL_SECONDS = 15 * 60; // 15 minutes
    let remaining = TOTAL_SECONDS;

    function pad(n) {
        return n.toString().padStart(2, '0');
    }

    function updateTimer() {
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;

        const newMins = pad(mins);
        const newSecs = pad(secs);

        if (minutesEl.textContent !== newMins) {
            minutesEl.style.transform = 'scale(1.15)';
            minutesEl.textContent = newMins;
            setTimeout(() => { minutesEl.style.transform = 'scale(1)'; }, 150);
        }
        if (secondsEl.textContent !== newSecs) {
            secondsEl.textContent = newSecs;
        }

        remaining--;
        if (remaining < 0) {
            remaining = TOTAL_SECONDS; // Reset loop
        }
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

/* ---------- Gold Sparkle Particles ---------- */
function initParticles() {
    const container = document.getElementById('particlesContainer');

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = (2 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDuration = (6 + Math.random() * 8) + 's';
        particle.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 16000);
    }

    // Initial particles
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createParticle(), i * 200);
    }

    // Continuous particles
    setInterval(createParticle, 1000);
}

/* ---------- Scroll Reveal ---------- */
function initScrollReveal() {
    const revealTargets = document.querySelectorAll(
        '.countdown-wrapper, .section-header, .pricing-table-card, .bank-card, .total-value, .urgency-wrapper'
    );

    revealTargets.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => observer.observe(el));
}

/* ---------- Popup Modal ---------- */
function initPopup() {
    const overlay = document.getElementById('modalOverlay');
    const openBtn = document.getElementById('openPopupBtn');
    const closeBtn = document.getElementById('modalClose');
    const form = document.getElementById('registrationForm');

    if (!overlay || !openBtn) return;

    // Open popup
    openBtn.addEventListener('click', () => {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Bottom CTA button also opens popup
    const openBtnBottom = document.getElementById('openPopupBtnBottom');
    if (openBtnBottom) {
        openBtnBottom.addEventListener('click', () => {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close popup
    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeModal();
        }
    });

    // ===== Google Apps Script Web App URL =====
    // Replace this with your deployed Apps Script URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxgts-hj7ZRZlci5E__1MgKTFpwaApCoMOgPmVgh2dN3tEvt8p0sMj2tC__jpUgd0xJ/exec';

    // Bank transfer modal
    const bankOverlay = document.getElementById('bankModalOverlay');
    const bankCloseBtn = document.getElementById('bankModalClose');

    function closeBankModal() {
        bankOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openBankModal() {
        bankOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    bankCloseBtn.addEventListener('click', closeBankModal);
    bankOverlay.addEventListener('click', (e) => {
        if (e.target === bankOverlay) closeBankModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bankOverlay.classList.contains('active')) {
            closeBankModal();
        }
    });

    // Form submit → send to Google Sheets, then show bank transfer popup
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (!name || !email || !phone) return;

        // Disable button while submitting
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Đang gửi...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    timestamp: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
                })
            });

            // Close registration modal and open bank transfer modal
            closeModal();
            form.reset();
            openBankModal();
        } catch (error) {
            console.error('Submit error:', error);
            // Still show bank transfer popup even on error
            closeModal();
            form.reset();
            openBankModal();
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

/* ---------- Social Proof Notification ---------- */
function initSocialProof() {
    const proofEl = document.getElementById('socialProof');
    const nameEl = document.getElementById('socialProofName');
    const phoneEl = document.getElementById('socialProofPhone');
    const avatarEl = document.getElementById('socialProofAvatar');

    if (!proofEl || !nameEl || !phoneEl || !avatarEl) return;

    // Vietnamese names for social proof
    const buyers = [
        'Ly', 'Hương', 'Minh', 'Thuỷ', 'Đức', 'Lan', 'Phương', 'Hải',
        'Trang', 'Quang', 'Mai', 'Tuấn', 'Ngọc', 'Hoàng', 'Linh',
        'Anh', 'Bình', 'Dũng', 'Hà', 'Khoa', 'Long', 'Nam',
        'Oanh', 'Phúc', 'Sơn', 'Thảo', 'Uyên', 'Vân', 'Yến',
        'Cường', 'Đạt', 'Giang', 'Hiền', 'Khánh', 'Nhung', 'Trâm'
    ];

    // Phone prefixes (common Vietnamese mobile)
    const phonePrefixes = [
        '0912', '0903', '0987', '0978', '0366', '0352', '0388',
        '0971', '0965', '0934', '0918', '0909', '0943', '0328',
        '0395', '0382', '0358', '0346', '0855', '0898'
    ];

    // Time labels
    const timeLabels = [
        'vài giây trước', '1 phút trước', '2 phút trước', '3 phút trước',
        '5 phút trước', '8 phút trước', '10 phút trước', '15 phút trước'
    ];

    // Avatar emojis
    const avatars = ['🎓', '👩‍💻', '👨‍💼', '🧑‍🎓', '👩‍🏫', '🙋‍♀️', '🙋‍♂️', '💁‍♀️', '🧑‍💻', '👨‍🎓'];

    let lastIndex = -1;
    let isShowing = false;

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getMaskedPhone() {
        const prefix = getRandomItem(phonePrefixes);
        const mid = Math.floor(Math.random() * 900 + 100); // 3 random digits
        return `${prefix} ${mid} ***`;
    }

    function showNotification() {
        if (isShowing) return;
        isShowing = true;

        // Pick a different name each time
        let idx;
        do { idx = Math.floor(Math.random() * buyers.length); } while (idx === lastIndex);
        lastIndex = idx;

        // Update content
        nameEl.textContent = buyers[idx] + ' vừa mua khóa học';
        phoneEl.textContent = getMaskedPhone();
        avatarEl.textContent = getRandomItem(avatars);

        // Update time
        const timeEl = proofEl.querySelector('.social-proof-time');
        if (timeEl) timeEl.textContent = getRandomItem(timeLabels);

        // Slide in
        proofEl.classList.add('active');

        // Slide out after 5 seconds
        setTimeout(() => {
            proofEl.classList.remove('active');
            isShowing = false;
        }, 5000);
    }

    // First notification after 5-8 seconds
    const firstDelay = 5000 + Math.random() * 3000;
    setTimeout(() => {
        showNotification();
        // Then repeat every 8-15 seconds
        setInterval(() => {
            showNotification();
        }, 8000 + Math.random() * 7000);
    }, firstDelay);
}


