'use client'

export default function CommunityCard({ data }) {
  const formatNumber = (num) => {
    return num.toLocaleString()
  }

  const formatGrowth = (growth) => {
    if (growth > 0) {
      return `+${growth.toFixed(1)}%`
    } else if (growth < 0) {
      return `${growth.toFixed(1)}%`
    }
    return '0.0%'
  }

  const getGrowthClass = (growth) => {
    if (growth > 0) return 'positive'
    if (growth < 0) return 'negative'
    return 'neutral'
  }

  return (
    <section className="community-section">
      <article className="community-card">
        <header className="card-header">
          <div>
            <h3>Community Metrics</h3>
            <span className="subtitle">Social media engagement and community growth</span>
          </div>
        </header>
        <div className="community-metrics">
          <div className="community-metric">
            <div className="metric-content">
              <div className="metric-label">Twitter Followers</div>
              <div className="metric-value">{formatNumber(data.twitterFollowers)}</div>
              <div className={`metric-growth ${getGrowthClass(data.twitterGrowth)}`}>
                {formatGrowth(data.twitterGrowth)}
              </div>
            </div>
          </div>
          <div className="community-separator"></div>
          <div className="community-metric">
            <div className="metric-content">
              <div className="metric-label">X Community Members</div>
              <div className="metric-value">{formatNumber(data.communityMembers)}</div>
              <div className={`metric-growth ${getGrowthClass(data.communityGrowth)}`}>
                {formatGrowth(data.communityGrowth)}
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  )
} 