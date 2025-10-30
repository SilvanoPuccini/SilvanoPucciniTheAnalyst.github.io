import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv(".env")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

print("🔍 Verificando modelos disponibles...")
print("=" * 50)

try:
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            print(f"✅ Modelo disponible: {model.name}")
except Exception as e:
    print(f"❌ Error al listar modelos: {e}")

print("\n🧪 Probando modelo gemini-1.5-flash...")
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Di 'hola'")
    print(f"✅ gemini-1.5-flash funciona: {response.text}")
except Exception as e:
    print(f"❌ gemini-1.5-flash no funciona: {e}")

print("\n🧪 Probando modelo gemini-pro...")
try:
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Di 'hola'")
    print(f"✅ gemini-pro funciona: {response.text}")
except Exception as e:
    print(f"❌ gemini-pro no funciona: {e}")
