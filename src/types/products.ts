export interface ProductDescription {
    line1: string
    line2?: string
}

export interface ProductSpec {
    name: string
    value: string
    unit?: string
}

export interface ProductMainCategory {
    id: string
    name: string
    specs: ProductSpec[]
}

export interface Product {
    id: string
    name: string
    image: string
    description?: ProductDescription
    detail?: string
    mainCategories: ProductMainCategory[]
}
  
export interface Category {
    id: string
    name: string
    products: Product[]
}
  
export interface Brand {
    id: string
    name: string
    categories: Category[]
}

export interface ProductsData {
    brands: Brand[]
}
