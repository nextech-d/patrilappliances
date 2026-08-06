import { Navigate, Route, Routes } from "react-router-dom";
import { getToken } from "./lib/api";
import Shell from "./components/Shell";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import ProductEditPage from "./pages/ProductEditPage";
import ProductCreatedPage from "./pages/ProductCreatedPage";
import BrandCreatedPage from "./pages/BrandCreatedPage";
import CategoryCreatedPage from "./pages/CategoryCreatedPage";
import SubcategoryCreatedPage from "./pages/SubcategoryCreatedPage";
import BrandsPage from "./pages/BrandsPage";
import BrandEditPage from "./pages/BrandEditPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryEditPage from "./pages/CategoryEditPage";
import SubcategoryEditPage from "./pages/SubcategoryEditPage";

function ProtectedLayout() {
  if (!getToken()) return <Navigate to="/login" replace />;
  return <Shell />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<ProductEditPage />} />
        <Route path="products/:id/created" element={<ProductCreatedPage />} />
        <Route path="products/:id/edit" element={<ProductEditPage />} />
        <Route path="brands" element={<BrandsPage />} />
        <Route path="brands/new" element={<BrandEditPage />} />
        <Route path="brands/:id/created" element={<BrandCreatedPage />} />
        <Route path="brands/:id/edit" element={<BrandEditPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="categories/new" element={<CategoryEditPage />} />
        <Route path="categories/:id/created" element={<CategoryCreatedPage />} />
        <Route path="categories/:id/edit" element={<CategoryEditPage />} />
        <Route path="subcategories/new" element={<SubcategoryEditPage />} />
        <Route path="subcategories/:id/created" element={<SubcategoryCreatedPage />} />
        <Route path="subcategories/:id/edit" element={<SubcategoryEditPage />} />
      </Route>
    </Routes>
  );
}
