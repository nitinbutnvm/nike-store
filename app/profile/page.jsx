"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft, User, MapPin, CreditCard, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showAddPayment, setShowAddPayment] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "United States",
  })

  const [paymentForm, setPaymentForm] = useState({
    card_type: "credit",
    card_last_four: "",
    card_brand: "",
    upi_id: "",
  })

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/")
        return
      }

      setUser(user)
      await fetchProfile(user.id)
      await fetchPaymentMethods(user.id)
    } catch (error) {
      console.error("Error checking user:", error)
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProfile = async (userId) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("user_profiles").select("*").eq("user_id", userId).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error)
        return
      }

      if (data) {
        setProfile(data)
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          address_line_1: data.address_line_1 || "",
          address_line_2: data.address_line_2 || "",
          city: data.city || "",
          state: data.state || "",
          postal_code: data.postal_code || "",
          country: data.country || "United States",
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const fetchPaymentMethods = async (userId) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("payment_methods").select("*").eq("user_id", userId)

      if (error) {
        console.error("Error fetching payment methods:", error)
        return
      }

      setPaymentMethods(data || [])
    } catch (error) {
      console.error("Error fetching payment methods:", error)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("user_profiles")
        .upsert({
          user_id: user.id,
          email: user.email,
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .select()

      if (error) {
        console.error("Error saving profile:", error)
        alert("Error saving profile. Please try again.")
        return
      }

      await fetchProfile(user.id)
      setIsEditing(false)
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Error saving profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddPaymentMethod = async () => {
    if (!user) return

    try {
      const supabase = createClient()

      const { error } = await supabase.from("payment_methods").insert({
        user_id: user.id,
        ...paymentForm,
      })

      if (error) {
        console.error("Error adding payment method:", error)
        alert("Error adding payment method. Please try again.")
        return
      }

      await fetchPaymentMethods(user.id)
      setShowAddPayment(false)
      setPaymentForm({
        card_type: "credit",
        card_last_four: "",
        card_brand: "",
        upi_id: "",
      })
      alert("Payment method added successfully!")
    } catch (error) {
      console.error("Error adding payment method:", error)
      alert("Error adding payment method. Please try again.")
    }
  }

  const handleDeletePaymentMethod = async (id) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("payment_methods").delete().eq("id", id)

      if (error) {
        console.error("Error deleting payment method:", error)
        alert("Error deleting payment method. Please try again.")
        return
      }

      await fetchPaymentMethods(user.id)
      alert("Payment method deleted successfully!")
    } catch (error) {
      console.error("Error deleting payment method:", error)
      alert("Error deleting payment method. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">My Profile</h1>
          </div>
          <div className="text-2xl font-bold">
            <span className="text-white">NIKE</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <User className="w-6 h-6 text-orange-400" />
                    <h2 className="text-xl font-semibold">Personal Information</h2>
                  </div>
                  <Button
                    onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                    disabled={isSaving}
                    className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
                  >
                    {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      disabled={!isEditing}
                      className="bg-gray-800/50 border-gray-600 text-white disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <Input
                      value={user?.email || ""}
                      disabled
                      className="bg-gray-800/50 border-gray-600 text-white opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="bg-gray-800/50 border-gray-600 text-white disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      disabled={!isEditing}
                      className="bg-gray-800/50 border-gray-600 text-white disabled:opacity-50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Address Line 1</label>
                    <Input
                      value={formData.address_line_1}
                      onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
                      disabled={!isEditing}
                      className="bg-gray-800/50 border-gray-600 text-white disabled:opacity-50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Address Line 2</label>
                    <Input
                      value={formData.address_line_2}
                      onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
                      disabled={!isEditing}
                      className="bg-gray-800/50 border-gray-600 text-white disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      disabled={!isEditing}
                      className="bg-gray-800/50 border-gray-600 text-white disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">State</label>
                    <Input
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      disabled={!isEditing}
                      className="bg-gray-800/50 border-gray-600 text-white disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Postal Code</label>
                    <Input
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                      disabled={!isEditing}
                      className="bg-gray-800/50 border-gray-600 text-white disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment Methods */}
          <div>
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-orange-400" />
                    <h2 className="text-xl font-semibold">Payment Methods</h2>
                  </div>
                  <Button
                    onClick={() => setShowAddPayment(true)}
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {method.card_type === "upi" ? method.upi_id : `**** ${method.card_last_four}`}
                        </p>
                        <p className="text-sm text-gray-400 capitalize">
                          {method.card_type === "upi" ? "UPI" : `${method.card_brand} ${method.card_type}`}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleDeletePaymentMethod(method.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  {paymentMethods.length === 0 && (
                    <p className="text-gray-400 text-center py-4">No payment methods added yet</p>
                  )}
                </div>

                {showAddPayment && (
                  <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
                    <h3 className="font-medium mb-4">Add Payment Method</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                        <select
                          value={paymentForm.card_type}
                          onChange={(e) => setPaymentForm({ ...paymentForm, card_type: e.target.value })}
                          className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-md px-3 py-2"
                        >
                          <option value="credit">Credit Card</option>
                          <option value="debit">Debit Card</option>
                          <option value="upi">UPI</option>
                        </select>
                      </div>

                      {paymentForm.card_type === "upi" ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">UPI ID</label>
                          <Input
                            value={paymentForm.upi_id}
                            onChange={(e) => setPaymentForm({ ...paymentForm, upi_id: e.target.value })}
                            placeholder="your-upi@paytm"
                            className="bg-gray-800/50 border-gray-600 text-white"
                          />
                        </div>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Card Brand</label>
                            <select
                              value={paymentForm.card_brand}
                              onChange={(e) => setPaymentForm({ ...paymentForm, card_brand: e.target.value })}
                              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-md px-3 py-2"
                            >
                              <option value="">Select Brand</option>
                              <option value="visa">Visa</option>
                              <option value="mastercard">Mastercard</option>
                              <option value="amex">American Express</option>
                              <option value="rupay">RuPay</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Last 4 Digits</label>
                            <Input
                              value={paymentForm.card_last_four}
                              onChange={(e) => setPaymentForm({ ...paymentForm, card_last_four: e.target.value })}
                              placeholder="1234"
                              maxLength={4}
                              className="bg-gray-800/50 border-gray-600 text-white"
                            />
                          </div>
                        </>
                      )}

                      <div className="flex space-x-2">
                        <Button
                          onClick={handleAddPaymentMethod}
                          className="bg-orange-500 hover:bg-orange-600 text-black font-semibold"
                        >
                          Add Method
                        </Button>
                        <Button
                          onClick={() => setShowAddPayment(false)}
                          variant="outline"
                          className="border-gray-600 text-gray-400 hover:text-white"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm mt-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/orders">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-gray-600 text-gray-300 hover:text-white bg-transparent"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      View Orders
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
