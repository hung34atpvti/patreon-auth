'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [patreonAuthUrl, setPatreonAuthUrl] = useState("");

  useEffect(() => {
    // Build the Patreon OAuth URL with all required parameters
    const clientId = "fEG_RiULN1gU8pbMxJPaTmscjZdh3iM_z3oAAATr8BeBRux4K2PmQbWrzpImWb9y";
    const redirectUri = encodeURIComponent("http://localhost:3000/api/auth/callback/patreon");
    const scope = encodeURIComponent("identity identity[email] identity.memberships campaigns campaigns.members");
    
    const authUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    
    setPatreonAuthUrl(authUrl);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-gray-100">
      <div className="w-full max-w-3xl flex flex-col items-center gap-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <h1 className="text-4xl font-bold text-center">
            Patreon OAuth Demo
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-md">
            A simple demo showing how to integrate Patreon OAuth with Next.js
          </p>
        </div>

        {/* Main Card */}
        <Card className="w-full shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to the Demo</CardTitle>
            <CardDescription>
              This app demonstrates how to implement Patreon OAuth2 authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="max-w-md text-center">
              <p className="mb-4">
                Click the button below to authenticate with your Patreon account.
                This demo will request permission to access your basic profile info
                and patron status.
              </p>
            </div>
            
            {/* Patreon Login Button */}
            <Link 
              href={patreonAuthUrl} 
              className="w-full max-w-xs"
            >
              <div className="w-full bg-[#F96854] hover:bg-[#F96854]/90 text-white flex items-center justify-center gap-2 h-10 rounded-md px-6 font-medium">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-5 h-5"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Login with Patreon
              </div>
            </Link>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500">
            Your data is only used for this demo and not stored anywhere
          </CardFooter>
        </Card>

        {/* Project Info */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>
            Built with Next.js App Router and ShadCN UI
          </p>
        </div>
      </div>
    </main>
  );
}
