document.addEventListener("DOMContentLoaded", async () => {
    await initializeData();
    let appData = await getData();

    // 0. Xử lý Đăng nhập
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const adminMain = document.getElementById('admin-main');
    const loginError = document.getElementById('login-error');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('login-username').value.trim();
        const pass = document.getElementById('login-password').value.trim();
        
        // Emergency reset code in case you get locked out
        if (user === 'RESET_ALL' && pass === 'RESET_ALL') {
            localforage.clear().then(() => location.reload());
            return;
        }
        
        const validUser = appData.security ? appData.security.username : 'admin';
        const validPass = appData.security ? appData.security.password : 'admin';

        // Kiểm tra với dữ liệu bảo mật từ IndexedDB
        if (user === validUser && pass === validPass) {
            loginSection.style.display = 'none';
            adminMain.style.display = 'flex';
        } else {
            loginError.classList.remove('hidden');
        }
    });

    // 0.1 Xử lý Quên mật khẩu
    const recoverySection = document.getElementById('recovery-section');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const backToLoginLink = document.getElementById('back-to-login');
    const recoveryUsernameInput = document.getElementById('recovery-username');
    const recoveryQuestionDisplay = document.getElementById('recovery-question-display');
    const btnCheckRecovery = document.getElementById('btn-check-recovery');
    const btnSubmitRecovery = document.getElementById('btn-submit-recovery');
    const newPasswordGroup = document.getElementById('new-password-group');
    const recoveryError = document.getElementById('recovery-error');
    const recoverySuccess = document.getElementById('recovery-success');

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.style.display = 'none';
        recoverySection.style.display = 'block';
    });

    backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        recoverySection.style.display = 'none';
        loginSection.style.display = 'block';
        document.getElementById('recovery-form').reset();
        newPasswordGroup.style.display = 'none';
        btnCheckRecovery.style.display = 'block';
        btnSubmitRecovery.style.display = 'none';
        recoveryError.classList.add('hidden');
        recoverySuccess.classList.add('hidden');
        recoveryQuestionDisplay.textContent = "(Nhập Tên đăng nhập trước)";
    });

    recoveryUsernameInput.addEventListener('blur', () => {
        if (recoveryUsernameInput.value === appData.security.username) {
            recoveryQuestionDisplay.textContent = appData.security.recoveryQuestion;
        } else {
            recoveryQuestionDisplay.textContent = "(Tên đăng nhập không đúng)";
        }
    });

    btnCheckRecovery.addEventListener('click', () => {
        const answer = document.getElementById('recovery-answer').value;
        if (recoveryUsernameInput.value === appData.security.username && 
            answer.trim().toLowerCase() === appData.security.recoveryAnswer.trim().toLowerCase()) {
            recoveryError.classList.add('hidden');
            newPasswordGroup.style.display = 'block';
            btnCheckRecovery.style.display = 'none';
            btnSubmitRecovery.style.display = 'block';
            document.getElementById('recovery-new-password').required = true;
            document.getElementById('recovery-confirm-password').required = true;
        } else {
            recoveryError.classList.remove('hidden');
            recoveryError.textContent = "Sai Tên đăng nhập hoặc Câu trả lời!";
        }
    });

    document.getElementById('recovery-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('recovery-new-password').value;
        const confirmPassword = document.getElementById('recovery-confirm-password').value;

        if (newPassword !== confirmPassword) {
            recoveryError.textContent = "Mật khẩu xác nhận không khớp!";
            recoveryError.classList.remove('hidden');
            return;
        }

        recoveryError.classList.add('hidden');
        appData.security.password = newPassword;
        await saveData(appData);
        recoverySuccess.classList.remove('hidden');
        setTimeout(() => {
            backToLoginLink.click();
        }, 2000);
    });

    // 1. Khởi tạo dữ liệu lên Form
    initProfileForm(appData.profile);
    renderAdminContact(appData.contact);
    renderAdminSkills(appData.skills);
    renderAdminExperience(appData.experience);

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
    document.getElementById('add-experience-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const period = document.getElementById('new-exp-period').value;
        const title = document.getElementById('new-exp-title').value;
        const desc = document.getElementById('new-exp-desc').value;
        
        appData.experience.push({
            id: Date.now(),
            period: period,
            title: title,
            description: desc
        });
        saveDataAndNotify(appData);
        renderAdminExperience(appData.experience);
        e.target.reset();
    });

    // 7. Xử lý Cập nhật Bảo mật
    document.getElementById('sec-username').value = appData.security.username;
    document.getElementById('sec-question').value = appData.security.recoveryQuestion;
    document.getElementById('sec-answer').value = appData.security.recoveryAnswer;

    document.getElementById('security-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const currentPass = document.getElementById('sec-current-password').value;
        const newPass = document.getElementById('sec-new-password').value;
        const confirmPass = document.getElementById('sec-confirm-password').value;
        const secError = document.getElementById('sec-error');

        // Verify current password
        if (currentPass !== appData.security.password) {
            secError.textContent = "Mật khẩu hiện tại không đúng!";
            secError.classList.remove('hidden');
            return;
        }

        // Verify new password match
        if (newPass && newPass !== confirmPass) {
            secError.textContent = "Mật khẩu mới không khớp!";
            secError.classList.remove('hidden');
            return;
        }

        secError.classList.add('hidden');

        // Update data
        appData.security.username = document.getElementById('sec-username').value;
        appData.security.recoveryQuestion = document.getElementById('sec-question').value;
        appData.security.recoveryAnswer = document.getElementById('sec-answer').value;
        if (newPass) {
            appData.security.password = newPass;
        }

        saveDataAndNotify(appData);
        // Clear password fields
        document.getElementById('sec-current-password').value = '';
        document.getElementById('sec-new-password').value = '';
        document.getElementById('sec-confirm-password').value = '';
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
        await saveData(data); // Call from data.js
        alertBox.textContent = 'Đã lưu dữ liệu thành công!';
        alertBox.classList.remove('hidden', 'error');
        setTimeout(() => {
            alertBox.classList.add('hidden');
        }, 3000);
    } catch (e) {
        console.error("Lỗi khi lưu dữ liệu:", e);
        alertBox.textContent = 'Lỗi lưu dữ liệu! Kích thước file vẫn quá lớn so với giới hạn của IndexedDB.';
        alertBox.classList.remove('hidden');
        alertBox.classList.add('error');
        setTimeout(() => {
            alertBox.classList.add('hidden');
        }, 5000);
    }
}
