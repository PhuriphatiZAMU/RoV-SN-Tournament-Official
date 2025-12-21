// seed-schedule-results.js - สร้างข้อมูลผลการแข่งขันเริ่มต้น
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function seedResults() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas');
        
        const db = client.db('rov_sn_tournament_2026');
        const collection = db.collection('schedule_results');
        
        // ลบข้อมูลเก่าทั้งหมด
        await collection.deleteMany({});
        console.log('🗑️  Cleared old results');
        
        // สร้างโครงสร้างผลการแข่งขัน 8 วัน
        const results = [];
        for (let day = 0; day < 8; day++) {
            const dayData = {
                day: day + 1,
                matches: []
            };
            
            // แต่ละวันมี 4 แมตช์
            for (let match = 0; match < 4; match++) {
                dayData.matches.push({
                    team1: '',
                    team2: '',
                    team1Score: undefined,
                    team2Score: undefined,
                    status: 'scheduled',
                    updatedAt: null
                });
            }
            
            results.push(dayData);
        }
        
        // สร้าง document
        const document = {
            results: results,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        await collection.insertOne(document);
        console.log('✅ Created initial schedule_results structure');
        console.log('📊 Structure: 8 days × 4 matches per day');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
        console.log('👋 Disconnected from MongoDB');
    }
}

seedResults();
