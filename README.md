# Registro de Gastos y Órdenes de Servicio (Frontend)

Este repositorio contiene el **frontend** de la aplicación para registrar gastos y órdenes de servicio (OdeS). Construido con **React** (Create React App) y **TypeScript**, permite gestionar catálogos, subir archivos asociados a cada gasto y generar reportes de porcentaje de gasto por OdeS.

---

## 📦 Características principales

1. **Catálogo Bancos**  
   - CRUD completo de cuentas bancarias para métodos de pago.

2. **Catálogo Proveedores**  
   - CRUD completo de proveedores.

3. **Órdenes de Servicio (OdeS)**  
   - CRUD de OdeS (número de orden + monto a cobrar).  
   - Botón “Cobrar” que redirige al formulario de gastos.

4. **Registro de Gastos**  
   - Formulario que liga OdeS, Banco y Proveedor.  
   - Campos: cantidad gastada, cantidad a cobrar, fecha.  
   - Subida de **3 archivos**: factura, comprobante y evidencia.  
   - Al enviar:
     1. `POST /gastos/upload` → Guarda JSON y archivos en S3.  
     2. `PUT /odes/:id/cobrar` → Marca la OdeS como cobrada en S3.

5. **Reportes**  
   - Filtrado por rango de fechas.  
   - Totales de gasto por banco y proveedor.  
   - Detalle por OdeS: gastado, cobrar y % de gasto.  
   - Cálculo de **promedio mensual** de % de gasto entre todas las OdeS.

---

## 🚀 Tecnologías

- **React** + **TypeScript**  
- **Tailwind CSS**  
- **Axios** para llamadas HTTP  
- **React Router v6**  
- **Create React App** (react-scripts)  
- **AWS S3** (a través del backend)  

---

## ⚙️ Requisitos

- Node.js ≥ 14  
- npm (v8 o superior)  
- Cuenta en Netlify (para despliegue en producción)  
- Variables de entorno definidas (ver más abajo)  

---

## 🔧 Instalación y desarrollo local

1. Clona este repositorio:
   ```bash
   git clone https://github.com/Jesus-007-cmd/registro-gastos-odes-frontend7.git
   cd registro-gastos-odes-frontend7
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz con:
   ```ini
   REACT_APP_API_URL=https://tu-backend-url.com
   ```
4. Levanta el servidor de desarrollo:
   ```bash
   npm run dev
   # o npm start
   ```
5. Abre tu navegador en `http://localhost:3000`.

---

## 📦 Build de producción

Para generar los archivos estáticos optimizados:

```bash
npm run build
```

Se creará la carpeta `build/` que puedes servir con cualquier servidor estático.

---

## ☁️ Despliegue en Netlify

1. Crea un nuevo sitio en Netlify y vincúlalo a este repositorio.  
2. En **Build settings**, define:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
3. Configura en Netlify la variable de entorno:
   ```
   REACT_APP_API_URL=https://tu-backend-url.com
   ```
4. Guarda y despliega. Netlify ejecutará el build y publicará tu frontend al instante.

---

## 📁 Estructura de carpetas

```
public/            # Archivos estáticos (HTML, íconos, imágenes)
src/
  components/      # Componentes compartidos (Sidebar, CardAction, etc.)
  pages/admin/
    BancosPage.tsx
    ProveedoresPage.tsx
    OdesPage.tsx
    GastosPage.tsx
    ReportesPage.tsx
  routes.tsx       # Definición de Rutas con React Router
  App.tsx          # Layout principal
  index.tsx        # Punto de entrada
.env               # Variables de entorno
package.json
tailwind.config.js
tsconfig.json
```

---

## 🤝 Contribuciones

¡Bienvenidas! Si encuentras un bug o tienes una mejora, por favor abre un _issue_ o presenta un _pull request_ siguiendo las buenas prácticas de GitHub.

---

## 📜 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
