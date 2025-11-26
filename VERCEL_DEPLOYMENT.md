# Vercel Deployment Guide for ShopPulse API

## 🚀 Deployment Steps

### Step 1: Connect Your Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository `LocalDeals`
4. Select the `main` branch as the production branch

### Step 2: Configure Environment Variables

In the Vercel project settings, add the following environment variables:

#### Required Environment Variables:
```
DATABASE_URL=postgresql://user:password@host:port/database
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
EMAIL_FROM=your-email@gmail.com
```

**Note:** The `NEXT_PUBLIC_API_URL` is **optional** - Vercel will automatically set `VERCEL_URL` and `VERCEL_ENV` environment variables during deployment, which your app will automatically detect.

### Step 3: Deploy

Click "Deploy" and wait for the deployment to complete.

---

## ✅ What Happens Automatically After Deployment

Once deployed to Vercel:

1. **Automatic URL Detection**: Your app automatically detects `VERCEL_URL` (e.g., `your-app.vercel.app`)
2. **HTTPS Protocol**: Production deployments automatically use `https://`
3. **API Endpoints Available**: All 31 API endpoints will be accessible in Swagger UI
4. **Server URL Set**: The OpenAPI spec will automatically use the correct server URL

### Example After Deployment:
- **Swagger Documentation**: `https://your-app.vercel.app/swagger`
- **OpenAPI Spec**: `https://your-app.vercel.app/api/openapi`
- **API Endpoints**: `https://your-app.vercel.app/api/*`

---

## 🔍 Verify Deployment

After deployment, verify everything is working:

1. Navigate to your Vercel app URL
2. Go to `/swagger` endpoint
3. You should see:
   - ✅ Swagger UI loads successfully
   - ✅ "Found 31 API endpoints" in logs
   - ✅ Server URL shows your Vercel domain with HTTPS
   - ✅ All API endpoints are documented and clickable
   - ✅ "Try it out" button works for testing endpoints

---

## 🐛 Troubleshooting

### Issue: API endpoints not showing in Swagger

**Solution**: Check Vercel deployment logs:
1. Go to your Vercel project
2. Click "Deployments"
3. View the build logs for any errors
4. Look for "[Swagger] Found X API endpoints" message

### Issue: CORS errors when testing endpoints

**Solution**: CORS headers are already configured. If you still get errors:
- Ensure your requests include proper `Authorization` header for protected endpoints
- Check that the request body format matches the API documentation

### Issue: Wrong server URL in Swagger

**Solution**: The app automatically uses `VERCEL_URL` environment variable. If it's not working:
1. Set `NEXT_PUBLIC_API_URL` environment variable in Vercel to your deployment URL
2. Format: `https://your-app-name.vercel.app`

---

## 📝 Current Configuration

Your app is now configured with:

- ✅ Automatic Vercel URL detection
- ✅ HTTPS protocol for production
- ✅ CORS headers enabled
- ✅ 31 documented API endpoints
- ✅ Error handling and fallback specs
- ✅ Production-ready swagger configuration

---

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Your Swagger Docs: `https://your-app.vercel.app/swagger` (after deployment)
- GitHub Repository: https://github.com/EGodarshanReddy/LocalDeals

---

**Ready to deploy?** Push any remaining changes and Vercel will automatically detect and deploy them!
