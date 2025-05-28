import React, { useState, useEffect, useRef } from 'react'
import './LandingPage.css'

const HalimuyakLanding = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [hasScrolled, setHasScrolled] = useState(false)
  const [gradientAngle, setGradientAngle] = useState(135)

  useEffect(() => {
    // Custom cursor tracking
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
      
      // Create trail effect
      const trail = document.createElement('div')
      trail.className = 'cursor-trail'
      trail.style.left = e.clientX + 'px'
      trail.style.top = e.clientY + 'px'
      document.body.appendChild(trail)
      
      setTimeout(() => {
        trail.remove()
      }, 500)
    }

    // Scroll handling
    const handleScroll = () => {
      if (!hasScrolled && window.pageYOffset > 100) {
        setHasScrolled(true)
      }

      // Parallax effect for floating bottles
      const scrolled = window.pageYOffset
      const bottles = document.querySelectorAll('.floating-bottle')
      
      bottles.forEach((bottle, index) => {
        const speed = 0.5 + (index * 0.1)
        bottle.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`
      });
    };

    // Create particles
    const createParticle = () => {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = Math.random() * 100 + 'vw'
      particle.style.animationDuration = (Math.random() * 20 + 10) + 's'
      particle.style.animationDelay = Math.random() * 5 + 's'
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove()
      }, 25000)
    };

    // Dynamic background gradient
    const gradientInterval = setInterval(() => {
      setGradientAngle(prev => prev + 0.5)
    }, 100)

    const particleInterval = setInterval(createParticle, 3000)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('scroll', handleScroll)

    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1'
          entry.target.style.transform = 'translateY(0)'
        }
      })
    }, observerOptions)

    // Observe elements for scroll animations
    setTimeout(() => {
      document.querySelectorAll('.feature-card, .stat-item, .testimonial-card, .team-member, .faq-item').forEach(el => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(30px)'
        el.style.transition = 'all 0.6s ease'
        observer.observe(el)
      })
    }, 100)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('scroll', handleScroll)
      clearInterval(gradientInterval)
      clearInterval(particleInterval)
    }
  }, [hasScrolled])

  return (
    <div className='halimuyak-landing' style={{ background: `linear-gradient(${gradientAngle}deg, rgb(219, 230, 255) 0%, rgb(219, 255, 234) 50%, rgb(255, 245, 189) 100%)` }}>
      {/* Custom Cursor */}
      <div 
        className="cursor" 
        style={{ 
          left: cursorPosition.x + 'px', 
          top: cursorPosition.y + 'px' 
        }}
      ></div>

      {/* Navigation */}
      <nav>
        <div className="nav-container">
          <div className="logo">Halimuyak</div>
          <ul className="nav-links">
            <li><a href="#discover">Discover</a></li>
            <li><a href="#community">Community</a></li>
            <li><a href="#reviews">Reviews</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Halimuyak</h1>
          <p className="hero-subtitle">
            Discover the perfect Filipino fragrance inspired by your favorite international scents. 
            Connect, compare, and find your signature scent in the Philippines' premier fragrance community.
          </p>
          <a href="#" className="cta-button">Explore Fragrances</a>
        </div>
        
        {/* Floating Bottles */}
        <div className="floating-bottle bottle-1"></div>
        <div className="floating-bottle bottle-2"></div>
        <div className="floating-bottle bottle-3"></div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="section-title">Why Fragheads Choose Halimuyak</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Smart Discovery</h3>
              <p className="feature-description">
                Search any international fragrance and instantly find all Filipino-inspired alternatives. 
                From Creed Aventus to Tom Ford, discover local gems that capture the essence at accessible prices.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3 className="feature-title">Verified Reviews</h3>
              <p className="feature-description">
                Real reviews from Filipino fragrance enthusiasts, complete with longevity tests, 
                projection ratings, and honest comparisons to the original fragrances.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎬</div>
              <h3 className="feature-title">TikTok Integration</h3>
              <p className="feature-description">
                Watch curated video reviews from top Filipino fragrance influencers. 
                Get the real scoop on performance, value, and authenticity from trusted local voices.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🛒</div>
              <h3 className="feature-title">Direct Shopping</h3>
              <p className="feature-description">
                Seamless links to Shopee and Lazada for instant purchasing. 
                Compare prices across platforms and find the best deals on your favorite local fragrances.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">Fraghead Community</h3>
              <p className="feature-description">
                Join discussions with fellow Filipino fragrance lovers. Share discoveries, 
                ask for recommendations, and connect with people who share your passion for scents.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Performance Analytics</h3>
              <p className="feature-description">
                Detailed performance metrics including longevity, projection, and similarity ratings 
                to help you make informed fragrance decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Local Fragrances</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Verified Reviews</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">TikTok Influencers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Fragheads</span>
          </div>
        </div>
      </section>

      {/* NEW: Testimonials Section */}
      <section className="testimonials">
        <div className="testimonials-container">
          <h2 className="section-title">What Fragheads Are Saying</h2>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p className="testimonial-text">
                  "Finally found a local version of Creed Aventus that actually performs! 
                  Halimuyak helped me discover Penshoppe's version - 8 hours longevity at 1/10 the price."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">🧔</div>
                  <div className="author-info">
                    <h4>Miguel Santos</h4>
                    <span>Fragrance Collector</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p className="testimonial-text">
                  "The TikTok reviews are so helpful! Watched 5 different influencers review the same fragrance 
                  before buying. No regrets - it's exactly what I expected."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">👩</div>
                  <div className="author-info">
                    <h4>Sarah Cruz</h4>
                    <span>Beauty Enthusiast</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p className="testimonial-text">
                  "Best fragrance community in the Philippines! The discussions are so detailed and everyone 
                  is willing to help newbies like me find their signature scent."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">👨</div>
                  <div className="author-info">
                    <h4>James Reyes</h4>
                    <span>Fragrance Newbie</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: How It Works Section */}
      <section className="how-it-works">
        <div className="how-it-works-container">
          <h2 className="section-title">How Halimuyak Works</h2>
          
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Search & Discover</h3>
                <p className="step-description">
                  Enter any international fragrance name and instantly see all Filipino alternatives 
                  with detailed comparisons and similarity ratings.
                </p>
              </div>
            </div>

            <div className="step-connector"></div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Watch & Learn</h3>
                <p className="step-description">
                  Watch curated TikTok reviews from trusted Filipino influencers to get real insights 
                  on performance, longevity, and value.
                </p>
              </div>
            </div>

            <div className="step-connector"></div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Compare & Choose</h3>
                <p className="step-description">
                  Use our performance analytics and community reviews to make informed decisions 
                  about which local fragrance suits you best.
                </p>
              </div>
            </div>

            <div className="step-connector"></div>

            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3 className="step-title">Shop & Enjoy</h3>
                <p className="step-description">
                  Purchase directly through Shopee or Lazada links with price comparisons 
                  and join our community to share your experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Featured Brands Section */}
      <section className="featured-brands">
        <div className="featured-brands-container">
          <h2 className="section-title">Featured Filipino Fragrance Brands</h2>
          
          <div className="brands-grid">
            <div className="brand-card">
              <div className="brand-logo">💎</div>
              <h3 className="brand-name">Symmetry Labs</h3>
              <p className="brand-description">Premium designer-inspired fragrances with exceptional longevity and amazing juice quality</p>
              <div className="brand-stats">
                <span className="brand-stat">50+ Fragrances</span>
                <span className="brand-rating">4.8⭐</span>
              </div>
            </div>

            <div className="brand-card">
              <div className="brand-logo">🌟</div>
              <h3 className="brand-name">Father & Son</h3>
              <p className="brand-description">Affordable luxury scents inspired by high-end fragrances</p>
              <div className="brand-stats">
                <span className="brand-stat">30+ Fragrances</span>
                <span className="brand-rating">4.6⭐</span>
              </div>
            </div>

            <div className="brand-card">
              <div className="brand-logo">⚡</div>
              <h3 className="brand-name">Online Exclusives</h3>
              <p className="brand-description">Shopee and Lazada exclusive brands with great value</p>
              <div className="brand-stats">
                <span className="brand-stat">200+ Fragrances</span>
                <span className="brand-rating">4.5⭐</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: FAQ Section */}
      <section className="faq">
        <div className="faq-container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">How accurate are the fragrance comparisons?</h3>
              <p className="faq-answer">
                Our comparisons are based on community reviews, scent profiles, and performance data. 
                We use a 1-10 similarity scale with detailed notes breakdown to help you find the closest match.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Are the TikTok reviews genuine?</h3>
              <p className="faq-answer">
                Yes! We partner only with verified Filipino fragrance influencers who purchase and test fragrances 
                independently. All reviews include honest pros and cons.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Can I return fragrances if I don't like them?</h3>
              <p className="faq-answer">
                Return policies depend on the seller (Shopee/Lazada stores). We provide detailed reviews 
                and performance data to help you make informed decisions before purchasing.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">How do you verify review authenticity?</h3>
              <p className="faq-answer">
                All reviews require photo proof of purchase and detailed performance testing over 24-48 hours. 
                Our community moderators verify reviews before publication.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Is the platform free to use?</h3>
              <p className="faq-answer">
                Yes! Halimuyak is completely free. We earn through affiliate commissions when you purchase 
                through our partner links, but this doesn't affect the prices you pay.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">How often are new fragrances added?</h3>
              <p className="faq-answer">
                We add 10-20 new Filipino fragrances weekly as they become available. 
                Our community also suggests new discoveries through our submission system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Badge */}
      <div className="coming-soon">LAUNCHING SOON</div>

      {/* Scroll Indicator */}
      {!hasScrolled && <div className="scroll-indicator"></div>}
    </div>
  )
}

export default HalimuyakLanding