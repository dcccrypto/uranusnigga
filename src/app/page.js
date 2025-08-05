'use client'

import { useEffect, useState } from 'react'
import Particles from './components/Particles'
import LoadingScreen from './components/LoadingScreen'
import ContractAddress from './components/ContractAddress'
import TopStats from './components/TopStats'
import AnalyticsGrid from './components/AnalyticsGrid'
import CommunityCard from './components/CommunityCard'
import NotificationContainer from './components/NotificationContainer'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const [communityData, setCommunityData] = useState({
    twitterFollowers: 0,
    communityMembers: 0,
    twitterGrowth: 0,
    communityGrowth: 0
  })

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      fetchDashboardData()
      fetchCommunityData()
    }
  }, [isLoading])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard-data')
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const fetchCommunityData = async () => {
    try {
      // Simulate community data fetching
      const mockCommunityData = {
        twitterFollowers: 6594,
        communityMembers: 2672,
        twitterGrowth: 12.5,
        communityGrowth: 8.3
      }
      setCommunityData(mockCommunityData)
    } catch (error) {
      console.error('Error fetching community data:', error)
    }
  }

  const refreshData = () => {
    fetchDashboardData()
    fetchCommunityData()
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      <Particles />
      
      <main className="dashboard-section">
        <div className="dashboard-container">
          <header className="dashboard-header">
            <h1 className="dashboard-title">UrAnus Anal-ytics Dashboard</h1>
            <p className="dashboard-subtitle">Advanced blockchain anal-ytics</p>
          </header>

          <ContractAddress />

          <TopStats data={dashboardData} />

          <AnalyticsGrid 
            data={dashboardData} 
            onRefresh={refreshData}
          />

          <CommunityCard data={communityData} />
        </div>
      </main>

      <NotificationContainer />
    </>
  )
} 