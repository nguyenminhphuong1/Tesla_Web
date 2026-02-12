import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { mockBrands } from "./ProductInfo"
import type { Product } from "../types/products"
import "../styles/components.css"

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>()
  const [activeTab, setActiveTab] = useState<string>("")
  const { t } = useTranslation()
  
  // Tìm sản phẩm từ mockBrands
  let product: Product | null = null
  let brandName = ""
  let categoryName = ""
  
  for (const brand of mockBrands) {
    for (const category of brand.categories) {
      const foundProduct = category.products.find(p => p.id === productId)
      if (foundProduct) {
        product = foundProduct
        brandName = brand.name
        categoryName = category.name
        break
      }
    }
    if (product) break
  }

  // Set active tab mặc định là tab đầu tiên
  useEffect(() => {
    if (product && product.mainCategories.length > 0) {
      setActiveTab(product.mainCategories[0]?.id || "")
    }
  }, [product])

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="error-state">
          <h2>{t('product.not_found')}</h2>
          <Link to="/products" className="back-button">
            ← {t('product.back_to_list')}
          </Link>
        </div>
      </div>
    )
  }

  const activeCategory = product.mainCategories.find(cat => cat.id === activeTab)

  return (
    <div className="product-detail-container">
      {/* Back Button - Góc trái trên */}
      <div className="back-button-top">
        <Link to="/products" className="back-button-icon">
          ←
        </Link>
      </div>

      <div className="product-detail-content">
        {/* Product Header - Hình ảnh + Tiêu đề + Description */}
        <motion.div 
          className="product-detail-header-new"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="product-header-layout">
            <div className="product-header-image">
              <img 
                src={(product.image?.startsWith('/') ? product.image : `/${product.image}`) || '/placeholder.svg'} 
                alt={product.name} 
                className="product-header-img"
              />
            </div>
            <div className="product-header-info">
              <h1 className="product-header-title">{product.name}</h1>
              <p className="product-header-subtitle">{brandName} - {categoryName}</p>
              {product.description && (
                <div className="product-header-description">
                  <p>{product.description.line1}</p>
                  {product.description.line2 && <p>{product.description.line2}</p>}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div 
          className="product-tabs-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="product-tabs">
            {product.mainCategories.map((category) => (
              <button
                key={category.id}
                className={`product-tab ${activeTab === category.id ? 'active' : ''}`}
                onClick={() => setActiveTab(category.id)}
              >
                <span className="tab-name">{category.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeCategory && (
              <div className="category-content">
                <div className="specs-table">
                  <table className="specs-table-content">
                    <tbody>
                      {activeCategory.specs.map((spec, specIndex) => (
                        <motion.tr
                          key={spec.name}
                          className="spec-row"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: specIndex * 0.05 }}
                        >
                          <td className="spec-name-cell">
                            <span className="spec-name">{spec.name}</span>
                          </td>
                          <td className="spec-value-cell">
                            <span className="spec-value">{spec.value}</span>
                            {spec.unit && <span className="spec-unit">{spec.unit}</span>}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Product Detail Summary */}
        {product.detail && (
          <motion.div 
            className="product-detail-summary-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="summary-title">{t('product.description')}</h3>
            <p className="summary-content">{product.detail}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
