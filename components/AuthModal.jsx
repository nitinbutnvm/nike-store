"use client"

import { useState, useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2, X, Mail, Lock, Phone, User } from "lucide-react"
import { signIn, signUp } from "@/lib/actions"

function SubmitButton({ isLogin }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 text-lg rounded-lg"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isLogin ? "Signing in..." : "Creating account..."}
        </>
      ) : isLogin ? (
        "Sign In"
      ) : (
        "Create Account"
      )}
    </Button>
  )
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [loginState, loginAction] = useActionState(signIn, null)
  const [signUpState, signUpAction] = useActionState(signUp, null)

  const currentState = isLogin ? loginState : signUpState
  const currentAction = isLogin ? loginAction : signUpAction

  useEffect(() => {
    if (loginState?.success) {
      console.log("[v0] Login successful, calling onAuthSuccess and closing modal")
      setTimeout(() => {
        onAuthSuccess?.()
        onClose()
      }, 100)
    }
  }, [loginState, onAuthSuccess, onClose])

  useEffect(() => {
    if (signUpState?.success) {
      console.log("[v0] Signup successful, calling onAuthSuccess and closing modal")
      setTimeout(() => {
        onAuthSuccess?.()
        onClose()
      }, 100)
    }
  }, [signUpState, onAuthSuccess, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 bg-gray-900/95 border-gray-700 backdrop-blur-md">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">{isLogin ? "Welcome Back" : "Join Nike"}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin ? "bg-orange-500 text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin ? "bg-orange-500 text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form action={currentAction} className="space-y-4">
            {currentState?.error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {currentState.error}
              </div>
            )}

            {currentState?.success && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm">
                {currentState.success}
              </div>
            )}

            <div className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    name="full_name"
                    type="text"
                    placeholder="Full name"
                    required
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  required
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500"
                />
              </div>

              {!isLogin && (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Mobile number (optional)"
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500"
                  />
                </div>
              )}

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500"
                />
              </div>
            </div>

            <SubmitButton isLogin={isLogin} />
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <button onClick={() => setIsLogin(false)} className="text-orange-400 hover:text-orange-300 font-medium">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setIsLogin(true)} className="text-orange-400 hover:text-orange-300 font-medium">
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
