let appData = null;
let currentUid = null;

document.addEventListener("DOMContentLoaded", async () => {
    await initializeData();

    // 0. Xử lý Đăng nhập/Đăng ký Firebase
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const adminMain = document.getElementById('admin-main');
    const loginError = document.getElementById('login-error');
    const loginSuccess = document.getElementById('login-success');
    const btnGoogleLogin = document.getElementById('btn-google-login');
    // Theo dõi trạng thái đăng nhập
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            // Đã đăng nhập
            currentUid = user.uid;
            appData = await getData(currentUid);
            
            // Khởi tạo dữ liệu lên Form
            initProfileForm(appData.profile);
            renderAdminContact(appData.contact);
            renderAdminSkills(appData.skills);
            renderAdminExperience(appData.experience);

            // Cập nhật Link chia sẻ
            const publicLink = `${window.location.origin}/index.html?user=${currentUid}`;
            document.getElementById('public-link-input').value = publicLink;
            document.getElementById('btn-view-public').href = `index.html?user=${currentUid}`;

            loginSection.style.display = 'none';
            adminMain.style.display = 'flex';
        } else {
            // Chưa đăng nhập
            currentUid = null;
            appData = null;
            loginSection.style.display = 'block';
            adminMain.style.display = 'none';
        }
    });
    if (btnGoogleLogin) {
        btnGoogleLogin.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            btnGoogleLogin.disabled = true;
            loginError.classList.add('hidden');
            
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    loginSuccess.classList.remove('hidden');
                    btnGoogleLogin.disabled = false;
                })
                .catch((error) => {
                    console.error("Lỗi đăng nhập Google:", error);
                    loginError.textContent = "Đăng nhập thất bại: " + error.message;
                    loginError.classList.remove('hidden');
                    btnGoogleLogin.disabled = false;
                });
        });
    }

    // 0.1 Xử lý Đăng xuất & Copy link
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            firebase.auth().signOut().then(() => {
                window.location.reload();
            });
        });
    }

    const btnCopyLink = document.getElementById('btn-copy-link');
    if (btnCopyLink) {
        btnCopyLink.addEventListener('click', () => {
            const linkInput = document.getElementById('public-link-input');
            linkInput.select();
            document.execCommand("copy");
            btnCopyLink.textContent = "Đã copy!";
            setTimeout(() => {
                btnCopyLink.textContent = "Copy Link";
            }, 2000);
        });
    }

    // 2. Chuyển đổi các Tab
    const menuLinks = document.querySelectorAll('.admin-menu a[data-target]');
    const sections = document.querySelectorAll('.admin-section');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active classes
            menuLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class
            link.classList.add('active');
            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 2.1 Xử lý xem trước ảnh đại diện (Preview Avatar)
    let currentAvatarDataUrl = appData.profile.avatar || '';
    document.getElementById('input-avatar-file').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                currentAvatarDataUrl = event.target.result;
                const preview = document.getElementById('preview-avatar');
                preview.src = currentAvatarDataUrl;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // 2.1.1 Xử lý xem trước Logo
    let currentLogoDataUrl = appData.profile.logo || 'assets/img/logo.png';
    document.getElementById('input-logo-file').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                currentLogoDataUrl = event.target.result;
                const preview = document.getElementById('preview-logo');
                preview.src = currentLogoDataUrl;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // 2.2 Xử lý xem trước video giới thiệu
    let currentVideoDataUrl = appData.profile.videoUrl || '';
    document.getElementById('input-video-file').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                currentVideoDataUrl = event.target.result;
                const previewVideo = document.getElementById('preview-video');
                previewVideo.src = currentVideoDataUrl;
                previewVideo.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // 2.3 Xử lý tải lên CV
    let currentCvDataUrl = appData.profile.cvUrl || '';
    document.getElementById('input-cv-file').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                currentCvDataUrl = event.target.result;
                document.getElementById('cv-status').textContent = `Đã chọn: ${file.name} (Chờ bấm Lưu thay đổi)`;
            };
            reader.readAsDataURL(file);
        }
    });

    // 3. Xử lý Form Submit (Profile)
    document.getElementById('profile-form').addEventListener('submit', (e) => {
        e.preventDefault();
        appData.profile = {
            name: document.getElementById('input-name').value,
            title: document.getElementById('input-title').value,
            avatar: currentAvatarDataUrl,
            logo: currentLogoDataUrl,
            videoUrl: currentVideoDataUrl,
            cvUrl: currentCvDataUrl,
            about: document.getElementById('input-about').value,
            themeColor: document.getElementById('input-theme-color').value,
            bgGradient1: document.getElementById('input-bg-1').value,
            bgGradient2: document.getElementById('input-bg-2').value
        };
        saveDataAndNotify(appData);
    });

    // 3.1 Cập nhật màu giao diện trực tiếp khi chọn
    document.getElementById('input-theme-color').addEventListener('input', (e) => {
        const hex = e.target.value;
        document.documentElement.style.setProperty('--primary-color', hex);
        if (typeof updateFaviconColor === 'function') updateFaviconColor(hex);
    });

    const updateGradient = () => {
        const c1 = document.getElementById('input-bg-1').value;
        const c2 = document.getElementById('input-bg-2').value;
        document.body.style.background = `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
    };
    document.getElementById('input-bg-1').addEventListener('input', updateGradient);
    document.getElementById('input-bg-2').addEventListener('input', updateGradient);

    // 4. Xử lý Form Submit (Contact) - Thêm liên hệ mới
    document.getElementById('add-contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('new-contact-name').value;
        const icon = document.getElementById('new-contact-icon').value;
        const value = document.getElementById('new-contact-value').value;
        const url = document.getElementById('new-contact-url').value;
        
        // Ensure contact is an array (Migration handle)
        if(!Array.isArray(appData.contact)) {
            appData.contact = [];
        }

        appData.contact.push({
            id: Date.now(),
            icon: icon,
            name: name,
            value: value,
            href: url
        });
        saveDataAndNotify(appData);
        renderAdminContact(appData.contact);
        e.target.reset();
    });

    // 5. Thêm Kỹ năng
    document.getElementById('add-skill-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('new-skill-name').value;
        const level = document.getElementById('new-skill-level').value;
        
        appData.skills.push({
            id: Date.now(),
            name: name,
            level: level
        });
        saveDataAndNotify(appData);
        renderAdminSkills(appData.skills);
        e.target.reset(); // clear form
    });

    // 6. Thêm Kinh nghiệm
    const expPresentCheckbox = document.getElementById('new-exp-present');
    if (expPresentCheckbox) {
        expPresentCheckbox.addEventListener('change', function() {
            document.getElementById('new-exp-end').disabled = this.checked;
        });
    }

    document.getElementById('add-experience-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const startRaw = document.getElementById('new-exp-start').value;
        const endRaw = document.getElementById('new-exp-end').value;
        const isPresent = document.getElementById('new-exp-present').checked;
        const title = document.getElementById('new-exp-title').value;
        const desc = document.getElementById('new-exp-desc').value;
        
        // Format period string
        let period = "";
        if (startRaw) {
            const [sYear, sMonth] = startRaw.split('-');
            period += `${sMonth}/${sYear}`;
        }
        if (isPresent) {
            period += " - Hiện tại";
        } else if (endRaw) {
            const [eYear, eMonth] = endRaw.split('-');
            period += ` - ${eMonth}/${eYear}`;
        }
        
        appData.experience.push({
            id: Date.now(),
            period: period,
            startDate: startRaw,
            endDate: isPresent ? "present" : endRaw,
            title: title,
            description: desc
        });
        saveDataAndNotify(appData);
        renderAdminExperience(appData.experience);
        e.target.reset(); // clear form
        document.getElementById('new-exp-end').disabled = false;
    });

    // Expose delete functions to global for inline onclick
    window.deleteSkill = (id) => {
        if(confirm('Bạn có chắc chắn muốn xóa?')) {
            appData.skills = appData.skills.filter(s => s.id !== id);
            saveDataAndNotify(appData);
            renderAdminSkills(appData.skills);
        }
    };

    window.deleteExperience = (id) => {
        if(confirm('Bạn có chắc chắn muốn xóa?')) {
            appData.experience = appData.experience.filter(e => e.id !== id);
            saveDataAndNotify(appData);
            renderAdminExperience(appData.experience);
        }
    };

    window.deleteContact = (id) => {
        if(confirm('Bạn có chắc chắn muốn xóa?')) {
            appData.contact = appData.contact.filter(c => c.id !== id);
            saveDataAndNotify(appData);
            renderAdminContact(appData.contact);
        }
    };
});

// Helper Functions
function initProfileForm(profile) {
    document.getElementById('input-name').value = profile.name || '';
    document.getElementById('input-title').value = profile.title || '';
    document.getElementById('input-about').value = profile.about || '';
    
    const themeColor = profile.themeColor || '#ff6b81';
    document.getElementById('input-theme-color').value = themeColor;
    document.documentElement.style.setProperty('--primary-color', themeColor);
    if (typeof updateFaviconColor === 'function') updateFaviconColor(themeColor);
    
    const bg1 = profile.bgGradient1 || '#f4f6f9';
    const bg2 = profile.bgGradient2 || '#ffe3e8';
    document.getElementById('input-bg-1').value = bg1;
    document.getElementById('input-bg-2').value = bg2;
    document.body.style.background = `linear-gradient(135deg, ${bg1} 0%, ${bg2} 100%)`;

    // Avatar preview
    const preview = document.getElementById('preview-avatar');
    if (profile.avatar) {
        preview.src = profile.avatar;
        preview.style.display = 'block';
    }

    // Logo preview
    const previewLogo = document.getElementById('preview-logo');
    if (profile.logo) {
        previewLogo.src = profile.logo;
        previewLogo.style.display = 'block';
    }

    // Video preview
    const previewVideo = document.getElementById('preview-video');
    if (profile.videoUrl && !profile.videoUrl.includes('youtube.com')) {
        previewVideo.src = profile.videoUrl;
        previewVideo.style.display = 'block';
    }

    // CV Status
    const cvStatus = document.getElementById('cv-status');
    if (profile.cvUrl) {
        cvStatus.textContent = "Hệ thống đang có sẵn 1 bản CV. Bạn có thể tải file mới để thay thế.";
    } else {
        cvStatus.textContent = "";
    }
}

function renderAdminContact(contactArray) {
    const container = document.getElementById('admin-contact-list');
    container.innerHTML = '';
    
    let contacts = contactArray;
    if (!Array.isArray(contacts)) {
        contacts = []; // Nếu chưa migrate kịp thì để trống
    }

    contacts.forEach(c => {
        const brands = ['fa-facebook', 'fa-facebook-f', 'fa-twitter', 'fa-instagram', 'fa-linkedin', 'fa-linkedin-in', 'fa-github', 'fa-youtube', 'fa-tiktok', 'fa-behance', 'fa-dribbble', 'fa-discord', 'fa-telegram', 'fa-whatsapp'];
        const prefix = brands.includes(c.icon) ? 'fab' : 'fas';
        
        container.innerHTML += `
            <div class="list-item">
                <div>
                    <strong><i class="${prefix} ${c.icon}"></i> ${c.name}</strong>: ${c.value}
                </div>
                <div class="item-actions">
                    <button onclick="deleteContact(${c.id})" title="Xóa"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
}

function renderAdminSkills(skills) {
    const container = document.getElementById('admin-skills-list');
    container.innerHTML = '';
    skills.forEach(skill => {
        container.innerHTML += `
            <div class="list-item">
                <div>
                    <strong>${skill.name}</strong> - Mức độ: ${skill.level}%
                </div>
                <div class="item-actions">
                    <button onclick="deleteSkill(${skill.id})" title="Xóa"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
}

function renderAdminExperience(experience) {
    const container = document.getElementById('admin-experience-list');
    container.innerHTML = '';
    experience.forEach(exp => {
        container.innerHTML += `
            <div class="list-item">
                <div>
                    <strong>${exp.period}</strong>: ${exp.title}
                </div>
                <div class="item-actions">
                    <button onclick="deleteExperience(${exp.id})" title="Xóa"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
}

async function saveDataAndNotify(data) {
    const alertBox = document.getElementById('alert-message');
    try {
        await saveData(data, currentUid); // Call from data.js
        alertBox.textContent = 'Đã lưu dữ liệu thành công!';
        alertBox.classList.remove('hidden', 'error');
        setTimeout(() => {
            alertBox.classList.add('hidden');
        }, 3000);
    } catch (e) {
        console.error("Lỗi khi lưu dữ liệu:", e);
        alertBox.textContent = 'Lỗi lưu dữ liệu!';
        alertBox.classList.remove('hidden');
        alertBox.classList.add('error');
        setTimeout(() => {
            alertBox.classList.add('hidden');
        }, 5000);
    }
}
