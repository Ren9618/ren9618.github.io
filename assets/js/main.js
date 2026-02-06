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

    // Hero Background Slideshow
    const bgCurrent = document.querySelector('#hero-bg-current');
    const bgNext = document.querySelector('#hero-bg-next');

    if (bgCurrent && bgNext) {
        const worldImages = [
            './assets/images/world/world_1.png',
            './assets/images/world/world_2.png',
            './assets/images/world/world_3.png',
            './assets/images/world/world_4.png',
            './assets/images/world/world_5.png',
            './assets/images/world/world_6.png',
            './assets/images/world/world_7.png',
            './assets/images/world/world_8.png',
            './assets/images/world/world_9.png'
        ];

        let currentIndex = Math.floor(Math.random() * worldImages.length);
        let isCurrentActive = true;

        // 初期画像を設定
        bgCurrent.style.backgroundImage = `url('${worldImages[currentIndex]}')`;
        bgCurrent.classList.add('active');

        // 背景切り替え関数
        function switchBackground() {
            // 次の画像をランダムに選択（現在と違うもの）
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * worldImages.length);
            } while (nextIndex === currentIndex && worldImages.length > 1);
            currentIndex = nextIndex;

            if (isCurrentActive) {
                bgNext.style.backgroundImage = `url('${worldImages[currentIndex]}')`;
                bgCurrent.classList.remove('active');
                bgNext.classList.add('active');
            } else {
                bgCurrent.style.backgroundImage = `url('${worldImages[currentIndex]}')`;
                bgNext.classList.remove('active');
                bgCurrent.classList.add('active');
            }
            isCurrentActive = !isCurrentActive;
        }

        // 10秒ごとに背景を切り替え
        setInterval(switchBackground, 10000);
    }

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
        const videoCache = new Map(); // 動画キャッシュ

        // 待機動画を通常ループで再生（シームレス）
        avatarBase.loop = true;
        avatarBase.play().catch(() => { }); // 自動再生エラーを無視

        // 動画をフェッチしてBlob URLを取得（キャッシュ付き）
        async function fetchVideo(src) {
            if (videoCache.has(src)) {
                return videoCache.get(src);
            }
            const response = await fetch(src);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            videoCache.set(src, blobUrl);
            return blobUrl;
        }

        // モーション再生関数（読み込み完了を待ってから再生）
        async function playMotion(src, returnToIdle = true) {
            if (isPlayingMotion) return;
            isPlayingMotion = true;

            // ランダムタイマーを一時停止
            if (randomTimer) {
                clearTimeout(randomTimer);
                randomTimer = null;
            }

            try {
                // Blob URLを取得（1回だけダウンロード）
                const blobUrl = await fetchVideo(src);

                avatarMotion.src = blobUrl;

                // 読み込み完了を待ってから再生
                avatarMotion.oncanplaythrough = () => {
                    avatarMotion.oncanplaythrough = null;
                    avatarBase.style.opacity = '0';
                    avatarMotion.classList.add('active');
                    avatarMotion.play();
                };

                avatarMotion.onended = () => {
                    avatarMotion.classList.remove('active');
                    avatarBase.style.opacity = '1';
                    isPlayingMotion = false;
                    if (returnToIdle) {
                        scheduleRandomMotion();
                    }
                };
            } catch (err) {
                console.error('動画読み込みエラー:', err);
                isPlayingMotion = false;
                scheduleRandomMotion();
            }
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
