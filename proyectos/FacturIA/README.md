# FacturIA - Sistema de Automatización de Facturas con IA

![FacturIA](Logo_FacturIA.png)

## Descripción

FacturIA es un sistema automatizado diseñado para procesar facturas en formato PDF, extraer su información utilizando modelos de Inteligencia Artificial (OpenAI GPT-4), almacenar los datos en una base de datos SQLite, y visualizarlos mediante un dashboard interactivo en Power BI.

Este proyecto integra tecnologías de análisis de datos modernas para optimizar la gestión documental y facilitar el análisis financiero.

## Características Principales

- **Extracción Automática de Datos**: Utiliza OpenAI GPT-4 para extraer información estructurada de facturas en PDF
- **Almacenamiento en Base de Datos**: Guarda los datos procesados en SQLite para consultas eficientes
- **Dashboard Interactivo**: Visualización profesional en Power BI con KPIs y análisis detallados
- **Conversión de Divisas**: Conversión automática de dólares a euros
- **Procesamiento por Lotes**: Capacidad de procesar múltiples facturas organizadas por carpetas

## Tecnologías Utilizadas

- **Python 3.x**
  - `pandas`: Manipulación y análisis de datos
  - `PyMuPDF (fitz)`: Extracción de texto de archivos PDF
  - `openai`: Integración con API de OpenAI GPT-4
  - `sqlalchemy`: Gestión de base de datos SQLite
  - `python-dotenv`: Manejo seguro de variables de entorno

- **Power BI**: Visualización de datos y creación de dashboards interactivos

- **SQLite**: Base de datos ligera para almacenamiento local

## Estructura del Proyecto

```
FacturIA/
├── main.py                          # Script principal de ejecución
├── funciones.py                     # Funciones auxiliares de procesamiento
├── prompt.py                        # Prompt optimizado para OpenAI
├── entorno.yml                      # Dependencias del entorno conda
├── .env                             # Variables de entorno (API keys)
├── Dashboard_FacturIA.pbix          # Dashboard de Power BI
├── Logo_FacturIA.png                # Logo del proyecto
├── IMPORTANTE - LEER.txt            # Instrucciones importantes
└── iconos/                          # Iconos utilizados en el dashboard
    ├── companias.png
    ├── euro.png
    ├── evolucion.png
    ├── facturas.png
    ├── gasto_por_factura.png
    └── proveedores.png
```

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/silvanopuccini/SilvanoPucciniTheAnalyst.github.io.git
cd SilvanoPucciniTheAnalyst.github.io/proyectos/FacturIA
```

### 2. Crear entorno virtual (recomendado)

```bash
# Con conda
conda env create -f entorno.yml
conda activate facturia

# O con venv
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install pandas pymupdf openai sqlalchemy python-dotenv
```

### 3. Configurar API Key de OpenAI

Crea un archivo `.env` en la carpeta del proyecto:

```
OPENAI_API_KEY=tu_api_key_aqui
```

**IMPORTANTE**: Nunca compartas tu API key públicamente

## Uso

### 1. Preparar tus facturas

Crea una carpeta `facturas/` y organiza tus PDFs por subcarpetas (ej: por mes o año):

```
facturas/
├── enero/
│   ├── factura1.pdf
│   └── factura2.pdf
└── febrero/
    └── factura3.pdf
```

### 2. Ejecutar el procesamiento

```bash
python main.py
```

El script procesará todas las facturas y generará una base de datos `facturas.db` con la información extraída.

### 3. Visualizar en Power BI

1. Abre `Dashboard_FacturIA.pbix` en Power BI Desktop
2. Conecta el dashboard a tu base de datos `facturas.db` mediante ODBC
3. Actualiza los datos para ver tus visualizaciones

## Campos Extraídos

El sistema extrae los siguientes campos de cada factura:

- **fecha_factura**: Fecha de emisión (formato dd/mm/aaaa)
- **proveedor**: Nombre de la empresa emisora
- **concepto**: Descripción del producto o servicio
- **importe**: Monto total de la factura
- **moneda**: Tipo de moneda (euros, dólares, otros)

## Origen del Proyecto

Este proyecto fue desarrollado a partir de una práctica del curso **"Introductorio a Data Analytics"** de [TuPrimeraExperiencia.com](https://www.tuprimeraexperiencia.com).

El objetivo fue adaptar y ampliar la práctica original, incorporando mejoras en la estructura del código, presentación de resultados, e integración completa del flujo de análisis de datos desde Python hasta Power BI.

## Autor

**Silvano Puccini**
Analista de Datos en Formación

- LinkedIn: [linkedin.com/in/Silvano-Puccini](https://www.linkedin.com/in/Silvano-Puccini)
- GitHub: [github.com/silvanopuccini](https://github.com/silvanopuccini)
- Email: silvano.jm.puccini@gmail.com

## Licencia

Este proyecto es de uso educativo y profesional. Ver archivo `LICENSE` para más detalles.

## Agradecimientos

- [TuPrimeraExperiencia.com](https://www.tuprimeraexperiencia.com) por la formación inicial
- OpenAI por la API de GPT-4
- Comunidad de desarrolladores de Python y Power BI
