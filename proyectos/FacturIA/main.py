<<<<<<< Updated upstream
import funciones
import pandas as pd
import os
from sqlalchemy import create_engine

# Crear un DataFrame vacío para almacenar todas las facturas
df = pd.DataFrame()

# Recorrer todas las carpetas dentro de la carpeta "facturas"
for carpeta in sorted(os.listdir("./facturas")):
    ruta_carpeta = os.path.join("./facturas/", carpeta)

    # Recorrer todos los archivos dentro de la carpeta
    for archivo in os.listdir(ruta_carpeta):
        ruta_pdf = os.path.join(ruta_carpeta, archivo)

        print(f"📄 Procesando factura: {ruta_pdf}")

        # Extraer texto de la factura
        texto_no_estructurado = funciones.extraer_texto_pdf(ruta_pdf)

        # Estructurar el texto de la factura
        texto_estructurado = funciones.estructurar_texto(texto_no_estructurado)

        # Convertir texto estructurado en dataframe
        df_factura = funciones.csv_a_dataframe(texto_estructurado)

        # Solo anexar si el dataframe no está vacío
        if not df_factura.empty:
            # Anexar el dataframe de la factura al dataframe general
            df = pd.concat([df, df_factura], ignore_index=True)
            print("✅ Factura procesada correctamente\n")
        else:
            print("⚠️  Factura omitida (no se pudo procesar)\n")

    # Si la moneda es "dolares" convertir a euros multiplicando por 0,9243
    if not df.empty and "moneda" in df.columns:
        df.loc[df["moneda"] == "dolares", "importe"] *= 0.9243

    # Eliminar las columnas no esenciales
    if not df.empty:
        df = df.iloc[:, 0:4]

# Verificar si hay datos para guardar
if df.empty:
    print("\n⚠️  No se procesaron facturas exitosamente. No hay datos para guardar.")
    print("Revisa que:")
    print("  1. Los PDFs contengan texto legible (no solo imágenes)")
    print("  2. Tu API key de Google Gemini esté configurada correctamente en el archivo .env")
    print("  3. Tu API key de Google Gemini sea válida")
else:
    # Guardar el DataFrame final en una bbdd sqlite
    # Crear una conexión a la base de datos SQLite
    engine = create_engine("sqlite:///facturas.db")

    # Guardar el DataFrame final en una bbdd sqlite, añadiendo los datos en lugar de reemplazarlos
    df.to_sql("facturas", engine, if_exists="append", index=False)

    # Cerrar la conexión a la base de datos
    engine.dispose()

    print("\n" + "="*60)
    print("✅ Proceso de extracción y estructuración de facturas completado exitosamente.")
    print(f"✅ {len(df)} factura(s) guardada(s) en la base de datos 'facturas.db'.")
    print("="*60)
=======
import funciones
import pandas as pd
import os
from sqlalchemy import create_engine

# Crear un DataFrame vacío para almacenar todas las facturas
df = pd.DataFrame()

# Recorrer todas las carpetas dentro de la carpeta "facturas"
for carpeta in sorted(os.listdir("./facturas")):
    ruta_carpeta = os.path.join("./facturas/", carpeta)

    # Recorrer todos los archivos dentro de la carpeta
    for archivo in os.listdir(ruta_carpeta):
        ruta_pdf = os.path.join(ruta_carpeta, archivo)

        print(f"📄 Procesando factura: {ruta_pdf}")

        # Extraer texto de la factura
        texto_no_estructurado = funciones.extraer_texto_pdf(ruta_pdf)

        # Si no hay texto, es una imagen - usar Gemini Vision
        if texto_no_estructurado is None:
            print("🖼️  PDF es una imagen, usando Gemini Vision...")
            imagen = funciones.pdf_a_imagen(ruta_pdf)
            texto_estructurado = funciones.estructurar_imagen(imagen)
        else:
            print("📝 PDF tiene texto, extrayendo datos...")
            texto_estructurado = funciones.estructurar_texto(texto_no_estructurado)

        # Convertir texto estructurado en dataframe
        df_factura = funciones.csv_a_dataframe(texto_estructurado)

        # Solo anexar si el dataframe no está vacío
        if not df_factura.empty:
            df = pd.concat([df, df_factura], ignore_index=True)
            print("✅ Factura procesada correctamente\n")
        else:
            print("⚠️  Factura omitida (no se pudo procesar)\n")

    # Si la moneda es "dolares" convertir a euros multiplicando por 0,9243
    if not df.empty and "moneda" in df.columns:
        df.loc[df["moneda"] == "dolares", "importe"] *= 0.9243

    # Eliminar las columnas no esenciales
    if not df.empty:
        df = df.iloc[:, 0:4]

# Verificar si hay datos para guardar
if df.empty:
    print("\n⚠️  No se procesaron facturas exitosamente. No hay datos para guardar.")
    print("Revisa que:")
    print("  1. Las imágenes de las facturas sean legibles")
    print("  2. Tu API key de Google Gemini esté configurada correctamente en el archivo .env")
    print("  3. Tu API key de Google Gemini sea válida")
else:
    # Guardar el DataFrame final en una bbdd sqlite
    engine = create_engine("sqlite:///facturas.db")
    df.to_sql("facturas", engine, if_exists="append", index=False)
    engine.dispose()

    print("\n" + "="*60)
    print("✅ Proceso de extracción y estructuración de facturas completado exitosamente.")
    print(f"✅ {len(df)} factura(s) guardada(s) en la base de datos 'facturas.db'.")
    print("="*60)
>>>>>>> Stashed changes
