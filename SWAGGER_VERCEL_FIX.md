# Swagger UI Vercel Deployment Fix

## 🎯 Problem Summary

After deploying to Vercel, the Swagger UI displays correctly, but API endpoints cannot be tested (clicking "Try it out" doesn't work or shows errors).

## 🔍 Root Cause

The issue occurs because:
1. **Vercel Environment Variables**: The `VERCEL_URL` environment variable is only available at **build time**, not at **runtime**
2. **Static Server URL**: The OpenAPI spec was generated with a server URL that was determined during the build, which might be incorrect or inaccessible
3. **Serverless Architecture**: Vercel uses serverless functions, and the server URL needs to be dynamically determined based on the actual deployment URL

## ✅ What Was Fixed

### 1. **Dynamic Server URL Detection** (`src/app/swagger/page.tsx`)

**Before**: The Swagger UI used the server URL from the OpenAPI spec, which was determined at build time.

**After**: The Swagger UI now **dynamically overrides** the server URL at runtime using `window.location.origin`, ensuring it always uses the correct deployment URL.

```typescript
// The fix in swagger/page.tsx
const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

if (data.servers && data.servers.length > 0) {
  data.servers[0].url = currentOrigin;
  console.log('[Swagger] Server URL set to:', currentOrigin);
}
```

### 2. **Improved Server URL Priority** (`src/lib/swagger.config.ts`)

Enhanced the `getServerUrl()` function with better fallback logic:
1. `NEXT_PUBLIC_API_URL` (if explicitly set) - **highest priority**
2. `VERCEL_URL` (build-time detection)
3. `window.location.origin` (client-side detection)
4. `localhost:3000` (development fallback)

### 3. **Enhanced Logging**

Added console logging to help debug server URL detection issues.

## 🚀 Deployment Steps

### Step 1: Commit and Push Changes

```bash
git add .
git commit -m "Fix Swagger UI endpoint testing on Vercel"
git push origin main
```

### Step 2: Vercel Auto-Deploys

Vercel will automatically detect the changes and redeploy your application.

### Step 3: Verify the Fix

1. Navigate to your Vercel deployment URL: `https://your-app.vercel.app/swagger`
2. Open Browser Developer Tools (F12) → Console tab
3. Look for the log message: `[Swagger] Server URL set to: https://your-app.vercel.app`
4. Try testing an API endpoint (e.g., `/api/categories`)
5. It should now work! ✅

## 🔧 Additional Configuration (Optional)

If the automatic detection doesn't work, you can manually set the API URL:

### Option 1: Set Environment Variable in Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-actual-deployment-url.vercel.app` (replace with your actual URL)
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**
6. Redeploy your application

### Option 2: Create `.env.production` File

```bash
# Create .env.production in your project root
echo "NEXT_PUBLIC_API_URL=https://your-app.vercel.app" > .env.production
```

**Note**: Replace `your-app.vercel.app` with your actual Vercel deployment URL.

## 🧪 Testing the Fix

### Test 1: Public Endpoint (No Auth Required)

1. Go to `/swagger`
2. Find **GET /api/categories**
3. Click "Try it out"
4. Click "Execute"
5. You should see a `200` response with a list of business categories ✅

### Test 2: Protected Endpoint (Auth Required)

1. First, login via **POST /api/auth/login**
2. Copy the `accessToken` from the response
3. Click "Authorize" button at the top of Swagger UI
4. Paste the token in the format: `Bearer your-access-token`
5. Try a protected endpoint (e.g., **GET /api/consumer/profile/{Id}**)
6. It should work! ✅

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to fetch" Error

**Symptoms**: When testing endpoints, you see "Failed to fetch" or network errors.

**Solutions**:
- ✅ Check browser console for CORS errors
- ✅ Verify the API route exists and is deployed
- ✅ Check Vercel deployment logs for errors
- ✅ Ensure the endpoint path matches the route file structure

### Issue 2: 404 Not Found

**Symptoms**: Swagger UI works, but endpoints return 404.

**Solutions**:
- ✅ Verify the route file exists in `src/app/api/`
- ✅ Check that the HTTP method is exported (GET, POST, etc.)
- ✅ Ensure the path in Swagger matches the file structure
- ✅ Check Vercel deployment logs for build errors

### Issue 3: CORS Errors

**Symptoms**: Browser shows "CORS policy" errors in console.

**Solutions**:
- ✅ CORS headers are already configured in `next.config.ts`
- ✅ Try clearing browser cache and hard refresh (Ctrl+Shift+R)
- ✅ Check that the request is going to the correct domain
- ✅ For protected endpoints, ensure the `Authorization` header is included

### Issue 4: Still Shows Wrong Server URL

**Symptoms**: Console shows incorrect server URL.

**Solutions**:
1. Clear browser cache completely
2. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
3. Check that the latest deployment is active in Vercel
4. Manually set `NEXT_PUBLIC_API_URL` as described above

## 📊 Expected Console Output

When everything is working correctly, you should see:

```
[Swagger] Server URL set to: https://your-app.vercel.app
```

If you see this, the fix is working! 🎉

## 🔗 Related Files Modified

- ✅ `src/app/swagger/page.tsx` - Dynamic server URL detection
- ✅ `src/lib/swagger.config.ts` - Improved URL priority logic
- ✅ `VERCEL_DEPLOYMENT.md` - Updated troubleshooting guide

## 📝 Summary

The fix ensures that:
1. ✅ Swagger UI always uses the correct deployment URL at runtime
2. ✅ API endpoint testing works on Vercel without manual configuration
3. ✅ Fallback mechanisms handle various deployment scenarios
4. ✅ Logging helps debug any remaining issues

## 🎉 Next Steps

1. **Deploy** the changes to Vercel
2. **Test** the Swagger UI at `/swagger`
3. **Verify** endpoints work correctly
4. If issues persist, check the troubleshooting section above

---

**Need Help?** Check the Vercel deployment logs or browser console for error messages, and refer to the troubleshooting section above.

