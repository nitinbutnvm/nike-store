"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User, LogOut, Package } from "lucide-react"
import Link from "next/link"

export default function ProfileDropdown({ user, userProfile, onSignOut }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const getUserDisplayName = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name.split(" ")[0] // First name only
    }
    if (user?.email) {
      return user.email.split("@")[0]
    }
    return "User"
  }

  const getUserInitial = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name.charAt(0).toUpperCase()
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return "U"
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 hover:bg-gray-800/50 rounded-lg p-2 transition-colors"
      >
        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-lg">
          {getUserInitial()}
        </div>
        <span className="hidden sm:block text-white font-medium">Hi, {getUserDisplayName()}</span>
      </button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-64 bg-gray-900/95 border-gray-700 backdrop-blur-md z-50">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-700">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-xl">
                {getUserInitial()}
              </div>
              <div>
                <p className="text-white font-semibold">{getUserDisplayName()}</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Link href="/profile" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800/50"
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile Settings
                </Button>
              </Link>

              <Link href="/orders" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800/50"
                >
                  <Package className="w-4 h-4 mr-3" />
                  My Orders
                </Button>
              </Link>

              <div className="border-t border-gray-700 pt-2 mt-2">
                <Button
                  onClick={() => {
                    onSignOut()
                    setIsOpen(false)
                  }}
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
