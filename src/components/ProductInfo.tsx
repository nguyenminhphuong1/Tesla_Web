import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ProductCard } from "./ProductCard"
import productsData from "../data/products.json"
import type { Brand, Category, Product } from "../types/products"

// Sử dụng dữ liệu từ file JSON
const mockBrands: Brand[] = productsData.brands

// Export để các component khác có thể sử dụng
export { mockBrands }

export default function ProductInfo() {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  // Tạo all brands và all categories
  const allBrands = { id: "all", name: t('product.all_brands'), categories: [] }
  const allCategories = { id: "all", name: t('product.all_categories'), products: [] }

  // Lấy tất cả sản phẩm từ tất cả hãng
  const getAllProducts = () => {
    const allProducts: Product[] = []
    mockBrands.forEach(brand => {
      brand.categories.forEach(category => {
        allProducts.push(...category.products)
      })
    })
    return allProducts
  }

  // Lấy tất cả danh mục từ tất cả hãng (gộp các danh mục trùng tên)
  const getAllCategories = () => {
    const categoryMap = new Map<string, Category>()
    
    mockBrands.forEach(brand => {
      brand.categories.forEach(category => {
        if (categoryMap.has(category.name)) {
          // Nếu danh mục đã tồn tại, gộp sản phẩm
          const existingCategory = categoryMap.get(category.name)!
          existingCategory.products.push(...category.products)
        } else {
          // Nếu danh mục chưa tồn tại, tạo mới
          categoryMap.set(category.name, {
            id: category.name, // Sử dụng name làm id để gộp
            name: category.name,
            products: [...category.products]
          })
        }
      })
    })
    
    return Array.from(categoryMap.values())
  }

  const allCategoriesList = useMemo(() => getAllCategories(), [])

  // Đồng bộ selectedCategory theo query ?category=
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const categoryQuery = params.get('category')
    if (!categoryQuery) {
      return
    }
    const found = allCategoriesList.find(c => c.name.toLowerCase() === categoryQuery.toLowerCase())
    if (found) {
      setSelectedBrand(null)
      setSelectedCategory(found)
    }
  }, [location.search, allCategoriesList])

  // Lấy sản phẩm dựa trên brand và category được chọn (đã sắp xếp theo tên)
  const getCurrentProducts = () => {
    let products: Product[] = []

    if (!selectedBrand || selectedBrand.id === "all") {
      if (!selectedCategory || selectedCategory.id === "all") {
        products = getAllProducts()
      } else {
        // Lấy sản phẩm từ category cụ thể trong tất cả hãng
        mockBrands.forEach(brand => {
          brand.categories.forEach(category => {
            if (category.name === selectedCategory.name) {
              products.push(...category.products)
            }
          })
        })
      }
    } else {
      if (!selectedCategory || selectedCategory.id === "all") {
        // Lấy tất cả sản phẩm từ brand cụ thể
        selectedBrand.categories.forEach(category => {
          products.push(...category.products)
        })
      } else {
        // Lấy sản phẩm từ brand và category cụ thể
        products = selectedCategory.products
      }
    }

    // return products.slice().sort((a, b) => a.name.localeCompare(b.name, 'vi', { numeric: true, sensitivity: 'base' }))
    return products.slice()
  }

  const handleBrandChange = (brand: Brand | null) => {
    setSelectedBrand(brand)
    setSelectedCategory(null)
  }

  const handleCategoryChange = (category: Category | null) => {
    setSelectedCategory(category)
  }

  const handleViewDetails = (product: Product) => {
    // Navigate to product detail page
    navigate(`/product/${product.id}`)
  }

  return (
    <div className="product-info-container">
      {/* Brand Tabs */}
      <div className="brand-tabs">
        <div className="brand-tabs-wrapper">
          {/* All Brands Tab */}
          <button
            onClick={() => handleBrandChange(null)}
            className={`brand-tab ${!selectedBrand ? "active" : "inactive"}`}
          >
            {allBrands.name}
          </button>
          
          {/* Individual Brand Tabs */}
          {mockBrands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => handleBrandChange(brand)}
              className={`brand-tab ${selectedBrand?.id === brand.id ? "active" : "inactive"}`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      <div className="main-layout">
        {/* Category Sidebar */}
        <AnimatePresence mode="wait">
            <motion.div
             key={selectedBrand?.id || 'all'}
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 20 }}
             transition={{ duration: 0.3 }}
             className="category-sidebar"
           >
            <div className="category-sidebar-content">
              <h3 className="category-title">{t('product.categories')}</h3>
              <div className="category-buttons">
                {/* All Categories Tab */}
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`category-button ${!selectedCategory ? "active" : "inactive"}`}
                >
                  {allCategories.name}
                  <span className="category-product-count">
                    {getCurrentProducts().length} {t('product.products')}
                  </span>
                </button>
                
                {/* Individual Category Tabs */}
                {(selectedBrand ? selectedBrand.categories : getAllCategories()).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category)}
                    className={`category-button ${selectedCategory?.id === category.id ? "active" : "inactive"}`}
                  >
                    {category.name}
                                         <span className="category-product-count">
                       {selectedBrand 
                         ? category.products.length 
                         : mockBrands.reduce((total, brand) => {
                             const cat = brand.categories.find(c => c.name === category.name)
                             return total + (cat ? cat.products.length : 0)
                           }, 0)
                       } {t('product.products')}
                     </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Main Content */}
        <div className="main-content">
          {/* Products Grid */}
          <AnimatePresence mode="wait">
                         <motion.div
               key={`${selectedBrand?.id || 'all'}-${selectedCategory?.id || 'all'}`}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.4 }}
             >
              <div className="content-header">
                <h2 className="content-title">
                  {selectedBrand ? selectedBrand.name : allBrands.name} - {selectedCategory ? selectedCategory.name : allCategories.name}
                </h2>
                <p className="content-subtitle">{getCurrentProducts().length} {t('product.products')}</p>
              </div>

              <div className="products-grid">
                {getCurrentProducts().map((product) => (
             
                  <ProductCard product={product} onViewDetails={handleViewDetails} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {getCurrentProducts().length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-state">
              <h3 className="empty-state-title">{t('product.no_products')}</h3>
              <p className="empty-state-description">
                {selectedBrand && selectedCategory 
                  ? t('product.no_products_in_category', { brand: selectedBrand.name, category: selectedCategory.name })
                  : t('product.no_products_found')
                }
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
