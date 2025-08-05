# Uranus Token Analytics Dashboard - Next.js Version

A professional blockchain analytics dashboard for the Uranus token, built with Next.js and featuring real-time data from the Solana Tracker API.

## Features

- **Real-time Analytics**: Live data from Solana Tracker API
- **Professional UI**: Modern, responsive design with animated elements
- **Interactive Components**: Copy functionality, notifications, and smooth animations
- **Community Metrics**: Social media engagement tracking
- **Top Holders**: Leaderboard of largest token holders
- **Performance Metrics**: Market cap, volume, price changes, and more

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: CSS with custom animations and responsive design
- **API**: Solana Tracker API integration
- **Environment**: Node.js

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd uranus-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
SOLANA_TRACKER_API_KEY=your_api_key_here
CONTRACT_ADDRESS=BFgdzMkTPdKKJeTipv2njtDEwhKxkgFueJQfJGt1jups
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
uranus-nextjs/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── dashboard-data/     # Main dashboard data endpoint
│   │   │   ├── chart-data/         # Chart data endpoint
│   │   │   └── health/             # Health check endpoint
│   │   ├── components/             # React components
│   │   │   ├── AnalyticsGrid.js
│   │   │   ├── CommunityCard.js
│   │   │   ├── ContractAddress.js
│   │   │   ├── LoadingScreen.js
│   │   │   ├── NotificationContainer.js
│   │   │   ├── Particles.js
│   │   │   └── TopStats.js
│   │   ├── globals.css             # Global styles
│   │   ├── layout.js               # Root layout
│   │   └── page.js                 # Main page component
│   └── ...
├── .env                            # Environment variables
├── next.config.js                  # Next.js configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

## API Endpoints

- `GET /api/dashboard-data` - Main dashboard data
- `GET /api/chart-data?period=24h` - Chart data for specified period
- `GET /api/health` - Health check endpoint

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features

### Dashboard Components

1. **Contract Address Section**: Displays the Uranus token contract address with copy functionality
2. **Top Stats Grid**: Shows key metrics like market cap, volume, holders, and price
3. **Analytics Grid**: Performance metrics and top holders leaderboard
4. **Community Card**: Social media metrics and growth tracking

### Interactive Features

- **Copy to Clipboard**: Contract address and wallet addresses
- **Notifications**: Success/error feedback for user actions
- **Animated Numbers**: Smooth number animations on data load
- **Responsive Design**: Works on all device sizes
- **Loading States**: Professional loading screens and states

### Data Sources

- **Solana Tracker API**: Real-time blockchain data
- **Mock Data**: Fallback data when API is unavailable
- **Community Metrics**: Simulated social media data

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SOLANA_TRACKER_API_KEY` | API key for Solana Tracker | Yes |
| `CONTRACT_ADDRESS` | Uranus token contract address | Yes |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue on GitHub or contact the development team.

---

**Uranus Token Team** - Building the future of blockchain analytics 🪐 