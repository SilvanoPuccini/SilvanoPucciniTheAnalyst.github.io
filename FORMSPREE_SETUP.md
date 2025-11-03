# 📧 Configuración del Formulario de Contacto con Formspree

## ¿Qué es Formspree?
Formspree es un servicio gratuito que permite que los formularios HTML envíen emails sin necesidad de un backend o servidor.

## Pasos para Configurar

### 1️⃣ Crear Cuenta en Formspree
1. Ve a https://formspree.io/
2. Haz clic en **"Get Started"**
3. Regístrate con tu email (puedes usar tu Gmail)
4. Confirma tu email

### 2️⃣ Crear un Nuevo Formulario
1. Una vez dentro, haz clic en **"+ New Form"**
2. Dale un nombre: **"Portfolio Contact Form"**
3. Copia tu **Form Endpoint** (se verá así: `https://formspree.io/f/xyzabc123`)

### 3️⃣ Actualizar tus Archivos HTML

Busca y reemplaza `YOUR_FORM_ID` con tu ID real en los siguientes archivos:

```bash
# Archivos a actualizar:
- index.html (línea 202)
- sobre-mi.html (línea 192)
- proyectos-web/facturia.html (línea 338)
- proyectos-web/facturia2.html
- proyectos-web/dashboard-ventas.html
- proyectos-web/analisis-clientes.html
```

**Ejemplo:**

Cambiar esto:
```html
<form method="POST" action="https://formspree.io/f/YOUR_FORM_ID" id="contact-form">
```

Por esto (usando tu ID real):
```html
<form method="POST" action="https://formspree.io/f/xyzabc123" id="contact-form">
```

### 4️⃣ Comandos para Actualizar Rápido

Puedes usar este comando para reemplazar en todos los archivos de una vez:

```bash
# Reemplaza xyzabc123 con tu ID real
find . -name "*.html" -type f -exec sed -i 's/YOUR_FORM_ID/xyzabc123/g' {} +
```

O hazlo manualmente con tu editor de código favorito usando "Find & Replace" (Ctrl+H):
- Buscar: `YOUR_FORM_ID`
- Reemplazar por: tu ID real de Formspree

### 5️⃣ Probar el Formulario

1. Sube los cambios a GitHub
2. Espera unos minutos a que GitHub Pages se actualice
3. Ve a tu sitio web
4. Llena el formulario y envía un mensaje de prueba
5. La primera vez Formspree te pedirá confirmar tu email
6. ¡Listo! Los mensajes llegarán a tu correo

## 📊 Plan Gratuito de Formspree

- ✅ 50 envíos por mes
- ✅ Protección anti-spam
- ✅ Notificaciones por email
- ✅ Archivo de mensajes por 30 días

## 🔧 Características Implementadas

✅ Validación de campos requeridos
✅ Mensaje de confirmación al enviar
✅ Mensaje de error si falla
✅ Soporte para idioma español e inglés
✅ Diseño responsive

## 🆘 Solución de Problemas

**Problema:** No recibo los emails
- Verifica que confirmaste tu email en Formspree
- Revisa tu carpeta de spam
- Verifica que el Form ID esté correcto

**Problema:** El formulario dice "403 Forbidden"
- Asegúrate de que el dominio esté autorizado en Formspree
- Ve a Settings en Formspree y agrega tu dominio GitHub Pages

## 📚 Documentación Oficial

https://help.formspree.io/hc/en-us
