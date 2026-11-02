// ============================================
// LUXURY PORTFOLIO - MOHAMMED EMAD ALAINI
// JavaScript - GSAP Animations & Interactions
// ============================================

// Wait for GSAP to load
window.addEventListener('load', function() {
    // Register GSAP plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initPreloader();
    } else {
        console.error('GSAP or ScrollTrigger not loaded');
        // Fallback: hide preloader after 2 seconds
        setTimeout(() => {
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                preloader.style.display = 'none';
                initHeroAnimations();
            }
        }, 2000);
    }
});

// ============================================
// SMOOTH SCROLL WITH LENIS
// ============================================

let lenis;

function initLenis() {
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }
}

// ============================================
// LIGHTING SYSTEM
// ============================================

const backgroundLight = document.querySelector('.background-light');
let lightX = 50;
let lightY = 50;

if (window.innerWidth >= 1024) {
    document.addEventListener('mousemove', (e) => {
        lightX = (e.clientX / window.innerWidth) * 100;
        lightY = (e.clientY / window.innerHeight) * 100;
        
        if (backgroundLight) {
            backgroundLight.style.setProperty('--mouse-x', lightX + '%');
            backgroundLight.style.setProperty('--mouse-y', lightY + '%');
        }
    });
}

// ============================================
// PRELOADER
// ============================================

function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const preloaderPercentage = document.querySelector('.preloader-percentage');
    const preloaderLogo = document.querySelector('.preloader-logo');
    const preloaderName = document.querySelector('.preloader-name');

    if (!preloader) return;

    // Initialize Lenis
    initLenis();

    // Animate loading percentage
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);

            // Complete loading animation
            gsap.to(preloaderPercentage, {
                opacity: 0,
                duration: 0.5,
                delay: 0.3,
                onComplete: () => {
                    preloaderPercentage.style.display = 'none';

                    // Expand logo
                    gsap.to(preloaderLogo, {
                        scale: 1.5,
                        duration: 0.8,
                        ease: 'power3.inOut',
                        onComplete: () => {
                            // Transition to hero
                            gsap.to(preloader, {
                                clipPath: 'circle(0% at 50% 50%)',
                                duration: 1,
                                ease: 'power3.inOut',
                                onComplete: () => {
                                    preloader.style.display = 'none';
                                    initHeroAnimations();
                                }
                            });
                        }
                    });
                }
            });
        }
        preloaderPercentage.textContent = progress.toString().padStart(2, '0');
    }, 150);
}

// ============================================
// CUSTOM CURSOR
// ============================================

const cursor = document.getElementById('cursor');
const cursorLabel = document.getElementById('cursor-label');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

// Only enable custom cursor on desktop
if (window.innerWidth >= 1024) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Optimized cursor movement with reduced lag
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        cursorLabel.style.left = mouseX + 'px';
        cursorLabel.style.top = mouseY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-item, .skill-item, .service-item');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            
            let labelText = '';
            if (el.tagName === 'A') {
                if (el.classList.contains('project-link')) {
                    labelText = 'EXPLORE';
                } else if (el.classList.contains('contact-link')) {
                    labelText = 'OPEN';
                } else {
                    labelText = 'VIEW';
                }
            } else if (el.tagName === 'BUTTON') {
                labelText = 'GO';
            } else if (el.classList.contains('project-item')) {
                labelText = 'EXPLORE';
            } else if (el.classList.contains('skill-item')) {
                labelText = 'VIEW';
            } else if (el.classList.contains('service-item')) {
                labelText = 'VIEW';
            }
            
            if (labelText) {
                cursorLabel.textContent = labelText;
                cursorLabel.classList.add('visible');
            }
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorLabel.classList.remove('visible');
        });
    });
}

// ============================================
// SCROLL PROGRESS
// ============================================

const progressNumbers = document.querySelectorAll('.progress-number');

if (progressNumbers.length > 0 && typeof ScrollTrigger !== 'undefined') {
    const sections = [
        '#home',
        '#about',
        '.philosophy',
        '.skills',
        '#work',
        '#expertise',
        '#contact'
    ];

    sections.forEach((section, index) => {
        const sectionEl = document.querySelector(section);
        if (sectionEl) {
            ScrollTrigger.create({
                trigger: section,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => updateProgress(index + 1),
                onEnterBack: () => updateProgress(index + 1)
            });
        }
    });

    function updateProgress(activeSection) {
        progressNumbers.forEach((num, i) => {
            if (i + 1 === activeSection) {
                num.classList.add('active');
            } else {
                num.classList.remove('active');
            }
        });

        const progress = (activeSection / sections.length) * 100;
        document.documentElement.style.setProperty('--scroll-progress', progress + '%');
    }
}

// ============================================
// MAGNETIC INTERACTIONS
// ============================================

// Only apply to specific interactive elements
const magneticElements = document.querySelectorAll('.project-link, .form-submit, #copy-email');

magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
    });
});

// ============================================
// PROJECT HOVER PREVIEW
// ============================================

const projectPreview = document.getElementById('project-preview');
const projectPreviewVisual = document.querySelector('.project-preview-visual');
const projectPreviewNumber = document.querySelector('.project-preview-number');
const projectItems = document.querySelectorAll('.project-item');

if (projectPreview && projectPreviewNumber) {
    projectItems.forEach((item, index) => {
        const projectTitle = item.querySelector('.project-title');
        
        if (projectTitle && window.innerWidth >= 1024) {
            projectTitle.addEventListener('mouseenter', () => {
                const projectNum = item.querySelector('.project-number');
                if (projectNum) {
                    projectPreviewNumber.textContent = projectNum.textContent;
                    projectPreview.classList.add('visible');
                }
            });
            
            projectTitle.addEventListener('mousemove', (e) => {
                projectPreview.style.left = e.clientX + 'px';
                projectPreview.style.top = e.clientY + 'px';
            });
            
            projectTitle.addEventListener('mouseleave', () => {
                projectPreview.classList.remove('visible');
            });
        }
    });
}

// ============================================
// LANGUAGE TOGGLE
// ============================================

const langToggle = document.getElementById('lang-toggle');
const langCurrent = document.querySelector('.lang-current');
const langOther = document.querySelector('.lang-other');
let currentLang = 'en';

const translations = {
    en: {
        menu: 'MENU',
        close: 'CLOSE',
        home: 'HOME',
        about: 'ABOUT',
        work: 'WORK',
        expertise: 'EXPERTISE',
        contact: 'CONTACT',
        scroll: 'SCROLL TO EXPLORE',
        available: 'AVAILABLE FOR DEVELOPMENT OPPORTUNITIES',
        based: 'BASED BETWEEN',
        engineeringStack: 'ENGINEERING STACK',
        selectedWork: 'SELECTED WORK',
        realProjects: 'REAL PROJECTS. REAL SYSTEMS. REAL EXPERIENCES.',
        whatIBuild: 'WHAT I BUILD',
        howIBuild: 'HOW I BUILD',
        letsBuild: "LET'S BUILD SOMETHING EXTRAORDINARY.",
        haveProject: 'Have a project, idea, or opportunity in mind? Let\'s talk.',
        email: 'EMAIL',
        yemen: 'YEMEN',
        pakistan: 'PAKISTAN',
        send: 'SEND MESSAGE',
        backToTop: 'BACK TO TOP ↑',
        heroSubtitle1: 'SOFTWARE ENGINEER',
        heroSubtitle2: 'FULL-STACK DEVELOPER',
        heroTitle1: 'BUILDING',
        heroTitle2: 'DIGITAL',
        heroTitle3: 'EXPERIENCES.',
        heroDescription: 'Software Engineering student and Full-Stack Developer focused on building real-world web applications, software systems, and modern digital experiences.',
        manifesto1: 'I BUILD',
        manifesto2: 'DIGITAL PRODUCTS',
        manifesto3: 'THAT TURN',
        manifesto4: 'IDEAS INTO',
        manifesto5: 'REAL EXPERIENCES.',
        aboutText1: 'I\'m a Software Engineering student and Full-Stack Developer focused on turning ideas into functional digital products.',
        aboutText2: 'I build web applications, management systems, booking platforms, database-driven systems, and technology-focused digital experiences.',
        aboutText3: 'My approach combines software engineering fundamentals with modern web development practices.',
        featuredProjects: 'FEATURED PROJECTS',
        fullStack: 'FULL-STACK',
        softwareEng: 'SOFTWARE',
        engineering: 'ENGINEERING',
        philosophy1: 'CLEAN ARCHITECTURE',
        philosophyText1: 'Structured and maintainable code across frontend interfaces and backend systems.',
        philosophy2: 'REAL-WORLD PROBLEM SOLVING',
        philosophyText2: 'Building systems for authentic operational challenges including ticket booking, parking, hospitality, real estate, and business websites.',
        philosophy3: 'CONTINUOUS GROWTH',
        philosophyText3: 'Constantly improving skills in C++, Python, JavaScript, databases, and modern web development.',
        service1: 'WEB DEVELOPMENT',
        serviceDesc1: 'Modern responsive websites and web applications.',
        service2: 'FULL-STACK DEVELOPMENT',
        serviceDesc2: 'Frontend interfaces, backend logic, APIs, authentication and databases.',
        service3: 'BUSINESS WEBSITES',
        serviceDesc3: 'Professional websites for businesses, hospitality, real estate and customer-facing services.',
        service4: 'DATABASE SYSTEMS',
        serviceDesc4: 'Structured database-driven applications and management systems.',
        process1: 'UNDERSTAND',
        processText1: 'Understand the idea, requirements, users and goals.',
        process2: 'PLAN',
        processText2: 'Structure the application, architecture and database.',
        process3: 'BUILD',
        processText3: 'Develop the interface, system logic, integrations and database operations.',
        process4: 'REFINE',
        processText4: 'Test, improve responsiveness, fix issues and polish the final experience.',
        copyEmail: 'COPY EMAIL',
        copied: 'COPIED!',
        formName: 'NAME',
        formEmail: 'EMAIL',
        formSubject: 'SUBJECT',
        formMessage: 'MESSAGE',
        footerLogo: 'MEA',
        footerName: 'MOHAMMED EMAD ALAINI',
        footerTitle: 'SOFTWARE ENGINEER',
        footerSubtitle: 'FULL-STACK DEVELOPER',
        footerCopyright: '© 2026 Mohammed Emad Alaini. All rights reserved.',
        aboutLabel: 'ABOUT',
        viewMyWork: 'VIEW MY WORK',
        letsWorkTogether: "LET'S WORK TOGETHER",
        github: 'GITHUB',
        liveDemo: 'LIVE DEMO',
        githubTitle: 'GITHUB',
        githubDescription: 'Explore my code repositories and open-source contributions.',
        githubLink: 'VISIT PROFILE',
        sending: 'SENDING...',
        sent: 'SENT!',
        formError: 'Please fill in all fields',
        formEmailError: 'Please enter a valid email address'
    },
    ar: {
        menu: 'القائمة',
        close: 'إغلاق',
        home: 'الرئيسية',
        about: 'نبذة عني',
        work: 'أعمالي',
        expertise: 'الخبرات',
        contact: 'تواصل معي',
        scroll: 'مر للتنقل',
        available: 'متاح للفرص التطويرية',
        based: 'مقر بين',
        engineeringStack: 'مجموعة الهندسة',
        selectedWork: 'أعمال مختارة',
        realProjects: 'مشاريع حقيقية. أنظمة حقيقية. تجارب حقيقية.',
        whatIBuild: 'ما أبنيه',
        howIBuild: 'كيف أبني',
        letsBuild: 'لنبنِ شيئًا استثنائيًا.',
        haveProject: 'لديك مشروع أو فكرة أو فرصة؟ لنحدث.',
        email: 'البريد الإلكتروني',
        yemen: 'اليمن',
        pakistan: 'باكستان',
        send: 'إرسال الرسالة',
        backToTop: 'العودة للأعلى ↑',
        heroSubtitle1: 'مهندس برمجيات',
        heroSubtitle2: 'مطور Full-Stack',
        heroTitle1: 'نبني',
        heroTitle2: 'تجارب',
        heroTitle3: 'رقمية.',
        heroDescription: 'طالب هندسة برمجيات ومطور Full-Stack متخصص في بناء تطبيقات الويب وأنظمة البرمجيات وتجارب رقمية حديثة.',
        manifesto1: 'أبني',
        manifesto2: 'منتجات رقمية',
        manifesto3: 'تحول',
        manifesto4: 'الأفكار إلى',
        manifesto5: 'تجارب حقيقية.',
        aboutText1: 'أنا طالب هندسة برمجيات ومطور Full-Stack متخصص في تحويل الأفكار إلى منتجات رقمية وظيفية.',
        aboutText2: 'أبني تطبيقات الويب وأنظمة الإدارة ومنصات الحجز والأنظمة القائمة على قواعد البيانات والتجارب الرقمية التكنولوجية.',
        aboutText3: 'نهجي يجمع بين أساسيات هندسة البرمجيات وممارسات تطوير الويب الحديثة.',
        featuredProjects: 'مشاريع مميزة',
        fullStack: 'فول ستاك',
        softwareEng: 'برمجيات',
        engineering: 'هندسة',
        philosophy1: 'هندسة نظيفة',
        philosophyText1: 'كود منظم وقابل للصيانة عبر واجهات الواجهة الأمامية والأنظمة الخلفية.',
        philosophy2: 'حل مشاكل واقعية',
        philosophyText2: 'بناء أنظمة للتحديات التشغيلية الحقيقية بما في ذلك حجز التذاكر، والوقوف، والضيافة، والعقارات، ومواقع الأعمال.',
        philosophy3: 'نمو مستمر',
        philosophyText3: 'تحسين المهارات باستمرار في C++ و Python و JavaScript وقواعد البيانات وتطوير الويب الحديث.',
        service1: 'تطوير الويب',
        serviceDesc1: 'مواقع الويب الحديثة وتطبيقات الويب المتجاوبة.',
        service2: 'تطوير Full-Stack',
        serviceDesc2: 'واجهات الواجهة الأمامية، المنطق الخلفي، واجهات برمجة التطبيقات، المصادقة وقواعد البيانات.',
        service3: 'مواقع الأعمال',
        serviceDesc3: 'مواقع احترافية للشركات والضيافة والعقارات والخدمات الموجهة للعملاء.',
        service4: 'أنظمة قواعد البيانات',
        serviceDesc4: 'تطبيقات قاعدة البيانات المنظمة وأنظمة الإدارة.',
        process1: 'فهم',
        processText1: 'فهم الفكرة والمتطلبات والمستخدمين والأهداف.',
        process2: 'تخطيط',
        processText2: 'هيكلة التطبيق والهندسة وقاعدة البيانات.',
        process3: 'بناء',
        processText3: 'تطوير الواجهة ومنطق النظام والتكاملات وعمليات قاعدة البيانات.',
        process4: 'تحسين',
        processText4: 'الاختبار وتحسين الاستجابة وإصلاح المشاكل وتلميع التجربة النهائية.',
        copyEmail: 'نسخ البريد',
        copied: 'تم النسخ!',
        formName: 'الاسم',
        formEmail: 'البريد الإلكتروني',
        formSubject: 'الموضوع',
        formMessage: 'الرسالة',
        footerLogo: 'م ع ع',
        footerName: 'محمد عماد العيني',
        footerTitle: 'مهندس برمجيات',
        footerSubtitle: 'مطور Full-Stack',
        footerCopyright: '© 2026 محمد عماد العيني. جميع الحقوق محفوظة.',
        aboutLabel: 'نبذة عني',
        viewMyWork: 'شاهد أعمالي',
        letsWorkTogether: 'لنعمل معاً',
        github: 'جيت هب',
        liveDemo: 'عرض مباشر',
        githubTitle: 'جيت هب',
        githubDescription: 'استكشف مستودعات الكود والمساهمات مفتوحة المصدر.',
        githubLink: 'زيارة الملف الشخصي',
        sending: 'جاري الإرسال...',
        sent: 'تم الإرسال!',
        formError: 'يرجى ملء جميع الحقول',
        formEmailError: 'يرجى إدخال عنوان بريد إلكتروني صحيح'
    }
};

if (langToggle && langCurrent && langOther) {
    langToggle.addEventListener('click', () => {
        // Switch language
        currentLang = currentLang === 'en' ? 'ar' : 'en';

        // Update toggle text
        langCurrent.textContent = currentLang === 'en' ? 'EN' : 'AR';
        langOther.textContent = currentLang === 'en' ? 'AR' : 'EN';

        // Set RTL/LTR
        document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLang;

        // Update font family for Arabic
        if (currentLang === 'ar') {
            document.body.style.fontFamily = "'IBM Plex Sans Arabic', 'Cairo', sans-serif";
        } else {
            document.body.style.fontFamily = "'Inter', sans-serif";
        }

        // Translate content
        const t = translations[currentLang];

        // Update menu
        const menuText = document.querySelector('.menu-toggle-text');
        if (menuText) menuText.textContent = t.menu;

        const menuCloseText = document.querySelector('.menu-close');
        if (menuCloseText) menuCloseText.textContent = t.close;

        // Update navigation links
        const menuLinks = document.querySelectorAll('.menu-link');
        const navKeys = ['home', 'about', 'work', 'expertise', 'contact'];
        menuLinks.forEach((link, i) => {
            if (navKeys[i]) {
                link.textContent = t[navKeys[i]];
            }
        });

        // Update hero section
        const heroSubtitle = document.querySelectorAll('.hero-subtitle span');
        heroSubtitle.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        const heroTitleLines = document.querySelectorAll('.hero-title-line');
        heroTitleLines.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        const heroName = document.querySelector('.hero-name');
        if (heroName && heroName.dataset[currentLang]) {
            heroName.textContent = heroName.dataset[currentLang];
        }

        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription && heroDescription.dataset[currentLang]) {
            heroDescription.textContent = heroDescription.dataset[currentLang];
        }

        // Update hero CTAs
        const heroCtaPrimary = document.querySelector('.hero-cta.primary');
        if (heroCtaPrimary && heroCtaPrimary.dataset[currentLang]) {
            heroCtaPrimary.textContent = heroCtaPrimary.dataset[currentLang];
        }

        const heroCtaSecondary = document.querySelector('.hero-cta.secondary');
        if (heroCtaSecondary && heroCtaSecondary.dataset[currentLang]) {
            heroCtaSecondary.textContent = heroCtaSecondary.dataset[currentLang];
        }

        const heroCtaGithubSpan = document.querySelector('.hero-cta.github span');
        if (heroCtaGithubSpan && heroCtaGithubSpan.dataset[currentLang]) {
            heroCtaGithubSpan.textContent = heroCtaGithubSpan.dataset[currentLang];
        }

        const heroFooterLabels = document.querySelectorAll('.hero-footer-label');
        heroFooterLabels.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        const heroFooterValues = document.querySelectorAll('.hero-footer-value');
        heroFooterValues.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        // Update manifesto
        const manifestoLines = document.querySelectorAll('.manifesto-line');
        manifestoLines.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        // Update about section
        const aboutName = document.querySelector('.about-name');
        if (aboutName && aboutName.dataset[currentLang]) {
            aboutName.textContent = aboutName.dataset[currentLang];
        }

        const aboutLabel = document.querySelector('.about-label');
        if (aboutLabel && aboutLabel.dataset[currentLang]) {
            aboutLabel.textContent = aboutLabel.dataset[currentLang];
        }

        const aboutText = document.querySelectorAll('.about-text p');
        aboutText.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        const aboutStatLabels = document.querySelectorAll('.about-stat-label');
        aboutStatLabels.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        const aboutStatTexts = document.querySelectorAll('.about-stat-text');
        aboutStatTexts.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        // Update philosophy
        const philosophyTitles = document.querySelectorAll('.philosophy-title');
        philosophyTitles.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        const philosophyTexts = document.querySelectorAll('.philosophy-text');
        philosophyTexts.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        // Update skills center
        const skillsCenter = document.querySelector('.skills-center-text');
        if (skillsCenter) skillsCenter.textContent = t.engineeringStack;

        // Update projects section
        const projectsSubtitle = document.querySelector('.projects-subtitle');
        if (projectsSubtitle) projectsSubtitle.textContent = t.selectedWork;

        const projectsTitle = document.querySelector('.projects-title');
        if (projectsTitle) projectsTitle.textContent = t.realProjects;

        // Update services
        const servicesTitle = document.querySelector('.services-title');
        if (servicesTitle) servicesTitle.textContent = t.whatIBuild;

        const serviceTitles = document.querySelectorAll('.service-title');
        serviceTitles.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        const serviceDescs = document.querySelectorAll('.service-description');
        serviceDescs.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        // Update process
        const processTitle = document.querySelector('.process-title');
        if (processTitle) processTitle.textContent = t.howIBuild;

        const processSteps = document.querySelectorAll('.process-step');
        processSteps.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        const processTexts = document.querySelectorAll('.process-text');
        processTexts.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        // Update contact
        const contactTitleLines = document.querySelectorAll('.contact-title-line');
        if (contactTitleLines[0]) contactTitleLines[0].textContent = t.letsBuild.split(' ')[0] + ' ' + t.letsBuild.split(' ')[1];
        if (contactTitleLines[1]) contactTitleLines[1].textContent = t.letsBuild.split(' ')[2];
        if (contactTitleLines[2]) contactTitleLines[2].textContent = t.letsBuild.split(' ')[3];

        const contactSubtitle = document.querySelector('.contact-subtitle');
        if (contactSubtitle) contactSubtitle.textContent = t.haveProject;

        const contactLabels = document.querySelectorAll('.contact-label');
        if (contactLabels[0]) contactLabels[0].textContent = t.email;
        if (contactLabels[1]) contactLabels[1].textContent = t.yemen;
        if (contactLabels[2]) contactLabels[2].textContent = t.pakistan;

        const copyHint = document.querySelector('.contact-copy-hint');
        if (copyHint) copyHint.textContent = t.copyEmail;

        // Update form
        const formNameLabel = document.querySelector('label[for="form-name"]');
        if (formNameLabel) formNameLabel.textContent = t.formName;

        const formEmailLabel = document.querySelector('label[for="form-email"]');
        if (formEmailLabel) formEmailLabel.textContent = t.formEmail;

        const formSubjectLabel = document.querySelector('label[for="form-subject"]');
        if (formSubjectLabel) formSubjectLabel.textContent = t.formSubject;

        const formMessageLabel = document.querySelector('label[for="form-message"]');
        if (formMessageLabel) formMessageLabel.textContent = t.formMessage;

        const formSubmit = document.querySelector('.form-submit');
        if (formSubmit) formSubmit.textContent = t.send;

        // Update footer
        const footerLogo = document.querySelector('.footer-logo');
        if (footerLogo) footerLogo.textContent = t.footerLogo;

        const footerName = document.querySelector('.footer-name');
        if (footerName) footerName.textContent = t.footerName;

        const footerTitle = document.querySelector('.footer-title');
        if (footerTitle) footerTitle.textContent = t.footerTitle;

        const footerSubtitle = document.querySelector('.footer-subtitle');
        if (footerSubtitle) footerSubtitle.textContent = t.footerSubtitle;

        const footerCopyright = document.querySelector('.footer-copyright');
        if (footerCopyright) footerCopyright.textContent = t.footerCopyright;

        const footerTop = document.querySelector('.footer-top');
        if (footerTop) footerTop.textContent = t.backToTop;

        const footerLinks = document.querySelectorAll('.footer-link');
        if (footerLinks[0]) footerLinks[0].textContent = t.home;
        if (footerLinks[1]) footerLinks[1].textContent = t.about;
        if (footerLinks[2]) footerLinks[2].textContent = t.work;
        if (footerLinks[3]) footerLinks[3].textContent = t.expertise;
        if (footerLinks[4]) footerLinks[4].textContent = t.contact;

        // Update projects
        const projectCategories = document.querySelectorAll('.project-category');
        const projectTitles = document.querySelectorAll('.project-title');
        const projectDescriptions = document.querySelectorAll('.project-description');
        const projectLinks = document.querySelectorAll('.project-link span');

        projectCategories.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        projectTitles.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        projectDescriptions.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        projectLinks.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        // Update project links specifically
        const projectPrimaryLinks = document.querySelectorAll('.project-link.primary span');
        projectPrimaryLinks.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });

        const projectSecondaryLinks = document.querySelectorAll('.project-link.secondary span');
        projectSecondaryLinks.forEach(el => {
            if (el.dataset[currentLang]) {
                el.textContent = el.dataset[currentLang];
            }
        });
    });
}

// ============================================
// NAVIGATION
// ============================================

const menuToggle = document.getElementById('menu-toggle');
const menuOverlay = document.getElementById('menu-overlay');
const menuClose = document.getElementById('menu-close');
const menuLinks = document.querySelectorAll('.menu-link');

menuToggle.addEventListener('click', () => {
    menuOverlay.classList.add('active');
    if (lenis) lenis.stop();

    // Animate menu items in
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(menuLinks,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
        );
    }
});

menuClose.addEventListener('click', () => {
    menuOverlay.classList.remove('active');
    if (lenis) lenis.start();
});

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
        if (lenis) lenis.start();
    });
});

// ============================================
// HERO ANIMATIONS
// ============================================

function initHeroAnimations() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroTitleLines = document.querySelectorAll('.hero-title-line');
    const heroName = document.querySelector('.hero-name');
    const heroDescription = document.querySelector('.hero-description');
    const heroCtas = document.querySelector('.hero-ctas');
    const heroFooter = document.querySelector('.hero-footer');

    const tl = gsap.timeline();

    tl.fromTo(heroSubtitle,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
    .fromTo(heroTitleLines,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' },
        '-=0.4'
    )
    .to(heroName, { opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    .to(heroDescription, { opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    .to(heroCtas, { opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    .fromTo(heroFooter,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
    );

    // Parallax effect on hero 3D element
    gsap.to('.hero-3d-shape', {
        y: -100,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });
}

// ============================================
// MANIFESTO ANIMATIONS
// ============================================

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const manifestoLines = document.querySelectorAll('.manifesto-line');

    manifestoLines.forEach((line, index) => {
        gsap.to(line, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: line,
                start: 'top 80%',
                end: 'top 60%',
                scrub: 1
            }
        });
    });

    // Different speeds for parallax effect
    manifestoLines.forEach((line, index) => {
        const speed = (index + 1) * 0.2;
        gsap.to(line, {
            y: -50 * speed,
            scrollTrigger: {
                trigger: '.manifesto',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });
}

// ============================================
// ABOUT ANIMATIONS
// ============================================

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.fromTo('.about-left',
        { opacity: 0, x: -50 },
        {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about',
                start: 'top 70%'
            }
        }
    );

    gsap.fromTo('.about-right',
        { opacity: 0, x: 50 },
        {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about',
                start: 'top 70%'
            }
        }
    );

    // Animate statistics number
    const statNumber = document.querySelector('.about-stat-number');
    if (statNumber) {
        const targetValue = parseInt(statNumber.dataset.value);

        ScrollTrigger.create({
            trigger: '.about-stats',
            start: 'top 80%',
            onEnter: () => {
                gsap.to(statNumber, {
                    textContent: targetValue,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    onUpdate: function() {
                        statNumber.textContent = Math.round(this.targets()[0].textContent).toString().padStart(2, '0');
                    }
                });
            }
        });
    }
}

// ============================================
// PHILOSOPHY ANIMATIONS
// ============================================

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const philosophyItems = document.querySelectorAll('.philosophy-item');

    philosophyItems.forEach((item, index) => {
        gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                end: 'top 60%',
                scrub: 1
            }
        });
    });
}

// ============================================
// JOURNEY ANIMATIONS
// ============================================

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const journeyItems = document.querySelectorAll('.journey-item');

    journeyItems.forEach((item, index) => {
        gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                end: 'top 60%',
                scrub: 1
            }
        });
    });

    // Animate journey line
    const journeyLine = document.querySelector('.journey-line');
    if (journeyLine) {
        gsap.to(journeyLine,
            {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.journey-timeline',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    scrub: 1
                }
            }
        );
    }
}

// ============================================
// SKILLS CONSTELLATION
// ============================================

const skillItems = document.querySelectorAll('.skill-item');

skillItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        // Deactivate all
        skillItems.forEach(si => {
            si.classList.remove('active');
            si.style.opacity = '0.3';
        });
        
        // Activate hovered
        item.classList.add('active');
        item.style.opacity = '1';
    });
    
    item.addEventListener('mouseleave', () => {
        // Reset all
        skillItems.forEach(si => {
            si.classList.remove('active');
            si.style.opacity = '1';
        });
    });
});

// Animate skills on scroll
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.fromTo('.skill-item',
        { opacity: 0, scale: 0.8 },
        {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.skills',
                start: 'top 70%'
            }
        }
    );
}

// ============================================
// PROJECTS ANIMATIONS
// ============================================

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const projectItems = document.querySelectorAll('.project-item');

    projectItems.forEach((item, index) => {
        gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                end: 'top 60%',
                scrub: 1
            }
        });

        // Parallax effect on project visual
        const visual = item.querySelector('.project-visual');
        const image = item.querySelector('.project-image');

        if (visual && image) {
            // Image scale on scroll
            gsap.to(image, {
                scale: 1.1,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    end: 'top 30%',
                    scrub: 1
                }
            });
        }
    });
}

// ============================================
// SERVICES ANIMATIONS
// ============================================

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const serviceItems = document.querySelectorAll('.service-item');

    serviceItems.forEach((item, index) => {
        gsap.fromTo(item,
            { opacity: 0, x: 50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%'
                }
            }
        );
    });

    // Horizontal scroll for services on desktop
    if (window.innerWidth > 768) {
        const servicesScroll = document.querySelector('.services-scroll');

        if (servicesScroll) {
            gsap.to(servicesScroll, {
                x: () => -(servicesScroll.scrollWidth - window.innerWidth + 100),
                ease: 'none',
                scrollTrigger: {
                    trigger: '.services',
                    start: 'top top',
                    end: () => `+=${servicesScroll.scrollWidth}`,
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1
                }
            });
        }
    }
}

// ============================================
// PROCESS ANIMATIONS
// ============================================

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const processItems = document.querySelectorAll('.process-item');

    processItems.forEach((item, index) => {
        gsap.to(item, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                end: 'top 60%',
                scrub: 1
            }
        });
    });

    // Animate progress line
    const processLine = document.querySelector('.process-line');
    if (processLine) {
        gsap.to(processLine,
            {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.process-timeline',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    scrub: 1
                }
            }
        );
    }
}

// ============================================
// CONTACT ANIMATIONS
// ============================================

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.fromTo('.contact-title-line',
        { y: 100, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 70%'
            }
        }
    );

    gsap.fromTo('.contact-subtitle',
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 70%'
            }
        }
    );

    gsap.fromTo('.contact-link',
        { opacity: 0, x: -30 },
        {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact-info',
                start: 'top 80%'
            }
        }
    );

    gsap.fromTo('.contact-form',
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact-form-container',
                start: 'top 80%'
            }
        }
    );
}

// ============================================
// CONTACT FORM HANDLING
// ============================================

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const subject = document.getElementById('form-subject').value.trim();
        const message = document.getElementById('form-message').value.trim();
        const submitBtn = contactForm.querySelector('.form-submit');

        // Validation
        if (!name || !email || !subject || !message) {
            showFormError(currentLang === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormError(currentLang === 'ar' ? 'يرجى إدخال عنوان بريد إلكتروني صحيح' : 'Please enter a valid email address');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = currentLang === 'ar' ? 'جاري الإرسال...' : 'SENDING...';
        submitBtn.style.opacity = '0.7';

        // Simulate sending (in real scenario, this would be an API call)
        setTimeout(() => {
            // Create mailto link
            const mailtoLink = `mailto:mo.emad.alaini@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

            // Open email client
            window.open(mailtoLink, '_blank');

            // Reset form
            contactForm.reset();

            // Show success state
            submitBtn.textContent = currentLang === 'ar' ? 'تم الإرسال!' : 'SENT!';
            submitBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = currentLang === 'ar' ? 'إرسال الرسالة' : 'SEND MESSAGE';
                submitBtn.style.background = '';
                submitBtn.style.opacity = '1';
            }, 2000);
        }, 1000);
    });
}

function showFormError(message) {
    const existingError = document.querySelector('.form-error');
    if (existingError) existingError.remove();

    const error = document.createElement('div');
    error.className = 'form-error';
    error.textContent = message;
    error.style.cssText = `
        color: #d32f2f;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        font-family: var(--font-body);
    `;

    const formContainer = document.querySelector('.contact-form-container');
    formContainer.appendChild(error);

    setTimeout(() => error.remove(), 3000);
}

// ============================================
// COPY EMAIL FUNCTION
// ============================================

window.copyEmail = function() {
    const email = 'mo.emad.alaini@gmail.com';
    const emailValue = document.getElementById('email-value');
    const copyHint = document.querySelector('.contact-copy-hint');

    if (!copyHint) {
        console.error('Copy hint element not found');
        return;
    }

    navigator.clipboard.writeText(email).then(() => {
        // Show copied feedback
        const originalText = copyHint.textContent;
        const t = translations[currentLang];
        copyHint.textContent = t.copied;
        copyHint.style.color = 'var(--color-accent)';

        setTimeout(() => {
            copyHint.textContent = t.copyEmail;
            copyHint.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy email:', err);
    });
};

// ============================================
// FOOTER ANIMATIONS
// ============================================

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.fromTo('.footer-content',
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 95%'
            }
        }
    );
}

// ============================================
// SCROLL TO TOP
// ============================================

const backToTop = document.querySelector('.footer-top');
if (backToTop) {
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        if (lenis) {
            lenis.scrollTo(0, { duration: 1.5 });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// ============================================
// NAV LINK SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            if (lenis) {
                lenis.scrollTo(target, {
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            } else {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ============================================
// REFRESH SCROLLTRIGGER ON RESIZE
// ============================================

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 250);
});

// ============================================
// PREFERS REDUCED MOTION
// ============================================

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (typeof gsap !== 'undefined') {
        gsap.globalTimeline.timeScale(0);
    }
    if (lenis) lenis.destroy();
}
