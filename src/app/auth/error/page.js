'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AuthError() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("An unknown error occurred");

  useEffect(() => {
    // Get error from URL params
    const error = searchParams.get("error");
    if (error) {
      setErrorMessage(decodeURIComponent(error));
    }
  }, [searchParams]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center text-red-600">Authentication Error</CardTitle>
          <CardDescription className="text-center">
            There was a problem with your Patreon authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 rounded-md border border-red-200 text-red-800">
            <h3 className="font-medium mb-1">Error details:</h3>
            <p className="text-sm break-all">{errorMessage}</p>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Common causes of authentication errors:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Invalid or expired authorization code</li>
              <li>Incorrect redirect URI configuration</li>
              <li>Permissions not granted by the user</li>
              <li>API rate limits exceeded</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button className="bg-patreon-orange hover:bg-patreon-orange/90 text-white">
              Try Again
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
