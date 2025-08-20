"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "../../contexts/CartContext"
import { supabase } from "../../lib/supabase/client"
import Link from "next/link"
import { ArrowLeft, CreditCard, Smartphone, Wallet, Shield } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const [checkoutData, setCheckoutData] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState("upi")
  const [upiId, setUpiId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const savedCheckoutData = localStorage.getItem("checkout-data")
    if (!savedCheckoutData) {
      router.push("/checkout")
      return
    }
    setCheckoutData(JSON.parse(savedCheckoutData))
  }, [router])

  const totalAmount = (getTotalPrice() * 1.18).toFixed(2)

  const handlePayment = async () => {
    if (selectedPayment === "upi" && !upiId.trim()) {
      alert("Please enter your UPI ID")
      return
    }

    setIsProcessing(true)

    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_email: checkoutData.email,
          user_name: checkoutData.fullName,
          user_phone: checkoutData.mobile,
          shipping_address: checkoutData.address,
          city: checkoutData.city,
          state: checkoutData.state,
          pincode: checkoutData.pincode,
          total_amount: Number.parseFloat(totalAmount),
          payment_method: selectedPayment,
          payment_status: "completed",
          order_status: "confirmed",
        })
        .select()
        .single()

      if (orderError) throw orderError

      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image || "/placeholder.svg",
        size: item.selectedSize || item.size || "One Size",
        color: item.selectedColor || item.color || "Default",
        quantity: item.quantity,
        price: Number.parseFloat(item.price.replace("₹", "").replace(",", "")),
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Store user email for orders page access
      localStorage.setItem("userEmail", checkoutData.email)

      // Clear cart and redirect
      clearCart()
      localStorage.removeItem("checkout-data")
      router.push(`/order-confirmed?orderId=${orderData.id}`)
    } catch (error) {
      console.error("Error processing payment:", error)
      alert("Payment failed. Please try again.")
      setIsProcessing(false)
    }
  }

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/checkout" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Checkout
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Payment Methods */}
          <div>
            <h1 className="text-3xl font-bold mb-8">Payment</h1>

            <div className="space-y-4 mb-8">
              {/* UPI Payment */}
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPayment === "upi" ? "border-orange-500 bg-orange-500/10" : "border-gray-700"
                }`}
                onClick={() => setSelectedPayment("upi")}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={selectedPayment === "upi"}
                    onChange={() => setSelectedPayment("upi")}
                    className="text-orange-500"
                  />
                  <Smartphone className="w-6 h-6 text-orange-500" />
                  <div>
                    <h3 className="font-semibold">UPI Payment</h3>
                    <p className="text-gray-400 text-sm">Pay using Google Pay, PhonePe, Paytm</p>
                  </div>
                </div>

                {selectedPayment === "upi" && (
                  <div className="mt-4 pl-9">
                    <input
                      type="text"
                      placeholder="Enter your UPI ID (e.g., user@paytm)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                )}
              </div>

              {/* Razorpay */}
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPayment === "razorpay" ? "border-orange-500 bg-orange-500/10" : "border-gray-700"
                }`}
                onClick={() => setSelectedPayment("razorpay")}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={selectedPayment === "razorpay"}
                    onChange={() => setSelectedPayment("razorpay")}
                    className="text-orange-500"
                  />
                  <CreditCard className="w-6 h-6 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">Razorpay</h3>
                    <p className="text-gray-400 text-sm">Credit/Debit Card, Net Banking, Wallets</p>
                  </div>
                </div>
              </div>

              {/* Wallet */}
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPayment === "wallet" ? "border-orange-500 bg-orange-500/10" : "border-gray-700"
                }`}
                onClick={() => setSelectedPayment("wallet")}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={selectedPayment === "wallet"}
                    onChange={() => setSelectedPayment("wallet")}
                    className="text-orange-500"
                  />
                  <Wallet className="w-6 h-6 text-green-500" />
                  <div>
                    <h3 className="font-semibold">Digital Wallet</h3>
                    <p className="text-gray-400 text-sm">Paytm, Amazon Pay, Mobikwik</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-gray-900 rounded-lg p-4 mb-8">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-green-500" />
                <div>
                  <h3 className="font-semibold">Secure Payment</h3>
                  <p className="text-gray-400 text-sm">Your payment information is encrypted and secure</p>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                `Pay ₹${totalAmount}`
              )}
            </button>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-gray-900 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Shipping Address */}
              <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p className="text-gray-300 text-sm">
                  {checkoutData.fullName}
                  <br />
                  {checkoutData.address}
                  <br />
                  {checkoutData.city}, {checkoutData.state} - {checkoutData.pincode}
                  <br />
                  {checkoutData.mobile}
                </p>
              </div>

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
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
