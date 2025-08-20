"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart, ChevronDown, Star, Search } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/CartContext"
import CartDropdown from "@/components/CartDropdown"

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const headerRef = useRef(null)
  const heroRef = useRef(null)
  const scrollArrowRef = useRef(null)
  const productsRef = useRef(null)
  const lifestyleRef = useRef(null)
  const reviewsRef = useRef(null)
  const footerRef = useRef(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { getTotalItems, addToCart } = useCart()

  useEffect(() => {
    const fetchShoesData = async () => {
      try {
        setLoading(true)

        const [mensResponse, womensResponse, sportsResponse, sneakersResponse] = await Promise.all([
          fetch("https://dummyjson.com/products/category/mens-shoes"),
          fetch("https://dummyjson.com/products/category/womens-shoes"),
          fetch("https://dummyjson.com/products/category/sports-accessories"),
          fetch("https://dummyjson.com/products/search?q=sneakers&limit=20"),
        ])

        const mensData = await mensResponse.json()
        const womensData = await womensResponse.json()
        const sportsData = await sportsResponse.json()
        const sneakersData = await sneakersResponse.json()

        const allShoes = [
          ...mensData.products.map((product) => ({ ...product, categoryLabel: "Men's Shoes" })),
          ...womensData.products.map((product) => ({ ...product, categoryLabel: "Women's Shoes" })),
          ...sportsData.products
            .filter(
              (product) =>
                product.title.toLowerCase().includes("shoe") ||
                product.title.toLowerCase().includes("sneaker") ||
                product.title.toLowerCase().includes("boot"),
            )
            .map((product) => ({ ...product, categoryLabel: "Sports Shoes" })),
          ...sneakersData.products.map((product) => ({ ...product, categoryLabel: "Sneakers" })),
        ].map((product) => ({
          id: product.id,
          name: product.title,
          price: `₹${Math.round(product.price * 83)}`,
          originalPrice: product.price,
          image: product.thumbnail,
          images: product.images,
          description: product.description,
          brand: product.brand,
          category: product.category,
          categoryLabel: product.categoryLabel,
          rating: product.rating,
          stock: product.stock,
          discountPercentage: product.discountPercentage,
          tags: product.tags || [],
        }))

        const uniqueShoes = allShoes
          .filter((product, index, self) => index === self.findIndex((p) => p.id === product.id))
          .slice(0, 24)

        setProducts(uniqueShoes)
        setError(null)
      } catch (err) {
        console.error("Error fetching shoes data:", err)
        setError("Failed to load products. Please try again later.")
        setProducts([
          {
            id: 1,
            name: "Air Max 90",
            price: "₹9,999",
            image: "/white-sneaker.png",
            categoryLabel: "Men's Shoes",
            brand: "Nike",
          },
          {
            id: 2,
            name: "Air Force 1",
            price: "₹8,999",
            image: "/nike-air-force-1-black.png",
            categoryLabel: "Men's Shoes",
            brand: "Nike",
          },
          {
            id: 3,
            name: "React Infinity",
            price: "₹12,999",
            image: "/nike-react-infinity.png",
            categoryLabel: "Women's Shoes",
            brand: "Nike",
          },
          {
            id: 4,
            name: "Dunk Low",
            price: "₹7,999",
            image: "/nike-dunk-low-skateboard-shoe.png",
            categoryLabel: "Sneakers",
            brand: "Nike",
          },
          {
            id: 5,
            name: "Blazer Mid",
            price: "₹7,999",
            image: "/placeholder-ieuv0.png",
            categoryLabel: "Sports Shoes",
            brand: "Nike",
          },
          {
            id: 6,
            name: "Air Jordan 1",
            price: "₹13,999",
            image: "/air-jordan-1-red-black.png",
            categoryLabel: "Sneakers",
            brand: "Nike",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchShoesData()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" })

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          const progress = self.progress
          gsap.to(headerRef.current, {
            scale: 1 - progress * 0.05,
            duration: 0.3,
          })
        },
      })

      gsap.to(scrollArrowRef.current, {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      })

      gsap.fromTo(
        ".product-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: productsRef.current,
            start: "top 80%",
            end: "bottom 20%",
          },
        },
      )

      gsap.fromTo(
        ".lifestyle-title",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: lifestyleRef.current,
            start: "top 70%",
          },
        },
      )

      gsap.fromTo(
        ".feature-block",
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.3,
          scrollTrigger: {
            trigger: lifestyleRef.current,
            start: "top 60%",
          },
        },
      )

      gsap.fromTo(
        ".review-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: reviewsRef.current,
            start: "top 75%",
          },
        },
      )

      gsap.fromTo(
        footerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  const filteredProducts = products.filter((product) => {
    const searchTerm = searchQuery.toLowerCase()
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
      (product.category && product.category.toLowerCase().includes(searchTerm)) ||
      (product.categoryLabel && product.categoryLabel.toLowerCase().includes(searchTerm)) ||
      (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
    )
  })

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  const reviews = [
    {
      name: "Sarah Johnson",
      avatar: "/professional-woman-profile.png",
      quote: "Best shoes I've ever owned! The comfort is unmatched.",
      rating: 5,
    },
    {
      name: "Mike Chen",
      avatar: "/professional-man-profile.png",
      quote: "Perfect for my daily runs. Great quality and style.",
      rating: 5,
    },
    {
      name: "Emma Davis",
      avatar: "/young-woman-profile.png",
      quote: "Love the design and they're so comfortable for work.",
      rating: 5,
    },
    {
      name: "Alex Rodriguez",
      avatar: "/placeholder-q75xs.png",
      quote: "Nike never disappoints. These are my go-to shoes now.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Sticky Header */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/10"
      >
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wider">
              <span className="bg-gradient-to-r from-white via-orange-400 to-white bg-clip-text text-transparent drop-shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                NIKE
              </span>
            </div>
          </div>

          <nav className="hidden md:flex space-x-4 lg:space-x-8">
            <button
              onClick={() => scrollToSection(heroRef)}
              className="text-white/90 hover:text-orange-400 transition-colors duration-300 font-medium text-sm lg:text-base"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection(productsRef)}
              className="text-white/90 hover:text-orange-400 transition-colors duration-300 font-medium text-sm lg:text-base"
            >
              Shop
            </button>
            <button
              onClick={() => scrollToSection(lifestyleRef)}
              className="text-white/90 hover:text-orange-400 transition-colors duration-300 font-medium text-sm lg:text-base"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection(footerRef)}
              className="text-white/90 hover:text-orange-400 transition-colors duration-300 font-medium text-sm lg:text-base"
            >
              Contact
            </button>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search shoes, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300 w-40 sm:w-48 lg:w-56"
              />
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-1 sm:space-x-2 hover:text-orange-400 transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {getTotalItems() > 0 && (
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-black text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold shadow-lg">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Hero Section */}
      <section ref={heroRef} className="h-screen relative">
        <iframe
          src="https://my.spline.design/nikeairmax90celebrationwithmousehover-hXLBgqCWORaNHugmIQCe4Gw5/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="absolute inset-0"
        />

        <div
          ref={scrollArrowRef}
          className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 cursor-pointer z-10 text-center"
        >
          <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
          <p className="text-xs sm:text-sm mt-2">Scroll Down</p>
        </div>
      </section>

      {/* Products Section */}
      <section ref={productsRef} className="py-12 sm:py-16 md:py-20 px-3 sm:px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16 bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
            Latest Drops
          </h2>

          <div className="sm:hidden mb-6 sm:mb-8 flex justify-center px-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search shoes, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300"
              />
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
              <p className="text-gray-400 mt-4">Loading amazing shoes...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} className="bg-orange-500 hover:bg-orange-600 text-black">
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="product-card bg-gray-900/50 border-gray-800 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="p-4 sm:p-6">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg mb-4"
                    />
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold">{product.name}</h3>
                      {product.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                          <span className="text-sm text-gray-300">{product.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      {product.brand && <p className="text-sm text-gray-400">{product.brand}</p>}
                      {product.categoryLabel && (
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                          {product.categoryLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-orange-400 mb-4">{product.price}</p>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Link href={`/product/${product.id}`} className="flex-1">
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold text-sm sm:text-base py-2 sm:py-3">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        variant="outline"
                        className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black text-sm sm:text-base py-2 sm:py-3"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-base sm:text-lg">No shoes found matching "{searchQuery}"</p>
              <p className="text-gray-500 text-sm mt-2">Try searching for brands like Nike, Adidas, or shoe types</p>
              <Button
                onClick={() => setSearchQuery("")}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-black text-sm sm:text-base"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Lifestyle Section */}
      <section
        ref={lifestyleRef}
        className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 relative bg-gradient-to-r from-gray-900 to-black"
        style={{
          backgroundImage: "url('/athletic-runner-motion.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="container mx-auto text-center">
          <h2 className="lifestyle-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-12 sm:mb-16 text-white drop-shadow-2xl">
            Engineered for Movement
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="feature-block backdrop-blur-md bg-white/10 p-6 sm:p-8 rounded-xl border border-white/20">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-orange-400">Built for Speed</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Advanced cushioning and lightweight materials for maximum performance.
              </p>
            </div>

            <div className="feature-block backdrop-blur-md bg-white/10 p-6 sm:p-8 rounded-xl border border-white/20">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-orange-400">Trusted by Athletes</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Worn by professionals worldwide, tested in the most demanding conditions.
              </p>
            </div>

            <div className="feature-block backdrop-blur-md bg-white/10 p-6 sm:p-8 rounded-xl border border-white/20">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-orange-400">Everyday Comfort</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                From morning jogs to evening walks, comfort that lasts all day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section
        ref={reviewsRef}
        className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-gradient-to-b from-black to-gray-900"
      >
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16 bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
            What People Are Saying
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {reviews.map((review, index) => (
              <Card
                key={index}
                className="review-card backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="p-4 sm:p-6 text-center">
                  <img
                    src={review.avatar || "/placeholder.svg"}
                    alt={review.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-4 border-2 border-orange-400"
                  />
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">{review.name}</h4>
                  <div className="flex justify-center mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm italic">"{review.quote}"</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer ref={footerRef} className="bg-black border-t border-gray-800 py-8 sm:py-12 px-3 sm:px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 md:col-span-1">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
                NIKE
              </h3>
              <p className="text-gray-400 mb-4 text-sm sm:text-base">Just Do It.</p>
              <p className="text-gray-500 text-xs sm:text-sm">
                Bringing inspiration and innovation to every athlete in the world.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-orange-400 text-sm sm:text-base">Shop</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors duration-300">
                    Men
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors duration-300">
                    Women
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors duration-300">
                    Kids
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors duration-300">
                    Sale
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-orange-400 text-sm sm:text-base">Help</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors duration-300">
                    Size Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors duration-300">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors duration-300">
                    Shipping
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors duration-300">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-orange-400 text-sm sm:text-base">Follow Us</h4>
              <div className="flex space-x-3 sm:space-x-4 mb-4">
                <a
                  href="https://instagram.com/nike"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-full bg-gray-800 hover:bg-orange-500 transition-all duration-300"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-black transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.948 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com/nike"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-full bg-gray-800 hover:bg-orange-500 transition-all duration-300"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-black transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com/nike"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-full bg-gray-800 hover:bg-orange-500 transition-all duration-300"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-black transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com/nike"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-full bg-gray-800 hover:bg-orange-500 transition-all duration-300"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-black transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm">Stay connected with Nike</p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-sm sm:text-base">&copy; 2024 Nike, Inc. All rights reserved.</p>
            <p className="text-xs sm:text-sm mt-2 text-gray-500">Privacy Policy | Terms of Service | Cookie Settings</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
