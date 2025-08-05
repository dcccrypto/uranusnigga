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
  const [showWelcome, setShowWelcome] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [communityData, setCommunityData] = useState({
    twitterFollowers: 0,
    communityMembers: 0,
    twitterGrowth: 0,
    communityGrowth: 0
  })

  useEffect(() => {
    if (!showWelcome && !isLoading) {
      fetchDashboardData()
      fetchCommunityData()
    }
  }, [showWelcome, isLoading])

  const handleEnterApp = () => {
    setIsLoading(true)
    // The LoadingScreen component will handle the transition
    setTimeout(() => {
      setShowWelcome(false)
      setIsLoading(false)
    }, 1500)
  }

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

  if (showWelcome) {
    return <LoadingScreen onEnterApp={handleEnterApp} />
  }

  return (
    <>
      <Particles />
      
      <main className="dashboard-section">
        <div className="dashboard-container">
          <header className="dashboard-header">
            <h1 className="dashboard-title">UrAnus Analytics Dashboard</h1>
            <p className="dashboard-subtitle">Advanced blockchain analytics</p>
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