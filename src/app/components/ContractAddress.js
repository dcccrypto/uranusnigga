'use client'

import { useState } from 'react'

export default function ContractAddress() {
  const [copied, setCopied] = useState(false)
  const contractAddress = 'BFgdzMkTPdKKJeTipv2njtDEwhKxkgFueJQfJGt1jups'

  const copyContractAddress = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress)
      setCopied(true)
      
      // Show notification
      showNotification('Contract address copied to clipboard!', 'success')
      
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
      showNotification('Failed to copy address', 'error')
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

  return (
    <section className="contract-address-section">
      <div className="contract-address-card">
        <div className="contract-info">
          <span className="contract-label">Contract Address</span>
          <span className="contract-address">{contractAddress}</span>
        </div>
        <button 
          className={`copy-contract-btn ${copied ? 'copied' : ''}`}
          onClick={copyContractAddress}
        >
          {copied ? 'Copied!' : 'Copy Address'}
        </button>
      </div>
    </section>
  )
} 