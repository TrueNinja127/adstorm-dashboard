"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { Globe, Search, User, ChevronLeft, ChevronRight, Bookmark } from "lucide-react"
import { carouselSlides, type CarouselSlide } from "@/lib/carousel-data"

const EASE = "sine.inOut"
const CARD_WIDTH = 228
const CARD_HEIGHT = 320
const GAP = 40
const NUMBER_SIZE = 50
const PROGRESS_WIDTH = 500
const PAGINATION_GAP = 20
/** When embedded, smaller cards so the stack fits and doesn’t look split */
const EMBEDDED_CARD_WIDTH = 168
const EMBEDDED_CARD_HEIGHT = 220
const EMBEDDED_GAP = 12
const EMBEDDED_PROGRESS_WIDTH = 280
/** Visible width of card stack so only ~3.5 cards show (half of 4th, 5th off-screen, like original). */
const EMBEDDED_STACK_VISIBLE_WIDTH = 3.5 * EMBEDDED_CARD_WIDTH + 3 * EMBEDDED_GAP

function getCard(index: number) {
  return `#hero-card-${index}`
}
function getCardContent(index: number) {
  return `#hero-card-content-${index}`
}
function getSlideItemId(index: number) {
  return `#hero-slide-item-${index}`
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

interface HeroCarouselProps {
  /** When true, carousel fills its container and uses container dimensions (e.g. on Brands page). Hides nav. */
  embedded?: boolean
}

export function HeroCarousel({ embedded = false }: HeroCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [order, setOrder] = useState(() => carouselSlides.map((_, i) => i))
  const [detailsEven, setDetailsEven] = useState(true)
  const [ready, setReady] = useState(false)
  const loopRef = useRef<number | null>(null)
  const clicksRef = useRef(0)
  const offsetTopRef = useRef(200)
  const offsetLeftRef = useRef(700)
  const widthRef = useRef(typeof window !== "undefined" ? window.innerWidth : 1920)
  const heightRef = useRef(typeof window !== "undefined" ? window.innerHeight : 1080)
  const cardWRef = useRef(CARD_WIDTH)
  const cardHRef = useRef(CARD_HEIGHT)
  const gapRef = useRef(GAP)
  const progressWidthRef = useRef(PROGRESS_WIDTH)

  const runStep = useCallback(() => {
    return new Promise<void>((resolve) => {
      setOrder((prev) => {
        const next = [...prev]
        next.push(next.shift()!)
        const active = next[0]
        const rest = next.slice(1)
        const prv = rest[rest.length - 1]!
        const detailsActive = !detailsEven ? "details-even" : "details-odd"
        const detailsInactive = detailsEven ? "details-even" : "details-odd"

        const ot = offsetTopRef.current
        const ol = offsetLeftRef.current
        const width = widthRef.current
        const height = heightRef.current

        // Update the panel we're about to show with the new slide content
        const detailsActiveEl = document.getElementById(`hero-${detailsActive}`)
        if (detailsActiveEl) {
          const slide = carouselSlides[active]
          const placeEl = detailsActiveEl.querySelector(".hero-detail-place")
          const title1El = detailsActiveEl.querySelector(".hero-detail-title-1")
          const title2El = detailsActiveEl.querySelector(".hero-detail-title-2")
          const descEl = detailsActiveEl.querySelector(".hero-detail-desc")
          if (placeEl) placeEl.textContent = slide.place
          if (title1El) title1El.textContent = slide.title
          if (title2El) title2El.textContent = slide.title2
          if (descEl) descEl.textContent = slide.description
        }

        gsap.set(`#hero-${detailsActive}`, { zIndex: 22 })
        gsap.to(`#hero-${detailsActive}`, { opacity: 1, delay: 0.4, ease: EASE })
        gsap.to(`#hero-${detailsActive} .hero-detail-place`, {
          y: 0,
          delay: 0.1,
          duration: 0.7,
          ease: EASE,
        })
        gsap.to(`#hero-${detailsActive} .hero-detail-title-1`, {
          y: 0,
          delay: 0.15,
          duration: 0.7,
          ease: EASE,
        })
        gsap.to(`#hero-${detailsActive} .hero-detail-title-2`, {
          y: 0,
          delay: 0.15,
          duration: 0.7,
          ease: EASE,
        })
        gsap.to(`#hero-${detailsActive} .hero-detail-desc`, {
          y: 0,
          delay: 0.3,
          duration: 0.4,
          ease: EASE,
        })
        gsap.to(`#hero-${detailsActive} .hero-detail-cta`, {
          y: 0,
          delay: 0.35,
          duration: 0.4,
          onComplete: () => resolve(),
          ease: EASE,
        })
        gsap.set(`#hero-${detailsInactive}`, { zIndex: 12 })

        gsap.set(getCard(prv), { zIndex: 10 })
        gsap.set(getCard(active), { zIndex: 20 })
        const cw = cardWRef.current
        const ch = cardHRef.current
        const gap = gapRef.current
        const progressW = progressWidthRef.current
        gsap.to(getCard(prv), { scale: 1.5, duration: 0.25, ease: EASE })
        gsap.to(getCardContent(active), {
          y: ot + ch - 10,
          opacity: 0,
          duration: 0.3,
          ease: EASE,
        })
        gsap.to(getSlideItemId(active), { x: 0, duration: 0.4, ease: EASE })
        gsap.to(getSlideItemId(prv), { x: -NUMBER_SIZE, duration: 0.4, ease: EASE })
        gsap.to(".hero-progress-foreground", {
          width: progressW * (1 / next.length) * (active + 1),
          duration: 0.4,
          ease: EASE,
        })

        gsap.to(getCard(active), {
          x: 0,
          y: 0,
          width,
          height,
          borderRadius: 0,
          duration: 0.6,
          ease: EASE,
          onComplete: () => {
            const xNew = ol + (rest.length - 1) * (cw + gap)
            gsap.set(getCard(prv), {
              x: xNew,
              y: ot,
              width: cw,
              height: ch,
              zIndex: 30,
              borderRadius: 10,
              scale: 1,
            })
            gsap.set(getCardContent(prv), {
              x: xNew,
              y: ot + ch - (embedded ? 80 : 100),
              opacity: 1,
              zIndex: 40,
            })
            gsap.set(getSlideItemId(prv), { x: rest.length * NUMBER_SIZE })
            gsap.set(`#hero-${detailsInactive}`, { opacity: 0 })
            gsap.set(`#hero-${detailsInactive} .hero-detail-place`, { y: 100 })
            gsap.set(`#hero-${detailsInactive} .hero-detail-title-1`, { y: 100 })
            gsap.set(`#hero-${detailsInactive} .hero-detail-title-2`, { y: 100 })
            gsap.set(`#hero-${detailsInactive} .hero-detail-desc`, { y: 50 })
            gsap.set(`#hero-${detailsInactive} .hero-detail-cta`, { y: 60 })
            clicksRef.current -= 1
            if (clicksRef.current > 0) {
              runStep()
            }
          },
        })

        rest.forEach((i, index) => {
          if (i !== prv) {
            const xNew = ol + index * (cw + gap)
            const d = 0.1 * (index + 1)
            gsap.set(getCard(i), { zIndex: 30 })
            gsap.to(getCard(i), {
              x: xNew,
              y: ot,
              width: cw,
              height: ch,
              duration: 0.5,
              delay: d,
              ease: EASE,
            })
            gsap.to(getCardContent(i), {
              x: xNew,
              y: ot + ch - (embedded ? 80 : 100),
              opacity: 1,
              zIndex: 40,
              duration: 0.5,
              delay: d,
              ease: EASE,
            })
            gsap.to(getSlideItemId(i), {
              x: (index + 1) * NUMBER_SIZE,
              duration: 0.4,
              delay: d,
              ease: EASE,
            })
          }
        })

        setDetailsEven((d) => !d)
        return next
      })
    })
  }, [detailsEven])

  const goNext = useCallback(() => {
    if (!ready) return
    clicksRef.current += 1
    if (clicksRef.current === 1) runStep()
  }, [ready, runStep])

  const goPrev = useCallback(() => {
    if (!ready) return
    setOrder((prev) => {
      const next = [...prev]
      next.unshift(next.pop()!)
      const active = next[0]!
      const rest = next.slice(1)
      const ot = offsetTopRef.current
      const ol = offsetLeftRef.current
      const width = widthRef.current
      const height = heightRef.current

      const detailsActive = detailsEven ? "details-even" : "details-odd"
      const detailsInactive = !detailsEven ? "details-even" : "details-odd"
      const slide = carouselSlides[active]

      const detailsActiveEl = document.getElementById(`hero-${detailsActive}`)
      if (detailsActiveEl) {
        const placeEl = detailsActiveEl.querySelector(".hero-detail-place")
        const title1El = detailsActiveEl.querySelector(".hero-detail-title-1")
        const title2El = detailsActiveEl.querySelector(".hero-detail-title-2")
        const descEl = detailsActiveEl.querySelector(".hero-detail-desc")
        if (placeEl) placeEl.textContent = slide.place
        if (title1El) title1El.textContent = slide.title
        if (title2El) title2El.textContent = slide.title2
        if (descEl) descEl.textContent = slide.description
      }

      setDetailsEven((d) => !d)

      gsap.set(`#hero-${detailsActive}`, { zIndex: 22, opacity: 0 })
      gsap.set(`#hero-${detailsActive} .hero-detail-place`, { y: 100 })
      gsap.set(`#hero-${detailsActive} .hero-detail-title-1`, { y: 100 })
      gsap.set(`#hero-${detailsActive} .hero-detail-title-2`, { y: 100 })
      gsap.set(`#hero-${detailsActive} .hero-detail-desc`, { y: 50 })
      gsap.set(`#hero-${detailsActive} .hero-detail-cta`, { y: 60 })
      gsap.to(`#hero-${detailsActive}`, { opacity: 1, duration: 0.4, ease: EASE })
      gsap.to(`#hero-${detailsActive} .hero-detail-place`, {
        y: 0,
        delay: 0.1,
        duration: 0.5,
        ease: EASE,
      })
      gsap.to(`#hero-${detailsActive} .hero-detail-title-1`, {
        y: 0,
        delay: 0.12,
        duration: 0.5,
        ease: EASE,
      })
      gsap.to(`#hero-${detailsActive} .hero-detail-title-2`, {
        y: 0,
        delay: 0.12,
        duration: 0.5,
        ease: EASE,
      })
      gsap.to(`#hero-${detailsActive} .hero-detail-desc`, {
        y: 0,
        delay: 0.2,
        duration: 0.35,
        ease: EASE,
      })
      gsap.to(`#hero-${detailsActive} .hero-detail-cta`, {
        y: 0,
        delay: 0.22,
        duration: 0.35,
        ease: EASE,
      })

      const cw = cardWRef.current
      const ch = cardHRef.current
      const gap = gapRef.current
      const progressW = progressWidthRef.current
      const firstRest = rest[0]!
      gsap.set(getCard(active), { zIndex: 20 })
      gsap.set(getCard(firstRest), { zIndex: 10 })
      gsap.to(getCard(active), {
        x: 0,
        y: 0,
        width,
        height,
        borderRadius: 0,
        ease: EASE,
      })
      rest.forEach((i, index) => {
        const xNew = ol + index * (cw + gap)
        gsap.to(getCard(i), {
          x: xNew,
          y: ot,
          width: cw,
          height: ch,
          zIndex: 30,
          borderRadius: 10,
          ease: EASE,
          delay: 0.05 * index,
        })
        gsap.set(getCardContent(i), {
          x: xNew,
          y: ot + ch - (embedded ? 80 : 100),
          opacity: 1,
          zIndex: 40,
        })
        gsap.to(getSlideItemId(i), {
          x: (index + 1) * NUMBER_SIZE,
          ease: EASE,
        })
      })
      gsap.set(getCardContent(active), {
        x: ol,
        y: ot + ch - (embedded ? 80 : 100),
        opacity: 1,
        zIndex: 40,
      })
      gsap.to(".hero-progress-foreground", {
        width: progressW * (1 / next.length) * (active + 1),
        ease: EASE,
      })
      gsap.to(getSlideItemId(active), { x: 0, ease: EASE })

      return next
    })
  }, [ready, detailsEven])

  useEffect(() => {
    if (typeof window === "undefined") return

    function getDimensions() {
      if (embedded && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        return { width: rect.width, height: rect.height }
      }
      return { width: window.innerWidth, height: window.innerHeight }
    }

    const init = () => {
      const { width, height } = getDimensions()
      widthRef.current = width
      heightRef.current = height

      if (embedded) {
        cardWRef.current = EMBEDDED_CARD_WIDTH
        cardHRef.current = EMBEDDED_CARD_HEIGHT
        gapRef.current = EMBEDDED_GAP
        progressWidthRef.current = EMBEDDED_PROGRESS_WIDTH
        offsetLeftRef.current = width - EMBEDDED_STACK_VISIBLE_WIDTH
        offsetTopRef.current = height - EMBEDDED_CARD_HEIGHT - 80
      } else {
        cardWRef.current = CARD_WIDTH
        cardHRef.current = CARD_HEIGHT
        gapRef.current = GAP
        progressWidthRef.current = PROGRESS_WIDTH
        offsetTopRef.current = height - 430
        offsetLeftRef.current = width - 830
      }

      const active = order[0]!
      const rest = order.slice(1)
      const cw = cardWRef.current
      const ch = cardHRef.current
      const gap = gapRef.current
      const progressW = progressWidthRef.current
      const detailsActive = detailsEven ? "details-even" : "details-odd"
      const detailsInactive = detailsEven ? "details-odd" : "details-even"
      const ot = offsetTopRef.current
      const ol = offsetLeftRef.current

      gsap.set("#hero-pagination", {
        top: ot + ch + PAGINATION_GAP,
        left: ol,
        y: 200,
        opacity: 0,
        zIndex: 60,
      })
      if (!embedded) gsap.set("#hero-nav", { y: -200, opacity: 0 })
      gsap.set(getCard(active), {
        x: 0,
        y: 0,
        width,
        height,
      })
      gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 })
      gsap.set(`#hero-${detailsActive}`, { opacity: 0, zIndex: 22, x: -200 })
      gsap.set(`#hero-${detailsInactive}`, { opacity: 0, zIndex: 12 })
      gsap.set(`#hero-${detailsInactive} .hero-detail-place`, { y: 100 })
      gsap.set(`#hero-${detailsInactive} .hero-detail-title-1`, { y: 100 })
      gsap.set(`#hero-${detailsInactive} .hero-detail-title-2`, { y: 100 })
      gsap.set(`#hero-${detailsInactive} .hero-detail-desc`, { y: 50 })
      gsap.set(`#hero-${detailsInactive} .hero-detail-cta`, { y: 60 })
      gsap.set(".hero-progress-foreground", {
        width: progressW * (1 / order.length) * (active + 1),
      })
      gsap.set(getSlideItemId(active), { x: 0 })

      const initialOffset = embedded ? ol : ol + 400
      rest.forEach((i, index) => {
        gsap.set(getCard(i), {
          x: initialOffset + index * (cw + gap),
          y: ot,
          width: cw,
          height: ch,
          zIndex: 30,
          borderRadius: 10,
        })
        gsap.set(getCardContent(i), {
          x: initialOffset + index * (cw + gap),
          zIndex: 40,
          y: ot + ch - (embedded ? 80 : 100),
        })
        gsap.set(getSlideItemId(i), { x: (index + 1) * NUMBER_SIZE })
      })
      gsap.set("#hero-indicator", { x: -width })

      const startDelay = 0.6
      gsap.to("#hero-cover", {
        x: width + 400,
        delay: 0.5,
        ease: EASE,
        onComplete: () => {
          setTimeout(() => {
            setReady(true)
            const cw2 = cardWRef.current
            const ch2 = cardHRef.current
            const gap2 = gapRef.current
            rest.forEach((i, index) => {
              const delay = startDelay + 0.05 * index
              gsap.to(getCard(i), {
                x: ol + index * (cw2 + gap2),
                zIndex: 30,
                ease: EASE,
                delay,
              })
              gsap.to(getCardContent(i), {
                x: ol + index * (cw2 + gap2),
                zIndex: 40,
                ease: EASE,
                delay,
              })
            })
            gsap.to("#hero-pagination", {
              y: 0,
              opacity: 1,
              ease: EASE,
              delay: startDelay,
            })
            if (!embedded) gsap.to("#hero-nav", { y: 0, opacity: 1, ease: EASE, delay: startDelay })
            gsap.to(`#hero-${detailsActive}`, {
              opacity: 1,
              x: 0,
              ease: EASE,
              delay: startDelay,
            })

            const loop = async () => {
              await gsap.to("#hero-indicator", { x: 0, duration: 2, ease: EASE })
              await gsap.to("#hero-indicator", {
                x: width,
                duration: 0.8,
                delay: 0.3,
                ease: EASE,
              })
              gsap.set("#hero-indicator", { x: -width })
              await runStep()
              loopRef.current = window.setTimeout(loop, 100)
            }
            loopRef.current = window.setTimeout(loop, 500)
          }, 500)
        },
      })
    }

    const loadImages = () =>
      Promise.all(carouselSlides.map((s) => loadImage(s.image)))

    loadImages()
      .then(() => {
        if (embedded) {
          requestAnimationFrame(() => requestAnimationFrame(() => init()))
        } else {
          init()
        }
      })
      .catch((err) => console.error("Carousel images failed to load", err))

    return () => {
      if (loopRef.current) clearTimeout(loopRef.current)
    }
  }, [embedded])

  const activeIndex = order[0] ?? 0
  const detailsActiveId = detailsEven ? "details-even" : "details-odd"
  const detailsInactiveId = detailsEven ? "details-odd" : "details-even"

  return (
    <div
      ref={containerRef}
      className={embedded ? "hero-carousel-root hero-carousel-embedded h-full w-full min-h-0" : "hero-carousel-root"}
    >
      <div id="hero-indicator" className="hero-indicator" />

      {!embedded && (
      <nav id="hero-nav" className="hero-nav">
        <div className="hero-nav-left">
          <div className="hero-nav-icon">
            <Globe className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <Link href="/" className="hero-nav-logo">
            ADStorm
          </Link>
        </div>
        <div className="hero-nav-right">
          <span className="hero-nav-active">Carousel</span>
          <Link href="/">Dashboard</Link>
          <Link href="/brands">Brands</Link>
          <div className="hero-nav-icon" aria-hidden>
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div className="hero-nav-icon" aria-hidden>
            <User className="h-5 w-5" />
          </div>
        </div>
      </nav>
      )}

      <div id="hero-demo" className="hero-demo">
        {carouselSlides.map((slide, index) => (
          <div
            key={slide.image}
            id={`hero-card-${index}`}
            className="hero-card"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
        {carouselSlides.map((slide, index) => (
          <div
            key={`content-${slide.image}`}
            id={`hero-card-content-${index}`}
            className="hero-card-content"
          >
            <div className="hero-content-start" />
            <div className="hero-content-place">{slide.place}</div>
            <div className="hero-content-title-1">{slide.title}</div>
            <div className="hero-content-title-2">{slide.title2}</div>
          </div>
        ))}
      </div>

      <DetailsPanel
        id={`hero-${detailsActiveId}`}
        slide={carouselSlides[order[0] ?? 0]}
        isActive
      />
      <DetailsPanel
        id={`hero-${detailsInactiveId}`}
        slide={carouselSlides[order[0] ?? 0]}
        isActive={false}
      />

      <div id="hero-pagination" className="hero-pagination">
        <button
          type="button"
          className="hero-arrow hero-arrow-left"
          onClick={goPrev}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2} />
        </button>
        <button
          type="button"
          className="hero-arrow hero-arrow-right"
          onClick={goNext}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" strokeWidth={2} />
        </button>
        <div className="hero-progress-container">
          <div className="hero-progress-background">
            <div className="hero-progress-foreground" />
          </div>
        </div>
        <div className="hero-slide-numbers">
          {carouselSlides.map((_, index) => (
            <div
              key={index}
              id={`hero-slide-item-${index}`}
              className="hero-slide-item"
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      <div id="hero-cover" className="hero-cover" />
    </div>
  )
}

function DetailsPanel({
  id,
  slide,
  isActive,
}: {
  id: string
  slide: CarouselSlide
  isActive: boolean
}) {
  return (
    <div id={id} className="hero-details">
      <div className="hero-detail-place-box">
        <div className="hero-detail-place">{slide.place}</div>
      </div>
      <div className="hero-detail-title-box-1">
        <div className="hero-detail-title-1">{slide.title}</div>
      </div>
      <div className="hero-detail-title-box-2">
        <div className="hero-detail-title-2">{slide.title2}</div>
      </div>
      <div className="hero-detail-desc">{slide.description}</div>
      <div className="hero-detail-cta">
        <button type="button" className="hero-bookmark" aria-label="Bookmark">
          <Bookmark className="h-5 w-5" />
        </button>
        <button type="button" className="hero-discover">
          Discover Location
        </button>
      </div>
    </div>
  )
}
