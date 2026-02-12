import type React from "react"
import { Link } from "react-router-dom"
import "../styles/components.css"
import blogsData from "../data/blogs.json"
interface Blog {
  id: number
  title: string
  slug: string
  thumbnail: string
  excerpt?: string
  content?: string
  author: string
  createdAt: string
  isFeatured: boolean
}

interface BlogListProps {
  blogs?: Blog[]
  limit?: number
}

const BlogSection: React.FC<BlogListProps> = ({ blogs = [], limit }) => {
  const sourceBlogs = blogs.length > 0 ? blogs : (blogsData as Blog[])
  const displayBlogs = limit ? sourceBlogs.slice(0, limit) : sourceBlogs

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <main className="container">
        <div className="blog-list">
          {displayBlogs.map((blog) => (
            <article key={blog.id} className="blog-item">
              <Link to={`/blog/${blog.slug}`} className="blog-link">
                <div className="blog-thumbnail">
                  <img src={blog.thumbnail || "/placeholder.svg"} alt={blog.title} loading="lazy" />
                </div>
                <div className="blog-content">
                  <h3 className="blog-title">{blog.title}</h3>
                  <time className="blog-date" dateTime={blog.createdAt}>
                    {formatDate(blog.createdAt)}
                  </time>
                </div>
              </Link>
            </article>
          ))}
        </div>

    </main>
  )
}

export default BlogSection
