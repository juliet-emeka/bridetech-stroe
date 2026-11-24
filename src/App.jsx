import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import { PlaceholderPage } from './components/common'
import AdminRoute from './components/admin/AdminRoute'
import AdminLayout from './components/admin/AdminLayout'
import Home from './pages/Home/Home'
import Categories from './pages/Shop/Categories'
import Shop from './pages/Shop/Shop'
import ProductDetails from './pages/ProductDetails/ProductDetails'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import FAQ from './pages/FAQ/FAQ'
import Delivery from './pages/Delivery/Delivery'
import Returns from './pages/Returns/Returns'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminProducts from './pages/Admin/AdminProducts'
import AdminCategories from './pages/Admin/AdminCategories'
import AdminOrders from './pages/Admin/AdminOrders'
import AdminPromotions from './pages/Admin/AdminPromotions'
import AdminReviews from './pages/Admin/AdminReviews'
import AdminReports from './pages/Admin/AdminReports'

export default function App() {
  return (
    <Routes>
      <Route path="admin/login" element={<AdminLogin />} />
      <Route
        path="admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="promotions" element={<AdminPromotions />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="categories" element={<Categories />} />
        <Route path="product/:slug" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="delivery" element={<Delivery />} />
        <Route path="returns" element={<Returns />} />
        <Route
          path="*"
          element={
            <PlaceholderPage
              title="Page Not Found"
              description="The page you are looking for does not exist."
            />
          }
        />
      </Route>
    </Routes>
  )
}
