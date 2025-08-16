# Nike E-commerce Store

A modern, responsive e-commerce website built with Next.js, featuring a complete shopping experience with product browsing, cart management, and order processing.

## 🚀 Features

### Core Functionality
- **Product Catalog**: Browse shoes from multiple categories (Men's, Women's, Sports)
- **Product Search**: Real-time search across product names, brands, categories, and tags
- **Product Details**: Comprehensive product pages with images, specifications, and reviews
- **Shopping Cart**: Add/remove items, quantity management, and persistent cart state
- **Checkout Process**: Complete order flow with customer details and payment processing
- **Order Management**: Order confirmation and tracking system

### Technical Features
- **Responsive Design**: Mobile-first approach with optimized layouts for all devices
- **Real-time Data**: Integration with DummyJSON API for dynamic product data
- **Database Integration**: Supabase for order storage and management
- **Modern UI**: Clean, Nike-inspired design with smooth animations
- **Currency Support**: INR pricing with proper formatting
- **Performance Optimized**: Fast loading with efficient data fetching

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript/JavaScript
- **Styling**: Tailwind CSS, Custom CSS animations
- **Database**: Supabase (PostgreSQL)
- **API**: DummyJSON for product data
- **Icons**: Lucide React, Custom SVG icons
- **Animations**: GSAP, CSS transitions
- **State Management**: React Context API
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd nike-ecommerce-store
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

4. **Set up Supabase database**
   Run the SQL scripts in the `scripts/` folder to create the necessary tables:
   - `create_orders_tables.sql`
   - `create_user_profiles_table_v3.sql`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

\`\`\`
├── app/
│   ├── checkout/          # Checkout page
│   ├── order-confirmed/   # Order confirmation
│   ├── orders/           # Order management
│   ├── payment/          # Payment processing
│   ├── product/[id]/     # Dynamic product pages
│   ├── profile/          # User profile (if auth enabled)
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.jsx          # Homepage
├── components/
│   ├── ui/               # Reusable UI components
│   ├── AuthModal.jsx     # Authentication modal
│   ├── CartDropdown.jsx  # Shopping cart dropdown
│   └── ProfileDropdown.jsx # User profile dropdown
├── contexts/
│   └── CartContext.jsx   # Shopping cart state management
├── lib/
│   ├── supabase/         # Supabase client configuration
│   ├── actions.jsx       # Server actions
│   └── utils.ts          # Utility functions
├── scripts/
│   └── *.sql            # Database setup scripts
└── public/
    └── *.png            # Static assets and product images
\`\`\`

## 🔧 Configuration

### API Integration
The project uses DummyJSON API for product data:
- **Mens Shoes**: `https://dummyjson.com/products/category/mens-shoes`
- **Womens Shoes**: `https://dummyjson.com/products/category/womens-shoes`
- **Sports Accessories**: `https://dummyjson.com/products/category/sports-accessories`

### Database Schema
The Supabase database includes:
- `orders` table for order information
- `order_items` table for individual order items
- `user_profiles` table for user data (if authentication is enabled)

## 🎨 Design System

### Colors
- **Primary**: Orange (#f97316) - Nike brand color
- **Secondary**: Black (#000000) - Text and accents
- **Background**: White (#ffffff) - Clean, minimal background
- **Accent**: Gray variants for subtle elements

### Typography
- **Headings**: Bold, modern sans-serif
- **Body**: Clean, readable font with proper line spacing
- **Mobile**: Responsive font scaling for all devices

### Layout
- **Mobile-first**: Designed for mobile, enhanced for desktop
- **Grid System**: Responsive product grids
- **Spacing**: Consistent spacing using Tailwind utilities

## 🚀 Usage

### Adding Products to Cart
1. Browse products on the homepage
2. Use the search bar to find specific items
3. Click "View Details" to see product information
4. Select size and color (on product detail page)
5. Click "Add to Cart"

### Checkout Process
1. Click the cart icon to view cart items
2. Click "Checkout" to proceed to checkout
3. Fill in customer details
4. Proceed to payment
5. Complete order and receive confirmation

### Search Functionality
- Search by product name, brand, or category
- Real-time filtering as you type
- Clear search to reset results

## 🔄 API Endpoints

### DummyJSON Integration
- `GET /products/category/{category}` - Fetch products by category
- `GET /products/{id}` - Fetch individual product details
- `GET /products/search?q={query}` - Search products

### Internal API Routes
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **DummyJSON** for providing the product API
- **Supabase** for database and backend services
- **Nike** for design inspiration
- **Tailwind CSS** for the utility-first CSS framework
- **Next.js** for the React framework

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using Next.js and modern web technologies.
# nike-store
