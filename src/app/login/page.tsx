"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase/firebase"
import { syncUserSession } from "@/actions/auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2 } from "lucide-react"
import Link from "next/link"
import { useOnboardingStore } from "@/store/onboarding-store"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const isRegister = searchParams.get("register") === "true"
  const selectedType = useOnboardingStore((state) => state.selectedType)
  const selectedPlan = useOnboardingStore((state) => state.selectedPlan)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    setError("")

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      const result = await syncUserSession({
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        name: userCredential.user.displayName,
        workspaceType: isRegister ? selectedType || undefined : undefined,
        subscriptionPlan: isRegister ? selectedPlan || undefined : undefined,
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.redirectUrl) {
        router.push(result.redirectUrl)
      }
    } catch (err: any) {
      setError(err.message || "Failed to login")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.05),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 grayscale pointer-events-none" />
      
      <Card className="w-full max-w-md border border-border/40 shadow-2xl bg-card/60 backdrop-blur-xl relative z-10">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="flex justify-center mb-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-primary/10 rounded-2xl border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.1)]"
            >
              <Building2 className="w-10 h-10 text-primary" />
            </motion.div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">RE Manager OS</CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Enter your credentials to access your luxury portfolio
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-destructive text-sm text-center font-medium bg-destructive/10 border border-destructive/20 p-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80 font-medium ml-1">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                className="bg-background/50 border-border/60 h-12 rounded-xl focus:ring-primary/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-foreground/80 font-medium">Password</Label>
                <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">Forgot password?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                className="bg-background/50 border-border/60 h-12 rounded-xl focus:ring-primary/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-6 pt-4 pb-8">
            <Button className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" type="submit" disabled={pending}>
              {pending ? "Authenticating..." : "Sign in to Dashboard"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:text-primary/80 font-bold transition-colors">
                Contact Administrator
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      
      {/* Decorative Footer */}
      <div className="absolute bottom-8 left-0 w-full text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 font-bold pointer-events-none">
        The Operating System for Real Estate & Assets
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-2xl animate-pulse">
            <Building2 className="w-10 h-10 text-primary/50 animate-bounce" />
          </div>
          <p className="text-muted-foreground text-sm font-medium animate-pulse">Loading login services...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
