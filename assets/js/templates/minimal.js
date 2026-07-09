window.PortfolioTemplates = window.PortfolioTemplates || {};

window.PortfolioTemplates.minimal = `
    <header style="border-bottom: 1px solid #eaeaea; background: #fff;">
        <div class="container">
            <nav style="justify-content: space-between;">
                <div class="logo" style="font-weight: 300; font-size: 1.5rem; letter-spacing: 2px;">
                    <span id="site-logo-text">Portfolio.</span>
                </div>
                <ul class="nav-links" style="font-weight: 400; font-size: 0.95rem;">
                    <li><a href="#home" style="color: #333;">About</a></li>
                    <li><a href="#skills" style="color: #333;">Skills</a></li>
                    <li><a href="#experience" style="color: #333;">Experience</a></li>
                    <li><a href="#contact" style="color: #333;">Contact</a></li>
                    <li><a href="admin.html" style="color: #999; font-size: 0.8rem;">Admin</a></li>
                </ul>
                <div class="mobile-menu-btn">
                    <i class="fas fa-bars" style="color: #333;"></i>
                </div>
            </nav>
        </div>
    </header>

    <main style="background: #fafafa; padding-top: 50px;">
        <!-- Hero Section -->
        <section id="home" class="container" style="min-height: auto; padding: 60px 0; text-align: left; display: flex; flex-direction: column; align-items: flex-start;">
            <div style="display: flex; gap: 40px; align-items: center; flex-wrap: wrap;">
                <img id="profile-avatar" src="https://via.placeholder.com/150" alt="Avatar" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 1px solid #ddd;">
                <div>
                    <h1 style="font-size: 3rem; font-weight: 300; color: #111; margin-bottom: 10px;" id="profile-name">Loading...</h1>
                    <h2 style="font-size: 1.2rem; font-weight: 400; color: #666; margin-bottom: 20px;" id="profile-title">Loading...</h2>
                    <p id="profile-about" style="max-width: 600px; line-height: 1.8; color: #444; font-size: 1.05rem;">Loading...</p>
                </div>
            </div>
            
            <div style="margin-top: 30px; display: flex; gap: 15px;">
                <a href="#contact" style="padding: 10px 25px; background: #111; color: #fff; text-decoration: none; border-radius: 4px; font-size: 0.9rem;">Contact Me</a>
                <a href="#" id="btn-view-cv" style="display: none; padding: 10px 25px; border: 1px solid #111; color: #111; text-decoration: none; border-radius: 4px; font-size: 0.9rem;" target="_blank">View CV</a>
            </div>

            <div style="width: 100%; max-width: 800px; height: 400px; margin-top: 40px; display: none;" id="video-container">
                <iframe id="profile-video" src="" title="Video Giới thiệu" allowfullscreen
                    style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 1px solid #eaeaea;"></iframe>
            </div>
        </section>

        <!-- Skills Section -->
        <section id="skills" class="container" style="padding: 60px 0;">
            <h2 style="font-size: 1.5rem; font-weight: 300; margin-bottom: 30px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">Skills</h2>
            <div id="skills-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                <!-- Data loaded via JS -->
            </div>
        </section>

        <!-- Experience Section -->
        <section id="experience" class="container" style="padding: 60px 0;">
            <h2 style="font-size: 1.5rem; font-weight: 300; margin-bottom: 30px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">Experience</h2>
            <div id="experience-container" style="display: flex; flex-direction: column; gap: 25px;">
                <!-- Data loaded via JS -->
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="container" style="padding: 60px 0; padding-bottom: 100px;">
            <h2 style="font-size: 1.5rem; font-weight: 300; margin-bottom: 30px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">Connect</h2>
            <div id="contact-container" style="display: flex; gap: 20px; flex-wrap: wrap;">
                <!-- Data loaded via JS -->
            </div>
        </section>
    </main>

    <footer style="background: #111; color: #fff; padding: 40px 0; text-align: center; font-weight: 300; font-size: 0.9rem;">
        <p>&copy; 2026 <span id="footer-name">Loading...</span>. All rights reserved.</p>
    </footer>
`;
