import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import blogsData from "../data/blogs.json"
import "../styles/components.css"

interface BlogItem {
  id: number
  title: string
  slug: string
  thumbnail: string
}

export default function BlogCarousel() {
  const posts = useMemo(() => (blogsData as BlogItem[]), [])
  const [index, setIndex] = useState(0)

  const total = posts.length
  const current = posts.length > 0 ? posts[index % total] : undefined
  const prev = posts.length > 0 ? posts[(index - 1 + total) % total] : undefined
  const next = posts.length > 0 ? posts[(index + 1) % total] : undefined

  const handlePrev = () => setIndex((i) => (i - 1 + total) % total)
  const handleNext = () => setIndex((i) => (i + 1) % total)

  if (!current || !prev || !next) return null

  return (
    <section className="blog-carousel">
      <div className="carousel-track">
        <article className="carousel-item prev">
          <Link to={`/blog/${prev.slug}`} className="blog-link" aria-label={prev.title}>
            <div className="blog-thumbnail">
              <img src={prev.thumbnail || "/placeholder.svg"} alt={prev.title} loading="lazy" />
            </div>
            <div className="blog-content">
              <h3 className="blog-title">{prev.title}</h3>
            </div>
          </Link>
        </article>

        <article className="carousel-item current">
          <Link to={`/blog/${current.slug}`} className="blog-link" aria-label={current.title}>
            <div className="blog-thumbnail">
              <img src={current.thumbnail || "/placeholder.svg"} alt={current.title} loading="lazy" />
            </div>
            <div className="blog-content">
              <h3 className="blog-title">{current.title}</h3>
            </div>
          </Link>
        </article>

        <article className="carousel-item next">
          <Link to={`/blog/${next.slug}`} className="blog-link" aria-label={next.title}>
            <div className="blog-thumbnail">
              <img src={next.thumbnail || "/placeholder.svg"} alt={next.title} loading="lazy" />
            </div>
            <div className="blog-content">
              <h3 className="blog-title">{next.title}</h3>
            </div>
          </Link>
        </article>
      </div>

      <div className="carousel-dots" role="tablist" aria-label="Danh sách bài viết">
        {posts.map((p, i) => (
          <button
            key={p.slug}
            className={`carousel-dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Chuyển đến bài: ${p.title}`}
            aria-current={i === index ? 'true' : 'false'}
            role="tab"
          />
        ))}
      </div>
    </section>
  )
}


