const { MongoClient } = require('mongodb');
require('dotenv').config();

// ข้อมูลตัวอย่างสำหรับผู้เล่น
const samplePlayers = {
    players: [
        // Team 1
        {
            playerName: "SkyKing",
            team: "Thunder Dragons",
            position: "Top",
            kills: 156,
            deaths: 28,
            assists: 89,
            goldPerMin: 425,
            damage: "245.8K"
        },
        {
            playerName: "JungleMaster",
            team: "Thunder Dragons",
            position: "Jungle",
            kills: 198,
            deaths: 35,
            assists: 156,
            goldPerMin: 385,
            damage: "198.5K"
        },
        {
            playerName: "MidLord",
            team: "Thunder Dragons",
            position: "Mid",
            kills: 205,
            deaths: 42,
            assists: 142,
            goldPerMin: 438,
            damage: "289.3K"
        },
        {
            playerName: "ADCPro",
            team: "Thunder Dragons",
            position: "ADC",
            kills: 218,
            deaths: 38,
            assists: 124,
            goldPerMin: 485,
            damage: "312.6K"
        },
        {
            playerName: "SupportKing",
            team: "Thunder Dragons",
            position: "Support",
            kills: 45,
            deaths: 52,
            assists: 267,
            goldPerMin: 245,
            damage: "89.2K"
        },
        // Team 2
        {
            playerName: "IcePhoenix",
            team: "Crystal Legends",
            position: "Top",
            kills: 142,
            deaths: 31,
            assists: 76,
            goldPerMin: 412,
            damage: "221.4K"
        },
        {
            playerName: "ForestRunner",
            team: "Crystal Legends",
            position: "Jungle",
            kills: 176,
            deaths: 40,
            assists: 148,
            goldPerMin: 375,
            damage: "185.9K"
        },
        {
            playerName: "MysticMage",
            team: "Crystal Legends",
            position: "Mid",
            kills: 189,
            deaths: 45,
            assists: 158,
            goldPerMin: 420,
            damage: "267.8K"
        },
        {
            playerName: "SilverArrow",
            team: "Crystal Legends",
            position: "ADC",
            kills: 201,
            deaths: 41,
            assists: 135,
            goldPerMin: 468,
            damage: "298.5K"
        },
        {
            playerName: "HealerWitch",
            team: "Crystal Legends",
            position: "Support",
            kills: 38,
            deaths: 55,
            assists: 245,
            goldPerMin: 238,
            damage: "76.4K"
        },
        // Team 3
        {
            playerName: "InfernoKing",
            team: "Burning Hawks",
            position: "Top",
            kills: 167,
            deaths: 26,
            assists: 98,
            goldPerMin: 441,
            damage: "265.2K"
        },
        {
            playerName: "ShadowHunter",
            team: "Burning Hawks",
            position: "Jungle",
            kills: 210,
            deaths: 32,
            assists: 167,
            goldPerMin: 395,
            damage: "215.7K"
        },
        {
            playerName: "ArcaneWizard",
            team: "Burning Hawks",
            position: "Mid",
            kills: 223,
            deaths: 38,
            assists: 165,
            goldPerMin: 455,
            damage: "301.2K"
        },
        {
            playerName: "VenomSlayer",
            team: "Burning Hawks",
            position: "ADC",
            kills: 234,
            deaths: 35,
            assists: 142,
            goldPerMin: 498,
            damage: "325.9K"
        },
        {
            playerName: "WardMaster",
            team: "Burning Hawks",
            position: "Support",
            kills: 52,
            deaths: 48,
            assists: 289,
            goldPerMin: 258,
            damage: "95.8K"
        }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
};

async function seedPlayers() {
    let client;
    
    try {
        console.log('🔄 กำลังเชื่อมต่อกับ MongoDB Atlas...\n');
        
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        
        console.log('✅ เชื่อมต่อสำเร็จ!\n');
        
        const db = client.db('rov_sn_tournament_2026');
        const collection = db.collection('players');
        
        // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
        const existingCount = await collection.countDocuments();
        console.log(`📊 พบข้อมูลเดิม: ${existingCount} รายการ`);
        
        if (existingCount > 0) {
            console.log('⚠️  มีข้อมูลอยู่แล้ว ต้องการลบและเพิ่มใหม่หรือไม่?');
            console.log('   (กำลังเพิ่มข้อมูลใหม่โดยไม่ลบของเดิม...)\n');
        }
        
        // เพิ่มข้อมูลตัวอย่าง
        const result = await collection.insertOne(samplePlayers);
        
        console.log('✅ เพิ่มข้อมูลผู้เล่นสำเร็จ!');
        console.log(`📝 Document ID: ${result.insertedId}`);
        console.log('\n📦 ข้อมูลที่เพิ่มเข้าไป:');
        console.log(`   - จำนวนผู้เล่น: ${samplePlayers.players.length} คน`);
        
        // แสดง top 5 players by kills
        console.log('\n🔥 Top 5 Kills:');
        const sortedByKills = [...samplePlayers.players].sort((a, b) => b.kills - a.kills);
        sortedByKills.slice(0, 5).forEach((player, idx) => {
            console.log(`   ${idx + 1}. ${player.playerName} (${player.team}) - ${player.kills} kills`);
        });
        
        console.log('\n🎉 สำเร็จ! ตอนนี้คุณสามารถเปิดเว็บไซต์และดูสถิติผู้เล่นได้แล้ว');
        console.log('🌐 เปิด players.html ใน browser เพื่อดูผล');
        
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
seedPlayers();
