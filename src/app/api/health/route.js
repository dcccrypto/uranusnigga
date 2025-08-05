import { NextResponse } from 'next/server'

// Solana Tracker API configuration
const SOLANA_TRACKER_API_KEY = process.env.SOLANA_TRACKER_API_KEY
const BASE_URL = 'https://data.solanatracker.io'

// Helper function to make API calls with proper headers
async function makeSolanaTrackerRequest(endpoint) {
    try {
        console.log(`Making request to: ${endpoint}`)
        
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: {
                'x-api-key': SOLANA_TRACKER_API_KEY,
                'Content-Type': 'application/json'
            }
        })

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
        throw error
    }
}

export async function GET() {
    try {
        // Test API connection with a simple request
        const credits = await makeSolanaTrackerRequest('/credits')
        
        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            apiCredits: credits.credits,
            message: 'Solana Tracker API is working correctly'
        })
    } catch (error) {
        return NextResponse.json({ 
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message,
            message: 'API connection failed - using mock data'
        }, { status: 500 })
    }
} 