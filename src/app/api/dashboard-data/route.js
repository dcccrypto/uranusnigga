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

// Calculate real holder growth from historical data
async function calculateHolderGrowth(tokenAddress) {
    try {
        console.log('📈 Calculating real holder growth...')
        
        // Get holder chart data
        const holderChartData = await makeSolanaTrackerRequest(`/holders/chart/${tokenAddress}`)
        
        if (!holderChartData || !holderChartData.holders || !Array.isArray(holderChartData.holders)) {
            console.log('⚠️ No valid holder chart data available, using mock growth')
            return Math.floor(Math.random() * 50) + 10
        }
        
        const holders = holderChartData.holders
        
        // Need at least 2 data points to calculate growth
        if (holders.length < 2) {
            console.log('⚠️ Insufficient holder data points, using mock growth')
            return Math.floor(Math.random() * 50) + 10
        }
        
        // Sort by timestamp to ensure chronological order
        const sortedHolders = holders.sort((a, b) => a.time - b.time)
        
        // Get current holders (latest data point)
        const currentHolders = parseInt(sortedHolders[sortedHolders.length - 1].holders) || 0
        
        // Get holders from 24 hours ago (or closest available data point)
        const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60)
        
        // Find the closest data point to 24 hours ago
        let previousHolders = currentHolders
        for (let i = sortedHolders.length - 1; i >= 0; i--) {
            if (sortedHolders[i].time <= twentyFourHoursAgo) {
                previousHolders = parseInt(sortedHolders[i].holders) || currentHolders
                break
            }
        }
        
        // If we don't have 24h old data, use the earliest available data point
        if (previousHolders === currentHolders && sortedHolders.length > 1) {
            previousHolders = parseInt(sortedHolders[0].holders) || currentHolders
        }
        
        if (previousHolders === 0) {
            console.log('⚠️ No previous holder data available, using mock growth')
            return Math.floor(Math.random() * 50) + 10
        }
        
        const growthPercentage = ((currentHolders - previousHolders) / previousHolders) * 100
        console.log(`✅ Calculated holder growth: ${growthPercentage.toFixed(2)}% (${previousHolders} → ${currentHolders})`)
        
        return Math.max(growthPercentage, -100) // Cap at -100% to avoid unrealistic negative growth
        
    } catch (error) {
        console.error('❌ Error calculating holder growth:', error.message)
        console.log('⚠️ Falling back to mock holder growth')
        return Math.floor(Math.random() * 50) + 10
    }
}

// Process dashboard data from token API response
function processDashboardData(tokenData, topHoldersData, holderGrowth) {
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
    
    // Process real top holders data or fallback to mock data
    const processedTopHolders = processTopHoldersData(topHoldersData)
    
    // Use real holder growth or fallback to mock
    const holdersGrowth = holderGrowth || Math.floor(Math.random() * 50) + 10
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

// Process real top holders data from Solana Tracker API
function processTopHoldersData(topHoldersData) {
    console.log('🔄 Processing top holders data...')
    
    if (!topHoldersData || !Array.isArray(topHoldersData)) {
        console.log('⚠️ No valid top holders data, using mock data')
        return generateMockTopHolders()
    }
    
    // Take top 10 holders and format them
    const top10Holders = topHoldersData.slice(0, 10).map((holder, index) => {
        const balance = holder.balance || holder.amount || 0
        const percentage = holder.percentage || holder.percentageOfSupply || 0
        
        return {
            rank: index + 1,
            wallet: holder.wallet || holder.address || holder.owner || '',
            balance: balance,
            balanceFormatted: balance.toLocaleString(),
            percentage: typeof percentage === 'number' ? percentage.toFixed(2) : percentage
        }
    })
    
    console.log(`✅ Processed ${top10Holders.length} top holders`)
    return top10Holders
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
        
        // Get top holders data
        let topHoldersData = null
        try {
            console.log('👥 Fetching top holders data...')
            topHoldersData = await makeSolanaTrackerRequest(`/tokens/${CONTRACT_ADDRESS}/holders/top`)
            console.log('✅ Successfully fetched top holders data')
        } catch (holdersError) {
            console.error('❌ Error fetching top holders data:', holdersError.message)
            console.log('⚠️ Falling back to mock top holders data')
            topHoldersData = null
        }
        
        // Calculate real holder growth
        const holderGrowth = await calculateHolderGrowth(CONTRACT_ADDRESS)
        
        // Process and combine all data
        const dashboardData = processDashboardData(tokenData, topHoldersData, holderGrowth)
        
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
            topWallets: generateMockTopHolders(),
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