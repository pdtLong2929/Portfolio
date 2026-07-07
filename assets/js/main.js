document.addEventListener("DOMContentLoaded", async () => {
    // 1. Load dữ liệu từ IndexedDB (thông qua hàm trong data.js)
    await initializeData();
    const data = await getData();
    
    if (data) {
        renderProfile(data.profile);
        renderSkills(data.skills);
        renderExperience(data.experience);
        renderContact(data.contact);
    }

    // 2. Animate skill bars on scroll
    window.addEventListener('scroll', animateSkills);

    // 3. Mobile menu toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Hide menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
});

function renderProfile(profile) {
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-title').textContent = profile.title;
    document.getElementById('profile-about').textContent = profile.about;
    document.getElementById('profile-avatar').src = profile.avatar;
    document.getElementById('footer-name').textContent = profile.name;
    
    // Set Theme Color
    if (profile.themeColor) {
        document.documentElement.style.setProperty('--primary-color', profile.themeColor);
        // Tạo hiệu ứng shadow mềm dẻo dựa trên màu HEX
        let hex = profile.themeColor.replace('#', '');
        if (hex.length === 6) {
            let r = parseInt(hex.substring(0, 2), 16);
            let g = parseInt(hex.substring(2, 4), 16);
            let b = parseInt(hex.substring(4, 6), 16);
            document.documentElement.style.setProperty('--glass-shadow', `0 8px 32px 0 rgba(${r}, ${g}, ${b}, 0.15)`);
        }
    }
    
    // Set Background Gradient
    if (profile.bgGradient1 && profile.bgGradient2) {
        document.body.style.background = `linear-gradient(135deg, ${profile.bgGradient1} 0%, ${profile.bgGradient2} 100%)`;
        document.body.style.backgroundAttachment = 'fixed';
    }
    
    // Set Logo
    if (profile.logo) {
        document.getElementById('site-logo').src = profile.logo;
    }
    
    // Set iframe/video src if exists
    const videoFrame = document.getElementById('profile-video');
    if (profile.videoUrl && profile.videoUrl.trim() !== '') {
        videoFrame.src = profile.videoUrl;
    } else {
        if (videoFrame) videoFrame.parentElement.style.display = 'none'; // hide if no video
    }

    // Set CV button
    const btnCv = document.getElementById('btn-view-cv');
    if (btnCv) {
        btnCv.style.display = 'flex';
        btnCv.href = (profile.cvUrl && profile.cvUrl.trim() !== '') ? profile.cvUrl : '#';
    }
}

function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    container.innerHTML = ''; // clear loading state
    
    skills.forEach(skill => {
        const skillEl = document.createElement('div');
        skillEl.className = 'skill-card glass-panel';
        skillEl.innerHTML = `
            <div class="skill-info">
                <span>${skill.name}</span>
                <span>${skill.level}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress" data-width="${skill.level}%"></div>
            </div>
        `;
        container.appendChild(skillEl);
    });
}

function renderExperience(expList) {
    const container = document.getElementById('experience-container');
    container.innerHTML = '';
    
    expList.forEach(exp => {
        const expEl = document.createElement('div');
        expEl.className = 'timeline-item';
        expEl.innerHTML = `
            <div class="timeline-content glass-panel">
                <div class="timeline-period">${exp.period}</div>
                <h3>${exp.title}</h3>
                <p>${exp.description}</p>
            </div>
        `;
        container.appendChild(expEl);
    });
}

function renderContact(contactArray) {
    const container = document.getElementById('contact-container');
    container.innerHTML = '';
    
    // Nếu data chưa được migrate (vẫn là object), chuyển nó thành mảng tạm thời để hiển thị
    let contacts = contactArray;
    if (!Array.isArray(contacts)) {
        contacts = [
            { icon: 'fa-envelope', value: contactArray.email, href: `mailto:${contactArray.email}` },
            { icon: 'fa-phone', value: contactArray.phone, href: `tel:${contactArray.phone}` },
            { icon: 'fa-facebook', value: 'Facebook', href: contactArray.facebook },
            { icon: 'fa-behance', value: 'Behance', href: contactArray.behance }
        ];
    }
    
    contacts.forEach(c => {
        if(c.value && c.href && c.href !== '') {
            const brands = ['fa-facebook', 'fa-facebook-f', 'fa-twitter', 'fa-instagram', 'fa-linkedin', 'fa-linkedin-in', 'fa-github', 'fa-youtube', 'fa-tiktok', 'fa-behance', 'fa-dribbble', 'fa-discord', 'fa-telegram', 'fa-whatsapp'];
            const prefix = brands.includes(c.icon) ? 'fab' : 'fas';
            
            const el = document.createElement('a');
            el.href = c.href;
            el.target = '_blank';
            el.className = 'contact-card glass-panel';
            el.innerHTML = `
                <i class="${prefix} ${c.icon} contact-icon"></i>
                <span>${c.name ? c.name + ': ' : ''}${c.value}</span>
            `;
            container.appendChild(el);
        }
    });
}

// Hàm chạy hiệu ứng thanh progress khi cuộn chuột tới
function animateSkills() {
    const section = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.progress');
    
    if(!section || progressBars.length === 0) return;
    
    const sectionPos = section.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.3;
    
    if (sectionPos < screenPos) {
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
    }
}
