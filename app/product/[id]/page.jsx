"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart, ArrowLeft, Star, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/CartContext"
import CartDropdown from "@/components/CartDropdown"

gsap.registerPlugin(ScrollTrigger)

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  const { addToCart, getTotalItems } = useCart()

  const headerRef = useRef(null)
  const productRef = useRef(null)
  const reviewsRef = useRef(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        console.log("[v0] Fetching product with ID:", params.id)
        const response = await fetch(`https://dummyjson.com/products/${params.id}`)
        const productData = await response.json()

        console.log("[v0] API Response:", productData)

        if (productData.id) {
          console.log("[v0] Product found, transforming data...")
          const transformedProduct = {
            id: productData.id,
            name: productData.title,
            price: `₹${Math.round(productData.price * 83).toLocaleString()}`,
            originalPrice: `₹${Math.round(productData.price * 83 * (1 + (productData.discountPercentage || 20) / 100)).toLocaleString()}`,
            description: productData.description,
            images: productData.images || [productData.thumbnail],
            colors: ["Black/White", "White/Black", "Red/White", "Blue/White"],
            sizes: ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
            features: ["Premium materials", "Comfortable fit", "Durable construction", "Stylish design"],
            rating: productData.rating || 4.5,
            reviews: Math.floor(Math.random() * 2000) + 500,
            brand: productData.brand || "Nike",
            category: productData.category,
            discountPercentage: productData.discountPercentage || 0,
            stock: productData.stock || 50,
            tags: productData.tags || [],
            sku: productData.sku || `SKU-${productData.id}`,
            weight: productData.weight || Math.floor(Math.random() * 500) + 300,
            dimensions: productData.dimensions || {
              width: Math.floor(Math.random() * 10) + 25,
              height: Math.floor(Math.random() * 5) + 10,
              depth: Math.floor(Math.random() * 15) + 30,
            },
            warrantyInformation: productData.warrantyInformation || "2 year warranty",
            shippingInformation: productData.shippingInformation || "Ships in 1-2 business days",
            availabilityStatus: productData.availabilityStatus || "In Stock",
            returnPolicy: productData.returnPolicy || "30 days return policy",
            minimumOrderQuantity: productData.minimumOrderQuantity || 1,
          }
          setProduct(transformedProduct)
          console.log("[v0] Product set successfully:", transformedProduct.name)
        } else {
          console.log("[v0] Product not found, redirecting to homepage")
          router.push("/")
        }
      } catch (error) {
        console.error("[v0] Error fetching product:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id, router])

  useEffect(() => {
    if (!product) {
      router.push("/")
      return
    }

    setSelectedColor(product.colors[0])

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" })

      // Product section animation
      gsap.fromTo(".product-detail", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 })

      // Reviews animation
      gsap.fromTo(
        ".review-item",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: reviewsRef.current,
            start: "top 80%",
          },
        },
      )
    })

    return () => ctx.revert()
  }, [product, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Product not found</p>
          <Link href="/" className="text-orange-400 hover:text-orange-300">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const productReviews = [
    { name: "Alex M.", rating: 5, comment: "Perfect fit and amazing quality. Highly recommend!", date: "2 days ago" },
    { name: "Sarah K.", rating: 5, comment: "Love these shoes! So comfortable for daily wear.", date: "1 week ago" },
    { name: "Mike R.", rating: 4, comment: "Great style and comfort. Worth the price.", date: "2 weeks ago" },
    { name: "Emma L.", rating: 5, comment: "Best purchase I've made this year. Amazing!", date: "3 weeks ago" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/10"
      >
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:text-orange-400 transition-colors">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Back</span>
            </Link>
            <div className="text-lg sm:text-xl md:text-2xl font-bold">
              <span className="text-white">{product.brand}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 hover:text-orange-400 cursor-pointer transition-colors" />
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6 hover:text-orange-400 cursor-pointer transition-colors" />
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-1 sm:space-x-2 hover:text-orange-400 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {getTotalItems() > 0 && (
                <span className="bg-orange-500 text-black text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <div className="pt-20">
        {/* Product Section */}
        <section ref={productRef} className="py-8 sm:py-12 px-3 sm:px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Product Images */}
              <div className="product-detail">
                <div className="mb-4 sm:mb-6">
                  <img
                    src={product.images[selectedImage] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-4">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      className={`w-full h-16 sm:h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                        selectedImage === index ? "border-orange-500" : "border-gray-700 hover:border-gray-500"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="product-detail">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          i < Math.floor(product.rating) ? "fill-orange-400 text-orange-400" : "text-gray-400"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-400 text-sm sm:text-base">({product.reviews} reviews)</span>
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <span className="text-2xl sm:text-3xl font-bold text-orange-400 mr-4">{product.price}</span>
                  <span className="text-lg sm:text-xl text-gray-500 line-through">{product.originalPrice}</span>
                  {product.discountPercentage > 0 && (
                    <span className="ml-3 bg-green-600 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                      {Math.round(product.discountPercentage)}% OFF
                    </span>
                  )}
                </div>

                <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">{product.description}</p>

                {product.tags && product.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs sm:text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3">Color</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-2 sm:px-4 text-xs sm:text-sm rounded-lg border transition-all ${
                          selectedColor === color
                            ? "border-orange-500 bg-orange-500/20 text-orange-400"
                            : "border-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3">
                    Size {!selectedSize && <span className="text-red-400">*</span>}
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 sm:py-3 text-sm sm:text-base rounded-lg border transition-all ${
                          selectedSize === size
                            ? "border-orange-500 bg-orange-500/20 text-orange-400"
                            : "border-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-semibold mb-3">Quantity</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-gray-600 hover:border-gray-400 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-lg sm:text-xl font-semibold w-6 sm:w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-gray-600 hover:border-gray-400 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={() => {
                    if (!selectedSize) {
                      alert("Please select a size")
                      return
                    }

                    const productToAdd = {
                      ...product,
                      selectedSize,
                      selectedColor,
                      quantity,
                    }

                    // Add multiple quantities if selected
                    for (let i = 0; i < quantity; i++) {
                      addToCart(productToAdd)
                    }

                    // Reset quantity after adding
                    setQuantity(1)

                    // Show success feedback
                    alert(`Added ${quantity} ${product.name} to cart!`)
                  }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 sm:py-4 text-base sm:text-lg mb-6"
                >
                  Add to Cart - {product.price}
                </Button>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">SKU:</span>
                        <span className="text-white">{product.sku}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Weight:</span>
                        <span className="text-white">{product.weight}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-white capitalize">{product.category.replace("-", " ")}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Dimensions:</span>
                        <span className="text-white">
                          {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Min Order:</span>
                        <span className="text-white">{product.minimumOrderQuantity} piece(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Brand:</span>
                        <span className="text-white">{product.brand}</span>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-base font-semibold mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-900/50 rounded-lg">
                    <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Shipping</p>
                      <p className="text-xs sm:text-sm text-gray-400">{product.shippingInformation}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-900/50 rounded-lg">
                    <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Returns</p>
                      <p className="text-xs sm:text-sm text-gray-400">{product.returnPolicy}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-900/50 rounded-lg">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Warranty</p>
                      <p className="text-xs sm:text-sm text-gray-400">{product.warrantyInformation}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center space-x-4">
                    <span
                      className={`text-sm font-semibold ${product.stock > 10 ? "text-green-400" : product.stock > 0 ? "text-yellow-400" : "text-red-400"}`}
                    >
                      {product.availabilityStatus}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {product.stock > 0 ? `${product.stock} items left` : "Out of stock"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section ref={reviewsRef} className="py-12 sm:py-16 px-3 sm:px-4 bg-gray-900/30">
          <div className="container mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {productReviews.map((review, index) => (
                <Card key={index} className="review-item bg-gray-900/50 border-gray-800 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-sm sm:text-base">{review.name}</h4>
                    <span className="text-xs sm:text-sm text-gray-400">{review.date}</span>
                  </div>
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating ? "fill-orange-400 text-orange-400" : "text-gray-400"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base">{review.comment}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
