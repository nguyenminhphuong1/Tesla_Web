import { Link, useParams } from "react-router-dom"
import "../styles/components.css"
import blogsData from "../data/blogs.json"

interface Blog {
  id: number
  title: string
  slug: string
  thumbnail: string
  content: string
  author: string
  createdAt: string
  isFeatured: boolean
}

const blogs = blogsData as Blog[]

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()
  const blog = blogs.find((p) => p.slug === slug)

  if (!blog) {
    return <div>Bài viết không tồn tại</div>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <main className="blog-detail-container">
      <nav className="breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span>/</span>
        <Link to="/blog">Bài viết</Link>
        <span>/</span>
        <span>{blog.title}</span>
      </nav>

      <article className="blog-detail-container">
        <header className="blog-detail-header">
          <h1 className="blog-detail-title">{blog.title}</h1>
          <div className="blog-detail-meta">
            <span className="blog-author">Tác giả: {blog.author}</span>
            <time className="blog-detail-date" dateTime={blog.createdAt}>
              {formatDate(blog.createdAt)}
            </time>
          </div>
        </header>

        <div className="blog-detail-thumbnail">
          <img src={blog.thumbnail || "/placeholder.svg"} alt={blog.title} />
        </div>

        <div className="blog-detail-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </article>

      <nav className="blog-navigation">
        <Link to="/blog" className="back-to-list">
          ← Quay lại danh sách bài viết
        </Link>
      </nav>
    </main>
  )
}
