import { NextResponse } from 'next/server'

// Generate mock price history data
function generateMockPriceHistory(hours) {
    const data = []
    const basePrice = 0.5022527140331136 // Use the actual current price
    const baseVolume = 2370571 // Use the actual 24h volume
    
    for (let i = 0; i < hours; i++) {
        const time = Date.now() - (hours - i) * 3600000
        // Generate realistic price fluctuations around the base price
        const priceVariation = 0.05; // 5% variation
        const priceRandomFactor = 1 + (Math.random() - 0.5) * priceVariation
        const price = basePrice * priceRandomFactor
        
        // Generate realistic volume fluctuations around the base volume
        const volumeVariation = 0.3; // 30% variation
        const volumeRandomFactor = 1 + (Math.random() - 0.5) * volumeVariation
        const volume = Math.floor(baseVolume * volumeRandomFactor / 24); // Divide by 24 for hourly data
        
        data.push({
            time: time,
            price: price,
            volume: volume
        })
    }
    
    return data
}

// Generate mock OHLCV data
function generateMockOHLCV(hours) {
    const data = []
    const basePrice = 0.5022527140331136 // Use the actual current price
    
    for (let i = 0; i < hours; i++) {
        const time = Date.now() - (hours - i) * 3600000
        
        // Generate realistic OHLCV data around the base price
        const priceVariation = 0.05; // 5% variation
        const open = basePrice * (1 + (Math.random() - 0.5) * priceVariation)
        const high = open * (1 + Math.random() * 0.02); // High is 0-2% above open
        const low = open * (1 - Math.random() * 0.02); // Low is 0-2% below open
        const close = open * (1 + (Math.random() - 0.5) * 0.01); // Close is ±0.5% from open
        
        const baseVolume = 2370571
        const volumeVariation = 0.3
        const volumeRandomFactor = 1 + (Math.random() - 0.5) * volumeVariation
        const volume = Math.floor(baseVolume * volumeRandomFactor / 24)
        
        data.push({
            time: time,
            open: open,
            high: high,
            low: low,
            close: close,
            volume: volume
        })
    }
    
    return data
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const period = searchParams.get('period') || '24h'
        
        console.log(`📈 Fetching chart data for period: ${period}`)
        
        // For now, we'll use mock chart data since the specific endpoints might not be available
        // In a real implementation, you'd use the correct Solana Tracker chart endpoints
        const mockChartData = {
            priceHistory: generateMockPriceHistory(24),
            ohlcvData: generateMockOHLCV(24),
            period: period
        }
        
        return NextResponse.json(mockChartData)
        
    } catch (error) {
        console.error('❌ Error fetching chart data:', error)
        
        // Return mock chart data if API fails
        const mockChartData = {
            priceHistory: generateMockPriceHistory(24),
            ohlcvData: generateMockOHLCV(24),
            period: '24h'
        }
        
        return NextResponse.json(mockChartData)
    }
} 