import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

// Custom Patreon provider for NextAuth
async function patreonProvider() {
  return {
    id: "patreon",
    name: "Patreon",
    type: "oauth",
    
    // Authorization URL endpoint - users are redirected here to authorize
    authorization: {
      url: "https://www.patreon.com/oauth2/authorize",
      params: {
        response_type: "code",
        client_id: process.env.PATREON_CLIENT_ID,
        redirect_uri: process.env.PATREON_REDIRECT_URI,
        scope: "identity identity[email] identity.memberships campaigns campaigns.members",
      },
    },
    
    // Token URL - exchanging authorization code for tokens
    token: {
      url: "https://www.patreon.com/api/oauth2/token",
      async request(context) {
        const { provider, params } = context;
        const { code } = params;

        const tokenResponse = await axios.post(
          provider.token.url,
          new URLSearchParams({
            client_id: process.env.PATREON_CLIENT_ID,
            client_secret: process.env.PATREON_CLIENT_SECRET,
            grant_type: "authorization_code",
            code,
            redirect_uri: process.env.PATREON_REDIRECT_URI,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        return { tokens: tokenResponse.data };
      },
    },
    
    // UserInfo URL - fetching user profile and membership data
    userinfo: {
      url: "https://www.patreon.com/api/oauth2/v2/identity",
      async request(context) {
        const { provider, tokens } = context;
        const { access_token } = tokens;

        const userInfoResponse = await axios.get(provider.userinfo.url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          params: {
            "fields[user]": "email,first_name,full_name,image_url,last_name,thumb_url,url",
            "include": "memberships,memberships.campaign",
            "fields[member]": "patron_status,currently_entitled_amount_cents,lifetime_support_cents",
          },
        });

        return userInfoResponse.data;
      },
    },
    
    // Profile callback - transforming user data
    profile(profile) {
      const user = profile.data;
      const memberships = profile.included || [];
      
      // Find user's patron status if they have memberships
      let patronStatus = "not_patron";
      let supportAmountCents = 0;
      
      if (memberships.length > 0) {
        const membership = memberships.find(item => item.type === "member");
        if (membership) {
          patronStatus = membership.attributes.patron_status || "not_patron";
          supportAmountCents = membership.attributes.currently_entitled_amount_cents || 0;
        }
      }
      
      return {
        id: user.id,
        name: user.attributes.full_name,
        email: user.attributes.email,
        image: user.attributes.image_url,
        patronStatus,
        supportAmountCents,
        // Include raw data for debugging and additional info
        patreonData: profile,
      };
    },
  };
}

// NextAuth handler
const handler = NextAuth({
  providers: [
    {
      // The credentials provider is only used as a mechanism to trigger
      // the custom Patreon OAuth flow
      id: "patreon-oauth",
      name: "Patreon",
      type: "credentials",
      credentials: {},
      async authorize() {
        return { id: "patreon-redirect" };
      },
    },
  ],
  callbacks: {
    async signIn({ user, account }) {
      // We'll handle sign-in via the custom flow
      return true;
    },
    async jwt({ token, user, account, profile }) {
      // Add Patreon user data to the token
      if (user && user.patronStatus) {
        token.patronStatus = user.patronStatus;
        token.supportAmountCents = user.supportAmountCents;
        token.patreonData = user.patreonData;
      }
      return token;
    },
    async session({ session, token }) {
      // Add Patreon data to the session
      if (token) {
        session.user.patronStatus = token.patronStatus;
        session.user.supportAmountCents = token.supportAmountCents;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
});

export { handler as GET, handler as POST };
