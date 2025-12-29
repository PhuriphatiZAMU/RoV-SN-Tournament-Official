require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); // 1. Import mongoose ก่อนเสมอ
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(cors({
    origin: 'https://phuriphatizamu.github.io' // อนุญาตเฉพาะเว็บของเรา
}));

// --- Database Connection ---
// ใน Production แนะนำให้ใช้ process.env.MONGO_URI แต่ถ้า hardcode ไว้ก็ต้องแน่ใจว่า string ถูกต้อง
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://phuriphatizamu_db_user:nNkkDsJQiDcI4uh3@cluster.bi2ornw.mongodb.net/rov_sn_tournament_2026?retryWrites=true&w=majority&appName=Cluster";

console.log("🔄 Connecting to MongoDB...");
mongoose.connect(MONGO_URI)
    .then(() => console.log(`✅ MongoDB Connected`))
    .catch(err => console.error('❌ MongoDB Error:', err));

// --- Schemas & Models (ประกาศหลังจาก Import mongoose แล้ว) ---

// 1. Schedule Schema
const ScheduleSchema = new mongoose.Schema({
    teams: [String],
    potA: [String],
    potB: [String],
    schedule: Array,
    createdAt: { type: Date, default: Date.now }
});
const Schedule = mongoose.model('Schedule', ScheduleSchema, 'schedules');

// 2. Result Schema
const ResultSchema = new mongoose.Schema({
    matchId: String,
    matchDay: Number,
    teamBlue: String,
    teamRed: String,
    scoreBlue: Number,
    scoreRed: Number,
    winner: String,
    loser: String,
    gameDetails: Array,
    createdAt: { type: Date, default: Date.now }
});
const Result = mongoose.model('Result', ResultSchema, 'results');

// 3. Game Stat Schema (ต้องประกาศหลังจาก mongoose ถูก import แล้วเช่นกัน)
const GameStatSchema = new mongoose.Schema({
    matchId: String,
    gameNumber: Number,
    teamName: String,
    playerName: String,
    kills: Number,
    deaths: Number,
    assists: Number,
    gold: Number,
    damage: Number,
    damageTaken: Number,
    mvp: Boolean,
    gameDuration: Number,
    win: Boolean,
    createdAt: { type: Date, default: Date.now }
});
const GameStat = mongoose.model('GameStat', GameStatSchema, 'gamestats');


// --- API Routes ---

app.get('/', (req, res) => {
    res.send('<h1>RoV SN Tournament API</h1><p>Status: Online</p>');
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// GET: Schedules
app.get('/api/schedules', async (req, res) => {
    try {
        const latest = await Schedule.findOne().sort({ createdAt: -1 });
        if (!latest) return res.status(404).json({ message: "No schedule found" });
        res.json(latest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Schedules
app.post('/api/schedules', async (req, res) => {
    try {
        const newSchedule = new Schedule(req.body);
        const saved = await newSchedule.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Results
app.get('/api/results', async (req, res) => {
    try {
        const results = await Result.find().sort({ matchDay: 1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Results
app.post('/api/results', async (req, res) => {
    try {
        const { matchDay, teamBlue, teamRed, scoreBlue, scoreRed } = req.body;
        
        let winner = null;
        let loser = null;
        if (scoreBlue > scoreRed) {
            winner = teamBlue;
            loser = teamRed;
        } else {
            winner = teamRed;
            loser = teamBlue;
        }

        const matchId = `${matchDay}_${teamBlue}_vs_${teamRed}`.replace(/\s+/g, '');

        const resultData = {
            matchId, matchDay, teamBlue, teamRed, scoreBlue, scoreRed, winner, loser
        };

        const result = await Result.findOneAndUpdate(
            { matchId: matchId }, 
            resultData, 
            { upsert: true, new: true }
        );

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Player Stats
app.get('/api/player-stats', async (req, res) => {
    try {
        const stats = await GameStat.aggregate([
            {
                $group: {
                    _id: { playerName: "$playerName", teamName: "$teamName" },
                    totalKills: { $sum: "$kills" },
                    totalDeaths: { $sum: "$deaths" },
                    totalAssists: { $sum: "$assists" },
                    totalGold: { $sum: "$gold" },
                    gamesPlayed: { $sum: 1 },
                    mvpCount: { $sum: { $cond: ["$mvp", 1, 0] } }
                }
            },
            {
                $project: {
                    playerName: "$_id.playerName",
                    teamName: "$_id.teamName",
                    totalKills: 1, totalDeaths: 1, totalAssists: 1, totalGold: 1, gamesPlayed: 1, mvpCount: 1,
                    kda: { 
                        $cond: [
                            { $eq: ["$totalDeaths", 0] }, 
                            { $add: ["$totalKills", "$totalAssists"] }, 
                            { $divide: [{ $add: ["$totalKills", "$totalAssists"] }, "$totalDeaths"] }
                        ]
                    },
                    gpm: { $divide: ["$totalGold", "$gamesPlayed"] }
                }
            },
            { $sort: { kda: -1 } }
        ]);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Team Stats
app.get('/api/team-stats', async (req, res) => {
    try {
        const stats = await GameStat.aggregate([
            {
                $group: {
                    _id: "$teamName",
                    totalKills: { $sum: "$kills" },
                    totalDeaths: { $sum: "$deaths" },
                    totalAssists: { $sum: "$assists" },
                    totalGold: { $sum: "$gold" },
                    gamesPlayed: { $sum: 1 },
                    wins: { $sum: { $cond: ["$win", 1, 0] } }
                }
            },
            {
                $project: {
                    teamName: "$_id",
                    totalKills: 1, totalDeaths: 1, totalAssists: 1, totalGold: 1,
                    // Assuming 5 players per team, divide by 5 to get actual team stats
                    realGamesPlayed: { $ceil: { $divide: ["$gamesPlayed", 5] } }, 
                    realWins: { $ceil: { $divide: ["$wins", 5] } }
                }
            },
            { $sort: { realWins: -1 } }
        ]);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Season Stats (Updated to include Total Deaths)
app.get('/api/season-stats', async (req, res) => {
    try {
        const stats = await GameStat.aggregate([
            {
                $group: {
                    _id: null,
                    totalKills: { $sum: "$kills" },
                    totalDeaths: { $sum: "$deaths" }, // เพิ่มบรรทัดนี้
                    avgGameDuration: { $avg: "$gameDuration" },
                    totalDarkSlayers: { $sum: 0 }
                }
            }
        ]);
        res.json(stats[0] || { totalKills: 0, totalDeaths: 0, avgGameDuration: 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Stats (Batch Insert)
app.post('/api/stats', async (req, res) => {
    try {
        const statsArray = req.body;
        if (!Array.isArray(statsArray)) {
            return res.status(400).json({ error: "Data must be an array of player stats" });
        }
        const savedStats = await GameStat.insertMany(statsArray);
        res.status(201).json(savedStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));