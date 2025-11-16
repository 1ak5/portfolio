// ============================================
//   LUXE NOIR - Advanced JavaScript
//   Animations, Interactivity, Real Functionality
// ============================================

// GSAP is loaded from CDN, register ScrollTrigger
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============ STATE MANAGEMENT ============

const state = {
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  wishlist: JSON.parse(localStorage.getItem("wishlist")) || [],
  isDarkMode: localStorage.getItem("theme") === "dark" || true,
  products: [
    {
      id: 1,
      name: "Elegance Watch",
      category: "accessories",
      price: 2499,
      originalPrice: 3299,
      rating: 5,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80",
    },
    {
      id: 2,
      name: "Signature Leather Jacket",
      category: "apparel",
      price: 1899,
      originalPrice: 2499,
      rating: 5,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&q=80",
    },
    {
      id: 3,
      name: "Premium Sunglasses",
      category: "accessories",
      price: 899,
      originalPrice: 1299,
      rating: 4,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281fb41?w=400&h=400&fit=crop&q=80",
      fallbackImage: "https://picsum.photos/seed/sunglasses/400/400",
    },
    {
      id: 4,
      name: "Cashmere Coat",
      category: "apparel",
      price: 2199,
      originalPrice: 2999,
      rating: 5,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&q=80",
    },
    {
      id: 5,
      name: "Designer Handbag",
      category: "lifestyle",
      price: 1599,
      originalPrice: 2199,
      rating: 5,
      image: "https://images.unsplash.com/photo-1520974735194-9506d4b2032f?w=400&h=400&fit=crop&q=80",
      fallbackImage: "https://picsum.photos/seed/handbag-luxury/400/400",
    },
    {
      id: 6,
      name: "Silk Scarf Collection",
      category: "accessories",
      price: 399,
      originalPrice: 599,
      rating: 4,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&q=80",
    },
    {
      id: 7,
      name: "Premium Cologne",
      category: "lifestyle",
      price: 249,
      originalPrice: 349,
      rating: 5,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&q=80",
    },
    {
      id: 8,
      name: "Gold Bracelet",
      category: "accessories",
      price: 1299,
      originalPrice: 1799,
      rating: 5,
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop&q=80",
    },
  ],
  testimonials: [
    {
      name: "Alexandra Sterling",
      position: "Fashion Influencer",
      text: "Really solid products. Everything I've bought has been worth it.",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      position: "CEO, Luxury Ventures",
      text: "Good quality stuff. They pay attention to the details that matter.",
      rating: 5,
    },
    {
      name: "Isabella Romano",
      position: "Art Collector",
      text: "Well made products. I'd tell my friends to check them out.",
      rating: 5,
    },
  ],
}

// ============ PRELOADER ============

window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader")
  setTimeout(() => {
    preloader.style.opacity = "0"
    preloader.style.pointerEvents = "none"
    // Trigger hero images animation after preloader
    document.body.classList.add("preloader-removed")
  }, 2500)
})

// ============ THEME TOGGLE ============

const themeToggle = document.getElementById("themeToggle")
const themeToggleMenu = document.getElementById("themeToggleMenu")

function updateThemeButtons() {
  const icon = state.isDarkMode ? "☀️" : "🌙"
  if (themeToggle) themeToggle.textContent = icon
  if (themeToggleMenu) themeToggleMenu.textContent = icon
}

function initTheme() {
  if (state.isDarkMode) {
    document.body.classList.remove("light-mode")
  } else {
    document.body.classList.add("light-mode")
  }
  updateThemeButtons()
}

function toggleTheme() {
  state.isDarkMode = !state.isDarkMode
  localStorage.setItem("theme", state.isDarkMode ? "dark" : "light")
  document.body.classList.toggle("light-mode")
  updateThemeButtons()
}

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme)
}

if (themeToggleMenu) {
  themeToggleMenu.addEventListener("click", toggleTheme)
}

// ============ NAVIGATION ANIMATIONS ============

const navbar = document.getElementById("navbar")
const navLinks = document.querySelectorAll(".nav-link")
const navLinksContainer = document.getElementById("navLinks")

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled")
        } else {
    navbar.classList.remove("scrolled")
  }
})

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    navLinks.forEach((l) => l.classList.remove("active"))
    e.target.classList.add("active")
    
  })
})

// ============ SMOOTH SCROLL ============

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  })
})

// ============ CART FUNCTIONALITY ============

const cartBtn = document.getElementById("cartBtn")
const cartModal = document.getElementById("cartModal")
const closeCart = document.getElementById("closeCart")
const cartCount = document.getElementById("cartCount")
const cartItems = document.getElementById("cartItems")
const cartTotal = document.getElementById("cartTotal")

function updateCartCount() {
  cartCount.textContent = state.cart.length
  updateCartModal()
}

function addToCart(productId) {
  const product = state.products.find((p) => p.id === productId)
  if (product) {
    state.cart.push(product)
    localStorage.setItem("cart", JSON.stringify(state.cart))
    updateCartCount()
    showNotification(`${product.name} added to cart!`)
  }
}

function removeFromCart(index) {
  state.cart.splice(index, 1)
  localStorage.setItem("cart", JSON.stringify(state.cart))
  updateCartCount()
}

function updateCartModal() {
  cartItems.innerHTML = ""
  let total = 0

  state.cart.forEach((item, index) => {
    total += item.price
    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"
    cartItem.innerHTML = `
      <div class="cart-item-image"></div>
      <div class="cart-item-details">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">$${item.price}</p>
        <button class="remove-item-btn" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `
    cartItems.appendChild(cartItem)
  })

  cartTotal.textContent = "$" + total.toFixed(2)
}

cartBtn.addEventListener("click", () => {
  cartModal.classList.add("active")
  gsap.to(cartModal, { duration: 0.3, opacity: 1 })
})

closeCart.addEventListener("click", () => {
  cartModal.classList.remove("active")
})

cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.classList.remove("active")
  }
})

// ============ WISHLIST FUNCTIONALITY ============

const wishlistBtn = document.getElementById("wishlistBtn")
const wishlistCount = document.getElementById("wishlistCount")
const wishlistModal = document.getElementById("wishlistModal")
const closeWishlist = document.getElementById("closeWishlist")
const wishlistItems = document.getElementById("wishlistItems")

function updateWishlistCount() {
  wishlistCount.textContent = state.wishlist.length
  updateWishlistModal()
}

function addToWishlist(productId) {
  if (!state.wishlist.find((id) => id === productId)) {
    state.wishlist.push(productId)
    localStorage.setItem("wishlist", JSON.stringify(state.wishlist))
    updateWishlistCount()
    updateWishlistButtons()
    showNotification("Added to wishlist!")
  } else {
    removeFromWishlist(productId)
  }
}

function removeFromWishlist(productId) {
  state.wishlist = state.wishlist.filter((id) => id !== productId)
  localStorage.setItem("wishlist", JSON.stringify(state.wishlist))
  updateWishlistCount()
  updateWishlistButtons()
  showNotification("Removed from wishlist!")
}

function updateWishlistButtons() {
  document.querySelectorAll('.wishlist-btn-sm').forEach(btn => {
    const onclickAttr = btn.getAttribute('onclick')
    if (onclickAttr) {
      const match = onclickAttr.match(/addToWishlist\((\d+)\)/)
      if (match) {
        const productId = parseInt(match[1])
        if (state.wishlist.includes(productId)) {
          btn.classList.add('active')
        } else {
          btn.classList.remove('active')
        }
      }
    }
  })
}

// Make functions globally accessible for onclick handlers
window.removeFromWishlist = removeFromWishlist
window.addToWishlist = addToWishlist
window.addToCart = addToCart

function updateWishlistModal() {
  wishlistItems.innerHTML = ""
  
  if (state.wishlist.length === 0) {
    wishlistItems.innerHTML = '<p class="empty-message">Your wishlist is empty</p>'
    return
  }
  
  state.wishlist.forEach((productId) => {
    const product = state.products.find((p) => p.id === productId)
    if (product) {
      const wishlistItem = document.createElement("div")
      wishlistItem.className = "wishlist-item"
      wishlistItem.innerHTML = `
        <div class="wishlist-item-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="wishlist-item-details">
          <p class="wishlist-item-name">${product.name}</p>
          <p class="wishlist-item-price">$${product.price}</p>
          <div class="wishlist-item-actions">
            <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">Add to Cart</button>
            <button class="remove-item-btn" onclick="removeFromWishlist(${product.id})">Remove</button>
          </div>
        </div>
      `
      wishlistItems.appendChild(wishlistItem)
    }
  })
}

wishlistBtn.addEventListener("click", () => {
  wishlistModal.classList.add("active")
  updateWishlistModal()
  if (typeof gsap !== 'undefined') {
    gsap.to(wishlistModal, { duration: 0.3, opacity: 1 })
  }
})

closeWishlist.addEventListener("click", () => {
  wishlistModal.classList.remove("active")
})

wishlistModal.addEventListener("click", (e) => {
  if (e.target === wishlistModal) {
    wishlistModal.classList.remove("active")
  }
})

// ============ RENDER PRODUCTS ============

function renderProducts() {
  const productsGrid = document.getElementById("productsGrid")
  productsGrid.innerHTML = ""

  state.products.forEach((product, index) => {
    const isInWishlist = state.wishlist.includes(product.id)
    const productCard = document.createElement("div")
    productCard.className = "product-card"
    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='${product.fallbackImage || "https://picsum.photos/seed/luxe/400/400"}'">
        <div class="product-badge">-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</div>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price-rating-wrapper">
          <div class="product-price">
            <span class="price-current">$${product.price}</span>
            <span class="price-original">$${product.originalPrice}</span>
          </div>
          <div class="product-rating">
            ${"★".repeat(product.rating)}${"☆".repeat(5 - product.rating)}
          </div>
        </div>
        <div class="product-actions">
          <button class="action-btn" onclick="addToCart(${product.id})">Add Cart</button>
          <button class="wishlist-btn-sm ${isInWishlist ? 'active' : ''}" onclick="addToWishlist(${product.id})">❤️</button>
        </div>
      </div>
    `
    productsGrid.appendChild(productCard)
  })

  // Animate products on scroll
  gsap.to(".product-card", {
    scrollTrigger: {
      trigger: ".featured",
      start: "top center",
      toggleActions: "play none none none",
    },
    opacity: 1,
    y: 0,
    stagger: 0.1,
    duration: 0.6,
  })
}

// ============ TESTIMONIALS AUTO-SCROLL ============
// Success stories section is now always visible, no button needed

// ============ FILTER PRODUCTS ============

const filterBtns = document.querySelectorAll(".filter-btn")

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"))
    btn.classList.add("active")

    const filter = btn.dataset.filter
    const productCards = document.querySelectorAll(".product-card")

    productCards.forEach((card) => {
      const category = card.querySelector(".product-category").textContent.toLowerCase()
      if (filter === "all" || category.includes(filter)) {
        gsap.to(card, { opacity: 1, duration: 0.3 })
        card.style.display = "block"
        } else {
        gsap.to(card, { opacity: 0, duration: 0.3 })
        card.style.display = "none"
      }
    })
  })
})

// ============ COUNTER ANIMATION ============

function animateCounter(element, target) {
  let current = 0
  const increment = target / 100

  const interval = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(interval)
    }
    element.textContent = current >= 100 ? Math.floor(current) : current.toFixed(0)

    // Format numbers with K, M suffix
    if (current >= 1000 && current < 1000000) {
      element.textContent = (current / 1000).toFixed(0) + "K"
    } else if (current >= 1000000) {
      element.textContent = (current / 1000000).toFixed(0) + "M"
    }
  }, 30)
}

// ============ SCROLL ANIMATIONS ============

// Hero title animation
gsap.to(".hero-title .word", {
  scrollTrigger: {
    trigger: ".hero",
    start: "top center",
    toggleActions: "play none none none",
  },
  opacity: 1,
  y: 0,
  stagger: 0.1,
  duration: 0.8,
})

// Stats counter animation
ScrollTrigger.create({
  trigger: ".stats",
  onEnter: () => {
    document.querySelectorAll(".stat-card").forEach((card) => {
      const target = Number.parseInt(card.dataset.number)
      animateCounter(card.querySelector(".stat-number"), target)
    })
  },
  once: true,
})

// Hero stats counter animation
ScrollTrigger.create({
  trigger: ".hero",
  start: "top 80%",
  onEnter: () => {
    document.querySelectorAll(".hero-stat-number").forEach((stat) => {
      const dataNumber = stat.getAttribute("data-number")
      if (!dataNumber) return
      let target
      if (dataNumber.includes("K")) {
        target = parseFloat(dataNumber.replace("K", "")) * 1000
      } else {
        target = Number.parseInt(dataNumber)
      }
      if (target && !isNaN(target)) {
        animateCounter(stat, target)
      }
    })
  },
  once: true,
})

// Product cards animation on scroll
gsap.to(".product-card", {
  scrollTrigger: {
    trigger: ".featured",
    start: "top 80%",
    toggleActions: "play none none none",
  },
            opacity: 1,
  y: 0,
  stagger: 0.05,
  duration: 0.6,
})

// Section fade-in animations
document.querySelectorAll(".section-header").forEach((header) => {
  gsap.to(header, {
    scrollTrigger: {
      trigger: header,
      start: "top 80%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
  })
})

// Collection items scroll animations
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.to(".collection-item", {
    scrollTrigger: {
      trigger: ".collection",
      start: "top 70%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    y: 0,
    scale: 1,
    stagger: 0.2,
    duration: 0.8,
    ease: "power3.out",
  })
  
  // Parallax effect for collection images
  gsap.to(".collection-image img", {
    scrollTrigger: {
      trigger: ".collection-item",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
    y: -30,
    ease: "none",
  })
}

// Testimonials section animations
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.to(".testimonials-hero", {
    scrollTrigger: {
      trigger: ".testimonials",
      start: "top 70%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power3.out",
  })
}

// About section animations
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.to(".about-image", {
    scrollTrigger: {
      trigger: ".about",
      start: "top 70%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    x: 0,
    duration: 1,
    ease: "power3.out",
  })

  gsap.to(".about-content", {
            scrollTrigger: {
      trigger: ".about",
      start: "top 70%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    x: 0,
    duration: 1,
    ease: "power3.out",
  })
}

// Stats cards scroll animations
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.to(".stat-card", {
    scrollTrigger: {
      trigger: ".stats",
      start: "top 70%",
      toggleActions: "play none none none",
    },
            opacity: 1,
    y: 0,
    scale: 1,
    stagger: 0.1,
            duration: 0.8,
    ease: "elastic.out(1, 0.5)",
  })
}

// Smooth reveal animation for filter buttons
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.from(".filter-btn", {
            scrollTrigger: {
      trigger: ".featured",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.6,
  })
}

// CTA section animation
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.to(".cta", {
            scrollTrigger: {
      trigger: ".cta",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1,
    ease: "power3.out",
  })
}

// Footer fade-in
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.to(".footer", {
    scrollTrigger: {
      trigger: ".footer",
      start: "top 90%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    y: 0,
    duration: 1,
  })
}

// ============ AESTHETIC TEXT SECTIONS ANIMATIONS ============

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  document.querySelectorAll(".aesthetic-text-large").forEach((text) => {
    // Parallax effect - text moves slower than scroll
    gsap.to(text, {
      scrollTrigger: {
        trigger: text.closest(".aesthetic-text-section"),
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
      },
      y: -150,
      scale: 1.15,
      ease: "none",
    })
    
    // Fade in/out on scroll with opacity variation
    gsap.to(text, {
      scrollTrigger: {
        trigger: text.closest(".aesthetic-text-section"),
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1.5,
      },
      opacity: 0.25,
      ease: "none",
    })
    
    // Initial reveal animation
    gsap.from(text, {
      scrollTrigger: {
        trigger: text.closest(".aesthetic-text-section"),
        start: "top 85%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      scale: 0.7,
      y: 100,
      duration: 1.5,
      ease: "power4.out",
    })
    
    // Rotation effect on scroll
    gsap.to(text, {
      scrollTrigger: {
        trigger: text.closest(".aesthetic-text-section"),
        start: "top bottom",
        end: "bottom top",
        scrub: 3,
      },
      rotation: 2,
      ease: "none",
    })
  })
  
  // Section wrapper parallax
  document.querySelectorAll(".aesthetic-text-section").forEach((section) => {
    gsap.to(section, {
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
      y: -50,
      ease: "none",
    })
  })
}

// ============ PARALLAX EFFECT ============

const heroImage = document.querySelector(".hero-image")

if (heroImage && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.to(heroImage, {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
    y: 100,
    scale: 1.05,
    ease: "none",
  })
}

// ============ MAGNETIC HOVER EFFECT ============

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    btn.style.setProperty("--x", x + "px")
    btn.style.setProperty("--y", y + "px")
  })
})

// ============ NOTIFICATION SYSTEM ============

function showNotification(message) {
  const notification = document.getElementById("notification")
  notification.textContent = message
  notification.classList.add("show")

  setTimeout(() => {
    notification.classList.remove("show")
  }, 3000)
}

// ============ NEWSLETTER FORM ============

document.querySelector(".cta-form")?.addEventListener("submit", (e) => {
  e.preventDefault()
  const email = e.target.querySelector(".cta-input").value
  if (email) {
    showNotification("Welcome to our VIP club! 🎉")
    e.target.reset()
  }
})

// ============ COLLECTION PARALLAX HOVER ============

function initCollectionParallaxHover() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches

  if (prefersReducedMotion || !hasFinePointer) return

  const collectionItems = document.querySelectorAll(".collection-item")
  if (!collectionItems.length) return

  collectionItems.forEach((item) => {
    const imageWrapper = item.querySelector(".collection-image")
    const image = item.querySelector(".collection-image img")
    const content = item.querySelector(".collection-content")
    let animationId = null
    let bounds = null

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

    const resetTransforms = () => {
      item.style.transform = ""
      if (imageWrapper) imageWrapper.style.transform = ""
      if (image) image.style.transform = ""
      if (content) content.style.transform = ""
    }

    const updateTransforms = (xRatio, yRatio) => {
      const rotateX = (0.5 - yRatio) * 14
      const rotateY = (xRatio - 0.5) * 16
      const translateX = (xRatio - 0.5) * 24
      const translateY = (yRatio - 0.5) * 24

      item.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`

      if (imageWrapper) {
        imageWrapper.style.transform = `translateX(${translateX * 0.45}px) translateY(${translateY * 0.45}px) scale(1.02)`
      }

      if (image) {
        image.style.transform = `translateX(${translateX * -0.4}px) translateY(${translateY * -0.6}px) scale(1.08)`
      }

      if (content) {
        content.style.transform = `translateX(${translateX * -0.2}px) translateY(${translateY * -0.2}px)`
      }
    }

    const handlePointerMove = (event) => {
      if (!bounds) bounds = item.getBoundingClientRect()
      const xRatio = clamp((event.clientX - bounds.left) / bounds.width, -0.25, 1.25)
      const yRatio = clamp((event.clientY - bounds.top) / bounds.height, -0.25, 1.25)

      cancelAnimationFrame(animationId)
      animationId = requestAnimationFrame(() => updateTransforms(xRatio, yRatio))
    }

    const handlePointerEnter = () => {
      bounds = item.getBoundingClientRect()
      item.classList.add("is-hovered")
    }

    const handlePointerLeave = () => {
      item.classList.remove("is-hovered")
      cancelAnimationFrame(animationId)
      animationId = requestAnimationFrame(() => {
        resetTransforms()
      })
      bounds = null
    }

    item.addEventListener("pointerenter", handlePointerEnter)
    item.addEventListener("pointermove", handlePointerMove)
    item.addEventListener("pointerleave", handlePointerLeave)
  })
}

// ============ CHECKOUT ============

document.getElementById("checkoutBtn")?.addEventListener("click", () => {
  if (state.cart.length === 0) {
    showNotification("Your cart is empty!")
  } else {
    showNotification("Proceeding to checkout... 🛍️")
    state.cart = []
    localStorage.removeItem("cart")
    updateCartCount()
    cartModal.classList.remove("active")
  }
})

// ============ INITIALIZATION ============

document.addEventListener("DOMContentLoaded", () => {
  initTheme()
  updateCartCount()
  updateWishlistCount()
  updateWishlistModal()
  updateWishlistButtons()
  
  // Initialize testimonials hero animation
  const testimonialsHero = document.querySelector(".testimonials-hero")
  if (testimonialsHero) {
    testimonialsHero.style.opacity = "0"
    testimonialsHero.style.transform = "translateY(30px)"
  }

  // Initialize mobile menu as closed
  const navLinksContainer = document.getElementById("navLinks")
  if (navLinksContainer && window.innerWidth <= 1024) {
    navLinksContainer.style.display = "none"
  }

  // Initialize hero stats to 0
  document.querySelectorAll(".hero-stat-number").forEach((stat) => {
    stat.textContent = "0"
  })

  // Collection card mouse tracking for shine effect
  document.querySelectorAll(".collection-item").forEach((item) => {
    const image = item.querySelector(".collection-image")
    if (image) {
      item.addEventListener("mousemove", (e) => {
        const rect = image.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        image.style.setProperty("--mouse-x", `${x}%`)
        image.style.setProperty("--mouse-y", `${y}%`)
      })
    }
  })

  // Set initial opacity for animated elements
  document.querySelectorAll(".product-card, .section-header").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
  })
  
  // Initialize collection items
  document.querySelectorAll(".collection-item").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(50px) scale(0.9)"
  })

  initCollectionParallaxHover()
  
  // Testimonials already present in DOM (static)
  
  // Initialize stat cards
  document.querySelectorAll(".stat-card").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px) scale(0.9)"
  })
  
  // Initialize about section
  const aboutImage = document.querySelector(".about-image")
  const aboutContent = document.querySelector(".about-content")
  if (aboutImage) {
    aboutImage.style.opacity = "0"
    aboutImage.style.transform = "translateX(-50px)"
  }
  if (aboutContent) {
    aboutContent.style.opacity = "0"
    aboutContent.style.transform = "translateX(50px)"
  }
  
  // Initialize CTA and Footer
  const cta = document.querySelector(".cta")
  const footer = document.querySelector(".footer")
  if (cta) {
    cta.style.opacity = "0"
    cta.style.transform = "scale(0.95)"
  }
  if (footer) {
    footer.style.opacity = "0"
    footer.style.transform = "translateY(30px)"
  }
})
