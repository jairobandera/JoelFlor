# Florencia & Joel - Lista de Regalos de Casamiento

Aplicación web para gestionar la lista de regalos del casamiento.

## Stack

- **Frontend**: HTML5, CSS3, Vanilla JS
- **Backend**: Node.js + Express
- **Base de datos**: PostgreSQL (Neon - gratis)
- **Package manager**: npm

## Requisitos

- Node.js 18+
- Cuenta gratuita en [Neon](https://neon.tech) para la base de datos PostgreSQL

## Setup Local

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

Copiar `.env.example` a `.env` y ajustar:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@host/neondb?sslmode=require
JWT_SECRET=tu-clave-secreta
ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu-password
```

### 3. Crear base de datos en Neon

1. Crear cuenta gratuita en [neon.tech](https://neon.tech)
2. Crear un proyecto y copiar el `DATABASE_URL`
3. Las tablas y datos iniciales se crean automáticamente al iniciar el servidor

### 4. Iniciar servidor

```bash
npm run dev
```

- **Vista invitados**: http://localhost:3000
- **Panel admin**: http://localhost:3000/admin-florencia-2025

## Deploy en Render

### Backend

1. Crear nuevo Web Service en Render
2. Conectar repo
3. Configurar:
    - Build: `cd backend && npm install`
    - Start: `cd backend && npm start`
4. Agregar variables de entorno:
    - `DATABASE_URL` (de Neon)
    - `JWT_SECRET`
    - `ADMIN_USERNAME`
    - `ADMIN_PASSWORD`
5. Las tablas y datos se crean automáticamente al iniciar

### Frontend

El frontend se sirve desde el backend (Express static).

## Admin Panel

- URL secreta: `/admin-florencia-2025`
- Default user: `admin` / `admin123`
- **Cambiar credenciales en producción**

## Funcionalidades

### Vista Invitados
- Lista de regalos con cards
- Estado: Disponible / Elegido
- Links a MercadoLibre
- Botón WhatsApp para notificar compras

### Panel Admin
- CRUD completo de regalos
- Cambiar estado (disponible ↔ elegido)
- Extraer imágenes de links de MercadoLibre
- Estadísticas en tiempo real
