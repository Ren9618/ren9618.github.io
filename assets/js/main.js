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
        // ランダム自動切り替え用モーション
        const randomMotions = [
            './assets/webm/motion_1.webm',
            './assets/webm/motion_2.webm',
            './assets/webm/motion_3.webm',
            './assets/webm/motion_4.webm',
            './assets/webm/motion_5.webm'
        ];

        // クリック・ホバー用アクション
        const actionMotions = [
            './assets/webm/action_1.webm',
            './assets/webm/action_2.webm',
            './assets/webm/action_3.webm',
            './assets/webm/action_4.webm',
            './assets/webm/action_5.webm'
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
            const delay = 10000 + Math.random() * 20000; // 10-30秒
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
