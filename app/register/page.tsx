"use client";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { register, getError } from "../../repository/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import bcrypt from "bcryptjs"


export default function Dashboard() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const hash = await bcrypt.hash(password, 10);
        const response = await register(username, hash);
        setError(getError());
        if (response) {
            router.push('/login');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleRegister(e as unknown as React.FormEvent);
        }
    };

    return (
        <div className="flex flex-col h-screen w-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex flex-1 bg-muted lg:block bg-gradient-to-bl from-blue-300 via-pink-500 to-blue-300">
                <div className="flex flex-1 items-center justify-center h-full">
                    <Label className="flex justify-center font-semibold text-7xl text-center">
                        Welcome to <br /> Atlas
                    </Label>
                </div>
            </div>
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Register</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter an username and a password below to register an account
                        </p>
                    </div>
                    <form onSubmit={handleRegister} className="grid gap-4" onKeyDown={handleKeyPress}>
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </form>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="mt-4 text-center text-sm">
                        Already have an account ?{" "}
                        <Link href="/login" className="underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}