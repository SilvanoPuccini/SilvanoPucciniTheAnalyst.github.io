# Market Basket Analysis - Análisis de Canasta de Mercado

## 📋 Descripción del Proyecto

Proyecto de análisis de asociación de productos utilizando técnicas de **Market Basket Analysis** sobre un dataset real de 4.9 millones de transacciones del supermercado "SanoYFresco". El objetivo es descubrir patrones de compra y reglas de asociación para optimizar la disposición de productos, estrategias de cross-selling y campañas de marketing.

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Python 3.8+
- Jupyter Notebook o JupyterLab

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/SilvanoPuccini/Market-Basket-Analysis.git
cd Market-Basket-Analysis

# Instalar dependencias
pip install -r requirements.txt
```

### Ejecución

**Opción 1: Jupyter Notebook (Local)**
```bash
jupyter notebook TPE_MarketBasketAnalysis_colab.ipynb
```

**Opción 2: Google Colab (Online)**
1. Abre el notebook en [Google Colab](https://colab.research.google.com)
2. Sube el archivo `TPE_MarketBasketAnalysis_colab.ipynb`
3. Sube la base de datos `sanoyfresco.db` (si la tienes)
4. Ejecuta las celdas secuencialmente

**Nota:** Si no tienes la base de datos `sanoyfresco.db`, el notebook incluye el dataset completo de 4.9M registros embebido.

## 🎯 Objetivo

Identificar qué productos se compran frecuentemente juntos para:
- Optimizar la ubicación de productos en tienda
- Diseñar promociones y ofertas combinadas
- Mejorar estrategias de cross-selling y up-selling
- Aumentar el ticket promedio por cliente

## 📊 Dataset

- **Fuente:** Base de datos SQLite `sanoyfresco.db`
- **Registros:** 4,975,718 transacciones
- **Período:** Año 2023
- **Productos únicos:** 40 productos
- **Clientes:** Miles de clientes únicos
- **Campos:**
  - `id_pedido`: Identificador único del pedido
  - `id_cliente`: Identificador del cliente
  - `fecha`: Fecha de la compra
  - `hora`: Hora de la compra
  - `id_departamento`: Departamento del producto
  - `id_seccion`: Sección del producto
  - `id_producto`: Identificador del producto
  - `nombre_producto`: Nombre del producto
  - `precio_unitario`: Precio unitario
  - `cantidad`: Cantidad comprada
  - `precio_total`: Total de la línea

## ⚙️ Metodología

### 1. Extracción y Preparación de Datos
```python
import sqlite3
import pandas as pd

# Conectar a base de datos y extraer transacciones
conexion = sqlite3.connect('sanoyfresco.db')
df = pd.read_sql_query("SELECT * FROM tickets", conexion)
```

### 2. Transformación a Formato Transaccional
- Agrupación de productos por pedido
- Creación de matriz binaria (producto comprado = 1, no comprado = 0)
- Uso de `pd.get_dummies()` para one-hot encoding

### 3. Cálculo de Métricas de Asociación

**Soporte:** Frecuencia de aparición de un producto
```
Soporte(A) = N° transacciones con A / Total transacciones
```

**Confianza:** Probabilidad de comprar B dado que se compró A
```
Confianza(A→B) = Transacciones con A y B / Transacciones con A
```

**Lift:** Indica qué tan más probable es comprar B cuando se compra A
```
Lift(A→B) = Confianza(A→B) / Soporte(B)
```
- Lift > 1: Asociación positiva (se compran juntos)
- Lift = 1: No hay asociación
- Lift < 1: Asociación negativa

### 4. Generación de Reglas
- Umbral de confianza mínima: 5%
- Generación de combinaciones de productos
- Cálculo de soporte, confianza y lift
- Filtrado y ordenamiento por lift

## 📈 Resultados Principales

### Top 10 Productos Más Vendidos (Soporte)

| Producto | Soporte (%) |
|----------|-------------|
| Banana | 23.8% |
| Bolsa de Bananas Orgánicas | 19.1% |
| Fresas Orgánicas | 13.3% |
| Espinacas Baby Orgánicas | 12.2% |
| Aguacate Hass Orgánico | 10.7% |
| Aguacate Orgánico | 8.9% |
| Limón Grande | 7.8% |
| Fresas | 7.2% |
| Limones | 7.1% |
| Leche Entera Orgánica | 6.9% |

### Top 10 Reglas de Asociación (Mayor Lift)

| Antecedente | Consecuente | Confianza (%) | Lift |
|-------------|-------------|---------------|------|
| Cilantro Orgánico | Limones | 25.4% | 3.6 |
| Cebolla Roja Orgánica | Cilantro Orgánico | 12.8% | 3.6 |
| Ajo Orgánico | Cebolla Amarilla Orgánica | 20.1% | 3.5 |
| Apio | Zanahorias | 12.0% | 3.3 |
| Apio | Pepino Orgánico | 12.7% | 3.1 |

**Interpretación:**
- **Cilantro → Limones (Lift 3.6):** Los clientes que compran cilantro tienen 3.6 veces más probabilidad de comprar limones que un cliente promedio
- **Ajo → Cebolla Amarilla (Lift 3.5):** Fuerte asociación entre estos condimentos básicos de cocina
- **Apio → Zanahorias (Lift 3.3):** Productos complementarios para preparación de sopas/ensaladas

### Insights Accionables

1. **Proximidad en Tienda:** Colocar cilantro cerca de limones puede aumentar ventas complementarias
2. **Promociones Combinadas:** Ofrecer descuentos en "packs de cocina" (ajo + cebolla + cilantro)
3. **Recomendaciones Online:** Sugerir limones cuando se añade cilantro al carrito
4. **Cross-Selling:** Personal de tienda puede recomendar productos asociados
5. **Planificación de Inventario:** Asegurar stock correlacionado de productos asociados

## 🛠️ Tecnologías Utilizadas

- **Python 3.x**
  - `pandas`: Manipulación de datos y análisis
  - `sqlite3`: Conexión a base de datos
  - `itertools`: Generación de combinaciones de productos
- **SQLite**: Base de datos transaccional
- **Google Colab**: Entorno de desarrollo

## 📁 Estructura del Proyecto

```
analisis-clientes/
├── README.md                                # Este archivo
├── TPE_MarketBasketAnalysis_colab.ipynb    # Notebook principal
└── reglas.csv                               # Reglas generadas (output)
```

## 🚀 Cómo Ejecutar el Proyecto

1. **Clonar el repositorio:**
```bash
git clone https://github.com/silvanopuccini/SilvanoPucciniTheAnalyst.github.io.git
cd SilvanoPucciniTheAnalyst.github.io/proyectos/analisis-clientes
```

2. **Abrir en Google Colab o Jupyter:**
- Subir `TPE_MarketBasketAnalysis_colab.ipynb` a Colab
- Subir la base de datos `sanoyfresco.db` (si disponible)

3. **Ejecutar celdas secuencialmente:**
- Extracción de datos
- Transformación
- Cálculo de métricas
- Generación de reglas

4. **Exportar resultados:**
- El notebook genera `reglas.csv` con todas las asociaciones

## 💡 Aprendizajes Clave

1. **Escalabilidad:** Procesamiento eficiente de 4.9M registros con pandas
2. **Transformación de Datos:** Conversión de transacciones a formato matricial para análisis
3. **Métricas de Asociación:** Aplicación práctica de soporte, confianza y lift
4. **Interpretación de Negocio:** Traducir métricas estadísticas en acciones comerciales
5. **Optimización:** Uso de umbrales para filtrar reglas relevantes

## 📊 Métricas del Proyecto

- **Registros procesados:** 4,975,718 transacciones
- **Productos analizados:** 40 productos únicos
- **Pedidos únicos:** 2,060,188 pedidos
- **Reglas generadas:** 399 reglas de asociación
- **Umbral de confianza:** 5%
- **Tiempo de procesamiento:** ~2-3 minutos

## 🔗 Enlaces

- **Notebook:** [TPE_MarketBasketAnalysis_colab.ipynb](./TPE_MarketBasketAnalysis_colab.ipynb)
- **Curso Origen:** [TuPrimeraExperiencia.com](https://www.tuprimeraexperiencia.com)

## 👤 Autor

**Silvano Puccini**
Analista de Datos en Formación

- **LinkedIn:** [linkedin.com/in/Silvano-Puccini](https://www.linkedin.com/in/Silvano-Puccini)
- **GitHub:** [github.com/silvanopuccini](https://github.com/silvanopuccini)
- **Email:** silvano.jm.puccini@gmail.com

## 📝 Origen del Proyecto

Proyecto desarrollado como práctica del curso "Introductorio a Data Analytics" de TuPrimeraExperiencia.com, adaptado y documentado profesionalmente para demostrar habilidades en análisis de datos y business intelligence.

---

**Última actualización:** Octubre 2025
