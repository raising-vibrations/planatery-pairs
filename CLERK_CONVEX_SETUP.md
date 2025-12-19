# Clerk + Convex Authentication Setup Guide

## The Problem
You're getting "Unauthenticated" errors when trying to create posts because Clerk isn't issuing JWT tokens that Convex can validate.

## Solution: Configure Clerk JWT Template

### Step-by-Step Instructions

#### 1. Go to Clerk Dashboard
- Visit: https://dashboard.clerk.com
- Sign in to your account
- Select your application: **choice-anchovy-36**

#### 2. Navigate to JWT Templates
- In the left sidebar, find **"Configure"**
- Click on **"JWT Templates"**

#### 3. Create Convex Template
You have two options:

**Option A: Use Pre-built Convex Template (RECOMMENDED)**
1. Click **"+ New template"** button
2. Find and select **"Convex"** from the list of pre-built templates
3. The template will be automatically named `convex` - **DO NOT CHANGE THIS NAME**
4. Click **"Save"** or **"Apply"**

**Option B: Check Existing Template**
1. Look for an existing template named **"convex"**
2. Make sure it exists and is enabled
3. The name MUST be exactly `convex` (lowercase)

#### 4. Verify Configuration
After creating/finding the template, verify these settings:

- **Template name**: `convex` (must match exactly)
- **Token lifetime**: 3600 seconds (default)
- **Claims**: Should include standard claims like `sub`, `iss`, `aud`, etc.

#### 5. Test the Integration
1. Go back to your app: http://localhost:3000
2. Sign out and sign back in (to get a fresh JWT token)
3. Try creating a post in the Community forum
4. The authentication should now work!

## What This Does

The JWT template tells Clerk to issue tokens with the correct format and claims that Convex expects. Without this template:
- Clerk issues a generic JWT token
- Convex receives the token but can't validate it
- You get "Unauthenticated" errors

With the template configured:
- Clerk issues a JWT token specifically for Convex
- Convex can validate the token using your auth.config.ts
- Authentication works properly

## Current Configuration Files

### convex/auth.config.ts
```typescript
export default {
  providers: [
    {
      domain: "https://choice-anchovy-36.clerk.accounts.dev",
      applicationID: "convex", // This must match your JWT template name
    },
  ],
};
```

### Environment Variables (Already Set)
- `.env.local`: `CLERK_JWT_ISSUER_DOMAIN=https://choice-anchovy-36.clerk.accounts.dev`
- Convex deployment: `CLERK_JWT_ISSUER_DOMAIN=https://choice-anchovy-36.clerk.accounts.dev`

## Troubleshooting

### Still getting "Unauthenticated" errors?

1. **Check the JWT template name**
   - Must be exactly `convex` (lowercase)
   - Check in Clerk Dashboard > JWT Templates

2. **Sign out and sign back in**
   - Your current session might have an old token
   - Sign out completely and sign back in to get a new token

3. **Clear browser cache**
   - Sometimes old tokens are cached
   - Try clearing cookies and local storage

4. **Check browser console**
   - Open Developer Tools (F12)
   - Look for any Clerk or Convex errors
   - Share them for further debugging

5. **Verify Convex is using correct environment**
   - Run: `npx convex env list`
   - Should show: `CLERK_JWT_ISSUER_DOMAIN=https://choice-anchovy-36.clerk.accounts.dev`

## Additional Resources

- [Convex + Clerk Integration Docs](https://docs.convex.dev/auth/clerk)
- [Clerk JWT Templates](https://clerk.com/docs/backend-requests/making/jwt-templates)
- [Community Feature Documentation](./COMMUNITY_FEATURE_DOCUMENTATION.md)

## Next Steps After Setup

Once authentication is working:
1. Test creating posts
2. Test uploading birth charts
3. Test commenting and liking
4. Verify real-time updates work

---

**Last Updated**: December 19, 2024
