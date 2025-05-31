'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from URL params
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const patronStatus = searchParams.get("patronStatus");
    const supportAmount = searchParams.get("supportAmount");
    const imageUrl = searchParams.get("imageUrl");
    const thumbUrl = searchParams.get("thumbUrl");
    const profileUrl = searchParams.get("profileUrl");
    const userId = searchParams.get("userId");
    const lifetimeSupport = searchParams.get("lifetimeSupport");
    const campaignName = searchParams.get("campaignName");
    const campaignUrl = searchParams.get("campaignUrl");

    if (name && email) {
      setUserData({
        name,
        email,
        patronStatus,
        supportAmount: parseInt(supportAmount || "0", 10) / 100, // Convert cents to dollars
        lifetimeSupport: parseInt(lifetimeSupport || "0", 10) / 100, // Convert cents to dollars
        imageUrl,
        thumbUrl,
        profileUrl,
        userId,
        campaignName,
        campaignUrl
      });
    } else {
      // No user data in URL, user might have accessed page directly
      setUserData(null);
    }
    
    setLoading(false);
  }, [searchParams]);

  // Helper function to determine patron status display
  const getPatronStatusDisplay = (status) => {
    switch(status) {
      case "active_patron":
        return { label: "Active Patron", color: "text-green-600" };
      case "declined_patron":
        return { label: "Declined Patron", color: "text-yellow-600" };
      case "former_patron":
        return { label: "Former Patron", color: "text-orange-600" };
      default:
        return { label: "Not a Patron", color: "text-gray-600" };
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-gray-100">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  // User not logged in or data not available
  if (!userData) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-gray-100">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">Not Logged In</CardTitle>
            <CardDescription className="text-center">
              You need to log in with Patreon to view this page
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button className="bg-patreon-orange hover:bg-patreon-orange/90 text-white">
                Return to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
    );
  }

  // User logged in, display data
  const patronStatus = getPatronStatusDisplay(userData.patronStatus);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-gray-100">
      <div className="w-full max-w-3xl flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          {userData.imageUrl && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange-500 shadow-md">
              <img 
                src={userData.imageUrl} 
                alt={`${userData.name}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              Welcome, {userData.name}!
            </h1>
            <p className="text-lg text-gray-600">
              You&apos;ve successfully logged in with Patreon
            </p>
          </div>
        </div>

        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Your Patreon Profile</CardTitle>
            <CardDescription>
              Information retrieved from your Patreon account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="text-lg">{userData.name}</p>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-lg">{userData.email}</p>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-500">Patron Status</h3>
                <p className={`text-lg font-medium ${patronStatus.color}`}>
                  {patronStatus.label}
                </p>
              </div>
              
              {userData.supportAmount > 0 && (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Support Amount</h3>
                  <p className="text-lg">${userData.supportAmount.toFixed(2)} per month</p>
                </div>
              )}
              
              {userData.userId && (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Patreon User ID</h3>
                  <p className="text-lg">{userData.userId}</p>
                </div>
              )}
              
              {userData.profileUrl && (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Patreon Profile</h3>
                  <a 
                    href={userData.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View Profile
                  </a>
                </div>
              )}
              
              {userData.lifetimeSupport > 0 && (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Lifetime Support</h3>
                  <p className="text-lg">${userData.lifetimeSupport.toFixed(2)}</p>
                </div>
              )}
              
              {userData.campaignName && (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Supporting Campaign</h3>
                  {userData.campaignUrl ? (
                    <a 
                      href={userData.campaignUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {userData.campaignName}
                    </a>
                  ) : (
                    <p className="text-lg">{userData.campaignName}</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">What This Means</h3>
              <p className="text-gray-700">
                {userData.patronStatus === "active_patron" 
                  ? "As an active patron, you have access to all creator benefits at your tier level." 
                  : "You're not currently an active patron. Consider supporting your favorite creators to unlock exclusive content and benefits."}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
