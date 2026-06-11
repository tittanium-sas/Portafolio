document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. NAVEGACIÓN SPA (por secciones/páginas)
    // ==========================================
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-links a[data-page]');
    const pageButtons = document.querySelectorAll('[data-page]');

    const showPage = (pageId) => {
        // Ocultar todas las páginas
        pages.forEach(page => page.classList.remove('active'));
        
        // Mostrar la página seleccionada
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            // Scroll al top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Actualizar menú activo
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });

        // Cerrar menú móvil si está abierto
        if (window.innerWidth <= 900) {
            sidebar.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-xmark');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        }

        // Disparar animaciones de reveal en la nueva página
        setTimeout(() => {
            observeRevealElements();
        }, 100);

        // Si es la página de servicios, inicializar gráfico
        if (pageId === 'servicios') {
            setTimeout(initCloudChart, 300);
        }
    };

    // Eventos de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            showPage(pageId);
        });
    });

    pageButtons.forEach(btn => {
        if (!btn.classList.contains('nav-links')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = btn.getAttribute('data-page');
                showPage(pageId);
            });
        }
    });

    // ==========================================
    // 2. MENÚ MÓVIL
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (sidebar.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && 
            !sidebar.contains(e.target) && 
            !mobileMenuBtn.contains(e.target) &&
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-xmark');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        }
    });

    // ==========================================
    // 3. MODO OSCURO
    // ==========================================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('tittanium-theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('tittanium-theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // ==========================================
    // 4. ANIMACIÓN DE NÚMEROS (CONTADOR)
    // ==========================================
    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const observeStatNumbers = () => {
        const statNumbers = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateValue(entry.target, 0, target, 1500);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    };

    // ==========================================
    // 5. SCROLL REVEAL (ANIMACIONES DE ENTRADA)
    // ==========================================
    const observeRevealElements = () => {
        const revealElements = document.querySelectorAll('.page.active .dashboard-card, .page.active .quick-card, .page.active .service-card, .page.active .diff-item, .page.active .team-member, .page.active .contact-item, .page.active .cert-item');
        
        revealElements.forEach((el, index) => {
            el.classList.add('reveal');
            el.classList.add(`reveal-delay-${(index % 4) + 1}`);
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    // ==========================================
    // 6. GRÁFICO CHART.JS (Servicios en la Nube)
    // ==========================================
    let cloudChartInstance = null;

    const initCloudChart = () => {
        const canvas = document.getElementById('cloudChart');
        if (!canvas) return;

        // Si ya existe, destruirlo para recrear
        if (cloudChartInstance) {
            cloudChartInstance.destroy();
        }

        const ctx = canvas.getContext('2d');
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#CBD5E1' : '#4B5563';
        const gridColor = isDark ? '#334155' : '#E5E7EB';

        cloudChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1 Año', '3 Años', '5 Años'],
                datasets: [
                    {
                        label: 'On-premise (USD)',
                        data: [12000, 21000, 30000],
                        backgroundColor: '#9CA3AF',
                        borderColor: '#6B7280',
                        borderWidth: 1,
                        borderRadius: 6,
                    },
                    {
                        label: 'Nube (USD)',
                        data: [7000, 10000, 13000],
                        backgroundColor: '#10B981',
                        borderColor: '#059669',
                        borderWidth: 1,
                        borderRadius: 6,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textColor,
                            padding: 15,
                            font: { family: 'Inter', size: 12 }
                        }
                    },
                    tooltip: {
                        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                        titleColor: isDark ? '#F1F5F9' : '#1F2937',
                        bodyColor: isDark ? '#CBD5E1' : '#4B5563',
                        borderColor: '#10B981',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: textColor,
                            callback: function(value) {
                                return '$' + (value / 1000) + 'k';
                            },
                            font: { family: 'Inter' }
                        },
                        grid: { color: gridColor }
                    },
                    x: {
                        ticks: {
                            color: textColor,
                            font: { family: 'Inter', weight: '600' }
                        },
                        grid: { display: false }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });
    };

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================
    observeStatNumbers();
    observeRevealElements();
    
    // Si la página inicial es servicios, cargar gráfico
    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id === 'servicios') {
        setTimeout(initCloudChart, 300);
    }
});