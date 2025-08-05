'use client'

import { useEffect, useState } from 'react'

export default function TopStats({ data }) {
  const [animatedValues, setAnimatedValues] = useState({
    marketCap: 0,
    volume24h: 0,
    totalHolders: 0,
    currentPrice: 0
  })

  useEffect(() => {
    if (data) {
      animateNumbers()
    }
  }, [data])

  const animateNumbers = () => {
    const duration = 1200
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      setAnimatedValues({
        marketCap: Math.floor(data.marketCap * progress),
        volume24h: Math.floor(data.volume24h * progress),
        totalHolders: Math.floor(data.totalHolders * progress),
        currentPrice: data.price * progress
      })

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  const formatCurrency = (amount) => {
    if (amount >= 1e9) {
      return `$${(amount / 1e9).toFixed(2)}B`
    } else if (amount >= 1e6) {
      return `$${(amount / 1e6).toFixed(2)}M`
    } else if (amount >= 1e3) {
      return `$${(amount / 1e3).toFixed(2)}K`
    }
    return `$${amount.toFixed(2)}`
  }

  const formatPrice = (price) => {
    if (price < 0.01) {
      return `$${price.toFixed(6)}`
    } else if (price < 1) {
      return `$${price.toFixed(4)}`
    }
    return `$${price.toFixed(2)}`
  }

  const formatNumber = (num) => {
    return num.toLocaleString()
  }

  if (!data) {
    return (
      <section className="top-stats-grid">
        <article className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Market Cap</div>
            <div className="stat-value">Loading...</div>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Volume Flowing in UrAnus</div>
            <div className="stat-value">Loading...</div>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-content">
            <div className="stat-label">People in UrAnus</div>
            <div className="stat-value">Loading...</div>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Price of URANUS</div>
            <div className="stat-value">Loading...</div>
            <div className="price-change">Loading...</div>
          </div>
        </article>
      </section>
    )
  }

  return (
    <section className="top-stats-grid">
      <article className="stat-card">
        <div className="stat-content">
          <div className="stat-label">Market Cap</div>
          <div className="stat-value">{formatCurrency(animatedValues.marketCap)}</div>
        </div>
      </article>
      <article className="stat-card">
        <div className="stat-content">
          <div className="stat-label">Volume Flowing in UrAnus</div>
          <div className="stat-value">{formatCurrency(animatedValues.volume24h)}</div>
        </div>
      </article>
      <article className="stat-card">
        <div className="stat-content">
          <div className="stat-label">People in UrAnus</div>
          <div className="stat-value">{formatNumber(animatedValues.totalHolders)}</div>
        </div>
      </article>
      <article className="stat-card">
        <div className="stat-content">
          <div className="stat-label">Price of URANUS</div>
          <div className="stat-value">{formatPrice(animatedValues.currentPrice)}</div>
          <div className={`price-change ${data.priceChange24h >= 0 ? 'positive' : 'negative'}`}>
            {data.priceChange24h >= 0 ? '+' : ''}{data.priceChange24h.toFixed(2)}%
          </div>
        </div>
      </article>
    </section>
  )
} 