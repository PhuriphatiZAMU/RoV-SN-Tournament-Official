const { MongoClient } = require('mongodb');
require('dotenv').config();

// ข้อมูลตัวอย่างสำหรับทดสอบระบบ
const sampleData = {
    potA: [
        "TEAM ALPHA",
        "TEAM BRAVO", 
        "TEAM CHARLIE",
        "TEAM DELTA"
    ],
    potB: [
        "TEAM ECHO",
        "TEAM FOXTROT",
        "TEAM GOLF",
        "TEAM HOTEL"
    ],
    schedule: [
        {
            day: 1,
            type: "Group Stage - Round 1",
            matches: [
                { blue: "TEAM ALPHA", red: "TEAM ECHO" },
                { blue: "TEAM BRAVO", red: "TEAM FOXTROT" },
                { blue: "TEAM CHARLIE", red: "TEAM GOLF" },
                { blue: "TEAM DELTA", red: "TEAM HOTEL" }
            ]
        },
        {
            day: 2,
            type: "Group Stage - Round 2",
            matches: [
                { blue: "TEAM ALPHA", red: "TEAM FOXTROT" },
                { blue: "TEAM BRAVO", red: "TEAM ECHO" },
                { blue: "TEAM CHARLIE", red: "TEAM HOTEL" },
                { blue: "TEAM DELTA", red: "TEAM GOLF" }
            ]
        },
        {
            day: 3,
            type: "Group Stage - Round 3",
            matches: [
                { blue: "TEAM ALPHA", red: "TEAM GOLF" },
                { blue: "TEAM BRAVO", red: "TEAM HOTEL" },
                { blue: "TEAM CHARLIE", red: "TEAM ECHO" },
                { blue: "TEAM DELTA", red: "TEAM FOXTROT" }
            ]
        },
        {
            day: 4,
            type: "Group Stage - Final Round",
            matches: [
                { blue: "TEAM ALPHA", red: "TEAM HOTEL" },
                { blue: "TEAM BRAVO", red: "TEAM GOLF" },
                { blue: "TEAM CHARLIE", red: "TEAM FOXTROT" },
                { blue: "TEAM DELTA", red: "TEAM ECHO" }
            ]
        }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
};

async function seedDatabase() {
    let client;
    
    try {
        console.log('🔄 กำลังเชื่อมต่อกับ MongoDB Atlas...');
        
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        
        console.log('✅ เชื่อมต่อสำเร็จ!');
        
        const db = client.db('rov_sn_tournament_2026');
        const collection = db.collection('schedules');
        
        // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
        const existingCount = await collection.countDocuments();
        console.log(`📊 พบข้อมูลเดิม: ${existingCount} รายการ`);
        
        if (existingCount > 0) {
            console.log('⚠️  มีข้อมูลอยู่แล้ว ต้องการลบและเพิ่มใหม่หรือไม่?');
            console.log('   (กำลังเพิ่มข้อมูลใหม่โดยไม่ลบของเดิม...)');
        }
        
        // เพิ่มข้อมูลตัวอย่าง
        const result = await collection.insertOne(sampleData);
        
        console.log('✅ เพิ่มข้อมูลตัวอย่างสำเร็จ!');
        console.log(`📝 Document ID: ${result.insertedId}`);
        console.log('\n📦 ข้อมูลที่เพิ่มเข้าไป:');
        console.log(`   - POT A: ${sampleData.potA.length} ทีม`);
        console.log(`   - POT B: ${sampleData.potB.length} ทีม`);
        console.log(`   - ตารางแข่ง: ${sampleData.schedule.length} วัน`);
        console.log(`   - จำนวนแมตช์: ${sampleData.schedule.reduce((sum, day) => sum + day.matches.length, 0)} แมตช์`);
        
        console.log('\n🎉 สำเร็จ! ตอนนี้คุณสามารถเปิดเว็บไซต์และดูข้อมูลได้แล้ว');
        console.log('🌐 เปิด index.html ใน browser เพื่อดูผล');
        
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
seedDatabase();
