document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('#mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navMenu.classList.toggle('active');
        });

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
                newTheme = systemPrefersDark ? 'light' : 'dark';
            }

            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Lightbox for Work Gallery
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const thumbnails = document.querySelectorAll('.work-thumbnail');

    if (lightbox && lightboxImg && thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                lightboxImg.src = thumb.src;
                lightboxImg.alt = thumb.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Avatar Animation System（VRChat ページのみ）
    const avatarContainer = document.querySelector('#avatar-container');
    const avatarBase = document.querySelector('#avatar-base');
    const avatarMotion1 = document.querySelector('#avatar-motion-1');
    const avatarMotion2 = document.querySelector('#avatar-motion-2');

    if (avatarContainer && avatarBase && avatarMotion1 && avatarMotion2) {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
            /iPad|iPhone|iPod/.test(navigator.userAgent);
        const videoDir = isSafari ? './assets/hevc_alpha' : './assets/webm';
        const videoExt = isSafari ? '.mov' : '.webm';

        const randomMotions = [
            `${videoDir}/motion_1${videoExt}`,
            `${videoDir}/motion_2${videoExt}`,
            `${videoDir}/motion_3${videoExt}`,
            `${videoDir}/motion_4${videoExt}`,
            `${videoDir}/motion_5${videoExt}`
        ];

        const actionMotions = [
            `${videoDir}/action_1${videoExt}`,
            `${videoDir}/action_2${videoExt}`,
            `${videoDir}/action_3${videoExt}`,
            `${videoDir}/action_4${videoExt}`,
            `${videoDir}/action_5${videoExt}`
        ];

        let isPlayingMotion = false;
        let randomTimer = null;
        let currentMotionVideo = null;
        const videoCache = new Map();

        avatarBase.loop = true;
        avatarBase.play().catch(() => { });

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

        async function playMotion(src, returnToIdle = true, forcePlay = false) {
            if (isPlayingMotion && !forcePlay) return;

            isPlayingMotion = true;

            if (randomTimer) {
                clearTimeout(randomTimer);
                randomTimer = null;
            }

            const nextMotionVideo = (currentMotionVideo === avatarMotion1) ? avatarMotion2 : avatarMotion1;
            const prevMotionVideo = currentMotionVideo;

            try {
                const blobUrl = await fetchVideo(src);

                nextMotionVideo.src = blobUrl;

                nextMotionVideo.oncanplaythrough = () => {
                    nextMotionVideo.oncanplaythrough = null;

                    avatarBase.style.opacity = '0';

                    nextMotionVideo.classList.add('active');
                    nextMotionVideo.play();

                    if (prevMotionVideo) {
                        prevMotionVideo.classList.remove('active');
                        setTimeout(() => {
                            prevMotionVideo.pause();
                            prevMotionVideo.currentTime = 0;
                        }, 300);
                    }

                    currentMotionVideo = nextMotionVideo;
                };

                nextMotionVideo.onended = () => {
                    nextMotionVideo.classList.remove('active');
                    avatarBase.style.opacity = '1';
                    isPlayingMotion = false;
                    currentMotionVideo = null;
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

        function scheduleRandomMotion() {
            const delay = 5000 + Math.random() * 10000;
            randomTimer = setTimeout(() => {
                const randomSrc = randomMotions[Math.floor(Math.random() * randomMotions.length)];
                playMotion(randomSrc);
            }, delay);
        }

        avatarContainer.addEventListener('click', () => {
            const randomAction = actionMotions[Math.floor(Math.random() * actionMotions.length)];
            playMotion(randomAction, true, true);
        });

        scheduleRandomMotion();
    }

    // ヘッダーのスクロール表示/非表示（モバイル用）
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const currentScrollY = window.scrollY;
        const isMobile = window.innerWidth <= 768;

        if (isMobile && currentScrollY > 100) {
            if (currentScrollY > lastScrollY) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
        } else {
            header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    if (header) {
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }
});
