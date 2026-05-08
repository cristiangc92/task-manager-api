# Task Manager API

REST API para gestión de tareas con autenticación JWT.

## 🛠️ Stack

- Node.js + Express
- PostgreSQL (Neon)
- JWT + bcryptjs
- Deploy: Railway

## 🚀 URL de producción

```
https://task-manager-api-production-2fbf.up.railway.app
```

## ⚙️ Correr en local

1. Clonar el repositorio
2. Instalar dependencias

```bash
npm install
```

3. Crear un archivo `.env` con las siguientes variables:

```
DATABASE_URL=tu_string_de_neon
JWT_SECRET=tu_clave_secreta
PORT=3000
```

4. Levantar el servidor

```bash
npm run dev
```

## 🔗 Endpoints

### Auth

| Método | Endpoint | Descripción |
|---|---|---|
| POST | /api/auth/register | Registrar usuario |
| POST | /api/auth/login | Iniciar sesión |

### Tasks (requieren JWT)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /api/tasks | Obtener tareas |
| POST | /api/tasks | Crear tarea |
| PUT | /api/tasks/:id | Editar tarea |
| DELETE | /api/tasks/:id | Eliminar tarea |

## 🔐 Autenticación

Todos los endpoints de tasks requieren el header:

```
Authorization: Bearer <token>
```

## 📝 Ejemplos

### Registro

```json
POST /api/auth/register
{
  "name": "Juan",
  "email": "juan@email.com",
  "password": "123456"
}
```

### Crear tarea

```json
POST /api/tasks
{
  "title": "Mi tarea",
  "description": "Descripción opcional",
  "priority": "high"
}
```

### Filtrar tareas

```
GET /api/tasks?status=pending&priority=high
```