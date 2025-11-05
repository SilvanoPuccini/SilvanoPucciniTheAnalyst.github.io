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
    prevBtn.style.color = 'white';
    prevBtn.style.borderColor = 'white';
    paginationDiv.appendChild(prevBtn);

    // Project counter
    const counter = document.createElement('span');
    counter.textContent = `${currentProject + 1} / ${projects.length}`;
    counter.style.padding = '0 1em';
    counter.style.fontWeight = 'bold';
    counter.style.color = 'white';
    paginationDiv.appendChild(counter);

    // Next button
    const nextBtn = document.createElement('a');
    nextBtn.href = `${projects[nextIndex].slug}.html`;
    nextBtn.className = 'button';
    nextBtn.setAttribute('data-i18n', 'nav.nextProject');
    nextBtn.textContent = currentLang === 'es' ? 'Siguiente Proyecto →' : 'Next Project →';
    nextBtn.style.margin = '0';
    nextBtn.style.color = 'white';
    nextBtn.style.borderColor = 'white';
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
        'dashboard.description': 'Dashboard interactivo para análisis de ventas y rendimiento por región, canal y producto, con KPIs dinámicos y visualizaciones profesionales.',

        // ========================================
        // FACTURIA - COMPLETE CONTENT
        // ========================================
        'facturia.section1.title': '📋 Descripción del Proyecto',
        'facturia.section1.p1': 'FacturIA es un sistema completo de automatización diseñado para optimizar la gestión documental de facturas en formato PDF. El proyecto integra tecnologías modernas de análisis de datos e inteligencia artificial para transformar documentos no estructurados en información valiosa para la toma de decisiones financieras.',
        'facturia.section1.p2.strong': 'Origen:',
        'facturia.section1.p2': ' Este proyecto fue desarrollado a partir de una práctica del curso "Introductorio a Data Analytics" de TuPrimeraExperiencia.com, donde adapté y amplié la propuesta original incorporando mejoras en la estructura del código, presentación de resultados y documentación profesional.',

        'facturia.section2.title': '🎯 Problema que Resuelve',
        'facturia.section2.p': 'Las empresas reciben decenas o cientos de facturas mensualmente en formato PDF. El procesamiento manual de estos documentos consume tiempo valioso y es propenso a errores. FacturIA automatiza completamente este proceso:',
        'facturia.section2.li1.strong': 'Antes:',
        'facturia.section2.li1': ' Abrir cada PDF, copiar datos manualmente a Excel, verificar importes, clasificar por proveedor (horas de trabajo)',
        'facturia.section2.li2.strong': 'Con FacturIA:',
        'facturia.section2.li2': ' Procesar automáticamente todas las facturas en minutos, extraer datos con IA, almacenar en base de datos y visualizar en dashboards interactivos',

        'facturia.section3.title': '⚙️ Cómo Funciona (Flujo de Trabajo)',
        'facturia.section3.li1.strong': 'Ingesta de Datos:',
        'facturia.section3.li1': ' El sistema recorre carpetas organizadas con facturas en PDF (acepta PDFs con texto, escaneados, fotos de WhatsApp)',
        'facturia.section3.li2.strong': 'Detección Inteligente:',
        'facturia.section3.li2': ' Analiza automáticamente si el PDF contiene texto extraíble o es una imagen',
        'facturia.section3.li3.strong': 'Extracción Dual:',
        'facturia.section3.li3.sub1.strong': 'PDFs con texto:',
        'facturia.section3.li3.sub1': ' Extrae con PyMuPDF y envía a Google Gemini',
        'facturia.section3.li3.sub2.strong': 'PDFs con imagen:',
        'facturia.section3.li3.sub2': ' Convierte a imagen y usa Google Gemini Vision (IA multimodal que "ve" la factura)',
        'facturia.section3.li4.strong': 'Procesamiento con IA:',
        'facturia.section3.li4': ' Google Gemini Vision analiza la factura y extrae:',
        'facturia.section3.li4.item1': 'Fecha de emisión (formato dd/mm/aaaa)',
        'facturia.section3.li4.item2': 'Nombre del proveedor',
        'facturia.section3.li4.item3': 'Concepto o descripción del servicio/producto',
        'facturia.section3.li4.item4': 'Importe total',
        'facturia.section3.li4.item5': 'Moneda (EUR, USD, pesos, u otros)',
        'facturia.section3.li5.strong': 'Estructuración:',
        'facturia.section3.li5': ' La IA devuelve los datos en formato CSV estructurado',
        'facturia.section3.li6.strong': 'Conversión de Divisas:',
        'facturia.section3.li6': ' Convierte automáticamente dólares a euros (tasa configurable)',
        'facturia.section3.li7.strong': 'Almacenamiento:',
        'facturia.section3.li7': ' Guarda todos los registros en una base de datos SQLite',
        'facturia.section3.li8.strong': 'Visualización:',
        'facturia.section3.li8': ' Conecta Power BI a la base de datos para crear dashboards interactivos',

        'facturia.section4.title': '🛠️ Tecnologías Utilizadas',
        'facturia.section4.backend.title': 'Backend & Procesamiento',
        'facturia.section4.backend.li1': 'Python 3.x - Lenguaje principal',
        'facturia.section4.backend.li2': 'Pandas - Manipulación de datos',
        'facturia.section4.backend.li3': 'PyMuPDF (fitz) - Extracción de PDFs',
        'facturia.section4.backend.li4': 'Google Gemini Vision API - IA multimodal (texto + imágenes) 🆓',
        'facturia.section4.backend.li5': 'Pillow (PIL) - Procesamiento de imágenes',
        'facturia.section4.backend.li6': 'SQLAlchemy - ORM para base de datos',
        'facturia.section4.backend.li7': 'python-dotenv - Gestión de variables de entorno',
        'facturia.section4.storage.title': 'Almacenamiento & Visualización',
        'facturia.section4.storage.li1': 'SQLite - Base de datos ligera',
        'facturia.section4.storage.li2': 'Power BI - Dashboards interactivos',
        'facturia.section4.storage.li3': 'ODBC - Conexión Power BI ↔ SQLite',
        'facturia.section4.advantages.title': 'Ventajas',
        'facturia.section4.advantages.li1': '100% Gratuito - Usa Google Gemini API sin costos',
        'facturia.section4.advantages.li2': 'Sin OCR adicional - Gemini Vision lee imágenes directamente',

        'facturia.section5.title': '📊 Resultados Obtenidos',
        'facturia.section5.dashboard.title': 'Dashboard de Power BI',
        'facturia.section5.dashboard.p': 'El sistema genera un dashboard interactivo que permite:',
        'facturia.section5.dashboard.li1.strong': 'KPIs Principales:',
        'facturia.section5.dashboard.li1': ' Total de facturas procesadas, importe total, gasto promedio por factura',
        'facturia.section5.dashboard.li2.strong': 'Análisis Temporal:',
        'facturia.section5.dashboard.li2': ' Evolución del gasto mes a mes con gráficos de líneas',
        'facturia.section5.dashboard.li3.strong': 'Análisis por Proveedor:',
        'facturia.section5.dashboard.li3': ' Top proveedores por importe, distribución de gastos',
        'facturia.section5.dashboard.li4.strong': 'Análisis por Concepto:',
        'facturia.section5.dashboard.li4': ' Clasificación de gastos por tipo de servicio/producto',
        'facturia.section5.dashboard.li5.strong': 'Filtros Interactivos:',
        'facturia.section5.dashboard.li5': ' Por fecha, proveedor, rango de importes, moneda',
        'facturia.section5.metrics.title': 'Métricas del Proyecto',
        'facturia.section5.table.metric': 'Métrica',
        'facturia.section5.table.result': 'Resultado',
        'facturia.section5.table.row1.col1': 'Tiempo de procesamiento',
        'facturia.section5.table.row1.col2': '~3-5 segundos por factura',
        'facturia.section5.table.row2.col1': 'Precisión de extracción',
        'facturia.section5.table.row2.col2': '95%+ con Google Gemini Vision',
        'facturia.section5.table.row3.col1': 'Reducción de tiempo manual',
        'facturia.section5.table.row3.col2': '80-90% vs. entrada manual',
        'facturia.section5.table.row4.col1': 'Formatos soportados',
        'facturia.section5.table.row4.col2': 'PDFs con texto, escaneados, fotos de WhatsApp, capturas de pantalla',

        'facturia.section6.title': '💡 Aprendizajes Clave',
        'facturia.section6.li1.strong': 'IA Multimodal:',
        'facturia.section6.li1': ' Implementar Google Gemini Vision para procesar tanto texto como imágenes en un mismo flujo, permitiendo leer facturas escaneadas y fotografías sin OCR adicional',
        'facturia.section6.li2.strong': 'Detección Inteligente:',
        'facturia.section6.li2': ' Desarrollar lógica para identificar automáticamente si un PDF contiene texto extraíble o imágenes, aplicando el método de procesamiento apropiado para cada caso',
        'facturia.section6.li3.strong': 'Ingeniería de Prompts:',
        'facturia.section6.li3': ' Diseñar prompts efectivos para que la IA extraiga datos estructurados de manera consistente, tanto de texto como de imágenes visuales',
        'facturia.section6.li4.strong': 'Procesamiento de Imágenes:',
        'facturia.section6.li4': ' Convertir PDFs a imágenes de alta calidad (2x zoom) usando PyMuPDF y procesarlas con Pillow para enviarlas a la API de visión',
        'facturia.section6.li5.strong': 'APIs Gratuitas:',
        'facturia.section6.li5': ' Aprovechar Google Gemini API (100% gratuita) como alternativa viable a servicios pagos, manteniendo alta precisión en la extracción de datos',
        'facturia.section6.li6.strong': 'Manejo de Errores Robusto:',
        'facturia.section6.li6': ' Implementar validaciones exhaustivas para facturas con formatos no estándar, imágenes borrosas o datos incompletos, evitando que el sistema se detenga',
        'facturia.section6.li7.strong': 'Integración de Tecnologías:',
        'facturia.section6.li7': ' Conectar Python → Google Gemini Vision → SQLite → Power BI en un flujo automatizado end-to-end',
        'facturia.section6.li8.strong': 'Seguridad de Datos:',
        'facturia.section6.li8': ' Proteger API keys y datos sensibles usando .env y .gitignore, asegurando que información confidencial nunca se suba al repositorio',

        'facturia.section7.title': '🔗 Enlaces del Proyecto',
        'facturia.section7.button': 'Ver Proyecto en GitHub',

        // ========================================
        // FACTURIA 2.0 - COMPLETE CONTENT
        // ========================================
        'facturia2.h2.1': '🎯 Descripción del Proyecto',
        'facturia2.p.1': 'FacturIA 2.0 es un sistema <strong>end-to-end</strong> que revoluciona la gestión contable empresarial mediante la automatización completa del proceso de análisis financiero. A diferencia de su versión anterior que solo procesaba PDFs manualmente, esta segunda versión implementa un <strong>ecosistema completo</strong> con monitor de email 24/7, clasificación automática con IA, base de datos robusta y dashboard web interactivo.',
        'facturia2.p.2.title': 'Evolución desde FacturIA 1.0:',
        'facturia2.li.1.1': '<strong>Monitor automático de email</strong> con Gmail IMAP que revisa constantemente tu casilla',
        'facturia2.li.1.2': '<strong>Detección automática de personas</strong> a partir del remitente del email',
        'facturia2.li.1.3': '<strong>Google Gemini 2.0 Flash</strong> (última versión) con optimización para free tier (15 RPM)',
        'facturia2.li.1.4': '<strong>Dashboard web interactivo</strong> con Streamlit (multi-página con 4 secciones especializadas)',
        'facturia2.li.1.5': '<strong>Base de datos SQLAlchemy</strong> con soporte SQLite/PostgreSQL',
        'facturia2.li.1.6': '<strong>Sistema de notificaciones</strong> por email con resúmenes HTML profesionales',
        'facturia2.li.1.7': '<strong>Exportaciones avanzadas</strong> a Excel y PDF con formato profesional',
        'facturia2.li.1.8': '<strong>Rate limiting inteligente</strong> y circuit breaker para evitar costos en APIs',
        'facturia2.li.1.9': '<strong>Manejo robusto de UTF-8</strong> para caracteres especiales del español',

        'facturia2.h2.2': '🚀 Problema que Resuelve',
        'facturia2.p.3': 'Las pequeñas empresas y freelancers enfrentan un desafío crítico: <strong>gestionar manualmente decenas de comprobantes</strong> que llegan por email cada mes. Este proceso consume horas valiosas, es propenso a errores humanos y dificulta la toma de decisiones financieras oportunas.',
        'facturia2.table.th.1': 'Proceso Manual (Antes)',
        'facturia2.table.th.2': 'Con FacturIA 2.0 (Ahora)',
        'facturia2.table.td.1.1': 'Revisar emails manualmente buscando facturas',
        'facturia2.table.td.1.2': '<strong>Monitor automático</strong> revisa cada 5 minutos',
        'facturia2.table.td.2.1': 'Descargar adjuntos uno por uno',
        'facturia2.table.td.2.2': '<strong>Descarga automática</strong> de PDFs, PNGs y JPGs',
        'facturia2.table.td.3.1': 'Abrir cada PDF y copiar datos a Excel',
        'facturia2.table.td.3.2': '<strong>Gemini AI extrae</strong> monto, fecha, categoría automáticamente',
        'facturia2.table.td.4.1': 'Clasificar manualmente: ingreso o egreso',
        'facturia2.table.td.4.2': '<strong>IA clasifica</strong> con 95%+ de precisión',
        'facturia2.table.td.5.1': 'Crear gráficos y reportes en Excel/PowerPoint',
        'facturia2.table.td.5.2': '<strong>Dashboard interactivo</strong> con visualizaciones en tiempo real',
        'facturia2.table.td.6.1': '<strong>Tiempo invertido:</strong> 3-5 horas por semana',
        'facturia2.table.td.6.2': '<strong>Tiempo invertido:</strong> 5 minutos (solo revisión de excepciones)',

        'facturia2.h2.3': '⚙️ Arquitectura del Sistema',
        'facturia2.p.4': 'FacturIA 2.0 implementa una <strong>arquitectura modular</strong> con 5 componentes principales que trabajan de manera coordinada:',
        'facturia2.h3.1': '1. Monitor de Email (email_monitor/)',
        'facturia2.li.2.1': '<strong>Conexión IMAP persistente</strong> con Gmail',
        'facturia2.li.2.2': 'Busca emails con adjuntos cada 5 minutos (configurable)',
        'facturia2.li.2.3': 'Filtra por palabras clave: "factura", "comprobante", "recibo"',
        'facturia2.li.2.4': 'Descarga PDFs, PNGs y JPGs automáticamente',
        'facturia2.li.2.5': 'Evita duplicados mediante tracking de Message-ID',
        'facturia2.li.2.6': '<strong>Extracción inteligente de personas:</strong> detecta el remitente desde el email',

        'facturia2.h3.2': '2. Procesador con IA (ai_processor/)',
        'facturia2.li.3.1': '<strong>Google Gemini 2.0 Flash</strong> (modelo multimodal más reciente)',
        'facturia2.li.3.2': 'Analiza PDFs e imágenes de comprobantes',
        'facturia2.li.3.3': 'Extrae: tipo (ingreso/egreso), categoría, monto, fecha, emisor, número de comprobante',
        'facturia2.li.3.4': '<strong>Rate limiting inteligente:</strong> respeta límite de 15 RPM del free tier',
        'facturia2.li.3.5': '<strong>Circuit breaker:</strong> pausa procesamiento si detecta múltiples fallos consecutivos',
        'facturia2.li.3.6': '<strong>Error recovery:</strong> corrige JSON malformado automáticamente',
        'facturia2.li.3.7': '<strong>Confianza ajustable:</strong> marca transacciones que requieren revisión manual',

        'facturia2.h3.3': '3. Base de Datos (database/)',
        'facturia2.li.4.1': '<strong>SQLAlchemy ORM</strong> para abstracción completa de SQL',
        'facturia2.li.4.2': 'Soporte multi-DB: SQLite (desarrollo) y PostgreSQL (producción)',
        'facturia2.li.4.3': 'Modelo de datos robusto con 20+ campos:',
        'facturia2.li.4.3.sub1': 'Información financiera: tipo, categoría, monto, fecha',
        'facturia2.li.4.3.sub2': 'Metadata: persona, emisor/receptor, descripción',
        'facturia2.li.4.3.sub3': 'Auditoría: fecha de creación, edición manual, última modificación',
        'facturia2.li.4.3.sub4': 'Flags: requiere_revision, editado_manualmente, confianza_ia',
        'facturia2.li.4.4': 'CRUD operations completas con validaciones',
        'facturia2.li.4.5': 'Script de limpieza incluido (limpiar_db.py)',

        'facturia2.h3.4': '4. Dashboard Interactivo (dashboard/)',
        'facturia2.li.5.1': '<strong>Streamlit Framework</strong> con 4 páginas especializadas:',
        'facturia2.li.5.1.sub1': '<strong>Principal:</strong> KPIs, gráficos de evolución temporal, distribución por categorías',
        'facturia2.li.5.1.sub2': '<strong>Revisar Transacciones:</strong> edición manual con interfaz intuitiva, búsqueda y filtros avanzados',
        'facturia2.li.5.1.sub3': '<strong>Cargar CSV:</strong> importación masiva con mapeo de columnas y validación',
        'facturia2.li.5.1.sub4': '<strong>Configuración:</strong> estadísticas del sistema y mantenimiento',
        'facturia2.li.5.2': '<strong>Visualizaciones con Plotly:</strong> gráficos interactivos 100% responsivos',
        'facturia2.li.5.3': '<strong>Filtros avanzados:</strong> por fecha, categoría, persona, tipo y origen',
        'facturia2.li.5.4': '<strong>Exportaciones profesionales:</strong> Excel con formato y PDF con gráficos',

        'facturia2.h3.5': '5. Sistema de Notificaciones (notifications/)',
        'facturia2.li.6.1': 'Envía emails automáticos cuando se procesan nuevas transacciones',
        'facturia2.li.6.2': 'HTML estilizado con formato profesional',
        'facturia2.li.6.3': 'Incluye resumen estadístico y lista detallada de transacciones',
        'facturia2.li.6.4': 'Soporte multi-destinatario',

        'facturia2.h2.4': '🛠️ Stack Tecnológico',
        'facturia2.h3.6': 'Backend & IA',
        'facturia2.li.7.1': '<strong>Python 3.10+</strong> - Lenguaje principal',
        'facturia2.li.7.2': '<strong>Google Gemini 2.0 Flash</strong> - IA multimodal',
        'facturia2.li.7.3': '<strong>SQLAlchemy 2.0</strong> - ORM',
        'facturia2.li.7.4': '<strong>Pydantic</strong> - Validación de datos',
        'facturia2.li.7.5': '<strong>PyPDF2 + Pillow</strong> - Procesamiento de documentos',
        'facturia2.li.7.6': '<strong>Schedule + Loguru</strong> - Automatización y logging',
        'facturia2.h3.7': 'Frontend & Visualización',
        'facturia2.li.8.1': '<strong>Streamlit 1.29</strong> - Framework de dashboard',
        'facturia2.li.8.2': '<strong>Plotly</strong> - Gráficos interactivos',
        'facturia2.li.8.3': '<strong>Pandas + NumPy</strong> - Análisis de datos',
        'facturia2.li.8.4': '<strong>openpyxl + ReportLab</strong> - Exportaciones',
        'facturia2.h3.8': 'Email & Comunicación',
        'facturia2.li.9.1': '<strong>Gmail IMAP</strong> - Monitor de emails',
        'facturia2.li.9.2': '<strong>smtplib</strong> - Envío de notificaciones',

        'facturia2.h2.5': '📊 Funcionalidades Destacadas',
        'facturia2.h3.9': '1. Rate Limiting Inteligente',
        'facturia2.p.5': 'Optimizado para el <strong>free tier de Google Gemini</strong> (15 requests por minuto):',
        'facturia2.li.10.1': 'Espera de 15 segundos entre archivos',
        'facturia2.li.10.2': 'Exponential backoff en reintentos: 10s → 20s → 30s',
        'facturia2.li.10.3': 'Circuit breaker: si fallan 10 archivos consecutivos, pausa 5 minutos',
        'facturia2.li.10.4': 'Logging detallado de cada request para debugging',

        'facturia2.h3.10': '2. Detección Automática de Personas',
        'facturia2.p.6': 'Extrae nombres automáticamente desde el email del remitente:',
        'facturia2.li.11.1': '<code>silva.puccini@gmail.com</code> → <strong>Silva Puccini</strong>',
        'facturia2.li.11.2': '<code>maria_rodriguez_123@hotmail.com</code> → <strong>Maria Rodriguez</strong>',
        'facturia2.li.11.3': '<code>info@empresa.com</code> → <strong>Empresa</strong> (usa dominio)',

        'facturia2.h3.11': '3. Manejo Robusto de UTF-8',
        'facturia2.p.7': 'Procesa correctamente caracteres especiales del español:',
        'facturia2.li.12.1': 'Acentos: á, é, í, ó, ú',
        'facturia2.li.12.2': 'Ñ mayúscula y minúscula',
        'facturia2.li.12.3': 'Símbolos: ¿, ¡, €, $',
        'facturia2.li.12.4': 'Función <code>safe_str()</code> en todas las exportaciones',

        'facturia2.h3.12': '4. Exportaciones Profesionales',
        'facturia2.p.8': '<strong>Excel (.xlsx):</strong>',
        'facturia2.li.13.1': 'Encabezados en negrita con fondo azul',
        'facturia2.li.13.2': 'Formato de moneda con símbolo $',
        'facturia2.li.13.3': 'Columnas auto-ajustadas',
        'facturia2.li.13.4': 'Filtros automáticos',
        'facturia2.p.9': '<strong>PDF:</strong>',
        'facturia2.li.14.1': 'Header profesional con título',
        'facturia2.li.14.2': 'Tabla con bordes y colores alternados',
        'facturia2.li.14.3': 'Pie de página con número de página y fecha',
        'facturia2.li.14.4': 'Resumen estadístico al final',

        'facturia2.h2.6': '📈 Resultados y Métricas',
        'facturia2.table2.th.1': 'Métrica',
        'facturia2.table2.th.2': 'Resultado',
        'facturia2.table2.td.1.1': 'Líneas de código',
        'facturia2.table2.td.1.2': '~5,000 líneas',
        'facturia2.table2.td.2.1': 'Archivos Python',
        'facturia2.table2.td.2.2': '15 módulos organizados',
        'facturia2.table2.td.3.1': 'Tiempo de procesamiento',
        'facturia2.table2.td.3.2': '~25 segundos por archivo (incluye delays de API)',
        'facturia2.table2.td.4.1': 'Precisión de clasificación',
        'facturia2.table2.td.4.2': '95%+ con Gemini 2.0 Flash',
        'facturia2.table2.td.5.1': 'Reducción de tiempo manual',
        'facturia2.table2.td.5.2': '90%+ vs. proceso tradicional',
        'facturia2.table2.td.6.1': 'Costo de operación',
        'facturia2.table2.td.6.2': '$0 (100% free tier de Gemini)',
        'facturia2.table2.td.7.1': 'Formatos soportados',
        'facturia2.table2.td.7.2': 'PDF (texto e imagen), PNG, JPG, CSV',

        'facturia2.h2.7': '💡 Desafíos Técnicos Resueltos',
        'facturia2.li.15.1': '<strong>Rate Limiting de APIs Gratuitas:</strong> Implementé un rate limiter inteligente con exponential backoff y circuit breaker para respetar el límite de 15 RPM de Gemini sin perder procesamiento.',
        'facturia2.li.15.2': '<strong>JSON Parsing con Errores:</strong> Gemini 2.0 a veces devuelve JSON con doble llaves <code>{{ }}</code>. Creé un sistema de detección y corrección automática que normaliza la respuesta antes de parsear.',
        'facturia2.li.15.3': '<strong>UTF-8 Encoding en Español:</strong> Los caracteres especiales (á, é, í, ó, ú, ñ) causaban errores en exportaciones. Implementé la función <code>safe_str()</code> y declaraciones de encoding en todos los módulos.',
        'facturia2.li.15.4': '<strong>Persistencia de Cambios en Streamlit:</strong> Los botones "Guardar" no persistían cambios porque <code>st.rerun()</code> terminaba el script antes del auto-commit. Solución: agregar <code>session.commit()</code> explícito antes de rerun.',
        'facturia2.li.15.5': '<strong>Detección de Usuarios Duplicados:</strong> El sistema creaba múltiples usuarios para la misma persona por variaciones en el campo From del email. Implementé regex para extraer solo el email limpio desde "Nombre &lt;email&gt;".',
        'facturia2.li.15.6': '<strong>Cambio de Modelo de Gemini:</strong> El modelo original (gemini-1.5-flash-8b) se deprecó. Migré a gemini-2.0-flash-exp ajustando delays y prompts para mantener precisión.',

        'facturia2.h2.8': '🎓 Aprendizajes Clave',
        'facturia2.li.16.1': '<strong>Arquitectura Modular:</strong> Diseñar sistemas con separación de responsabilidades (SoC) facilita el mantenimiento y escalabilidad.',
        'facturia2.li.16.2': '<strong>IA en Producción:</strong> Implementar rate limiting, error recovery y circuit breakers es esencial para sistemas que dependen de APIs externas.',
        'facturia2.li.16.3': '<strong>Full Stack Development:</strong> Integrar backend (Python), IA (Gemini), base de datos (SQLAlchemy) y frontend (Streamlit) en un flujo end-to-end.',
        'facturia2.li.16.4': '<strong>Ingeniería de Prompts:</strong> Diseñar prompts efectivos para extraer datos estructurados de manera consistente de documentos no estructurados.',
        'facturia2.li.16.5': '<strong>Testing en Producción:</strong> Los usuarios reales encuentran edge cases que los tests unitarios no cubren. Implementar logging exhaustivo es crucial.',
        'facturia2.li.16.6': '<strong>Optimización de Costos:</strong> Aprovechar free tiers de APIs (Gemini) con estrategias inteligentes de rate limiting puede resultar en sistemas $0 costo de operación.',

        'facturia2.h2.9': '🔗 Enlaces del Proyecto',
        'facturia2.button': 'Ver Proyecto en GitHub'
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
        'dashboard.description': 'Interactive dashboard for sales and performance analysis by region, channel and product, with dynamic KPIs and professional visualizations.',

        // ========================================
        // FACTURIA - COMPLETE CONTENT (ENGLISH)
        // ========================================
        'facturia.section1.title': '📋 Project Description',
        'facturia.section1.p1': 'FacturIA is a complete automation system designed to optimize document management of PDF invoices. The project integrates modern data analysis and artificial intelligence technologies to transform unstructured documents into valuable information for financial decision-making.',
        'facturia.section1.p2.strong': 'Origin:',
        'facturia.section1.p2': ' This project was developed from a practice in the "Introduction to Data Analytics" course from TuPrimeraExperiencia.com, where I adapted and expanded the original proposal by incorporating improvements in code structure, result presentation, and professional documentation.',

        'facturia.section2.title': '🎯 Problem It Solves',
        'facturia.section2.p': 'Companies receive dozens or hundreds of invoices monthly in PDF format. Manual processing of these documents consumes valuable time and is prone to errors. FacturIA completely automates this process:',
        'facturia.section2.li1.strong': 'Before:',
        'facturia.section2.li1': ' Open each PDF, manually copy data to Excel, verify amounts, classify by supplier (hours of work)',
        'facturia.section2.li2.strong': 'With FacturIA:',
        'facturia.section2.li2': ' Automatically process all invoices in minutes, extract data with AI, store in database and visualize in interactive dashboards',

        'facturia.section3.title': '⚙️ How It Works (Workflow)',
        'facturia.section3.li1.strong': 'Data Ingestion:',
        'facturia.section3.li1': ' The system scans organized folders with PDF invoices (accepts PDFs with text, scanned, WhatsApp photos)',
        'facturia.section3.li2.strong': 'Intelligent Detection:',
        'facturia.section3.li2': ' Automatically analyzes if the PDF contains extractable text or is an image',
        'facturia.section3.li3.strong': 'Dual Extraction:',
        'facturia.section3.li3.sub1.strong': 'PDFs with text:',
        'facturia.section3.li3.sub1': ' Extracts with PyMuPDF and sends to Google Gemini',
        'facturia.section3.li3.sub2.strong': 'PDFs with image:',
        'facturia.section3.li3.sub2': ' Converts to image and uses Google Gemini Vision (multimodal AI that "sees" the invoice)',
        'facturia.section3.li4.strong': 'AI Processing:',
        'facturia.section3.li4': ' Google Gemini Vision analyzes the invoice and extracts:',
        'facturia.section3.li4.item1': 'Issue date (dd/mm/yyyy format)',
        'facturia.section3.li4.item2': 'Supplier name',
        'facturia.section3.li4.item3': 'Concept or service/product description',
        'facturia.section3.li4.item4': 'Total amount',
        'facturia.section3.li4.item5': 'Currency (EUR, USD, pesos, or others)',
        'facturia.section3.li5.strong': 'Structuring:',
        'facturia.section3.li5': ' The AI returns data in structured CSV format',
        'facturia.section3.li6.strong': 'Currency Conversion:',
        'facturia.section3.li6': ' Automatically converts dollars to euros (configurable rate)',
        'facturia.section3.li7.strong': 'Storage:',
        'facturia.section3.li7': ' Saves all records in a SQLite database',
        'facturia.section3.li8.strong': 'Visualization:',
        'facturia.section3.li8': ' Connects Power BI to the database to create interactive dashboards',

        'facturia.section4.title': '🛠️ Technologies Used',
        'facturia.section4.backend.title': 'Backend & Processing',
        'facturia.section4.backend.li1': 'Python 3.x - Main language',
        'facturia.section4.backend.li2': 'Pandas - Data manipulation',
        'facturia.section4.backend.li3': 'PyMuPDF (fitz) - PDF extraction',
        'facturia.section4.backend.li4': 'Google Gemini Vision API - Multimodal AI (text + images) 🆓',
        'facturia.section4.backend.li5': 'Pillow (PIL) - Image processing',
        'facturia.section4.backend.li6': 'SQLAlchemy - Database ORM',
        'facturia.section4.backend.li7': 'python-dotenv - Environment variable management',
        'facturia.section4.storage.title': 'Storage & Visualization',
        'facturia.section4.storage.li1': 'SQLite - Lightweight database',
        'facturia.section4.storage.li2': 'Power BI - Interactive dashboards',
        'facturia.section4.storage.li3': 'ODBC - Power BI ↔ SQLite connection',
        'facturia.section4.advantages.title': 'Advantages',
        'facturia.section4.advantages.li1': '100% Free - Uses Google Gemini API at no cost',
        'facturia.section4.advantages.li2': 'No additional OCR - Gemini Vision reads images directly',

        'facturia.section5.title': '📊 Results Obtained',
        'facturia.section5.dashboard.title': 'Power BI Dashboard',
        'facturia.section5.dashboard.p': 'The system generates an interactive dashboard that allows:',
        'facturia.section5.dashboard.li1.strong': 'Main KPIs:',
        'facturia.section5.dashboard.li1': ' Total invoices processed, total amount, average expense per invoice',
        'facturia.section5.dashboard.li2.strong': 'Temporal Analysis:',
        'facturia.section5.dashboard.li2': ' Month-to-month spending evolution with line charts',
        'facturia.section5.dashboard.li3.strong': 'Supplier Analysis:',
        'facturia.section5.dashboard.li3': ' Top suppliers by amount, expense distribution',
        'facturia.section5.dashboard.li4.strong': 'Concept Analysis:',
        'facturia.section5.dashboard.li4': ' Expense classification by service/product type',
        'facturia.section5.dashboard.li5.strong': 'Interactive Filters:',
        'facturia.section5.dashboard.li5': ' By date, supplier, amount range, currency',
        'facturia.section5.metrics.title': 'Project Metrics',
        'facturia.section5.table.metric': 'Metric',
        'facturia.section5.table.result': 'Result',
        'facturia.section5.table.row1.col1': 'Processing time',
        'facturia.section5.table.row1.col2': '~3-5 seconds per invoice',
        'facturia.section5.table.row2.col1': 'Extraction accuracy',
        'facturia.section5.table.row2.col2': '95%+ with Google Gemini Vision',
        'facturia.section5.table.row3.col1': 'Manual time reduction',
        'facturia.section5.table.row3.col2': '80-90% vs. manual entry',
        'facturia.section5.table.row4.col1': 'Supported formats',
        'facturia.section5.table.row4.col2': 'PDFs with text, scanned, WhatsApp photos, screenshots',

        'facturia.section6.title': '💡 Key Learnings',
        'facturia.section6.li1.strong': 'Multimodal AI:',
        'facturia.section6.li1': ' Implementing Google Gemini Vision to process both text and images in the same workflow, allowing reading of scanned invoices and photographs without additional OCR',
        'facturia.section6.li2.strong': 'Intelligent Detection:',
        'facturia.section6.li2': ' Developing logic to automatically identify if a PDF contains extractable text or images, applying the appropriate processing method for each case',
        'facturia.section6.li3.strong': 'Prompt Engineering:',
        'facturia.section6.li3': ' Designing effective prompts so that AI extracts structured data consistently, both from text and visual images',
        'facturia.section6.li4.strong': 'Image Processing:',
        'facturia.section6.li4': ' Converting PDFs to high-quality images (2x zoom) using PyMuPDF and processing them with Pillow to send to the vision API',
        'facturia.section6.li5.strong': 'Free APIs:',
        'facturia.section6.li5': ' Leveraging Google Gemini API (100% free) as a viable alternative to paid services, maintaining high accuracy in data extraction',
        'facturia.section6.li6.strong': 'Robust Error Handling:',
        'facturia.section6.li6': ' Implementing comprehensive validations for invoices with non-standard formats, blurry images or incomplete data, preventing the system from stopping',
        'facturia.section6.li7.strong': 'Technology Integration:',
        'facturia.section6.li7': ' Connecting Python → Google Gemini Vision → SQLite → Power BI in an automated end-to-end flow',
        'facturia.section6.li8.strong': 'Data Security:',
        'facturia.section6.li8': ' Protecting API keys and sensitive data using .env and .gitignore, ensuring that confidential information is never uploaded to the repository',

        'facturia.section7.title': '🔗 Project Links',
        'facturia.section7.button': 'View Project on GitHub',

        // ========================================
        // FACTURIA 2.0 - COMPLETE CONTENT (ENGLISH)
        // ========================================
        'facturia2.h2.1': '🎯 Project Description',
        'facturia2.p.1': 'FacturIA 2.0 is an <strong>end-to-end</strong> system that revolutionizes business accounting management through complete automation of the financial analysis process. Unlike its previous version that only processed PDFs manually, this second version implements a <strong>complete ecosystem</strong> with 24/7 email monitoring, automatic AI classification, robust database, and interactive web dashboard.',
        'facturia2.p.2.title': 'Evolution from FacturIA 1.0:',
        'facturia2.li.1.1': '<strong>Automatic email monitor</strong> with Gmail IMAP that constantly checks your mailbox',
        'facturia2.li.1.2': '<strong>Automatic person detection</strong> from email sender',
        'facturia2.li.1.3': '<strong>Google Gemini 2.0 Flash</strong> (latest version) optimized for free tier (15 RPM)',
        'facturia2.li.1.4': '<strong>Interactive web dashboard</strong> with Streamlit (multi-page with 4 specialized sections)',
        'facturia2.li.1.5': '<strong>SQLAlchemy database</strong> with SQLite/PostgreSQL support',
        'facturia2.li.1.6': '<strong>Notification system</strong> via email with professional HTML summaries',
        'facturia2.li.1.7': '<strong>Advanced exports</strong> to Excel and PDF with professional formatting',
        'facturia2.li.1.8': '<strong>Intelligent rate limiting</strong> and circuit breaker to avoid API costs',
        'facturia2.li.1.9': '<strong>Robust UTF-8 handling</strong> for Spanish special characters',

        'facturia2.h2.2': '🚀 Problem It Solves',
        'facturia2.p.3': 'Small businesses and freelancers face a critical challenge: <strong>manually managing dozens of receipts</strong> arriving by email each month. This process consumes valuable hours, is prone to human error, and hinders timely financial decision-making.',
        'facturia2.table.th.1': 'Manual Process (Before)',
        'facturia2.table.th.2': 'With FacturIA 2.0 (Now)',
        'facturia2.table.td.1.1': 'Manually review emails looking for invoices',
        'facturia2.table.td.1.2': '<strong>Automatic monitor</strong> checks every 5 minutes',
        'facturia2.table.td.2.1': 'Download attachments one by one',
        'facturia2.table.td.2.2': '<strong>Automatic download</strong> of PDFs, PNGs and JPGs',
        'facturia2.table.td.3.1': 'Open each PDF and copy data to Excel',
        'facturia2.table.td.3.2': '<strong>Gemini AI extracts</strong> amount, date, category automatically',
        'facturia2.table.td.4.1': 'Manually classify: income or expense',
        'facturia2.table.td.4.2': '<strong>AI classifies</strong> with 95%+ accuracy',
        'facturia2.table.td.5.1': 'Create charts and reports in Excel/PowerPoint',
        'facturia2.table.td.5.2': '<strong>Interactive dashboard</strong> with real-time visualizations',
        'facturia2.table.td.6.1': '<strong>Time invested:</strong> 3-5 hours per week',
        'facturia2.table.td.6.2': '<strong>Time invested:</strong> 5 minutes (only exception review)',

        'facturia2.h2.3': '⚙️ System Architecture',
        'facturia2.p.4': 'FacturIA 2.0 implements a <strong>modular architecture</strong> with 5 main components working in coordination:',
        'facturia2.h3.1': '1. Email Monitor (email_monitor/)',
        'facturia2.li.2.1': '<strong>Persistent IMAP connection</strong> with Gmail',
        'facturia2.li.2.2': 'Searches for emails with attachments every 5 minutes (configurable)',
        'facturia2.li.2.3': 'Filters by keywords: "factura", "comprobante", "recibo"',
        'facturia2.li.2.4': 'Downloads PDFs, PNGs and JPGs automatically',
        'facturia2.li.2.5': 'Avoids duplicates through Message-ID tracking',
        'facturia2.li.2.6': '<strong>Intelligent person extraction:</strong> detects sender from email',

        'facturia2.h3.2': '2. AI Processor (ai_processor/)',
        'facturia2.li.3.1': '<strong>Google Gemini 2.0 Flash</strong> (latest multimodal model)',
        'facturia2.li.3.2': 'Analyzes PDFs and receipt images',
        'facturia2.li.3.3': 'Extracts: type (income/expense), category, amount, date, issuer, receipt number',
        'facturia2.li.3.4': '<strong>Intelligent rate limiting:</strong> respects 15 RPM limit of free tier',
        'facturia2.li.3.5': '<strong>Circuit breaker:</strong> pauses processing if multiple consecutive failures detected',
        'facturia2.li.3.6': '<strong>Error recovery:</strong> automatically corrects malformed JSON',
        'facturia2.li.3.7': '<strong>Adjustable confidence:</strong> marks transactions requiring manual review',

        'facturia2.h3.3': '3. Database (database/)',
        'facturia2.li.4.1': '<strong>SQLAlchemy ORM</strong> for complete SQL abstraction',
        'facturia2.li.4.2': 'Multi-DB support: SQLite (development) and PostgreSQL (production)',
        'facturia2.li.4.3': 'Robust data model with 20+ fields:',
        'facturia2.li.4.3.sub1': 'Financial information: type, category, amount, date',
        'facturia2.li.4.3.sub2': 'Metadata: person, issuer/receiver, description',
        'facturia2.li.4.3.sub3': 'Audit: creation date, manual edit, last modification',
        'facturia2.li.4.3.sub4': 'Flags: requires_review, manually_edited, ai_confidence',
        'facturia2.li.4.4': 'Complete CRUD operations with validations',
        'facturia2.li.4.5': 'Cleanup script included (limpiar_db.py)',

        'facturia2.h3.4': '4. Interactive Dashboard (dashboard/)',
        'facturia2.li.5.1': '<strong>Streamlit Framework</strong> with 4 specialized pages:',
        'facturia2.li.5.1.sub1': '<strong>Main:</strong> KPIs, temporal evolution charts, category distribution',
        'facturia2.li.5.1.sub2': '<strong>Review Transactions:</strong> manual editing with intuitive interface, search and advanced filters',
        'facturia2.li.5.1.sub3': '<strong>Load CSV:</strong> bulk import with column mapping and validation',
        'facturia2.li.5.1.sub4': '<strong>Settings:</strong> system statistics and maintenance',
        'facturia2.li.5.2': '<strong>Plotly visualizations:</strong> 100% responsive interactive charts',
        'facturia2.li.5.3': '<strong>Advanced filters:</strong> by date, category, person, type and origin',
        'facturia2.li.5.4': '<strong>Professional exports:</strong> Excel with formatting and PDF with charts',

        'facturia2.h3.5': '5. Notification System (notifications/)',
        'facturia2.li.6.1': 'Sends automatic emails when new transactions are processed',
        'facturia2.li.6.2': 'Styled HTML with professional formatting',
        'facturia2.li.6.3': 'Includes statistical summary and detailed transaction list',
        'facturia2.li.6.4': 'Multi-recipient support',

        'facturia2.h2.4': '🛠️ Technology Stack',
        'facturia2.h3.6': 'Backend & AI',
        'facturia2.li.7.1': '<strong>Python 3.10+</strong> - Main language',
        'facturia2.li.7.2': '<strong>Google Gemini 2.0 Flash</strong> - Multimodal AI',
        'facturia2.li.7.3': '<strong>SQLAlchemy 2.0</strong> - ORM',
        'facturia2.li.7.4': '<strong>Pydantic</strong> - Data validation',
        'facturia2.li.7.5': '<strong>PyPDF2 + Pillow</strong> - Document processing',
        'facturia2.li.7.6': '<strong>Schedule + Loguru</strong> - Automation and logging',
        'facturia2.h3.7': 'Frontend & Visualization',
        'facturia2.li.8.1': '<strong>Streamlit 1.29</strong> - Dashboard framework',
        'facturia2.li.8.2': '<strong>Plotly</strong> - Interactive charts',
        'facturia2.li.8.3': '<strong>Pandas + NumPy</strong> - Data analysis',
        'facturia2.li.8.4': '<strong>openpyxl + ReportLab</strong> - Exports',
        'facturia2.h3.8': 'Email & Communication',
        'facturia2.li.9.1': '<strong>Gmail IMAP</strong> - Email monitor',
        'facturia2.li.9.2': '<strong>smtplib</strong> - Notification sending',

        'facturia2.h2.5': '📊 Featured Functionalities',
        'facturia2.h3.9': '1. Intelligent Rate Limiting',
        'facturia2.p.5': 'Optimized for <strong>Google Gemini free tier</strong> (15 requests per minute):',
        'facturia2.li.10.1': '15-second wait between files',
        'facturia2.li.10.2': 'Exponential backoff on retries: 10s → 20s → 30s',
        'facturia2.li.10.3': 'Circuit breaker: if 10 consecutive files fail, pause 5 minutes',
        'facturia2.li.10.4': 'Detailed logging of each request for debugging',

        'facturia2.h3.10': '2. Automatic Person Detection',
        'facturia2.p.6': 'Automatically extracts names from email sender:',
        'facturia2.li.11.1': '<code>silva.puccini@gmail.com</code> → <strong>Silva Puccini</strong>',
        'facturia2.li.11.2': '<code>maria_rodriguez_123@hotmail.com</code> → <strong>Maria Rodriguez</strong>',
        'facturia2.li.11.3': '<code>info@empresa.com</code> → <strong>Empresa</strong> (uses domain)',

        'facturia2.h3.11': '3. Robust UTF-8 Handling',
        'facturia2.p.7': 'Correctly processes Spanish special characters:',
        'facturia2.li.12.1': 'Accents: á, é, í, ó, ú',
        'facturia2.li.12.2': 'Upper and lowercase Ñ',
        'facturia2.li.12.3': 'Symbols: ¿, ¡, €, $',
        'facturia2.li.12.4': '<code>safe_str()</code> function in all exports',

        'facturia2.h3.12': '4. Professional Exports',
        'facturia2.p.8': '<strong>Excel (.xlsx):</strong>',
        'facturia2.li.13.1': 'Headers in bold with blue background',
        'facturia2.li.13.2': 'Currency format with $ symbol',
        'facturia2.li.13.3': 'Auto-adjusted columns',
        'facturia2.li.13.4': 'Automatic filters',
        'facturia2.p.9': '<strong>PDF:</strong>',
        'facturia2.li.14.1': 'Professional header with title',
        'facturia2.li.14.2': 'Table with borders and alternating colors',
        'facturia2.li.14.3': 'Footer with page number and date',
        'facturia2.li.14.4': 'Statistical summary at the end',

        'facturia2.h2.6': '📈 Results and Metrics',
        'facturia2.table2.th.1': 'Metric',
        'facturia2.table2.th.2': 'Result',
        'facturia2.table2.td.1.1': 'Lines of code',
        'facturia2.table2.td.1.2': '~5,000 lines',
        'facturia2.table2.td.2.1': 'Python files',
        'facturia2.table2.td.2.2': '15 organized modules',
        'facturia2.table2.td.3.1': 'Processing time',
        'facturia2.table2.td.3.2': '~25 seconds per file (includes API delays)',
        'facturia2.table2.td.4.1': 'Classification accuracy',
        'facturia2.table2.td.4.2': '95%+ with Gemini 2.0 Flash',
        'facturia2.table2.td.5.1': 'Manual time reduction',
        'facturia2.table2.td.5.2': '90%+ vs. traditional process',
        'facturia2.table2.td.6.1': 'Operation cost',
        'facturia2.table2.td.6.2': '$0 (100% Gemini free tier)',
        'facturia2.table2.td.7.1': 'Supported formats',
        'facturia2.table2.td.7.2': 'PDF (text and image), PNG, JPG, CSV',

        'facturia2.h2.7': '💡 Technical Challenges Solved',
        'facturia2.li.15.1': '<strong>Free API Rate Limiting:</strong> Implemented an intelligent rate limiter with exponential backoff and circuit breaker to respect the 15 RPM limit of Gemini without losing processing.',
        'facturia2.li.15.2': '<strong>JSON Parsing with Errors:</strong> Gemini 2.0 sometimes returns JSON with double brackets <code>{{ }}</code>. Created an automatic detection and correction system that normalizes the response before parsing.',
        'facturia2.li.15.3': '<strong>UTF-8 Encoding in Spanish:</strong> Special characters (á, é, í, ó, ú, ñ) caused errors in exports. Implemented the <code>safe_str()</code> function and encoding declarations in all modules.',
        'facturia2.li.15.4': '<strong>Change Persistence in Streamlit:</strong> "Save" buttons did not persist changes because <code>st.rerun()</code> terminated the script before auto-commit. Solution: add explicit <code>session.commit()</code> before rerun.',
        'facturia2.li.15.5': '<strong>Duplicate User Detection:</strong> The system created multiple users for the same person due to variations in the email From field. Implemented regex to extract only the clean email from "Name &lt;email&gt;".',
        'facturia2.li.15.6': '<strong>Gemini Model Change:</strong> The original model (gemini-1.5-flash-8b) was deprecated. Migrated to gemini-2.0-flash-exp adjusting delays and prompts to maintain accuracy.',

        'facturia2.h2.8': '🎓 Key Learnings',
        'facturia2.li.16.1': '<strong>Modular Architecture:</strong> Designing systems with separation of concerns (SoC) facilitates maintenance and scalability.',
        'facturia2.li.16.2': '<strong>AI in Production:</strong> Implementing rate limiting, error recovery and circuit breakers is essential for systems that depend on external APIs.',
        'facturia2.li.16.3': '<strong>Full Stack Development:</strong> Integrating backend (Python), AI (Gemini), database (SQLAlchemy) and frontend (Streamlit) in an end-to-end flow.',
        'facturia2.li.16.4': '<strong>Prompt Engineering:</strong> Designing effective prompts to extract structured data consistently from unstructured documents.',
        'facturia2.li.16.5': '<strong>Testing in Production:</strong> Real users find edge cases that unit tests don\'t cover. Implementing comprehensive logging is crucial.',
        'facturia2.li.16.6': '<strong>Cost Optimization:</strong> Leveraging API free tiers (Gemini) with intelligent rate limiting strategies can result in $0 operation cost systems.',

        'facturia2.h2.9': '🔗 Project Links',
        'facturia2.button': 'View Project on GitHub'
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
