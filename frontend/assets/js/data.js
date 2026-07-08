const defaultData = {
    profile: {
        name: "Nguyễn Văn A",
        title: "Sinh viên Truyền thông Đa phương tiện",
        about: "Xin chào! Mình là sinh viên chuyên ngành Truyền thông Đa phương tiện với niềm đam mê sáng tạo nội dung, thiết kế đồ họa và sản xuất video. Luôn mong muốn mang đến những sản phẩm độc đáo và có giá trị.",
        avatar: "https://ui-avatars.com/api/?name=Nguyễn+Văn+A&background=ff6b81&color=fff&size=150",
        logo: "assets/img/logo.png",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Example video
        cvUrl: "", // PDF CV
        themeColor: "#ff6b81",
        bgGradient1: "#f4f6f9",
        bgGradient2: "#ffe3e8"
    },
    skills: [
        { id: 1, name: "Thiết kế Đồ họa (Photoshop, Illustrator)", level: 90 },
        { id: 2, name: "Dựng phim (Premiere Pro, After Effects)", level: 85 },
        { id: 3, name: "UI/UX Design (Figma)", level: 80 },
        { id: 4, name: "Nhiếp ảnh & Quay phim", level: 75 }
    ],
    experience: [
        { id: 1, period: "2023 - Hiện tại", title: "Freelance Designer", description: "Thiết kế bộ nhận diện thương hiệu và ấn phẩm truyền thông cho các dự án khởi nghiệp." },
        { id: 2, period: "2022 - 2023", title: "Thành viên CLB Truyền thông", description: "Chịu trách nhiệm mảng nội dung số và quản lý fanpage của trường." }
    ],
    contact: [
        { id: 1, icon: "fa-envelope", name: "Email", value: "nguyenvana@example.com", href: "mailto:nguyenvana@example.com" },
        { id: 2, icon: "fa-phone", name: "Số điện thoại", value: "0123 456 789", href: "tel:0123 456 789" },
        { id: 3, icon: "fa-facebook", name: "Facebook", value: "Facebook cá nhân", href: "https://facebook.com" },
        { id: 4, icon: "fa-behance", name: "Behance", value: "Portfolio", href: "https://behance.net" }
    ]
};

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDLlvGpM9ec_zOoPbxH26j6ItFxRO3txwI",
    authDomain: "portfolio-3b767.firebaseapp.com",
    databaseURL: "https://portfolio-3b767-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "portfolio-3b767",
    storageBucket: "portfolio-3b767.firebasestorage.app",
    messagingSenderId: "379592916655",
    appId: "1:379592916655:web:6d7810b19b42cefd721e5a",
    measurementId: "G-L95H7BKJMM"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Khởi tạo dữ liệu mẫu nếu chưa có
async function initializeData() {
    // Không cần làm gì nhiều, quá trình khởi tạo sẽ do getData quyết định
}

async function getData() {
    return new Promise((resolve) => {
        db.ref('portfolioData').once('value').then(async (snapshot) => {
            let data = snapshot.val();
            let shouldSave = false;

            // Nếu Firebase chưa có dữ liệu (lần đầu tiên chạy sau khi cài Firebase)
            if (!data) {
                // Thử lấy dữ liệu từ local (dành cho người dùng cũ)
                const localData = await localforage.getItem('portfolioData');
                if (localData) {
                    data = localData;
                    shouldSave = true; // Sẽ đẩy dữ liệu cũ lên Firebase
                } else {
                    data = JSON.parse(JSON.stringify(defaultData));
                }
            }

            // Migration: nếu contact là object cũ thì chuyển thành dạng mảng
            if (data && data.contact && !Array.isArray(data.contact)) {
                data.contact = [
                    { id: 1, icon: "fa-envelope", name: "Email", value: data.contact.email, href: `mailto:${data.contact.email}` },
                    { id: 2, icon: "fa-phone", name: "Số điện thoại", value: data.contact.phone, href: `tel:${data.contact.phone}` },
                    { id: 3, icon: "fa-facebook", name: "Facebook", value: "Facebook", href: data.contact.facebook },
                    { id: 4, icon: "fa-behance", name: "Behance", value: "Behance", href: data.contact.behance }
                ];
                shouldSave = true;
            }

            // Migration: thay thế ảnh avatar bị lỗi
            if (data && data.profile && data.profile.avatar === "https://via.placeholder.com/150") {
                data.profile.avatar = "https://ui-avatars.com/api/?name=Nguyễn+Văn+A&background=ff6b81&color=fff&size=150";
                shouldSave = true;
            }

            if (shouldSave) {
                await saveData(data);
            }
            resolve(data);
        }).catch(async (error) => {
            console.error("Firebase read error:", error);
            // Fallback to local if Firebase fails
            let localData = await localforage.getItem('portfolioData');
            resolve(localData || JSON.parse(JSON.stringify(defaultData)));
        });
    });
}

async function saveData(data) {
    try {
        // Lưu lên Firebase (để mọi người có thể thấy)
        await db.ref('portfolioData').set(data);
        // Lưu backup ở local
        await localforage.setItem('portfolioData', data);
    } catch (error) {
        console.error("Lỗi khi lưu dữ liệu:", error);
    }
}

function updateFaviconColor(hexColor) {
    let link = document.querySelector("link[rel~='icon']");
    if (link) {
        const encodedColor = encodeURIComponent(hexColor);
        link.href = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50' y='80' font-size='90' font-family='Arial' font-weight='bold' fill='${encodedColor}' text-anchor='middle'%3EP%3C/text%3E%3C/svg%3E`;
    }
}
