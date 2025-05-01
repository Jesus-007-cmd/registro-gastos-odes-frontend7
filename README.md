# 🌐 Frontend - Registro de Clientes 2025

Este frontend está construido con React y se conecta al backend para:
✅ Registrar clientes y subir documentos  
✅ Consultar registros existentes agrupados por ID  
✅ Descargar archivos usando signed URLs generados por el backend

---

## 🚀 Requisitos

- Node.js >= 14
- Cuenta Netlify (para despliegue)
- Variables de entorno configuradas

---

## ⚙ Variables de entorno

En un archivo `.env` local (o configurado en Netlify):
```
REACT_APP_API_URL=https://registro-clientes-backend.onrender.com
```

---

## 🔧 Comandos de desarrollo

Instalar dependencias:
```bash
npm install
```

Ejecutar localmente:
```bash
npm start
```

Build para producción:
```bash
npm run build
```

---

## 🛣 Estructura principal

- `ClienteForm.tsx` → Formulario para registro y carga de documentos
- `RegistrosList.tsx` → Lista de registros, muestra los campos y los archivos agrupados
- `App.tsx` → Contenedor principal que gestiona las rutas / vistas

---

## 🌍 Despliegue en Netlify

1️⃣ Conecta el repositorio en Netlify  
2️⃣ Usa los siguientes ajustes:
- Build command: `npm run build`
- Publish directory: `build`
- Environment variable: `REACT_APP_API_URL`

3️⃣ Después de configurar variables, haz un **re-deploy completo**

---

## 🔑 Notas importantes

- El frontend espera que el backend tenga habilitado CORS para:
  ```
  https://registro-clientes.netlify.app
  ```
- Las descargas de archivos se hacen usando el endpoint `/archivo/:key` del backend, que devuelve un signed URL temporal.

---

✏ **Autor:** Tu equipo de desarrollo 🚀  
