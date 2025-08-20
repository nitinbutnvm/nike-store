"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "../../lib/supabase/client"
import Link from "next/link"
import { CheckCircle, Package, Truck, Home, Download, ShoppingBag } from "lucide-react"

export default function OrderConfirmedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const orderId = searchParams.get("orderId")
    if (!orderId) {
      router.push("/")
      return
    }
    fetchOrderData(orderId)
  }, [router, searchParams])

  const fetchOrderData = async (orderId) => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("id", orderId)
        .single()

      if (orderError) throw orderError
      setOrderData(orderData)
    } catch (error) {
      console.error("Error fetching order:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <Link href="/" className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const estimatedDelivery = new Date(orderData.created_at)
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-400 text-lg">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {/* Order Details */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order ID:</span>
                  <span className="font-semibold">#{orderData.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Date:</span>
                  <span>{formatDate(orderData.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Method:</span>
                  <span className="capitalize">{orderData.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Amount:</span>
                  <span className="font-semibold text-orange-500">${orderData.total_amount}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="text-gray-300">
                <p className="font-semibold">{orderData.user_name}</p>
                <p>{orderData.shipping_address}</p>
                <p>
                  {orderData.city}, {orderData.state} - {orderData.pincode}
                </p>
                <p>{orderData.user_phone}</p>
                <p>{orderData.user_email}</p>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Order Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Order Confirmed</p>
                  <p className="text-gray-400 text-sm">{formatDate(orderData.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Processing</p>
                  <p className="text-gray-400 text-sm">Your order is being prepared</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-400">Shipped</p>
                  <p className="text-gray-400 text-sm">Estimated: 1-2 business days</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-400">Delivered</p>
                  <p className="text-gray-400 text-sm">
                    Estimated:{" "}
                    {estimatedDelivery.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Ordered Items</h2>
            <div className="space-y-4">
              {orderData.order_items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                  <img
                    src={item.product_image || "/placeholder.svg"}
                    alt={item.product_name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product_name}</h3>
                    <p className="text-gray-400">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">${item.price} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              View All Orders
            </Link>
            <button className="flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
              <Download className="w-5 h-5 mr-2" />
              Download Invoice
            </button>
            <Link
              href="/"
              className="flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Support Info */}
          <div className="text-center mt-12 p-6 bg-gray-900 rounded-lg">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-gray-400 mb-4">
              If you have any questions about your order, feel free to contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <span>📧 support@nike.com</span>
              <span>📞 1-800-NIKE-123</span>
              <span>💬 Live Chat Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
