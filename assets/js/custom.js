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
const projectsPerPage = 2; // Changed to 2 to show pagination with 3 projects

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

// DON'T initialize pagination automatically - only on individual project pages
// document.addEventListener('DOMContentLoaded', setupPagination);

// ============================================
// 2B. PROJECT NAVIGATION (for individual project pages)
// ============================================

const projects = [
    { slug: 'facturia2', titleEs: 'FacturIA 2.0', titleEn: 'FacturIA 2.0' },
    { slug: 'facturia', titleEs: 'FacturIA', titleEn: 'FacturIA' },
    { slug: 'analisis-clientes', titleEs: 'Market Basket Analysis', titleEn: 'Market Basket Analysis' },
    { slug: 'dashboard-ventas', titleEs: 'Dashboard Power BI', titleEn: 'Power BI Dashboard' }
];

function setupProjectNavigation() {
    // Detect current project from URL
    const currentPath = window.location.pathname;
    const currentProject = projects.findIndex(p => currentPath.includes(p.slug));

    if (currentProject === -1) return; // Not on a project page

    const prevIndex = currentProject > 0 ? currentProject - 1 : projects.length - 1;
    const nextIndex = currentProject < projects.length - 1 ? currentProject + 1 : 0;

    // Find or create pagination container
    let paginationDiv = document.querySelector('.pagination');
    if (!paginationDiv) {
        paginationDiv = document.createElement('div');
        paginationDiv.className = 'pagination';
        paginationDiv.style.textAlign = 'center';
        paginationDiv.style.marginTop = '2em';

        // Insert before footer
        const footer = document.querySelector('#footer');
        if (footer) {
            footer.parentNode.insertBefore(paginationDiv, footer);
        }
    }

    // Clear and build navigation
    paginationDiv.innerHTML = '';
    paginationDiv.style.display = 'flex';
    paginationDiv.style.justifyContent = 'center';
    paginationDiv.style.alignItems = 'center';
    paginationDiv.style.gap = '1em';

    // Previous button
    const prevBtn = document.createElement('a');
    prevBtn.href = `${projects[prevIndex].slug}.html`;
    prevBtn.className = 'button';
    prevBtn.setAttribute('data-i18n', 'nav.prevProject');
    prevBtn.textContent = currentLang === 'es' ? '← Proyecto Anterior' : '← Previous Project';
    prevBtn.style.margin = '0';
    paginationDiv.appendChild(prevBtn);

    // Project counter
    const counter = document.createElement('span');
    counter.textContent = `${currentProject + 1} / ${projects.length}`;
    counter.style.padding = '0 1em';
    counter.style.fontWeight = 'bold';
    paginationDiv.appendChild(counter);

    // Next button
    const nextBtn = document.createElement('a');
    nextBtn.href = `${projects[nextIndex].slug}.html`;
    nextBtn.className = 'button';
    nextBtn.setAttribute('data-i18n', 'nav.nextProject');
    nextBtn.textContent = currentLang === 'es' ? 'Siguiente Proyecto →' : 'Next Project →';
    nextBtn.style.margin = '0';
    paginationDiv.appendChild(nextBtn);
}

// Initialize project navigation when on individual project pages
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('/proyectos-web/')) {
        setupProjectNavigation();
    }
});

// ============================================
// 3. LANGUAGE SWITCHER (i18n)
// ============================================
let currentLang = localStorage.getItem('language') || 'es';

const translations = {
    es: {
        // Navigation
        'nav.projects': 'Proyectos',
        'nav.about': 'Sobre Mí',
        'nav.prevProject': '← Proyecto Anterior',
        'nav.nextProject': 'Siguiente Proyecto →',

        // Intro
        'intro.title': 'Silvano Puccini<br />Analista de Datos',
        'intro.description': 'Analista de Datos en formación especializado en SQL, Python, Power BI y Excel Avanzado.<br />Combinando conocimientos técnicos con más de 10 años de experiencia comercial.',
        'intro.button': 'Continue',

        // Project 1: FacturIA 2.0 (Featured)
        'project1.title': 'FacturIA 2.0 - Sistema Inteligente de Gestión Financiera',
        'project1.description': 'Sistema end-to-end que automatiza completamente la gestión contable: monitor de email 24/7, clasificación con Google Gemini 2.0 Flash, base de datos SQLAlchemy, y dashboard web interactivo con Streamlit. Procesa automáticamente comprobantes desde email, detecta personas, categoriza transacciones con IA y genera reportes en tiempo real. Python Full Stack + IA + Visualización Avanzada.',

        // Project 2: FacturIA
        'project2.title': 'FacturIA - Automatización de Facturas con IA',
        'project2.description': 'Sistema automatizado que procesa facturas en PDF usando Google Gemini Vision. Extrae datos de fotos de WhatsApp, facturas escaneadas o PDFs tradicionales. Almacena en SQLite y visualiza en Power BI. Python + IA Multimodal + Business Intelligence.',

        // Project 3: Market Basket Analysis
        'project3.title': 'Market Basket Analysis',
        'project3.description': 'Análisis de 4.9 millones de transacciones con descompresión automática de base de datos (Git LFS). Descubre patrones de compra y reglas de asociación mediante Lift y Confianza. Proyecto 100% funcional sin configuración manual. Tecnologías: Python, Pandas, SQLite, Jupyter, Git LFS.',

        // Project 4: Dashboard Power BI
        'project4.title': 'Dashboard de Ventas - Power BI',
        'project4.description': 'Análisis interactivo de ventas y rendimiento por región, canal y producto, con KPIs y visualizaciones dinámicas. Tecnologías: Power BI, Excel avanzado, SQL.',

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
        'btn.next': 'Siguiente',

        // About Page
        'about.pageTitle': 'Sobre Mí - Silvano Puccini',
        'about.subtitle': 'Analista de Datos',
        'about.summary.title': 'Resumen Profesional',
        'about.summary.p1': 'Analista de datos en formación, con experiencia en gestión y transformación de información, actualmente cursando la Tecnicatura Universitaria en Desarrollo de Aplicaciones Informáticas (2º año) y una Maestría en Desarrollo Web Full Stack academia ConquerBlocks. Manejo bases de datos SQL (PL/SQL y MSSQL), limpieza de datos en Python, incluyendo creación de vistas, optimización de procesos, así como herramientas de análisis y visualización en dashboard con estilos profesionales en Excel avanzado y Power BI.',
        'about.summary.p2': 'Cuento con más de diez años de experiencia en entornos comerciales, lo que me permite conectar los datos con las necesidades reales del negocio y generar conclusiones prácticas para la toma de decisiones. Mi perfil combina conocimientos técnicos con habilidades blandas.',

        'about.technical.title': 'Competencias Técnicas',
        'about.technical.languages': 'Lenguajes',
        'about.technical.frameworks': 'Frameworks / Librerías',
        'about.technical.tools': 'Herramientas',
        'about.technical.excelAdvanced': 'Excel Avanzado',
        'about.technical.methodologies': 'Metodologías',
        'about.technical.solid': 'Principios SOLID',
        'about.technical.testing': 'Buenas prácticas de testing',
        'about.technical.versionControl': 'Control de versiones',

        'about.personal.title': 'Competencias Personales',
        'about.personal.communication': 'Comunicación efectiva',
        'about.personal.results': 'Orientación a resultados',
        'about.personal.teamwork': 'Trabajo en equipo',
        'about.personal.problemSolving': 'Resolución de problemas',
        'about.personal.leadership': 'Liderazgo',
        'about.personal.customerService': 'Atención al cliente',
        'about.personal.negotiation': 'Negociación',
        'about.personal.adaptability': 'Adaptabilidad',

        'about.experience.title': 'Experiencia Profesional',
        'about.experience.job1.title': 'Coordinador Comercial — Distribuidora Gamma',
        'about.experience.job1.period': 'Tandil, Argentina | 10/2022 – 12/2023',
        'about.experience.job1.item1': 'Lideré la venta mayorista de medicamentos a nivel nacional, ampliando la cartera de clientes corporativos.',
        'about.experience.job1.item2': 'Gestioné relaciones comerciales con hospitales, clínicas y farmacias, garantizando niveles sostenidos de servicio.',
        'about.experience.job1.item3': 'Supervisé y coordiné a vendedores remotos, mejorando la eficiencia operativa y comunicación entre equipos.',
        'about.experience.job1.item4': 'Implementé mejoras operativas que optimizaron la satisfacción del cliente y redujeron tiempos de gestión de pedidos.',
        'about.experience.job2.title': 'Cajero / Recaudador — Credil SRL',
        'about.experience.job2.period': 'Tandil, Argentina | 01/2019 – 12/2021',
        'about.experience.job2.item1': 'Administré el cobro de cuotas de la cartera de clientes, manteniendo un flujo de caja estable.',
        'about.experience.job2.item2': 'Brindé atención personalizada y resolví reclamos, alcanzando altos niveles de satisfacción del cliente.',
        'about.experience.job2.item3': 'Promoví y concreté ventas de productos financieros, contribuyendo al crecimiento de la cartera activa.',
        'about.experience.job3.title': 'Coordinador Comercial — Tarjeta Naranja S.A.',
        'about.experience.job3.period': 'Azul, Argentina | 04/2012 – 12/2018',
        'about.experience.job3.item1': 'Diseñé e implementé campañas promocionales que incrementaron la visibilidad y facturación de productos.',
        'about.experience.job3.item2': 'Negocié y establecí acuerdos comerciales con comercios minoristas, fortaleciendo alianzas estratégicas.',
        'about.experience.job3.item3': 'Coordiné la apertura de una nueva sucursal en Bolívar, logrando una base de clientes superior a 300 en el primer año (2017).',

        'about.education.title': 'Formación Académica',
        'about.education.degree1.title': 'Máster en Desarrollo Web Full Stack',
        'about.education.degree1.period': 'ConquerBlocks (España) | 2025 – Actualidad',
        'about.education.degree1.description': 'Módulos: HTML, CSS, JavaScript, TypeScript, ReactJS, SQL, Python, Django, Streamlit, principios SOLID, Git, Linux, WordPress y despliegue de aplicaciones.',
        'about.education.degree2.title': 'Tecnicatura Universitaria en Desarrollo de Aplicaciones Informáticas (TUDAI)',
        'about.education.degree2.period': 'Universidad de la Defensa Nacional – Centro Regional Universitario de Córdoba (IUA) | 2024 – Actualidad (2º año)',
        'about.education.degree2.description': 'Principales áreas: fundamentos de programación, bases de datos, redes, derecho informático, arquitectura de computadoras, diseño de interfaces, gestión de proyectos, testing y calidad de software.',
        'about.education.degree3.title': 'Secundario completo — Humanidades y Ciencias Sociales',
        'about.education.degree3.period': 'Escuela Normal Superior Bernardino Rivadavia, Azul, Argentina | 2008',

        'about.languages.title': 'Idiomas',
        'about.languages.spanish': 'Español:',
        'about.languages.spanishLevel': 'Nativo',
        'about.languages.english': 'Inglés:',
        'about.languages.englishLevel': 'Nivel intermedio (lectura y escritura técnica)',

        // Project Pages
        'facturia2.date': 'Proyecto Full Stack con IA - 2025',
        'facturia2.title': 'FacturIA 2.0<br />Sistema Inteligente de Gestión Financiera',
        'facturia2.description': 'Sistema automatizado completo de procesamiento, clasificación y análisis de transacciones financieras mediante <strong>Inteligencia Artificial</strong>. Automatiza todo el ciclo: desde la recepción de comprobantes por email hasta la generación de reportes ejecutivos con visualizaciones interactivas en tiempo real.',

        'facturia.date': 'Proyecto de Análisis de Datos con IA',
        'facturia.title': 'FacturIA<br />Sistema de Automatización de Facturas con IA',
        'facturia.description': 'Sistema automatizado 100% gratuito para procesar facturas en PDF (texto e imágenes), extraer información con Google Gemini Vision, almacenar datos en SQLite y visualizarlos en Power BI. Compatible con fotos de WhatsApp y facturas escaneadas.',

        'analisis.date': 'Proyecto de Análisis de Datos',
        'analisis.title': 'Market Basket Analysis<br />Análisis de Canasta de Mercado',
        'analisis.description': 'Análisis de 4.9 millones de transacciones para descubrir patrones de compra y reglas de asociación que optimicen estrategias de cross-selling.',

        'dashboard.date': 'Proyecto de Business Intelligence',
        'dashboard.title': 'Dashboard de Ventas<br />Análisis Interactivo con Power BI',
        'dashboard.description': 'Dashboard interactivo para análisis de ventas y rendimiento por región, canal y producto, con KPIs dinámicos y visualizaciones profesionales.'
    },
    en: {
        // Navigation
        'nav.projects': 'Projects',
        'nav.about': 'About Me',
        'nav.prevProject': '← Previous Project',
        'nav.nextProject': 'Next Project →',

        // Intro
        'intro.title': 'Silvano Puccini<br />Data Analyst',
        'intro.description': 'Data Analyst in training specialized in SQL, Python, Power BI and Advanced Excel.<br />Combining technical knowledge with over 10 years of commercial experience.',
        'intro.button': 'Continue',

        // Project 1: FacturIA 2.0 (Featured)
        'project1.title': 'FacturIA 2.0 - Intelligent Financial Management System',
        'project1.description': 'End-to-end system that fully automates accounting management: 24/7 email monitoring, classification with Google Gemini 2.0 Flash, SQLAlchemy database, and interactive web dashboard with Streamlit. Automatically processes receipts from email, detects people, categorizes transactions with AI and generates real-time reports. Python Full Stack + AI + Advanced Visualization.',

        // Project 2: FacturIA
        'project2.title': 'FacturIA - Invoice Automation with AI',
        'project2.description': 'Automated system that processes PDF invoices using Google Gemini Vision. Extracts data from WhatsApp photos, scanned invoices or traditional PDFs. Stores in SQLite and visualizes in Power BI. Python + Multimodal AI + Business Intelligence.',

        // Project 3: Market Basket Analysis
        'project3.title': 'Market Basket Analysis',
        'project3.description': 'Analysis of 4.9 million transactions with automatic database decompression (Git LFS). Discovers purchase patterns and association rules through Lift and Confidence. 100% functional project without manual configuration. Technologies: Python, Pandas, SQLite, Jupyter, Git LFS.',

        // Project 4: Dashboard Power BI
        'project4.title': 'Sales Dashboard - Power BI',
        'project4.description': 'Interactive sales and performance analysis by region, channel and product, with KPIs and dynamic visualizations. Technologies: Power BI, Advanced Excel, SQL.',

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
        'btn.next': 'Next',

        // About Page
        'about.pageTitle': 'About Me - Silvano Puccini',
        'about.subtitle': 'Data Analyst',
        'about.summary.title': 'Professional Summary',
        'about.summary.p1': 'Data analyst in training, with experience in information management and transformation, currently pursuing a University Technical Degree in Computer Application Development (2nd year) and a Master\'s in Full Stack Web Development at ConquerBlocks academy. I handle SQL databases (PL/SQL and MSSQL), data cleaning in Python, including view creation, process optimization, as well as analysis and dashboard visualization tools with professional styling in advanced Excel and Power BI.',
        'about.summary.p2': 'I have over ten years of experience in commercial environments, which allows me to connect data with real business needs and generate practical insights for decision-making. My profile combines technical knowledge with soft skills.',

        'about.technical.title': 'Technical Skills',
        'about.technical.languages': 'Languages',
        'about.technical.frameworks': 'Frameworks / Libraries',
        'about.technical.tools': 'Tools',
        'about.technical.excelAdvanced': 'Advanced Excel',
        'about.technical.methodologies': 'Methodologies',
        'about.technical.solid': 'SOLID Principles',
        'about.technical.testing': 'Testing Best Practices',
        'about.technical.versionControl': 'Version Control',

        'about.personal.title': 'Personal Skills',
        'about.personal.communication': 'Effective Communication',
        'about.personal.results': 'Results-Oriented',
        'about.personal.teamwork': 'Teamwork',
        'about.personal.problemSolving': 'Problem Solving',
        'about.personal.leadership': 'Leadership',
        'about.personal.customerService': 'Customer Service',
        'about.personal.negotiation': 'Negotiation',
        'about.personal.adaptability': 'Adaptability',

        'about.experience.title': 'Professional Experience',
        'about.experience.job1.title': 'Commercial Coordinator — Distribuidora Gamma',
        'about.experience.job1.period': 'Tandil, Argentina | 10/2022 – 12/2023',
        'about.experience.job1.item1': 'Led wholesale pharmaceutical sales nationwide, expanding the corporate client portfolio.',
        'about.experience.job1.item2': 'Managed commercial relationships with hospitals, clinics and pharmacies, ensuring sustained service levels.',
        'about.experience.job1.item3': 'Supervised and coordinated remote sales teams, improving operational efficiency and team communication.',
        'about.experience.job1.item4': 'Implemented operational improvements that optimized customer satisfaction and reduced order management times.',
        'about.experience.job2.title': 'Cashier / Collector — Credil SRL',
        'about.experience.job2.period': 'Tandil, Argentina | 01/2019 – 12/2021',
        'about.experience.job2.item1': 'Managed installment collection from the client portfolio, maintaining stable cash flow.',
        'about.experience.job2.item2': 'Provided personalized service and resolved complaints, achieving high customer satisfaction levels.',
        'about.experience.job2.item3': 'Promoted and closed sales of financial products, contributing to active portfolio growth.',
        'about.experience.job3.title': 'Commercial Coordinator — Tarjeta Naranja S.A.',
        'about.experience.job3.period': 'Azul, Argentina | 04/2012 – 12/2018',
        'about.experience.job3.item1': 'Designed and implemented promotional campaigns that increased product visibility and revenue.',
        'about.experience.job3.item2': 'Negotiated and established commercial agreements with retail businesses, strengthening strategic alliances.',
        'about.experience.job3.item3': 'Coordinated the opening of a new branch in Bolívar, achieving a client base of over 300 in the first year (2017).',

        'about.education.title': 'Education',
        'about.education.degree1.title': 'Master\'s in Full Stack Web Development',
        'about.education.degree1.period': 'ConquerBlocks (Spain) | 2025 – Present',
        'about.education.degree1.description': 'Modules: HTML, CSS, JavaScript, TypeScript, ReactJS, SQL, Python, Django, Streamlit, SOLID principles, Git, Linux, WordPress and application deployment.',
        'about.education.degree2.title': 'University Technical Degree in Computer Application Development (TUDAI)',
        'about.education.degree2.period': 'National Defense University – Córdoba Regional University Center (IUA) | 2024 – Present (2nd year)',
        'about.education.degree2.description': 'Main areas: programming fundamentals, databases, networks, IT law, computer architecture, interface design, project management, testing and software quality.',
        'about.education.degree3.title': 'High School Diploma — Humanities and Social Sciences',
        'about.education.degree3.period': 'Escuela Normal Superior Bernardino Rivadavia, Azul, Argentina | 2008',

        'about.languages.title': 'Languages',
        'about.languages.spanish': 'Spanish:',
        'about.languages.spanishLevel': 'Native',
        'about.languages.english': 'English:',
        'about.languages.englishLevel': 'Intermediate level (technical reading and writing)',

        // Project Pages
        'facturia2.date': 'Full Stack Project with AI - 2025',
        'facturia2.title': 'FacturIA 2.0<br />Intelligent Financial Management System',
        'facturia2.description': 'Complete automated system for processing, classifying and analyzing financial transactions using <strong>Artificial Intelligence</strong>. Automates the entire cycle: from receipt of documents via email to generating executive reports with real-time interactive visualizations.',

        'facturia.date': 'Data Analysis Project with AI',
        'facturia.title': 'FacturIA<br />Invoice Automation System with AI',
        'facturia.description': '100% free automated system to process PDF invoices (text and images), extract information with Google Gemini Vision, store data in SQLite and visualize in Power BI. Compatible with WhatsApp photos and scanned invoices.',

        'analisis.date': 'Data Analysis Project',
        'analisis.title': 'Market Basket Analysis<br />Market Basket Analysis',
        'analisis.description': 'Analysis of 4.9 million transactions to discover purchase patterns and association rules that optimize cross-selling strategies.',

        'dashboard.date': 'Business Intelligence Project',
        'dashboard.title': 'Sales Dashboard<br />Interactive Analysis with Power BI',
        'dashboard.description': 'Interactive dashboard for sales and performance analysis by region, channel and product, with dynamic KPIs and professional visualizations.'
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

    // Update project navigation if on project page
    if (window.location.pathname.includes('/proyectos-web/')) {
        setupProjectNavigation();
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
        <a href="#" id="lang-toggle" class="button small" style="padding: 0.5em 1em; margin-left: 1em; color: white !important; border-color: white !important;">
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
