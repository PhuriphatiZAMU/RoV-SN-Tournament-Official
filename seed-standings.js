const { MongoClient } = require('mongodb');
require('dotenv').config();

// ข้อมูลตัวอย่างสำหรับตารางคะแนน
const sampleStandings = {
    teams: [
        {
            teamName: "Team 7",
            wins: 5,
            losses: 2,
            matchWins: 10,
            matchLosses: 4,
            points: 15
        },
        {
            teamName: "Team 5",
            wins: 4,
            losses: 3,
            matchWins: 9,
            matchLosses: 6,
            points: 12
        },
        {
            teamName: "Team 2",
            wins: 4,
            losses: 3,
            matchWins: 8,
            matchLosses: 6,
            points: 12
        },
        {
            teamName: "Team 11",
            wins: 3,
            losses: 4,
            matchWins: 7,
            matchLosses: 8,
            points: 9
        },
        {
            teamName: "Team 16",
            wins: 3,
            losses: 4,
            matchWins: 6,
            matchLosses: 8,
            points: 9
        },
        {
            teamName: "Team 14",
            wins: 2,
            losses: 5,
            matchWins: 5,
            matchLosses: 10,
            points: 6
        },
        {
            teamName: "Team 1",
            wins: 2,
            losses: 5,
            matchWins: 4,
            matchLosses: 10,
            points: 6
        },
        {
            teamName: "Team 12",
            wins: 1,
            losses: 6,
            matchWins: 3,
            matchLosses: 12,
            points: 3
        },
        {
            teamName: "Team 15",
            wins: 6,
            losses: 1,
            matchWins: 12,
            matchLosses: 2,
            points: 18
        },
        {
            teamName: "Team 6",
            wins: 5,
            losses: 2,
            matchWins: 11,
            matchLosses: 4,
            points: 15
        },
        {
            teamName: "Team 8",
            wins: 4,
            losses: 3,
            matchWins: 9,
            matchLosses: 6,
            points: 12
        },
        {
            teamName: "Team 9",
            wins: 3,
            losses: 4,
            matchWins: 7,
            matchLosses: 8,
            points: 9
        },
        {
            teamName: "Team 13",
            wins: 3,
            losses: 4,
            matchWins: 6,
            matchLosses: 8,
            points: 9
        },
        {
            teamName: "Team 3",
            wins: 2,
            losses: 5,
            matchWins: 5,
            matchLosses: 10,
            points: 6
        },
        {
            teamName: "Team 4",
            wins: 2,
            losses: 5,
            matchWins: 4,
            matchLosses: 10,
            points: 6
        },
        {
            teamName: "Team 10",
            wins: 1,
            losses: 6,
            matchWins: 2,
            matchLosses: 12,
            points: 3
        }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
};

async function seedStandings() {
    let client;
    
    try {
        console.log('🔄 กำลังเชื่อมต่อกับ MongoDB Atlas...\n');
        
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        
        console.log('✅ เชื่อมต่อสำเร็จ!\n');
        
        const db = client.db('rov_sn_tournament_2026');
        const collection = db.collection('standings');
        
        // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
        const existingCount = await collection.countDocuments();
        console.log(`📊 พบข้อมูลเดิม: ${existingCount} รายการ`);
        
        if (existingCount > 0) {
            console.log('⚠️  มีข้อมูลอยู่แล้ว ต้องการลบและเพิ่มใหม่หรือไม่?');
            console.log('   (กำลังเพิ่มข้อมูลใหม่โดยไม่ลบของเดิม...)\n');
        }
        
        // เพิ่มข้อมูลตัวอย่าง
        const result = await collection.insertOne(sampleStandings);
        
        console.log('✅ เพิ่มข้อมูลตารางคะแนนสำเร็จ!');
        console.log(`📝 Document ID: ${result.insertedId}`);
        console.log('\n📦 ข้อมูลที่เพิ่มเข้าไป:');
        console.log(`   - จำนวนทีม: ${sampleStandings.teams.length} ทีม`);
        console.log('\n🏆 ตารางคะแนน (Top 5):');
        
        // Sort and show top 5
        const sortedTeams = [...sampleStandings.teams].sort((a, b) => b.points - a.points);
        sortedTeams.slice(0, 5).forEach((team, idx) => {
            console.log(`   ${idx + 1}. ${team.teamName} - ${team.points} แต้ม (${team.wins}W-${team.losses}L)`);
        });
        
        console.log('\n🎉 สำเร็จ! ตอนนี้คุณสามารถเปิดเว็บไซต์และดูตารางคะแนนได้แล้ว');
        console.log('🌐 เปิด standings.html ใน browser เพื่อดูผล');
        
    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาด:', error.message);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
            console.log('\n✅ ปิดการเชื่อมต่อกับ MongoDB');
        }
    }
}

// รันสคริปต์
seedStandings();
