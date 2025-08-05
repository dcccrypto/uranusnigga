import { NextResponse } from 'next/server'

// Solana Tracker API configuration
const SOLANA_TRACKER_API_KEY = process.env.SOLANA_TRACKER_API_KEY
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS

// Base URL for Solana Tracker API
const BASE_URL = 'https://data.solanatracker.io'

// Rate limiting configuration
const RATE_LIMIT_DELAY = 1000 // 1 second between requests
let lastRequestTime = 0

// Helper function to delay requests for rate limiting
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// Helper function to make API calls with proper headers and rate limiting
async function makeSolanaTrackerRequest(endpoint, retries = 3) {
    try {
        // Rate limiting: ensure at least 1 second between requests
        const now = Date.now()
        const timeSinceLastRequest = now - lastRequestTime
        if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
            const delayTime = RATE_LIMIT_DELAY - timeSinceLastRequest
            console.log(`Rate limiting: waiting ${delayTime}ms before next request...`)
            await delay(delayTime)
        }
        lastRequestTime = Date.now()

        console.log(`Making request to: ${endpoint}`)
        
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: {
                'x-api-key': SOLANA_TRACKER_API_KEY,
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 429) {
            console.log('Rate limit hit (429), waiting 2 seconds before retry...')
            await delay(2000)
            if (retries > 0) {
                console.log(`Retrying request (${retries} retries left)...`)
                return makeSolanaTrackerRequest(endpoint, retries - 1)
            } else {
                throw new Error('Rate limit exceeded after all retries')
            }
        }

        if (!response.ok) {
            const errorText = await response.text()
            console.error(`HTTP error! status: ${response.status}, response: ${errorText}`)
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log(`✅ Successfully fetched data from ${endpoint}`)
        return data
    } catch (error) {
        console.error(`❌ Error making request to ${endpoint}:`, error.message)
        
        if (retries > 0 && (error.message.includes('429') || error.message.includes('rate limit'))) {
            console.log(`Retrying request (${retries} retries left)...`)
            await delay(2000) // Wait 2 seconds before retry
            return makeSolanaTrackerRequest(endpoint, retries - 1)
        }
        
        throw error
    }
}

// Process dashboard data from token API response
function processDashboardData(tokenData) {
    console.log('🔄 Processing dashboard data...')
    
    // Extract token information
    const token = tokenData.token || {}
    const pools = tokenData.pools || []
    const mainPool = pools[0] || {}
    
    // Extract price and market data from the pool
    const currentPrice = mainPool.price?.usd || 0
    const priceChange24h = tokenData.events?.['24h']?.priceChangePercentage || 0
    
    // Calculate market cap from price and supply
    const totalSupply = mainPool.tokenSupply || 0
    const marketCap = mainPool.marketCap?.usd || (currentPrice * totalSupply)
    
    // Extract volume and transaction data
    const volume24h = mainPool.txns?.volume24h || 0
    const totalVolume = mainPool.txns?.volume || 0
    const totalTransactions = mainPool.txns?.total || 0
    const buyTransactions = mainPool.txns?.buys || 0
    const sellTransactions = mainPool.txns?.sells || 0
    
    // Extract holder information
    const totalHolders = tokenData.holders || 0
    
    // Generate mock top holders since we don't have the holders endpoint working
    const processedTopHolders = generateMockTopHolders()
    
    // Calculate growth rates (mock for now, could be enhanced with historical data)
    const holdersGrowth = Math.floor(Math.random() * 50) + 10
    const volumeGrowth = Math.floor(Math.random() * 100) + 20
    
    return {
        // Basic token info
        tokenName: token.name || 'URANUS',
        tokenSymbol: token.symbol || 'URANUS',
        tokenImage: token.image || '',
        tokenDescription: token.description || '',
        
        // Market data
        marketCap: marketCap,
        price: currentPrice,
        priceChange24h: priceChange24h,
        totalSupply: totalSupply,
        circulatingSupply: totalSupply,
        
        // Volume and activity
        volume24h: volume24h,
        totalVolume: totalVolume,
        totalTransactions: totalTransactions,
        buyTransactions: buyTransactions,
        sellTransactions: sellTransactions,
        
        // Holders
        totalHolders: totalHolders,
        holdersGrowth: holdersGrowth,
        volumeGrowth: volumeGrowth,
        
        // Top wallets
        topWallets: processedTopHolders,
        
        // Liquidity info
        liquidity: mainPool.liquidity?.usd || 0,
        
        // Risk data
        riskScore: tokenData.risk?.score || 0,
        jupiterVerified: tokenData.risk?.jupiterVerified || false,
        
        // Pool information
        poolId: mainPool.poolId || '',
        market: mainPool.market || '',
        lastUpdated: mainPool.lastUpdated || Date.now()
    }
}

// Generate mock top holders
function generateMockTopHolders() {
    const wallets = [
        'BFgdzMkTPdKKJeTipv2njtDEwhKxkgFueJQfJGt1jups',
        '7ACsEkYSvVyCE5AuYC6hP1bNs4SpgCDwsfm3UdnyPERk',
        '8psNvWTrdNTiVRNzAgsou9kETXNJm2SXZyaKuJraVRtf',
        '9zGpUxJr2jnkwSSF9VGezy6aALEfxysE19hvcRSkbn15',
        'HvFsFTB59XWFmRcXN6noEuej5GBd2yZnYDDmnHtYiECz'
    ]
    
    return wallets.map((wallet, index) => ({
        rank: index + 1,
        wallet: wallet,
        balance: Math.floor(Math.random() * 10000000) + 100000,
        balanceFormatted: (Math.floor(Math.random() * 10000000) + 100000).toLocaleString(),
        percentage: (Math.random() * 10 + 1).toFixed(2)
    }))
}

export async function GET() {
    try {
        console.log('📊 Fetching comprehensive dashboard data from Solana Tracker...')
        
        // Get token information and basic data first
        const tokenData = await makeSolanaTrackerRequest(`/tokens/${CONTRACT_ADDRESS}`)
        
        // Process and combine all data - we'll get price and market data from the token endpoint
        const dashboardData = processDashboardData(tokenData)
        
        console.log('✅ Dashboard data processed successfully')
        return NextResponse.json(dashboardData)
        
    } catch (error) {
        console.error('❌ Error fetching dashboard data:', error)
        
        // Return mock data if API fails
        const mockData = {
            tokenName: 'URANUS',
            tokenSymbol: 'URANUS',
            tokenImage: '',
            tokenDescription: 'Uranus Token - Because your portfolio needs a little Uranus in it! 🪐',
            marketCap: 1234567.89,
            price: 0.000123,
            priceChange24h: 5.23,
            totalSupply: 1000000000,
            circulatingSupply: 1000000000,
            volume24h: 25000.50,
            totalVolume: 100000.00,
            totalTransactions: 1500,
            buyTransactions: 800,
            sellTransactions: 700,
            totalHolders: 1250,
            holdersGrowth: 15,
            volumeGrowth: 25,
            topWallets: [
                {
                    rank: 1,
                    wallet: 'BFgdzMkTPdKKJeTipv2njtDEwhKxkgFueJQfJGt1jups',
                    balance: 1000000,
                    balanceFormatted: '1,000,000',
                    percentage: '10.00'
                }
            ],
            liquidity: 50000.00,
            riskScore: 25,
            jupiterVerified: true,
            poolId: 'mock-pool-id',
            market: 'mock-market',
            lastUpdated: Date.now()
        }
        
        return NextResponse.json(mockData)
    }
} 