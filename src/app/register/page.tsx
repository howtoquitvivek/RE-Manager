"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase/firebase"
import { syncUserSession } from "@/actions/auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2 } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    setError("")

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name })
        
        const result = await syncUserSession({
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          name: name,
        })
        if (result?.error) {
          setError(result.error)
        } else if (result?.redirectUrl) {
          router.push(result.redirectUrl)
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to register")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 pointer-events-none" />
      
      <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
          <CardDescription>
            Join RE Manager OS and set up your portfolio
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-md">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit" disabled={pending}>
              {pending ? "Creating account..." : "Sign up"}
            </Button>
            <div className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
