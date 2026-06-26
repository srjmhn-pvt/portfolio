document.addEventListener('DOMContentLoaded', () => {
    // Typing Effect
    const roleText = "Embedded Systems & IoT Engineer";
    const typingElement = document.querySelector('.typing-text');
    let i = 0;
    
    typingElement.innerHTML = '';
    
    function typeWriter() {
        if (i < roleText.length) {
            typingElement.innerHTML += roleText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    setTimeout(typeWriter, 500);

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const iconSpan = themeToggle.querySelector('.icon');
    
    // Check saved theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light') {
            iconSpan.textContent = '🌙';
        }
    }
    
    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            iconSpan.textContent = '☀️';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            iconSpan.textContent = '🌙';
        }
    });

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // Smooth Scrolling for Navbar Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll Progress & Back to Top visibility
    const scrollProgress = document.querySelector('.scroll-progress');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        // Progress bar calculation
        let scrollPos = document.documentElement.scrollTop;
        let docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let scrollValue = Math.round((scrollPos * 100) / docHeight);
        scrollProgress.style.width = `${scrollValue}%`;

        // Back to top visibility
        if (scrollPos > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

});
    // Web Audio API Synthesizer
    let audioCtx = null;
    let audioUnlocked = false;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        audioUnlocked = true;
    }

    // Unlock audio on first user interaction
    document.body.addEventListener("click", () => {
        if (!audioUnlocked) initAudio();
    }, { once: true });

    function playGlassTick() {
        if (!audioUnlocked || !audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.1);
    }

    // Attach sound to interactive elements
    document.querySelectorAll("a, button, .project-card, .skill-category, .edu-card").forEach(el => {
        el.addEventListener("mouseenter", playGlassTick);
    });

