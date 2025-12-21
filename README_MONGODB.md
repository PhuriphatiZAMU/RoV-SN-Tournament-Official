# 🏆 ROV SN Tournament 2026 - Official Hub (MongoDB Version)

Official Tournament Hub for RoV SN Tournament 2026 with MongoDB Atlas Backend

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

The `.env` file is already configured with your MongoDB Atlas credentials:

```
MONGODB_URI=mongodb+srv://phuriphatizamu_db_user:nNkkDsJQiDcI4uh3@cluster.bi2ornw.mongodb.net/rov_sn_tournament_2026
PORT=3001
```

### 3. Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

You should see:

```
✅ Connected to MongoDB Atlas
📦 Database: rov_sn_tournament_2026
🚀 Server is running on http://localhost:3001
📡 API Base URL: http://localhost:3001/api
💚 Health Check: http://localhost:3001/api/health
📊 Schedules: http://localhost:3001/api/schedules
```

### 4. Open the Website

Simply open `index.html` in your browser or use a live server extension in VS Code.

---

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and database connection state.

### Get All Schedules
```
GET /api/schedules
```
Returns all tournament schedules sorted by latest first.

### Get Latest Schedule
```
GET /api/schedules/latest
```
Returns only the most recent schedule.

### Create New Schedule
```
POST /api/schedules
```
Body example:
```json
{
  "potA": ["Team1", "Team2", "Team3", "Team4"],
  "potB": ["Team5", "Team6", "Team7", "Team8"],
  "schedule": [
    {
      "day": 1,
      "type": "Group Stage",
      "matches": [
        { "blue": "Team1", "red": "Team5" },
        { "blue": "Team2", "red": "Team6" }
      ]
    }
  ]
}
```

### Update Schedule
```
PUT /api/schedules/:id
```

### Delete Schedule
```
DELETE /api/schedules/:id
```

---

## 🗂️ Database Structure

**Database:** `rov_sn_tournament_2026`

**Collection:** `tournament_schedules`

**Document Schema:**
```javascript
{
  "_id": ObjectId,
  "potA": ["Team1", "Team2", ...],
  "potB": ["Team5", "Team6", ...],
  "schedule": [
    {
      "day": 1,
      "type": "Group Stage",
      "matches": [
        { "blue": "TeamName", "red": "TeamName" }
      ]
    }
  ],
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

---

## 🔧 Technologies Used

### Frontend
- HTML5
- CSS3 (Tailwind CSS + Custom Styles)
- Vanilla JavaScript (ES6 Modules)
- Bootstrap 5 (Carousel Components)
- Font Awesome Icons

### Backend
- Node.js
- Express.js
- MongoDB Atlas (Cloud Database)
- CORS
- dotenv

---

## 📁 Project Structure

```
RoVSN-Official_Hub/
├── index.html              # Main page
├── schedule.html           # Schedule page
├── standings.html          # Standings page
├── teams.html             # Teams page
├── players.html           # Players page
├── news-detail.html       # News detail page
├── styles.css             # Custom styles
├── app.js                 # Main frontend logic (MongoDB version)
├── data.js                # Static data (KV & News)
├── navigation.js          # Navigation handler
├── server.js              # Backend API server
├── package.json           # Node.js dependencies
├── .env                   # Environment variables (MongoDB credentials)
├── .gitignore            # Git ignore rules
└── img/                  # Images folder
    └── Key-Visual-img/   # Key Visual images
```

---

## 🔐 Security Note

⚠️ **IMPORTANT:** Never commit the `.env` file to Git. It contains sensitive database credentials!

The `.gitignore` file is configured to exclude:
- `.env` files
- `node_modules/`
- Log files
- OS temporary files

---

## 🐛 Troubleshooting

### Server won't start
- Check if MongoDB URI is correct in `.env`
- Ensure port 3001 is not in use
- Run `npm install` to install dependencies

### Frontend shows "Server Offline"
- Make sure the server is running (`npm start`)
- Check browser console for CORS errors
- Verify API_BASE_URL in `app.js` is `http://localhost:3001/api`

### No data showing
- Check MongoDB Atlas connection
- Verify the collection name is `tournament_schedules`
- Use POST endpoint to create test data

---

## 👨‍💻 Development

**Author:** PhuriphatiZAMU  
**Year:** 2026  
**License:** ISC

---

## 📞 Support

For issues or questions, contact the development team.

---

**Powered by MongoDB Atlas & Express.js** 🚀
