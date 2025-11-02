/*
 * Custom JavaScript for Silvano Puccini Portfolio
 * Features: Contact Form, Pagination, Language Switcher
 */

// ============================================
// 1. CONTACT FORM HANDLER (Formspree)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const button = form.querySelector('input[type="submit"]');
            const originalText = button.value;

            // Disable button and show loading
            button.disabled = true;
            button.value = currentLang === 'es' ? 'Enviando...' : 'Sending...';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    status.style.display = 'block';
                    status.style.color = '#18bfef';
                    status.textContent = currentLang === 'es'
                        ? '¡Gracias! Tu mensaje ha sido enviado.'
                        : 'Thank you! Your message has been sent.';
                    form.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                status.style.display = 'block';
                status.style.color = '#ff6b6b';
                status.textContent = currentLang === 'es'
                    ? 'Oops! Hubo un problema. Por favor intenta de nuevo.'
                    : 'Oops! There was a problem. Please try again.';
            } finally {
                button.disabled = false;
                button.value = originalText;

                // Hide status message after 5 seconds
                setTimeout(() => {
                    status.style.display = 'none';
                }, 5000);
            }
        });
    }
});

// ============================================
// 2. PAGINATION FOR PROJECTS
// ============================================
let currentPage = 1;
const projectsPerPage = 3;

function setupPagination() {
    const projectsContainer = document.querySelector('.posts');
    if (!projectsContainer) return;

    const projects = Array.from(projectsContainer.querySelectorAll('article'));
    const totalProjects = projects.length;
    const totalPages = Math.ceil(totalProjects / projectsPerPage);

    // Only show pagination if there are more than projectsPerPage projects
    if (totalProjects <= projectsPerPage) return;

    function showPage(page) {
        currentPage = page;

        // Hide all projects
        projects.forEach(project => project.style.display = 'none');

        // Show projects for current page
        const start = (page - 1) * projectsPerPage;
        const end = start + projectsPerPage;
        projects.slice(start, end).forEach(project => project.style.display = 'block');

        // Update pagination buttons
        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;

        // Clear existing buttons
        pagination.innerHTML = '';

        // Previous button
        if (currentPage > 1) {
            const prevBtn = document.createElement('a');
            prevBtn.href = '#';
            prevBtn.className = 'previous';
            prevBtn.textContent = currentLang === 'es' ? 'Anterior' : 'Prev';
            prevBtn.onclick = (e) => {
                e.preventDefault();
                showPage(currentPage - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            pagination.appendChild(prevBtn);
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('a');
            pageBtn.href = '#';
            pageBtn.className = i === currentPage ? 'page active' : 'page';
            pageBtn.textContent = i;
            pageBtn.onclick = (e) => {
                e.preventDefault();
                showPage(i);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            pagination.appendChild(pageBtn);
        }

        // Next button
        if (currentPage < totalPages) {
            const nextBtn = document.createElement('a');
            nextBtn.href = '#';
            nextBtn.className = 'next';
            nextBtn.textContent = currentLang === 'es' ? 'Siguiente' : 'Next';
            nextBtn.onclick = (e) => {
                e.preventDefault();
                showPage(currentPage + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            pagination.appendChild(nextBtn);
        }
    }

    // Create pagination container if it doesn't exist
    if (!document.querySelector('.pagination')) {
        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'pagination';
        projectsContainer.parentNode.insertBefore(paginationDiv, projectsContainer.nextSibling);
    }

    // Initialize
    showPage(1);
}

// Initialize pagination when DOM is ready
document.addEventListener('DOMContentLoaded', setupPagination);

// ============================================
// 3. LANGUAGE SWITCHER (i18n)
// ============================================
let currentLang = localStorage.getItem('language') || 'es';

const translations = {
    es: {
        // Navigation
        'nav.projects': 'Proyectos',
        'nav.about': 'Sobre Mí',

        // Intro
        'intro.title': 'Silvano Puccini<br />Analista de Datos',
        'intro.description': 'Analista de Datos en formación especializado en SQL, Python, Power BI y Excel Avanzado.<br />Combinando conocimientos técnicos con más de 10 años de experiencia comercial.',
        'intro.button': 'Continue',

        // Footer
        'footer.interested': '¿Interesado en mis proyectos?',
        'footer.description': 'Si quieres saber más sobre cómo implementé estos sistemas o discutir colaboraciones, no dudes en contactarme:',
        'footer.name': 'Nombre',
        'footer.email': 'Email',
        'footer.message': 'Mensaje',
        'footer.submit': 'Enviar Mensaje',
        'footer.location': 'Ubicación',
        'footer.phone': 'Teléfono',
        'footer.social': 'Social',

        // Buttons
        'btn.viewProject': 'Ver Proyecto',
        'btn.prev': 'Anterior',
        'btn.next': 'Siguiente'
    },
    en: {
        // Navigation
        'nav.projects': 'Projects',
        'nav.about': 'About Me',

        // Intro
        'intro.title': 'Silvano Puccini<br />Data Analyst',
        'intro.description': 'Data Analyst in training specialized in SQL, Python, Power BI and Advanced Excel.<br />Combining technical knowledge with over 10 years of commercial experience.',
        'intro.button': 'Continue',

        // Footer
        'footer.interested': 'Interested in my projects?',
        'footer.description': 'If you want to know more about how I implemented these systems or discuss collaborations, feel free to contact me:',
        'footer.name': 'Name',
        'footer.email': 'Email',
        'footer.message': 'Message',
        'footer.submit': 'Send Message',
        'footer.location': 'Location',
        'footer.phone': 'Phone',
        'footer.social': 'Social',

        // Buttons
        'btn.viewProject': 'View Project',
        'btn.prev': 'Prev',
        'btn.next': 'Next'
    }
};

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);

    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translations[lang][key];
            } else if (element.tagName === 'INPUT') {
                element.placeholder = translations[lang][key];
            } else {
                element.innerHTML = translations[lang][key];
            }
        }
    });

    // Update language toggle button
    updateLanguageToggle();

    // Update pagination if it exists
    const pagination = document.querySelector('.pagination');
    if (pagination) {
        setupPagination();
    }
}

function updateLanguageToggle() {
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.textContent = currentLang === 'es' ? 'EN' : 'ES';
        langToggle.setAttribute('title', currentLang === 'es' ? 'Switch to English' : 'Cambiar a Español');
    }
}

function createLanguageToggle() {
    // Check if toggle already exists
    if (document.getElementById('lang-toggle')) return;

    const nav = document.querySelector('#nav .icons');
    if (!nav) return;

    const langToggle = document.createElement('li');
    langToggle.innerHTML = `
        <a href="#" id="lang-toggle" class="button small" style="padding: 0.5em 1em; margin-left: 1em;">
            ${currentLang === 'es' ? 'EN' : 'ES'}
        </a>
    `;

    const toggleLink = langToggle.querySelector('#lang-toggle');
    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchLanguage(currentLang === 'es' ? 'en' : 'es');
    });

    nav.appendChild(langToggle);
    updateLanguageToggle();
}

// Initialize language switcher
document.addEventListener('DOMContentLoaded', function() {
    createLanguageToggle();
    switchLanguage(currentLang); // Apply saved language
});
