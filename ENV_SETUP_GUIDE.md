# Environment Configuration Guide

## Overview

This project uses environment-specific configuration files for different deployment scenarios:
- **Local Development**: `.env.local`
- **Production**: `.env.production` (for Vercel)
- **Shared**: `.env` (base configuration)

---

## Environment Files

### `.env` (Base/Shared)
Located in the root directory. Contains default values used when specific environment overrides don't exist.

**Note**: Some sensitive values are included here as examples. **NEVER commit actual credentials**.

### `.env.local` (Local Development)
- **Purpose**: Local development with hot reload
- **Status**: Git ignored (won't be committed)
- **Load Command**: `npm run dev`
- **Environment**: `NODE_ENV=development`

Create this file for your local setup:
```bash
cp .env.example .env.local
# Edit .env.local with your local values
```

### `.env.production` (Production/Vercel)
- **Purpose**: Production deployments on Vercel
- **Status**: Git ignored (won't be committed)
- **Load Command**: `npm run build:prod` or `npm run start:prod`
- **Environment**: `NODE_ENV=production`

Create this file for production setup:
```bash
cp .env.example .env.production
# Edit .env.production with your production values
```

### `.env.example` (Template/Documentation)
- **Purpose**: Template showing all required environment variables
- **Status**: Git tracked (committed to repository)
- **Usage**: Template for developers to copy from

---

## How Next.js Loads Environment Files

Next.js loads environment variables in this priority order:

1. **`.env.local`** (highest priority - always loaded in development)
2. **`.env.[NODE_ENV]`** (e.g., `.env.production` when `NODE_ENV=production`)
3. **`.env`** (lowest priority - default values)

### Load Order Examples

**Local Development** (`npm run dev`):
```
NODE_ENV=development (implicit)
↓
Loads: .env.local → .env → merged result
```

**Production Build** (`npm run build:prod`):
```
NODE_ENV=production (explicit)
↓
Loads: .env.production → .env → merged result
```

**Vercel Deployment**:
```
NODE_ENV=production (set by Vercel)
↓
Loads: Environment variables from Vercel dashboard → .env.production → .env
```

---

## Available NPM Scripts

### Development Scripts
```bash
# Local development with hot reload (development environment)
npm run dev

# Local development with production environment variables
npm run dev:prod
```

### Build Scripts
```bash
# Build for development
npm run build

# Build with production environment variables
npm run build:prod
```

### Start/Production Scripts
```bash
# Start production server
npm run start

# Start production server with production environment variables
npm run start:prod

# Used by Vercel (same as build:prod)
npm run vercel-build
```

### Other Scripts
```bash
# Lint code
npm run lint
```

---

## Setting Up for Local Development

### Step 1: Create `.env.local`
```bash
cp .env.example .env.local
```

### Step 2: Edit `.env.local`
```dotenv
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/shoppulse_dev"

# SMTP (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
EMAIL_FROM=your-email@gmail.com

# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

### Step 3: Run Development Server
```bash
npm run dev
```

Server will be available at `http://localhost:3000`

---

## Setting Up for Vercel Production

### Step 1: Create `.env.production`
```bash
cp .env.example .env.production
```

### Step 2: Edit `.env.production`
```dotenv
# Database (production credentials)
DATABASE_URL="postgresql://prod_user:prod_password@prod-host:5432/prod_db"

# SMTP (production email service)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=production-email@gmail.com
SMTP_PASS=production-app-password
SMTP_SECURE=false
EMAIL_FROM=production-email@gmail.com

# Optional - Vercel will auto-detect VERCEL_URL
# NEXT_PUBLIC_API_URL=https://your-app.vercel.app

# Node Environment
NODE_ENV=production
```

### Step 3: Configure Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) → Your Project → Settings
2. Add Environment Variables:
   - `DATABASE_URL`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_SECURE`
   - `EMAIL_FROM`

### Step 4: Deploy
The `vercel.json` file will automatically:
- Run `npm run build:prod` during build
- Use environment variables from Vercel dashboard
- Auto-detect `VERCEL_URL` for API configuration

---

## Environment Variables Reference

| Variable | Purpose | Example | Required |
|----------|---------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` | ✅ Yes |
| `SMTP_HOST` | Email service hostname | `smtp.gmail.com` | ✅ Yes |
| `SMTP_PORT` | Email service port | `587` | ✅ Yes |
| `SMTP_USER` | Email authentication | `user@gmail.com` | ✅ Yes |
| `SMTP_PASS` | Email password | `app-password` | ✅ Yes |
| `SMTP_SECURE` | Use SSL/TLS | `false` (or `true`) | ✅ Yes |
| `EMAIL_FROM` | Default sender email | `noreply@example.com` | ✅ Yes |
| `NODE_ENV` | Environment type | `production` or `development` | ✅ Yes |
| `NEXT_PUBLIC_API_URL` | Public API URL | `https://api.example.com` | ❌ Optional* |

*\* If not set, the app will auto-detect from `VERCEL_URL` on Vercel or default to `http://localhost:3000` locally.*

---

## Troubleshooting

### Issue: Environment variables not loading
**Solution**: 
1. Ensure you're using the correct file name (`.env.local`, `.env.production`, etc.)
2. Verify the `NODE_ENV` matches the file name
3. Restart the development server after changing env files
4. Check that variables are not quoted in the wrong way

### Issue: Different values in dev vs production
**Reason**: This is normal and expected. Each environment can have different:
- Database URLs
- API endpoints
- Email service credentials
- Security settings

**Solution**: Make sure you're using the correct env file for the environment:
```bash
npm run dev              # Uses .env.local
npm run build:prod       # Uses .env.production
npm run start:prod       # Uses .env.production
```

### Issue: Vercel shows wrong environment variables
**Solution**:
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Verify all variables are set correctly
3. Redeploy after changing environment variables
4. Check the deployment logs for which values were used

---

## Security Best Practices

1. **Never commit `.env.local` or `.env.production`** - These are already in `.gitignore`
2. **Use strong passwords** - Especially for database and email credentials
3. **Rotate credentials regularly** - Especially in production
4. **Use environment-specific credentials** - Never use production credentials in development
5. **Don't hardcode secrets** - Always use environment variables
6. **Use `.env.example`** - As a template, commit this to show what variables are needed

---

## Quick Reference Commands

```bash
# Development
npm run dev                # Start dev server with .env.local
npm run dev:prod           # Start dev server with .env.production

# Building
npm run build              # Build with .env
npm run build:prod         # Build with .env.production

# Production
npm run start              # Start production server
npm run start:prod         # Start with .env.production

# Vercel
npm run vercel-build       # Build command used by Vercel
```

---

## File Structure

```
ShopPulseBE/
├── .env                  ← Base configuration (git tracked)
├── .env.local            ← Local development (git ignored)
├── .env.production        ← Production/Vercel (git ignored)
├── .env.example          ← Template (git tracked)
├── .env.development      ← Optional: Dev-specific overrides (git ignored)
├── vercel.json           ← Vercel deployment config
├── package.json          ← Scripts and dependencies
├── prisma.config.ts      ← Prisma configuration
└── src/
    └── lib/
        └── swagger.config.ts ← Uses environment variables
```

---

For more information about Next.js environment variables, see:
https://nextjs.org/docs/basic-features/environment-variables
