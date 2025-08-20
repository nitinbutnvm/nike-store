"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    // Get user email from localStorage or prompt
    const email = localStorage.getItem("userEmail") || prompt("Enter your email to view orders:")
    if (email) {
      setUserEmail(email)
      localStorage.setItem("userEmail", email)
      fetchOrders(email)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchOrders = async (email) => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("user_email", email)
        .order("created_at", { ascending: false })

      if (ordersError) throw ordersError
      setOrders(ordersData || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return

    try {
      const { error } = await supabase.from("orders").update({ order_status: "cancelled" }).eq("id", orderId)

      if (error) throw error

      // Update local state
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, order_status: "cancelled" } : order)))

      alert("Order cancelled successfully")
    } catch (error) {
      console.error("Error cancelling order:", error)
      alert("Failed to cancel order")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-green-500"
      case "shipped":
        return "text-blue-500"
      case "delivered":
        return "text-green-600"
      case "cancelled":
        return "text-red-500"
      default:
        return "text-gray-400"
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
      shipped: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      delivered: "bg-green-600/20 text-green-300 border-green-600/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    }

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">Please provide your email to view orders</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">My Orders</h1>
              <p className="text-gray-400">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("userEmail")
              window.location.reload()
            }}
            className="text-gray-400 hover:text-white text-sm"
          >
            Switch Account
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
            <p className="text-gray-400 mb-6">You haven't placed any orders yet</p>
            <Link href="/" className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-medium inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-900 rounded-xl p-6">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                      {getStatusBadge(order.order_status)}
                    </div>
                    <p className="text-gray-400 text-sm">
                      Placed on{" "}
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-500">${order.total_amount}</p>
                      <p className="text-gray-400 text-sm capitalize">{order.payment_method}</p>
                    </div>
                    {order.order_status === "confirmed" && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-800 rounded-lg">
                      <img
                        src={item.product_image || "/placeholder.svg"}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product_name}</h4>
                        <p className="text-gray-400 text-sm">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-gray-400 text-sm">${item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <p className="text-gray-400 text-sm">
                    {order.user_name}
                    <br />
                    {order.shipping_address}
                    <br />
                    {order.city}, {order.state} - {order.pincode}
                    <br />
                    Phone: {order.user_phone}
                  </p>
                </div>

                {/* Order Timeline */}
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <h4 className="font-medium mb-3">Order Timeline</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Order Confirmed</span>
                      <span className="text-gray-400 text-xs ml-auto">
                        {new Date(order.created_at).toLocaleString()}
                      </span>
                    </div>
                    {order.order_status === "shipped" && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Order Shipped</span>
                      </div>
                    )}
                    {order.order_status === "delivered" && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        <span className="text-sm">Order Delivered</span>
                      </div>
                    )}
                    {order.order_status === "cancelled" && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Order Cancelled</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
