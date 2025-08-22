"use client"

import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Plus, Minus } from "lucide-react"
import Link from "next/link"

export default function CartDropdown({ isOpen, onClose }) {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute top-16 right-2 sm:right-4 w-[95vw] sm:w-96 max-h-[80vh] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 sm:p-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-white">Shopping Cart</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-gray-400">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="p-3 sm:p-4 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="bg-gray-800 border-gray-700 p-3 sm:p-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-sm sm:text-base truncate">{item.name}</h4>
                      <p className="text-orange-400 font-bold text-sm sm:text-base">{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </button>
                      <span className="w-6 sm:w-8 text-center text-white text-sm sm:text-base">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-3 sm:p-4 border-t border-gray-700 bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <span className="text-base sm:text-lg font-semibold text-white">
                Total: ₹{getTotalPrice().toFixed(2)}
              </span>
              <button onClick={clearCart} className="text-xs sm:text-sm text-red-400 hover:text-red-300">
                Clear Cart
              </button>
            </div>
            <Link href="/checkout" onClick={onClose}>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold text-sm sm:text-base py-2 sm:py-3">
                Checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
