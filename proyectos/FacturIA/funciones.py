<<<<<<< Updated upstream
import google.generativeai as genai
import fitz  # PyMuPDF
from dotenv import load_dotenv
import os
import pandas as pd
from io import StringIO
from prompt import prompt

# Cargar variables de entorno desde el archivo .env
load_dotenv(".env")

# Obtener la clave de API de Google Gemini desde las variables de entorno
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configurar Google Gemini
genai.configure(api_key=GEMINI_API_KEY)


def extraer_texto_pdf(ruta_pdf):

    doc = fitz.open(ruta_pdf)  # Abrir PDF
    text = "\n".join([page.get_text("text") for page in doc])  # Extraer texto
    return text


def estructurar_texto(texto):
    """Envía el texto a Google Gemini y obtiene la respuesta estructurada en CSV,
    asegurando que solo devuelva datos válidos o 'error' en caso de problema."""

    try:
        # Crear el modelo Gemini (gemini-pro es el modelo gratuito estable)
        model = genai.GenerativeModel('gemini-pro')

        # Crear el mensaje completo
        mensaje_completo = f"""Eres un experto en extracción de datos de facturas. Devuelve solo el CSV sin explicaciones ni mensajes adicionales. Si no puedes extraer datos, devuelve exactamente la palabra 'error' sin comillas.

{prompt}

Este es el texto a parsear:
{texto}"""

        # Generar respuesta
        respuesta = model.generate_content(mensaje_completo)

        csv_respuesta = respuesta.text.strip()
        return csv_respuesta

    except Exception as e:
        print(f"⚠️  Error al comunicarse con Google Gemini: {e}")
        return "error"


def csv_a_dataframe(csv):
    """Convierte el texto CSV en un DataFrame de pandas, asegurando que 'importe' sea numérico."""

    # Mostrar lo que devolvió la IA para debugging
    print("📋 Respuesta de Google Gemini:")
    print(csv)
    print("=" * 50)

    # Verificar si la IA devolvió error
    if csv.lower().strip() == "error":
        print("⚠️  Google Gemini no pudo procesar esta factura. Saltando...")
        return pd.DataFrame()  # Retornar DataFrame vacío

    # Definir los tipos de datos para cada columna
    dtype_cols = {
        "fecha_factura": str,
        "proveedor": str,
        "concepto": str,
        "importe": str,  # Se leerá primero como str para poder limpiar comas
        "moneda": str,
    }

    try:
        # Leer el CSV en un DataFrame con los tipos especificados
        df_temp = pd.read_csv(StringIO(csv), delimiter=";", dtype=dtype_cols)

        # Verificar que existan las columnas esperadas
        columnas_requeridas = ["fecha_factura", "proveedor", "concepto", "importe", "moneda"]
        columnas_faltantes = [col for col in columnas_requeridas if col not in df_temp.columns]

        if columnas_faltantes:
            print(f"❌ Error: Faltan columnas en el CSV: {columnas_faltantes}")
            print(f"   Columnas encontradas: {list(df_temp.columns)}")
            return pd.DataFrame()  # Retornar DataFrame vacío

        # Convertir 'importe' a float, asegurando que los valores con coma se conviertan correctamente
        df_temp["importe"] = pd.to_numeric(
            df_temp["importe"].str.replace(",", "."), errors="coerce"
        )

        return df_temp

    except Exception as e:
        print(f"❌ Error al procesar CSV: {e}")
        print(f"   Contenido recibido: {csv}")
        return pd.DataFrame()  # Retornar DataFrame vacío
=======
import google.generativeai as genai
import fitz
from dotenv import load_dotenv
import os
import pandas as pd
from io import StringIO, BytesIO
from prompt import prompt
from PIL import Image

load_dotenv(".env")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def extraer_texto_pdf(ruta_pdf):
    """Extrae texto del PDF. Si no tiene texto, devuelve None para indicar que es una imagen."""
    doc = fitz.open(ruta_pdf)
    text = "\n".join([page.get_text("text") for page in doc])
    
    # Si el texto es muy corto o vacío, es probablemente una imagen
    if len(text.strip()) < 50:
        return None
    
    return text

def pdf_a_imagen(ruta_pdf):
    """Convierte la primera página del PDF a imagen PIL."""
    doc = fitz.open(ruta_pdf)
    page = doc[0]
    
    # Renderizar la página a imagen con buena resolución
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x zoom para mejor calidad
    
    # Convertir a imagen PIL
    img_data = pix.tobytes("png")
    imagen = Image.open(BytesIO(img_data))
    
    return imagen

def estructurar_texto(texto):
    """Envía texto a Google Gemini y obtiene respuesta estructurada en CSV."""
    try:
        model = genai.GenerativeModel('gemini-flash-latest')
        mensaje_completo = f"""Eres un experto en extracción de datos de facturas. Devuelve solo el CSV sin explicaciones ni mensajes adicionales. Si no puedes extraer datos, devuelve exactamente la palabra 'error' sin comillas.

{prompt}

Este es el texto a parsear:
{texto}"""
        respuesta = model.generate_content(mensaje_completo)
        csv_respuesta = respuesta.text.strip()
        return csv_respuesta
    except Exception as e:
        print(f"⚠️  Error al comunicarse con Google Gemini: {e}")
        return "error"

def estructurar_imagen(imagen):
    """Envía imagen a Google Gemini Vision y obtiene respuesta estructurada en CSV."""
    try:
        model = genai.GenerativeModel('gemini-flash-latest')
        mensaje = f"""Eres un experto en extracción de datos de facturas. Analiza esta imagen de factura y devuelve solo el CSV sin explicaciones ni mensajes adicionales. Si no puedes extraer datos, devuelve exactamente la palabra 'error' sin comillas.

{prompt}"""
        
        respuesta = model.generate_content([mensaje, imagen])
        csv_respuesta = respuesta.text.strip()
        return csv_respuesta
    except Exception as e:
        print(f"⚠️  Error al comunicarse con Google Gemini Vision: {e}")
        return "error"

def csv_a_dataframe(csv):
    """Convierte el texto CSV en un DataFrame de pandas."""
    print("📋 Respuesta de Google Gemini:")
    print(csv)
    print("=" * 50)
    
    if csv.lower().strip() == "error":
        print("⚠️  Google Gemini no pudo procesar esta factura. Saltando...")
        return pd.DataFrame()
    
    dtype_cols = {"fecha_factura": str, "proveedor": str, "concepto": str, "importe": str, "moneda": str}
    
    try:
        df_temp = pd.read_csv(StringIO(csv), delimiter=";", dtype=dtype_cols)
        columnas_requeridas = ["fecha_factura", "proveedor", "concepto", "importe", "moneda"]
        columnas_faltantes = [col for col in columnas_requeridas if col not in df_temp.columns]
        
        if columnas_faltantes:
            print(f"❌ Error: Faltan columnas en el CSV: {columnas_faltantes}")
            print(f"   Columnas encontradas: {list(df_temp.columns)}")
            return pd.DataFrame()
        
        df_temp["importe"] = pd.to_numeric(df_temp["importe"].str.replace(",", "."), errors="coerce")
        return df_temp
    
    except Exception as e:
        print(f"❌ Error al procesar CSV: {e}")
        print(f"   Contenido recibido: {csv}")
        return pd.DataFrame()
>>>>>>> Stashed changes
