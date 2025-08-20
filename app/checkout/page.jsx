"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "../../contexts/CartContext"
import Link from "next/link"
import { ArrowLeft, ShoppingBag } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice } = useCart()
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required"
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Mobile number must be 10 digits"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state.trim()) newErrors.state = "State is required"
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required"
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Pincode must be 6 digits"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Store checkout data in localStorage for payment page
      localStorage.setItem("checkout-data", JSON.stringify(formData))
      router.push("/payment")
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some products to continue</p>
          <Link
            href="/"
            className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div>
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.fullName ? "border-red-500" : "border-gray-700"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.mobile ? "border-red-500" : "border-gray-700"
                    }`}
                    placeholder="10-digit mobile number"
                  />
                  {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.email ? "border-red-500" : "border-gray-700"
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.address ? "border-red-500" : "border-gray-700"
                  }`}
                  placeholder="Enter your complete address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.city ? "border-red-500" : "border-gray-700"
                    }`}
                    placeholder="City"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.state ? "border-red-500" : "border-gray-700"
                    }`}
                    placeholder="State"
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.pincode ? "border-red-500" : "border-gray-700"
                    }`}
                    placeholder="6-digit pincode"
                  />
                  {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg transition-colors"
              >
                Proceed to Payment
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-gray-900 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-400 text-sm">
                        Size: {item.selectedSize} | Color: {item.selectedColor}
                      </p>
                      <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{(getTotalPrice() * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{(getTotalPrice() * 1.18).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
