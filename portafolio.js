document.addEventListener('DOMContentLoaded', () => {
    // Navegación SPA
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-links a[data-page]');
    const pageButtons = document.querySelectorAll('[data-page]');

    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
        
        if (window.innerWidth <= 1024) {
            closeMenu();
        }
        
        if (pageId === 'servicios') {
            setTimeout(initChart, 300);
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showPage(link.getAttribute('data-page'));
        });
    });

    pageButtons.forEach(btn => {
        if (!btn.classList.contains('nav-links')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                showPage(btn.getAttribute('data-page'));
            });
        }
    });

    // Menú móvil
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const mobileLogo = document.getElementById('mobileLogo');

    function openMenu() {
        sidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (mobileLogo) mobileLogo.style.display = 'none';
    }

    function closeMenu() {
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
        if (window.innerWidth <= 1024 && mobileLogo) {
            setTimeout(() => { mobileLogo.style.display = 'block'; }, 300);
        }
    }

    mobileBtn.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', closeMenu);

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                closeMenu();
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && 
            sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) && 
            !mobileBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Modo oscuro
    const themeToggle = document.getElementById('themeToggle');
    
    function updateThemeIcon(theme) {
        const icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
        if (themeToggle) themeToggle.querySelector('i').className = `fa-solid ${icon}`;
    }
    
    const savedTheme = localStorage.getItem('tittanium-theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    function toggleTheme() {
        const current = document.body.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('tittanium-theme', newTheme);
        updateThemeIcon(newTheme);
    }
    
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    // Animación números
    const animateNumbers = () => {
        const numbers = document.querySelectorAll('.stat-number');
        numbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            const duration = 1500;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    num.textContent = target;
                    clearInterval(timer);
                } else {
                    num.textContent = Math.floor(current);
                }
            }, 16);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stat-number')) {
                    animateNumbers();
                }
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stat-number, .dashboard-card').forEach(el => {
        observer.observe(el);
    });

    // Gráfico Chart.js
    function initChart() {
        const canvas = document.getElementById('cloudChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (window.cloudChartInstance) {
            window.cloudChartInstance.destroy();
        }
        
        window.cloudChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1 Año', '3 Años', '5 Años'],
                datasets: [
                    {
                        label: 'On-premise',
                        data: [12000, 21000, 30000],
                        backgroundColor: '#9CA3AF',
                        borderRadius: 8
                    },
                    {
                        label: 'Nube',
                        data: [7000, 10000, 13000],
                        backgroundColor: '#10B981',
                        borderRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => '$' + (value/1000) + 'k'
                        }
                    }
                }
            }
        });
    }
});