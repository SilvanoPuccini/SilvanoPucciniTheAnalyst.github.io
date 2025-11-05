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
        'facturia.section7.button': 'Ver Proyecto en GitHub'
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
        'facturia.section7.button': 'View Project on GitHub'
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
