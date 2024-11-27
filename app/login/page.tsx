"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
    </div>;
  }

  if (session) {
    router.push("/discover");
    return null;
  }
  else {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();

      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (res?.ok) {
        router.push("/discover"); // Redirige l'utilisateur après une connexion réussie
      } else {
        setError("Invalid username or password");
      }
    };

    const handleGitHubLogin = async () => {
      const res = await signIn("github", { callbackUrl: "https://localhost:3000/discover" });
      if (!res) {
        setError("Failed to login with GitHub");
      }
    };

    return (
      <div className="flex flex-col h-screen w-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex flex-1 bg-muted lg:block bg-gradient-to-bl from-orange-300 via-violet-400 to-blue-300">
          <div className="flex flex-1 items-center justify-center h-full">
            <h1 className="font-semibold text-7xl text-center">Welcome to Atlas</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-muted-foreground">
                Enter your username below to login to your account
              </p>
            </div>
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
            <div className="text-center">or</div>
            <Button
              onClick={handleGitHubLogin}
              className="button w-full"
            >
              <GitHubLogoIcon className="w-10 h-10" /> Login with GitHub
            </Button>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mt-4 text-center text-sm">
              Don&lsquo;t have an account ?{" "}
              <Link href="/register" className="underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}