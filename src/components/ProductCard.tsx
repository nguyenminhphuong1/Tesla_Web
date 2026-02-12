import type React from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import type { Product } from "../types/products"

interface ProductCardProps {
  product: Product
  onViewDetails: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { t } = useTranslation()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      className="product-card"
    >
      <div className="product-image-container">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-image" />
      </div>
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        {product.description?.line1 && (
          <p className="product-description">{product.description.line1}</p>
        )}
        {product.description?.line2 && (
          <p className="product-description">{product.description.line2}</p>
        )}
        <button onClick={() => onViewDetails(product)} className="product-button">
          {t('product.view_details')}
        </button>
      </div>
    </motion.div>
  )
}
