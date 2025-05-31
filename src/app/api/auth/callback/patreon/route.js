import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  // Get the authorization code from the URL query parameters
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  
  if (!code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=missing_code`);
  }
  
  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      "https://www.patreon.com/api/oauth2/token",
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
    
    const { access_token } = tokenResponse.data;
    
    // Fetch the user's profile using the access token
    const userInfoResponse = await axios.get(
      "https://www.patreon.com/api/oauth2/v2/identity",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          "fields[user]": "email,first_name,full_name,image_url,last_name,thumb_url,url",
          "include": "memberships,memberships.campaign",
          "fields[member]": "patron_status,currently_entitled_amount_cents,lifetime_support_cents",
        },
      }
    );
    
    const userData = userInfoResponse.data;
    
    // Store user data in session or cookie
    // For this demo, we'll redirect to the dashboard with user info in query params
    const user = userData.data;
    const memberships = userData.included || [];
    
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
    
    // Create a safe URL with user data as query parameters
    const dashboardUrl = new URL(`${process.env.NEXTAUTH_URL}/dashboard`);
    dashboardUrl.searchParams.set("name", user.attributes.full_name || "");
    dashboardUrl.searchParams.set("email", user.attributes.email || "");
    dashboardUrl.searchParams.set("patronStatus", patronStatus);
    dashboardUrl.searchParams.set("supportAmount", supportAmountCents.toString());
    
    // Redirect to the dashboard
    return NextResponse.redirect(dashboardUrl.toString());
    
  } catch (error) {
    console.error("Patreon OAuth error:", error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=${encodeURIComponent(error.message)}`);
  }
}
