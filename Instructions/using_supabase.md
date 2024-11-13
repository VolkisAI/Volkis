# Comprehensive Guide for Integrating Supabase with Next.js 14 App Router

## Introduction

This guide provides incredibly detailed, precise instructions for integrating Supabase with a Next.js 14 application using the App Router (app directory) and the new `@supabase/ssr` package. It addresses common errors, lessons learned, and best practices to ensure smooth future development when making changes and using the Supabase database.

## Table of Contents

1. Project Setup and Environment
2. Authentication with Supabase SSR
3. Middleware Configuration
4. Row-Level Security (RLS) Policies in Supabase
5. API Route for Uploading Images
6. Client-Side Adjustments
7. Common Errors and Solutions
8. Lessons Learned and Best Practices
9. Final Notes
10. References
11. Supabase Database Integration with Next.js 14 App Router

## 1. Project Setup and Environment

- Next.js Version: 14 (App Router)
- Supabase Libraries:
  - @supabase/ssr: Latest version
  - @supabase/supabase-js: Latest version

Ensure that your project is using the latest versions of these libraries to avoid compatibility issues.

## 2. Authentication with Supabase SSR

### 2.1 Installing Supabase SSR

```bash
npm install @supabase/ssr @supabase/supabase-js
```

### 2.2 Creating Supabase Client Instances

For Server Components:

```javascript
// utils/supabase/server.js
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => cookies().get(name)?.value,
        set: (name, value, options) => cookies().set(name, value, options),
        remove: (name, options) => cookies().set(name, '', options),
      },
    }
  )
}
```

For Client Components:

```javascript
// utils/supabase/client.js
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
```

Explanation:
- `createServerClient`: Initializes Supabase client for server-side usage, utilizing cookies from next/headers.
- `createBrowserClient`: Initializes Supabase client for client-side usage.

## 3. Middleware Configuration

Create `middleware.ts` at the root of your project:

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  await supabase.auth.getSession()

  return response
}

// Apply middleware to protected routes
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'], // Adjust paths as needed
};
```

Explanation:
- This middleware ensures that the Supabase client is properly initialized with the correct cookie handling for each request.
- It refreshes the session for each request, ensuring the user's authentication state is always up-to-date.

## 4. Row-Level Security (RLS) Policies in Supabase

### 4.1 Correct Usage of WITH CHECK and USING Clauses

The principles for RLS policies remain the same:
- USING: Used for SELECT, UPDATE, and DELETE operations.
- WITH CHECK: Used for INSERT and UPDATE operations to validate new data.

Example policies:

```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Authenticated users can upload to their folder"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
  AND bucket_id = 'source-files'
  AND substring(name, 1, 36) = auth.uid()::text
);

-- Allow authenticated users to read files in their folder
CREATE POLICY "Authenticated users can read their files"
ON storage.objects FOR SELECT
USING (
  auth.role() = 'authenticated'
  AND bucket_id = 'source-files'
  AND substring(name, 1, 36) = auth.uid()::text
);
```

## 5. API Route for Uploading Images

Updated API route using the new `createClient` function:

```javascript
// app/api/upload-source-images/route.js
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request) {
  const supabase = createClient()

  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  if (sessionError) {
    console.error('Error retrieving session:', sessionError)
    return NextResponse.json({ error: 'Error retrieving session' }, { status: 500 })
  }

  if (!session) {
    console.error('User not authenticated')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const formData = await request.formData()
    const files = formData.getAll('files')

    if (files.length === 0) {
      console.warn('No files were uploaded in the request')
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const uploadedFiles = []

    for (const file of files) {
      // ... (file processing logic remains the same)

      // Upload file to Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('source-files')
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: false,
        })

      if (storageError) {
        console.error(`Error uploading file ${file.name}:`, storageError)
        continue
      }

      // ... (database insertion logic remains the same)

      uploadedFiles.push(file.name)
    }

    return NextResponse.json(
      { message: 'Files uploaded successfully', uploadedFiles },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error during file upload:', error)
    return NextResponse.json({ error: 'Error uploading files' }, { status: 500 })
  }
}
```

## 6. Client-Side Adjustments

For client-side Supabase operations, use the client-side `createClient` function:

```javascript
// In a client component
import { createClient } from '@/utils/supabase/client'

export default function ClientComponent() {
  const supabase = createClient()

  const handleUpload = async (files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))

    try {
      const response = await fetch('/api/upload-source-images', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      // Handle success
    } catch (error) {
      // Handle error
    }
  }

  // ... rest of the component
}
```

## 7. Common Errors and Solutions

1. Error: "Failed to parse cookie string"
   - Cause: Incorrect cookie handling in middleware or server components.
   - Solution: Ensure proper implementation of cookie methods in the Supabase client initialization.

2. Error: "AuthApiError: Invalid login credentials"
   - Cause: Incorrect Supabase URL or API key.
   - Solution: Double-check your environment variables for correct Supabase credentials.

3. Error: "TypeError: supabase.auth.getSession is not a function"
   - Cause: Using an outdated version of @supabase/ssr or incorrect import.
   - Solution: Update to the latest version and ensure correct imports.

4. Error: "ReferenceError: cookies is not defined"
   - Cause: Incorrect usage of the cookies API in server components.
   - Solution: Ensure you're importing cookies from 'next/headers' and using it correctly.

## 8. Lessons Learned and Best Practices

1. Consistent Client Usage:
   - Use the appropriate `createClient` function for server and client components.

2. Middleware Configuration:
   - Implement middleware to handle session refresh and cookie management consistently.

3. Environment Variables:
   - Keep Supabase URL and API key in `.env.local` and never expose them in client-side code.

4. Error Handling:
   - Implement comprehensive error handling in both server and client code.
   - Log errors with detailed messages for easier debugging.

5. Security:
   - Always use RLS policies to secure your data.
   - Never trust client-side data; always validate on the server.

6. Performance:
   - Use server components for initial data fetching where possible.
   - Implement proper caching strategies to reduce unnecessary database calls.

## 9. Final Notes

1. Keep your Supabase and Next.js dependencies up to date.
2. Regularly review the official Supabase and Next.js documentation for best practices and updates.
3. Test your authentication flow thoroughly, including edge cases like session expiration and token refresh.
4. Consider implementing additional security measures like rate limiting for API routes.

## 10. References

1. Supabase Documentation:
   - [Supabase Auth with Next.js Server-Side Rendering](https://supabase.com/docs/guides/auth/server-side/nextjs)
   - [Row-Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)

2. Next.js Documentation:
   - [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
   - [Route Handlers in Next.js 14](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

3. Error Resolution:
   - [Common Supabase Errors](https://supabase.com/docs/guides/troubleshooting)
   - [Debugging Next.js Applications](https://nextjs.org/docs/pages/building-your-application/configuring/debugging)

## 11. Supabase Database Integration with Next.js 14 App Router

When integrating Supabase database with Next.js 14 using the App Router and SSR, follow these steps:

1. Install the required packages:
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```

2. Create a Supabase client for server components:
   ```javascript
   // app/supabase-server.js
   import { createServerClient } from '@supabase/ssr'
   import { cookies } from 'next/headers'

   export function createClient() {
     return createServerClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
       {
         cookies: {
           get: (name) => cookies().get(name)?.value,
           set: (name, value, options) => cookies().set(name, value, options),
           remove: (name, options) => cookies().set(name, '', options),
         },
       }
     )
   }
   ```

3. Use the Supabase client in server components:
   ```javascript
   // app/page.js
   import { createClient } from './supabase-server'

   export default async function Page() {
     const supabase = createClient()
     const { data: posts } = await supabase.from('posts').select()
     
     return (
       <ul>
         {posts.map((post) => (
           <li key={post.id}>{post.title}</li>
         ))}
       </ul>
     )
   }
   ```

4. For client components, create a separate client:
   ```javascript
   // app/supabase-client.js
   import { createBrowserClient } from '@supabase/ssr'

   export function createClient() {
     return createBrowserClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
     )
   }
   ```

5. Use the client-side Supabase client in client components:
   ```javascript
   'use client'
   
   import { useState, useEffect } from 'react'
   import { createClient } from './supabase-client'

   export default function ClientComponent() {
     const [posts, setPosts] = useState([])
     const supabase = createClient()

     useEffect(() => {
       const fetchPosts = async () => {
         const { data } = await supabase.from('posts').select()
         setPosts(data)
       }
       fetchPosts()
     }, [])

     return (
       <ul>
         {posts.map((post) => (
           <li key={post.id}>{post.title}</li>
         ))}
       </ul>
     )
   }
   ```

6. Ensure your environment variables are set in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

By following these steps, you'll have a robust setup for integrating Supabase with Next.js 14 using the App Router and SSR.

We are using hte updated supabase/ssr If you need to, please read the @Web @https://supabase.com/docs/guides/auth/server-side @https://supabase.com/docs/guides/auth/server-side/nextjs We are migrating from auth helpers to ssr, the details are here: @https://supabase.com/docs/guides/auth/server-side/migrating-to-ssr-from-auth-helpers