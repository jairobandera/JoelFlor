# Florencia & Joel - Lista de Regalos de Casamiento

Aplicación web para gestionar la lista de regalos del casamiento.

## Stack

- **Frontend**: HTML5, CSS3, Vanilla JS
- **Backend**: Node.js + Express
- **Base de datos**: PostgreSQL
- **Package manager**: pnpm

## Requisitos

- Node.js 18+
- pnpm
- PostgreSQL

## Setup Local

### 1. Instalar dependencias

```bash
cd backend
pnpm install
```

### 2. Configurar variables de entorno

Copiar `.env.example` a `.env` y ajustar:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/florence_wedding
JWT_SECRET=tu-clave-secreta
ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu-password
```

### 3. Crear base de datos

```sql
CREATE DATABASE florence_wedding;
```

### 4. Ejecutar seed

```bash
cd backend
pnpm seed
```

### 5. Iniciar servidor

```bash
pnpm dev
```

- **Vista invitados**: http://localhost:3000
- **Panel admin**: http://localhost:3000/admin-florencia-2025

## Deploy en Render

### Backend

1. Crear nuevo Web Service en Render
2. Conectar repo
3. Configurar:
   - Build: `cd backend && pnpm install`
   - Start: `cd backend && pnpm start`
4. Agregar variables de entorno
5. Crear PostgreSQL database en Render
6. Actualizar `DATABASE_URL` en variables

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
