# ROV SN Tournament 2026 - Official Hub

🏆 Official tournament management website for ROV SN Tournament 2026 with real-time data from MongoDB Atlas.

## 🚀 Features

- **Live Tournament Schedule** - Real-time match schedules with results
- **Standings & Rankings** - Dynamic team standings and points tracking  
- **Player Statistics** - Individual player performance metrics
- **Responsive Design** - Works on Desktop, Tablet, and Mobile

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript ES6
- Bootstrap 5 & Tailwind CSS
- Font Awesome Icons

**Backend:**
- Node.js + Express.js
- MongoDB Atlas (Cloud Database)
- RESTful API Architecture

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/PhuriphatiZAMU/RoVSN-Official_Hub.git
cd RoVSN-Official_Hub
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=3001
```

4. **Start the server**
```bash
npm start
```

The server will run on `http://localhost:3001`

## 🌐 Deployment

### Deploy to Render

1. **Create account** at [render.com](https://render.com)

2. **Create New Web Service**
   - Connect your GitHub repository
   - Select branch: `main`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables**
   - Key: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string

4. **Deploy!** 🎉

### Deploy to Railway

1. **Create account** at [railway.app](https://railway.app)

2. **New Project → Deploy from GitHub**
   - Select your repository
   - Railway auto-detects Node.js

3. **Add Environment Variables**
   - `MONGODB_URI`: Your connection string

4. **Deploy automatically** 🚀

### Deploy to Vercel (Serverless)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Configure vercel.json** (already included)

3. **Deploy**
```bash
vercel --prod
```

## 📁 Project Structure

```
RoVSN-Official_Hub/
├── css/
│   └── styles.css          # Custom styles
├── html/
│   ├── news-detail.html    # News detail page
│   ├── players.html        # Player statistics
│   ├── schedule.html       # Match schedule
│   ├── table.html          # Team standings
│   └── teams.html          # Team list
├── img/                    # Images and assets
├── js/
│   ├── app.js              # Frontend logic
│   ├── data.js             # Static data
│   ├── navigation.js       # Navigation handler
│   └── server.js           # Express backend
├── json/
│   ├── package.json        # Dependencies
│   └── vercel.json         # Vercel config
├── Key-Visual-img/         # Tournament key visuals
├── index.html              # Home page
└── README.md               # Documentation
```

## 🔑 API Endpoints

### Schedules
- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/latest` - Get latest schedule

### Standings
- `GET /api/standings` - Get all standings
- `GET /api/standings/latest` - Get latest standings

### Players
- `GET /api/players` - Get all players
- `GET /api/players/latest` - Get latest player stats

### Match Results
- `GET /api/schedule-results/latest` - Get latest results

### Health Check
- `GET /api/health` - Server health status

## 🔒 Security

- Environment variables stored in `.env` (not committed to Git)
- CORS enabled for specific origins only
- MongoDB connection uses authentication
- Input validation on all API endpoints

## 📝 License

Copyright © 2026 RoV SN Tournament. All rights reserved.

## 👨‍💻 Developer

**PhuriphatiZAMU**
- GitHub: [@PhuriphatiZAMU](https://github.com/PhuriphatiZAMU)

## 🆘 Support

For issues or questions, please open an issue on GitHub or contact the developer.

---

Made with ❤️ for ROV SN Tournament 2026
