# De los Reyes ERP — Frontend

Frontend del ERP de De los Reyes Accesorios y Repuestos, hecho con React, TypeScript y Vite.

## Sobre la empresa

**De los Reyes S.A.C.** vende repuestos y accesorios automotrices originales. Tiene más de 15 años en el rubro y se especializa en tres marcas: **Peugeot**, **Citroën** y **Renault**.

Este ERP es su sistema interno de gestión. Con él la empresa:

- Lleva el catálogo de productos por categoría y registra con qué vehículos es compatible cada repuesto.
- Controla el inventario (entradas, salidas y ajustes) y recibe alertas de stock bajo.
- Registra ventas y clientes (con DNI, RUC, carné de extranjería o pasaporte) y emite comprobantes.
- Genera reportes en Excel y PDF y muestra en un tablero cómo van las ventas.
- Administra usuarios y roles, y guarda un registro de quién hizo cada acción.

El frontend es la parte que usa el personal en pantalla. Los datos se guardan en el backend (`Backend-DelosReyes`).

## Cómo levantar el proyecto

### Requisitos previos

- Node.js 18 o superior (incluye npm)
- El backend (`Backend-DelosReyes`) levantado en `http://localhost:8080`

### Pasos

1. **Levantar el backend.** En la carpeta `Backend-DelosReyes`:

   ```powershell
   docker compose up -d
   .\mvnw spring-boot:run
   ```

   Sin el backend, el frontend abre pero no puede iniciar sesión ni cargar datos.

2. **Instalar dependencias.** En la carpeta `Frontend-DelosReyes` (solo la primera vez o cuando cambie `package.json`):

   ```powershell
   npm install
   ```

3. **Arrancar el servidor de desarrollo:**

   ```powershell
   npm run dev
   ```

4. **Abrir** `http://localhost:3000` e iniciar sesión con el usuario administrador por defecto:

   | Campo    | Valor                  |
   |----------|------------------------|
   | Email    | `admin@delosreyes.com` |
   | Password | `Admin2024!`           |

### Notas

- No se necesita archivo `.env`. Las llamadas a `/api` se reenvían al backend en `localhost:8080` mediante el proxy de Vite (`vite.config.ts`).
- El servidor escucha en toda la red, así que otras PCs de la misma red pueden entrar con `http://<IP-de-esta-PC>:3000`.

### Otros comandos

| Comando              | Qué hace                                          |
|----------------------|---------------------------------------------------|
| `npm run build`      | Genera la versión de producción en `dist/`        |
| `npm run preview`    | Sirve la versión de producción en el puerto 4173  |
| `npm run lint`       | Revisa el código con ESLint                       |
| `npm run type-check` | Revisa los tipos de TypeScript                    |
| `npm test`           | Ejecuta los tests (Vitest)                        |
| `npm run test:watch` | Ejecuta los tests y los repite al guardar cambios |
