document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio Loaded');

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Parallax effect for hero visual could be added here

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('#mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('is-active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Theme Toggle
    const themeToggle = document.querySelector('#theme-toggle');
    const root = document.documentElement;

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            let newTheme;
            if (currentTheme === 'dark') {
                newTheme = 'light';
            } else if (currentTheme === 'light') {
                newTheme = 'dark';
            } else {
                // No data-theme set, toggle based on system preference
                newTheme = systemPrefersDark ? 'light' : 'dark';
            }

            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Avatar Animation System
    const avatarContainer = document.querySelector('#avatar-container');
    const avatarBase = document.querySelector('#avatar-base');
    const avatarMotion = document.querySelector('#avatar-motion');

    if (avatarContainer && avatarBase && avatarMotion) {
        // Safari/WebKit検出（HEVC Alpha対応）
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
            /iPad|iPhone|iPod/.test(navigator.userAgent);
        const videoDir = isSafari ? './assets/hevc_alpha' : './assets/webm';
        const videoExt = isSafari ? '.mov' : '.webm';

        // ランダム自動切り替え用モーション
        const randomMotions = [
            `${videoDir}/motion_1${videoExt}`,
            `${videoDir}/motion_2${videoExt}`,
            `${videoDir}/motion_3${videoExt}`,
            `${videoDir}/motion_4${videoExt}`,
            `${videoDir}/motion_5${videoExt}`
        ];

        // クリック・ホバー用アクション
        const actionMotions = [
            `${videoDir}/action_1${videoExt}`,
            `${videoDir}/action_2${videoExt}`,
            `${videoDir}/action_3${videoExt}`,
            `${videoDir}/action_4${videoExt}`,
            `${videoDir}/action_5${videoExt}`
        ];

        let isPlayingMotion = false;
        let randomTimer = null;

        // 待機動画を通常ループで再生（シームレス）
        avatarBase.loop = true;
        avatarBase.play().catch(() => { }); // 自動再生エラーを無視

        // モーション再生関数
        function playMotion(src, returnToIdle = true) {
            if (isPlayingMotion) return;
            isPlayingMotion = true;

            // ランダムタイマーを一時停止
            if (randomTimer) {
                clearTimeout(randomTimer);
                randomTimer = null;
            }

            // ベース動画を非表示にしてモーションを表示
            avatarBase.style.opacity = '0';

            avatarMotion.src = src;
            avatarMotion.load();
            avatarMotion.play();
            avatarMotion.classList.add('active');

            avatarMotion.onended = () => {
                avatarMotion.classList.remove('active');
                avatarBase.style.opacity = '1';
                isPlayingMotion = false;
                if (returnToIdle) {
                    scheduleRandomMotion();
                }
            };
        }

        // ランダムモーションをスケジュール
        function scheduleRandomMotion() {
            const delay = 5000 + Math.random() * 10000; // 5-15秒
            randomTimer = setTimeout(() => {
                const randomSrc = randomMotions[Math.floor(Math.random() * randomMotions.length)];
                playMotion(randomSrc);
            }, delay);
        }

        // クリックでアクションモーション再生
        avatarContainer.addEventListener('click', () => {
            const randomAction = actionMotions[Math.floor(Math.random() * actionMotions.length)];
            playMotion(randomAction);
        });

        // 初回のランダムモーションをスケジュール
        scheduleRandomMotion();
    }
});
