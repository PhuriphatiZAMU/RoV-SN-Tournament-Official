import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, query } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { kvData, newsData } from './data.js';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBp022DX3ejcBUbIgmMAgXh1iOQZ5FcK5Y",
    authDomain: "rov-draft-f3f8c.firebaseapp.com",
    projectId: "rov-draft-f3f8c",
    storageBucket: "rov-draft-f3f8c.firebasestorage.app",
    messagingSenderId: "683405091548",
    appId: "1:683405091548:web:435ce7aa6f0552509e8a19",
    measurementId: "G-7ED6JWF1JH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const statusEl = document.getElementById('connectionStatus');
const mobileStatusEl = document.getElementById('mobileConnectionStatus');

function setConnectionStatus(state) {
    if (state === 'connected') {
        if (statusEl) statusEl.innerHTML = `<div class="w-2 h-2 rounded-full bg-green-500"></div> Connected`;
        if (mobileStatusEl) mobileStatusEl.innerHTML = `<span class="text-green-500">Connected</span>`;
        return;
    }
    if (state === 'error') {
        if (statusEl) statusEl.innerHTML = `<div class="w-2 h-2 rounded-full bg-red-500"></div> Error`;
        if (mobileStatusEl) mobileStatusEl.innerHTML = `<span class="text-red-500">Error</span>`;
        return;
    }
    if (statusEl) statusEl.innerHTML = `<div class="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div> Connecting...`;
    if (mobileStatusEl) mobileStatusEl.innerHTML = `Connecting...`;
}

// --- Key Visual Carousel Injection (Bootstrap 5) ---
export function initKVCarousel() {
    const container = document.getElementById('kv-carousel-inner');
    if (!container) return;
    
    let slidesHtml = '';
    kvData.forEach((kv, index) => {
        const isActive = index === 0 ? 'active' : '';
        slidesHtml += `
            <div class="carousel-item ${isActive} h-100">
                <img src="${kv.image}" class="d-block w-100 h-100 object-cover" alt="KV ${kv.year}">
                <div class="absolute inset-0 d-flex flex-column justify-content-center align-items-center text-white p-4 text-center kv-overlay">
                    <span class="text-primary-custom text-6xl font-heading font-bold mb-2">${kv.year}</span>
                    <h2 class="text-3xl md:text-5xl font-bold tracking-wide uppercase drop-shadow-lg">${kv.theme}</h2>
                    <div class="mt-4 w-16 h-1 bg-primary-custom rounded-full"></div>
                </div>
            </div>`;
    });
    container.innerHTML = slidesHtml;
}

// --- News Carousel Injection (Bootstrap 5) ---
export function renderNewsCarousel() {
    const inner = document.getElementById('news-carousel-inner');
    const indicators = document.getElementById('news-indicators');
    
    if (!inner || !indicators) return;
    
    inner.innerHTML = '';
    indicators.innerHTML = '';

    newsData.forEach((news, index) => {
        const isActive = index === 0 ? 'active' : '';
        
        // Indicators
        indicators.innerHTML += `<button type="button" data-bs-target="#newsCarousel" data-bs-slide-to="${index}" class="${isActive}" aria-label="Slide ${index + 1}"></button>`;

        // Slides
        const slide = document.createElement('div');
        slide.className = `carousel-item ${isActive} h-[400px] md:h-[450px] cursor-pointer`;
        slide.onclick = () => openNews(news.id);
        
        slide.innerHTML = `
            <img src="${news.image}" class="d-block w-100 h-100 object-cover" alt="${news.title}">
            <div class="carousel-caption d-none d-md-block text-start p-4 bg-gradient-to-t from-black/90 to-transparent bottom-0 start-0 end-0 w-100">
                <span class="bg-primary-custom text-white text-xs font-bold px-3 py-1 rounded shadow mb-2 d-inline-block uppercase">${news.category}</span>
                <h3 class="text-3xl font-heading font-bold text-white mb-2">${news.title}</h3>
                <p class="text-gray-300 text-sm">คลิกเพื่ออ่านเพิ่มเติม...</p>
            </div>
        `;
        inner.appendChild(slide);
    });
}

// Open News Detail
export function openNews(id) {
    const news = newsData.find(n => n.id === id);
    if (!news) return;

    // Store news data in sessionStorage for news-detail.html
    sessionStorage.setItem('selectedNews', JSON.stringify(news));
    
    // Navigate to news detail page
    window.location.href = `news-detail.html?id=${id}`;
}

// Main Fetch Function
export async function fetchTournamentData() {
    try {
        await signInAnonymously(auth);
        setConnectionStatus('connected');

        const q = query(collection(db, "tournament_schedules"));
        const querySnapshot = await getDocs(q);
        
        const schedules = querySnapshot.docs.map(d => d.data());

        if (schedules.length === 0) {
            renderNoData();
            return;
        }

        schedules.sort((a, b) => (b.savedAt?.seconds || 0) - (a.savedAt?.seconds || 0));
        const latestData = schedules[0];

        if (latestData?.schedule?.length) {
            renderUpNext(latestData.schedule);
            renderSchedule(latestData.schedule);
        } else {
            renderNoData();
        }
        if (latestData?.potA && latestData?.potB) {
            renderTeams(latestData.potA, latestData.potB);
            renderStandings(latestData.potA, latestData.potB);
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        setConnectionStatus('error');
        const scheduleContainer = document.getElementById('schedule-container');
        if (scheduleContainer) {
            scheduleContainer.innerHTML = 
                `<div class="text-center py-8 text-red-400">Failed to load data. Please try again.</div>`;
        }
    }
}

// --- Render Functions ---
export function renderUpNext(schedule) {
    const container = document.getElementById('up-next-container');
    if (!container) return;
    
    container.innerHTML = '';
    if (!schedule || schedule.length === 0) return;
    const firstDay = schedule[0];
    const matchesToShow = firstDay.matches.slice(0, 3);
    let cardsHtml = '';
    matchesToShow.forEach(match => {
        cardsHtml += `
            <div class="bg-gray-50 p-3 rounded-xl border border-gray-200 hover:border-primary-custom transition cursor-pointer group">
                <div class="flex justify-between items-center text-xs text-gray-500 mb-2 font-semibold">
                    <span>Day ${firstDay.day}, Match ${schedule[0].matches.indexOf(match) + 1}</span>
                    <span class="bg-gray-200 px-2 py-0.5 rounded text-[10px] text-gray-600">BO3</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 w-5/12">
                        <div class="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">${match.blue.substring(0,2)}</div>
                        <span class="font-bold text-sm text-gray-700 truncate group-hover:text-primary-custom transition">${match.blue}</span>
                    </div>
                    <span class="text-gray-400 text-xs font-bold bg-gray-100 px-2 py-1 rounded-full">VS</span>
                    <div class="flex items-center gap-2 w-5/12 flex-row-reverse text-right">
                        <div class="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">${match.red.substring(0,2)}</div>
                        <span class="font-bold text-sm text-gray-700 truncate group-hover:text-primary-custom transition">${match.red}</span>
                    </div>
                </div>
            </div>`;
    });
    container.innerHTML = cardsHtml;
}

export function renderSchedule(schedule) {
    const container = document.getElementById('schedule-container');
    if (!container) return;
    
    container.innerHTML = '';
    schedule.forEach(round => {
        container.innerHTML += `
            <div class="bg-white p-4 rounded-xl text-sm font-bold text-primary-custom border-l-4 border-primary-custom shadow-sm flex items-center justify-between mt-6">
                <span>Match Day ${round.day} • ${round.type}</span>
                <span class="text-gray-400 text-xs font-normal">BO3 Format</span>
            </div>
        `;
        round.matches.forEach(match => {
            container.innerHTML += `
                <div class="bg-white rounded-xl p-5 flex flex-col md:flex-row items-center justify-between border border-gray-100 card-shadow hover:border-primary-custom/30 transition">
                    <div class="flex items-center justify-center gap-4 w-full md:w-auto mb-4 md:mb-0 flex-grow">
                        <div class="flex items-center gap-4 w-2/5 justify-end">
                            <span class="font-bold text-lg text-gray-800 text-right">${match.blue}</span>
                            <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs border border-blue-200">${match.blue.substring(0,2)}</div>
                        </div>
                        <div class="px-4 py-1 rounded-lg text-sm font-bold text-gray-400 bg-gray-50">VS</div>
                        <div class="flex items-center gap-4 w-2/5">
                            <div class="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-xs border border-red-200">${match.red.substring(0,2)}</div>
                            <span class="font-bold text-lg text-gray-800">${match.red}</span>
                        </div>
                    </div>
                </div>
            `;
        });
    });
}

export function renderTeams(potA, potB) {
    const container = document.getElementById('teams-container');
    if (!container) return;
    
    container.innerHTML = '';
    const allTeams = [...potA, ...potB].sort();
    allTeams.forEach(team => {
        container.innerHTML += `
            <div class="bg-white border border-gray-200 p-6 rounded-xl flex flex-col items-center justify-center card-shadow hover:border-primary-custom transition cursor-pointer group">
                <div class="w-20 h-20 bg-gray-100 rounded-full mb-4 group-hover:scale-110 transition duration-300 shadow-inner flex items-center justify-center">
                    <span class="text-2xl font-bold text-gray-400 group-hover:text-primary-custom transition">${team.substring(0,1)}</span>
                </div>
                <span class="font-bold text-center text-sm text-gray-700 group-hover:text-primary-custom transition">${team}</span>
            </div>
        `;
    });
}

export function renderStandings(potA, potB) {
    const container = document.getElementById('standings-container');
    if (!container) return;
    
    container.innerHTML = '';
    const allTeams = [...potA, ...potB].sort();
    allTeams.forEach((team, index) => {
        container.innerHTML += `
            <tr class="hover:bg-blue-50/50 transition group">
                <td class="p-4 text-center font-bold text-lg text-gray-500">${index + 1}</td>
                <td class="p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-500">${team.substring(0,2)}</div>
                        <span class="font-bold group-hover:text-primary-custom transition">${team}</span>
                    </div>
                </td>
                <td class="p-4 text-center font-mono font-medium">0-0</td>
                <td class="p-4 text-center font-mono text-gray-500">0-0</td>
                <td class="p-4 text-center font-mono text-gray-400">0</td>
                <td class="p-4 text-center font-bold text-xl text-gray-800">0</td>
            </tr>
        `;
    });
}

export function renderNoData() {
    const scheduleContainer = document.getElementById('schedule-container');
    if (scheduleContainer) {
        scheduleContainer.innerHTML = `<div class="text-center py-10 text-gray-500">ยังไม่มีข้อมูลการจับสลาก <br>กรุณาทำการจับสลากและบันทึกข้อมูลก่อน</div>`;
    }
    const upNextContainer = document.getElementById('up-next-container');
    if (upNextContainer) {
        upNextContainer.innerHTML = `<div class="text-center py-10 text-gray-400 text-xs">No Match Data</div>`;
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    initKVCarousel();
    renderNewsCarousel();
    fetchTournamentData();
});

// Make openNews available globally
window.openNews = openNews;
