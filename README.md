# FR EXCALIBUR

Aplicación web con autenticación segura usando AWS Cognito, Next.js 15, Material UI y Tailwind CSS.

## Tecnologías

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Material UI v6** - Componentes UI (+2000 iconos)
- **Tailwind CSS** - Estilos utility-first
- **AWS Cognito** - Autenticación y gestión de usuarios
- **Zod** - Validación de datos

## Empezar a Trabajar

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```env
# AWS Cognito (completar cuando esté configurado)
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=tu-user-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=tu-client-id
COGNITO_CLIENT_SECRET=tu-client-secret


### 3. Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Estructura del Código

```
app/
├── api/auth/           # Endpoints de autenticación
│   ├── login/         # POST /api/auth/login
│   ├── register/      # POST /api/auth/register
│   ├── logout/        # POST /api/auth/logout
│   └── session/       # GET /api/auth/session
├── layout.tsx         # Layout principal
└── page.tsx           # Página de inicio

lib/
├── config.ts          # Configuración de Cognito y cookies
├── services/          # Lógica de negocio
│   ├── cognito.service.ts      # Comunicación con AWS
│   └── server-auth.service.ts  # Manejo de sesiones
├── types/             # Tipos TypeScript
├── utils/             # Utilidades (cookies, etc)
└── validations/       # Validación de formularios

middleware.ts          # Protección de rutas
```

## UI Components

### Material UI + Tailwind

Puedes usar ambos juntos:

```tsx
import { Button, TextField } from '@mui/material';
import { Send } from '@mui/icons-material';

<Button 
  variant="contained" 
  startIcon={<Send />}
  className="shadow-lg hover:shadow-xl"
>
  Enviar
</Button>
```

### Componentes Disponibles

- **Forms**: TextField, Select, Checkbox, Radio
- **Buttons**: Button, IconButton, Fab
- **Layout**: Container, Box, Grid, Stack
- **Feedback**: Alert, Snackbar, Dialog
- **Data**: Typography, Chip, Avatar, Badge

## Autenticación

### Cómo Funciona

1. **Login**: Usuario ingresa email/password → Cognito valida → Tokens guardados en cookies httpOnly
2. **Sesión**: Los tokens se renuevan automáticamente cada 15 minutos
3. **Logout**: Se invalidan los tokens y se limpian las cookies

### Seguridad

-  Tokens en cookies httpOnly (no accesibles desde JavaScript)
-  Protección CSRF con SameSite=strict
-  Refresh automático de tokens
-  Headers de seguridad (HSTS, XSS Protection, etc)

### API Endpoints

```bash
POST /api/auth/login          # Iniciar sesión
POST /api/auth/register       # Registrar usuario
POST /api/auth/logout         # Cerrar sesión
GET  /api/auth/session        # Obtener sesión actual
POST /api/auth/verify-email   # Verificar email
POST /api/auth/refresh        # Refrescar token
```

## ⚙️ Configurar AWS Cognito

### Paso 1: Crear User Pool

1. Ve a [AWS Console](https://console.aws.amazon.com/) → Cognito
2. Click "Create user pool"
3. Configuración:
   - Sign-in: Email
   - Password: Mínimo 8 caracteres, mayúsculas, minúsculas, números, símbolos
   - MFA: Opcional
   - Email verification: Requerida

### Paso 2: Crear App Client

1. En el User Pool, ve a "App integration"
2. Create app client:
   - Type: Public client
   - Auth flows: 
     -  ALLOW_USER_PASSWORD_AUTH
     -  ALLOW_REFRESH_TOKEN_AUTH
   - Token expiration:
     - Access: 15 min
     - Refresh: 30 días

### Paso 3: Copiar Credenciales

Copia estos valores al archivo `.env`:
- User Pool ID
- App Client ID
- Region

## Comandos Útiles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run type-check   # Verificar tipos TypeScript
```

## Licencia

Privado - Todos los derechos reservados
