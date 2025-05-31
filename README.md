# Patreon OAuth Demo with Next.js

This is a complete demo web application that demonstrates how to implement Patreon OAuth2 authentication in a Next.js application using the App Router.

## Features

- Landing page with a "Login with Patreon" button
- OAuth2 flow with Patreon
- Server-side token exchange and API calls
- User profile display after successful authentication
- Error handling for authentication failures
- Modern UI with ShadCN components

## Project Structure

- `src/app/page.js` - Landing page with the Patreon login button
- `src/app/api/auth/callback/patreon/route.js` - API route that handles the OAuth callback
- `src/app/dashboard/page.js` - Dashboard page to display user info after login
- `src/app/auth/error/page.js` - Error page for authentication failures
- `src/components/ui/` - ShadCN UI components
- `.env.local` - Environment variables for Patreon credentials

## OAuth Flow

1. User clicks the "Login with Patreon" button on the landing page
2. User is redirected to Patreon's authorization page
3. After granting permission, Patreon redirects back to our callback URL with an authorization code
4. The callback handler exchanges the code for an access token
5. The access token is used to fetch the user's profile and membership data
6. User is redirected to the dashboard with their information displayed

## Environment Variables

Create a `.env.local` file with the following variables:

```
# Patreon OAuth Credentials for Server-Side API Routes
PATREON_CLIENT_ID=your_patreon_client_id
PATREON_CLIENT_SECRET=your_patreon_client_secret
PATREON_REDIRECT_URI=http://localhost:3000/api/auth/callback/patreon

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with your Patreon API credentials
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

- Next.js 15 with App Router
- JavaScript
- ShadCN UI (Tailwind CSS-based components)
- Axios for API requests

## Setting Up Patreon OAuth

1. Create a Patreon developer account at [https://www.patreon.com/portal/registration/register-clients](https://www.patreon.com/portal/registration/register-clients)
2. Create a new client and set the redirect URI to `http://localhost:3000/api/auth/callback/patreon`
3. Copy the client ID and client secret to your `.env.local` file

## License

MIT
