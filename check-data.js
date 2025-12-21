const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkData() {
    let client;
    
    try {
        console.log('🔄 กำลังเชื่อมต่อกับ MongoDB Atlas...\n');
        
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        
        console.log('✅ เชื่อมต่อสำเร็จ!\n');
        
        const db = client.db('rov_sn_tournament_2026');
        const collection = db.collection('schedules');
        
        // นับจำนวนข้อมูล
        const count = await collection.countDocuments();
        console.log(`📊 จำนวนข้อมูลทั้งหมด: ${count} รายการ\n`);
        
        if (count === 0) {
            console.log('⚠️  ไม่มีข้อมูลใน Database!');
            console.log('💡 แนะนำ: รัน "node seed-data.js" เพื่อเพิ่มข้อมูลตัวอย่าง\n');
            return;
        }
        
        // ดึงข้อมูลล่าสุด
        const latestData = await collection
            .findOne({}, { sort: { createdAt: -1 } });
        
        console.log('📦 ข้อมูลล่าสุด:');
        console.log('─'.repeat(50));
        console.log(`🆔 Document ID: ${latestData._id}`);
        console.log(`📅 สร้างเมื่อ: ${latestData.createdAt?.toLocaleString('th-TH')}`);
        console.log(`📅 อัพเดทเมื่อ: ${latestData.updatedAt?.toLocaleString('th-TH')}\n`);
        
        console.log(`🔵 POT A (${latestData.potA?.length || 0} ทีม):`);
        if (latestData.potA) {
            latestData.potA.forEach((team, idx) => {
                console.log(`   ${idx + 1}. ${team}`);
            });
        }
        
        console.log(`\n🔴 POT B (${latestData.potB?.length || 0} ทีม):`);
        if (latestData.potB) {
            latestData.potB.forEach((team, idx) => {
                console.log(`   ${idx + 1}. ${team}`);
            });
        }
        
        console.log(`\n📅 ตารางแข่ง (${latestData.schedule?.length || 0} วัน):`);
        if (latestData.schedule) {
            latestData.schedule.forEach((day) => {
                console.log(`\n   🗓️  Day ${day.day} - ${day.type}`);
                console.log(`      จำนวนแมตช์: ${day.matches?.length || 0} แมตช์`);
                if (day.matches) {
                    day.matches.forEach((match, idx) => {
                        console.log(`      ${idx + 1}. ${match.blue} vs ${match.red}`);
                    });
                }
            });
        }
        
        console.log('\n' + '─'.repeat(50));
        console.log('✅ ตรวจสอบข้อมูลเสร็จสิ้น!\n');
        
    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาด:', error.message);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

checkData();
