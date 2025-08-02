// Logika Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const body = document.querySelector('body');

    if (preloader) {
        preloader.classList.add('hidden');
        body.classList.add('loaded');
        preloader.addEventListener('transitionend', () => {
            preloader.remove(); 
        });
    }
});

// Logika Utama Aplikasi
document.addEventListener('DOMContentLoaded', function() {

    // ===== DATABASE PROYEK (PATH GAMBAR SUDAH DIPERBAIKI) =====
    const projectsData = [
        {
            id: "fotografi",
            title: "Momen dalam Lensa",
            category: "Fotografi",
            description: "Ini adalah deskripsi lengkap tentang passion dan pendekatan saya dalam dunia fotografi. Saya suka menangkap emosi yang tulus dan momen yang tidak akan terulang kembali, mengubahnya menjadi sebuah cerita visual yang abadi.",
            images: [ "fotografi1.jpg", "fotografi2.jpg", "fotografi3.jpg" ]
        },
        {
            id: "arduino",
            title: "Proyek Arduino",
            category: "Elektronika & IoT",
            description: "Menjelajahi dunia mikrokontroler untuk menciptakan solusi otomatis. Proyek ini fokus pada sistem penyiraman tanaman otomatis berbasis sensor kelembaban tanah, menggunakan platform Arduino Uno dan beberapa komponen pendukung.",
            images: [ "arduino1.jpg", "arduino2.jpg" ]
        },
        {
            id: "desain",
            title: "Desain Grafis",
            category: "Desain Visual",
            description: "Sebuah proyek Desain Grafis. Tujuannya adalah menciptakan identitas visual yang modern, hangat, dan mudah diingat. Prosesnya meliputi desain logo, palet warna, desain kemasan, hingga pembuatan pamflet.",
            images: [ "desain1.jpg", "desain2.jpg" ]
        },
        {
            id: "alam",
            title: "Pecinta Alam",
            category: "Petualangan",
            description: "Dokumentasi perjalanan mendaki Gunung dan Masuk Hutan. Perjalanan ini bukan hanya tentang mencapai puncak, tapi juga tentang kebersamaan, ketahanan, dan mengapresiasi keindahan alam Sumatera yang luar biasa.",
            images: [ "alam1.jpg", "alam2.jpg" ]
        }
    ];

    // BAGIAN 1: ANIMASI BACKGROUND THREE.JS
    let particlesMaterial;
    const darkThemeColor = 0x00ffff;
    const lightThemeColor = 0x007bff;

    try {
        let scene, camera, renderer, particles, clock;
        const container = document.getElementById('hero-canvas');

        function initThreeJS() {
            scene = new THREE.Scene();
            clock = new THREE.Clock();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 50;
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);
            
            const particleCount = 5000;
            const positions = new Float32Array(particleCount * 3);
            for (let i = 0; i < particleCount * 3; i++) {
                positions[i] = (Math.random() - 0.5) * 200;
            }
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            particlesMaterial = new THREE.PointsMaterial({
                color: document.documentElement.getAttribute('data-theme') === 'dark' ? darkThemeColor : lightThemeColor,
                size: 0.2,
                transparent: true,
                blending: THREE.AdditiveBlending,
                opacity: 0.7
            });
            particles = new THREE.Points(geometry, particlesMaterial);
            scene.add(particles);

            window.addEventListener('resize', onWindowResize);
            document.addEventListener('mousemove', onDocumentMouseMove);
        }

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            if(particles) {
                particles.rotation.y = elapsedTime * 0.05;
                const positions = particles.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    const x = positions[i];
                    positions[i + 1] = Math.sin((x + elapsedTime) * 0.5) * 5;
                }
                particles.geometry.attributes.position.needsUpdate = true;
            }
            renderer.render(scene, camera);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function onDocumentMouseMove(event) {
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            camera.position.x += (mouseX * 0.1 - camera.position.x) * 0.02;
            camera.position.y += (mouseY * 0.1 - camera.position.y) * 0.02;
        }
        
        if (container) {
            initThreeJS();
            if (renderer) animate();
        }

    } catch (e) {
        console.error("Three.js error:", e);
        const canvasContainer = document.getElementById('hero-canvas');
        if(canvasContainer) canvasContainer.style.display = 'none';
    }


    // BAGIAN 2: SKRIP ANTARMUKA PENGGUNA (UI)
    // Pengalih Tema (Theme Switcher)
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeSwitcherIcon = themeSwitcher.querySelector('i');
    const docHtml = document.documentElement;

    function setTheme(theme) {
        docHtml.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            themeSwitcherIcon.classList.remove('fa-sun');
            themeSwitcherIcon.classList.add('fa-moon');
            if(particlesMaterial) particlesMaterial.color.set(darkThemeColor);
        } else {
            themeSwitcherIcon.classList.remove('fa-moon');
            themeSwitcherIcon.classList.add('fa-sun');
            if(particlesMaterial) particlesMaterial.color.set(lightThemeColor);
        }
    }

    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    themeSwitcher.addEventListener('click', () => {
        const newTheme = docHtml.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Efek fade-in untuk section biasa
    const sections = document.querySelectorAll('.section-observer');
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    sections.forEach(section => { sectionObserver.observe(section); });

    // Animasi Stagger untuk Kartu Proyek
    const projectSection = document.getElementById('proyek');
    const projectCards = document.querySelectorAll('.kartu-proyek');
    const projectObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                projectCards.forEach((card, index) => {
                    card.style.transitionDelay = `${index * 150}ms`;
                    card.classList.add('visible');
                });
                observer.unobserve(projectSection);
            }
        });
    }, { threshold: 0.1 });
    if(projectSection) {
        projectObserver.observe(projectSection);
    }

    // Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    window.addEventListener('mousemove', function(e) {
        const posX = e.clientX; const posY = e.clientY;
        if(cursorDot) {
            cursorDot.style.left = `${posX}px`; 
            cursorDot.style.top = `${posY}px`;
        }
        if(cursorOutline) {
            cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
        }
    });

    // Navigasi aktif saat scroll
    const navLinks = document.querySelectorAll('.nav-link');
    const allSections = document.querySelectorAll('main section');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
                });
            }
        });
    }, { rootMargin: "-30% 0px -70% 0px" });
    allSections.forEach(section => { navObserver.observe(section); });

    // Animasi Teks Mengetik
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const words = ["Developer", "Fotografer", "Desainer", "Pecinta Alam"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            const currentChars = isDeleting ? currentWord.substring(0, charIndex - 1) : currentWord.substring(0, charIndex + 1);
            typingText.textContent = currentChars;
            let typeSpeed = isDeleting ? 100 : 150;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 1200;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }
            
            charIndex += isDeleting ? -1 : 1;
            setTimeout(type, typeSpeed);
        }
        type();
    }

    // Tombol Scroll to Top
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
    }

    // Hilangkan 3D Background saat scroll
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                heroCanvas.style.opacity = '0';
                heroCanvas.style.pointerEvents = 'none';
            } else {
                heroCanvas.style.opacity = '1';
                heroCanvas.style.pointerEvents = 'auto';
            }
        });
    }

    // Efek Magnet pada Ikon
    const socialLinks = document.querySelectorAll('.social-links a');
    const magnetStrength = 0.5;
    socialLinks.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const moveX = (e.clientX - centerX) * magnetStrength;
            const moveY = (e.clientY - centerY) * magnetStrength;
            link.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translate(0, 0)';
        });
    });

    // Logika Modal Proyek
    const modal = document.getElementById('project-modal');
    if (modal) {
        const modalOverlay = document.querySelector('.modal-overlay');
        const modalCloseBtn = document.querySelector('.modal-close');
        const projectCardsForModal = document.querySelectorAll('.kartu-proyek');

        function populateModal(project) {
            document.getElementById('modal-title').textContent = project.title;
            document.getElementById('modal-category').textContent = project.category;
            document.getElementById('modal-description').textContent = project.description;
            
            const gallery = document.querySelector('.modal-gallery');
            gallery.innerHTML = '';
            project.images.forEach(imgUrl => {
                const img = document.createElement('img');
                img.src = imgUrl;
                img.alt = project.title;
                gallery.appendChild(img);
            });
        }

        function openModal(projectId) {
            const project = projectsData.find(p => p.id === projectId);
            if (project) {
                populateModal(project);
                modal.classList.add('visible');
            }
        }

        function closeModal() {
            modal.classList.remove('visible');
        }

        projectCardsForModal.forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.dataset.projectId;
                openModal(projectId);
            });
        });

        modalCloseBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('visible')) {
                closeModal();
            }
        });
    }

});