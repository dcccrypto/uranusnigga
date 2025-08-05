'use client'

import { useState } from 'react'

export default function AnalyticsGrid({ data, onRefresh }) {
  const [copiedWallet, setCopiedWallet] = useState(null)

  const copyWalletAddress = async (walletAddress) => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopiedWallet(walletAddress)
      
      // Show notification
      showNotification('Wallet address copied to clipboard!', 'success')
      
      setTimeout(() => {
        setCopiedWallet(null)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
      showNotification('Failed to copy wallet address', 'error')
    }
  }

  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div')
    notification.className = `notification ${type}`
    notification.textContent = message
    
    const container = document.getElementById('notification-container')
    if (container) {
      container.appendChild(notification)
      
      setTimeout(() => {
        notification.remove()
      }, 3000)
    }
  }

  const formatNumber = (num) => {
    return num.toLocaleString()
  }

  const formatPercentage = (num) => {
    return `${num.toFixed(2)}%`
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

  const formatWalletAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!data) {
    return (
      <section className="analytics-grid">
        <article className="analytics-card">
          <header className="card-header">
            <div>
              <h3>UrAnus Performance Metrics</h3>
              <span className="subtitle">Real-time trading activity and market dynamics</span>
            </div>
            <button className="refresh-btn" onClick={onRefresh}>Refresh Data</button>
          </header>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Transactions</span>
              <span className="stat-value">Loading...</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Volume Growth Rate</span>
              <span className="stat-value">Loading...</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Liquidity Pool</span>
              <span className="stat-value">Loading...</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">1-Day Holder Growth</span>
              <span className="stat-value">Loading...</span>
            </div>
          </div>
        </article>

        <article className="analytics-card">
          <header className="card-header">
            <div>
              <h3>Top People in UrAnus</h3>
              <span className="subtitle">People with largest amount in UrAnus</span>
            </div>
          </header>
          <div className="leaderboard-container">
            <div className="leaderboard-list">
              <div className="no-data">Loading holder data...</div>
            </div>
          </div>
        </article>
      </section>
    )
  }

  return (
    <section className="analytics-grid">
      <article className="analytics-card">
        <header className="card-header">
          <div>
            <h3>UrAnus Performance Metrics</h3>
            <span className="subtitle">Real-time trading activity and market dynamics</span>
          </div>
          <button className="refresh-btn" onClick={onRefresh}>Refresh Data</button>
        </header>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Transactions</span>
            <span className="stat-value">{formatNumber(data.totalTransactions)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Volume Growth Rate</span>
            <span className="stat-value">{formatPercentage(data.volumeGrowth)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Liquidity Pool</span>
            <span className="stat-value">{formatCurrency(data.liquidity)}</span>
          </div>
          <div className="stat-item holder-growth-highlight">
            <span className="stat-label">1-Day Holder Growth</span>
            <span className="stat-value">{formatPercentage(data.holdersGrowth)}</span>
          </div>
        </div>
      </article>

      <article className="analytics-card">
        <header className="card-header">
          <div>
            <h3>Top People in UrAnus</h3>
            <span className="subtitle">People with largest amount in UrAnus</span>
          </div>
        </header>
        <div className="leaderboard-container">
          <div className="leaderboard-list">
            {data.topWallets && data.topWallets.length > 0 ? (
              data.topWallets.map((wallet, index) => (
                <div key={index} className="leaderboard-item">
                  <div className="rank">#{wallet.rank}</div>
                  <div className="wallet-info">
                    <div className="wallet-address">{formatWalletAddress(wallet.wallet)}</div>
                    <div className="wallet-balance">{wallet.balanceFormatted} URANUS</div>
                  </div>
                  <div className="wallet-percentage">{wallet.percentage}%</div>
                  <button 
                    className={`copy-btn ${copiedWallet === wallet.wallet ? 'copied' : ''}`}
                    onClick={() => copyWalletAddress(wallet.wallet)}
                  >
                    {copiedWallet === wallet.wallet ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ))
            ) : (
              <div className="no-data">No holder data available</div>
            )}
          </div>
        </div>
      </article>
    </section>
  )
} 