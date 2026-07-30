/***************************
 * 宋春蕾工作台 - 核心逻辑
 ***************************/

// === 数据存储 ===
const Storage = {
    get(key, def) { try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; } },
    set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
};

// 示例日记数据
const sampleDiaries = [
    {
        id: 1001, date: '2026-07-29', weather: '☀️', mood: '😊',
        tags: ['心情', '感悟'],
        content: '今天早起去公园晨跑了 3 公里，空气特别清新。🏃‍♀️\n\n回来后冲了一杯手冲咖啡，慢慢享受周末的早晨。\n\n下午读完了《原子习惯》的第三章，最大的收获是：改变不是一蹴而就的，而是每天 1% 的微小进步。\n\n晚上做了一个酸奶水果碗，蓝莓+香蕉+燕麦+奇亚籽，简单但满足。🍓\n\n感恩今天的一切。',
        photos: []
    },
    {
        id: 1002, date: '2026-07-28', weather: '🌧️', mood: '😌',
        tags: ['工作', '学习', '阅读'],
        content: '下雨天，在办公室待了一整天。\n\n上午完成了齿轮检测报告，用三坐标测量机重新校对了齿形偏差数据，Fα全部在公差范围内，松了一口气。\n\n中午和同事讨论了新项目的 FMEA 分析，发现了一个潜在的失效模式——好在及时发现。\n\n晚上学习了 SPC 控制图的判异准则，原来连续 7 点在中心线同一侧就是异常信号。📊\n\n虽然下雨，但心里很踏实。',
        photos: []
    },
    {
        id: 1003, date: '2026-07-27', weather: '⛅', mood: '🥰',
        tags: ['美食', '运动', '感恩'],
        content: '今天周末，和闺蜜去探店了一家新开的日料店！🍣\n\n三文鱼刺身超级新鲜，入口即化的感觉太幸福了。\n\n下午去健身房练了背部和核心：\n• 引体向上（辅助）4组 × 8次\n• 坐姿划船 4组 × 12次\n• 平板支撑 3组 × 45秒\n\n晚上称体重发现又轻了 0.3kg，努力真的不会白费！💪\n\n感恩有健康的身体和好吃的食物。',
        photos: []
    },
    {
        id: 1004, date: '2026-07-26', weather: '☀️', mood: '🤔',
        tags: ['工作', '感悟', '成长'],
        content: '今天参加了一个线上质量管理的研讨会，主题是"从检验到预防"。\n\n感触很深的一句话：质量不是检验出来的，是设计和制造出来的。\n\n回顾自己的工作，确实很多时候都是在"救火"——出了问题再去查原因。真正高效的质量管理，应该把精力放在预防上。\n\n决定从下周开始，每周抽 2 小时做过程能力的复盘分析。\n\n成长，就是不断地审视自己。',
        photos: []
    },
    {
        id: 1005, date: '2026-07-25', weather: '☀️', mood: '😊',
        tags: ['健康', '运动', '心情'],
        content: '今天 6:30 就起床了！🌅\n\n空腹跳绳 20 分钟 + 拉伸 10 分钟，出了一身汗特别爽。\n\n早餐：全麦吐司 + 牛油果 + 煎蛋 + 黑咖啡 ☕\n午餐：鸡胸肉沙拉碗 🥗\n晚餐：清蒸鲈鱼 + 西兰花\n\n发现记录饮食真的很有用，以前不知不觉吃了很多零食，现在每一口都会想一想。\n\n体重管理 Day 5，继续加油！',
        photos: []
    }
];

// 初始化数据
let records = Storage.get('records', []);
let savings = Storage.get('savings', []);
let weights = Storage.get('weights', []);
let diets = Storage.get('diets', []);
let todos = Storage.get('todos', []);
let diaries = Storage.get('diaries', []);
let targetWeight = Storage.get('targetWeight', 55);

// 每日打卡数据
const CHECKIN_ITEMS = [
    { id: 'early', name: '早起', icon: 'generated-images/A_cute_kawaii_chibi_Hello_Kitt_2026-07-29T10-53-39.png' },
    { id: 'water', name: '饮水', icon: 'generated-images/A_cute_kawaii_chibi_Hello_Kitt_2026-07-29T10-53-40.png' },
    { id: 'sport', name: '运动', icon: 'generated-images/A_cute_kawaii_chibi_Hello_Kitt_2026-07-29T10-54-07.png' },
    { id: 'diary', name: '日记', icon: 'generated-images/kt_diary.png' },
    { id: 'sleep', name: '早睡', icon: 'generated-images/A_cute_kawaii_chibi_Hello_Kitt_2026-07-29T10-54-36.png' }
];
let checkins = Storage.get('checkins', {});

// 如果日记为空，加载示例数据
if (diaries.length === 0 && !Storage.get('sampleDiariesLoaded', false)) {
    diaries = [...sampleDiaries];
    Storage.set('diaries', diaries);
    Storage.set('sampleDiariesLoaded', true);
}

// 首次加载示例待办
if (todos.length === 0 && !Storage.get('sampleTodosLoaded', false)) {
    todos = [
        { id: 2001, text: '完成齿轮检测报告', priority: 'high', done: true, date: '2026-07-29' },
        { id: 2002, text: '学习 SPC 控制图判异准则', priority: 'medium', done: true, date: '2026-07-28' },
        { id: 2003, text: '健身房练背 + 核心', priority: 'medium', done: false, date: '2026-07-29' },
        { id: 2004, text: '书店买《齿轮手册》', priority: 'low', done: false, date: '2026-07-29' },
        { id: 2005, text: '整理本月开支账单', priority: 'medium', done: false, date: '2026-07-29' },
    ];
    Storage.set('todos', todos);
    Storage.set('sampleTodosLoaded', true);
}

// 首次加载示例体重数据
if (weights.length === 0 && !Storage.get('sampleWeightsLoaded', false)) {
    const today = new Date();
    weights = [];
    for (let i = 14; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        weights.push({
            date: d.toISOString().split('T')[0],
            weight: 58.5 - i * 0.12 + (Math.random() - 0.5) * 0.3,
            calories: Math.round(1400 + Math.random() * 400)
        });
    }
    Storage.set('weights', weights);
    Storage.set('sampleWeightsLoaded', true);
}

// 首次加载示例记账
if (records.length === 0 && !Storage.get('sampleRecordsLoaded', false)) {
    const month = getToday().substring(0, 7);
    records = [
        { id: 3001, type: 'income', amount: 12000, category: '其他', note: '工资', date: month + '-05' },
        { id: 3002, type: 'expense', amount: 2800, category: '房租', note: '月租', date: month + '-06' },
        { id: 3003, type: 'expense', amount: 85, category: '餐饮', note: '午餐外卖', date: getToday() },
        { id: 3004, type: 'expense', amount: 350, category: '购物', note: '运动鞋', date: month + '-22' },
        { id: 3005, type: 'expense', amount: 120, category: '交通', note: '打车', date: getToday() },
    ];
    Storage.set('records', records);
    Storage.set('sampleRecordsLoaded', true);
}

// 首次加载示例饮食
if (diets.length === 0 && !Storage.get('sampleDietsLoaded', false)) {
    diets = [
        { id: 4001, date: getToday(), name: '全麦吐司 + 煎蛋 + 黑咖啡', calories: 350, meal: '早餐' },
        { id: 4002, date: getToday(), name: '鸡胸肉沙拉碗', calories: 420, meal: '午餐' },
    ];
    Storage.set('diets', diets);
    Storage.set('sampleDietsLoaded', true);
}

// 首次加载示例储蓄
if (savings.length === 0 && !Storage.get('sampleSavingsLoaded', false)) {
    savings = [
        { id: 5001, name: '🏖️ 旅行基金', target: 15000, current: 6000 },
        { id: 5002, name: '📚 学习基金', target: 5000, current: 2000 },
    ];
    Storage.set('savings', savings);
    Storage.set('sampleSavingsLoaded', true);
}

// === 导航 ===
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const pageId = item.dataset.page;
        navigateTo(pageId);
    });
});

function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const page = document.getElementById(pageId);
    if (page) page.classList.add('active');
    const nav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (nav) nav.classList.add('active');

    if (pageId === 'weight') renderWeightChart();
    if (pageId === 'home') updateHomeStats();
    if (pageId === 'todo') updateTodoBadge();
}

// === 日期 ===
function formatDate(date) {
    const d = new Date(date);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${weekdays[d.getDay()]}`;
}

function getToday() {
    return new Date().toISOString().split('T')[0];
}

// === 首页 ===
function updateHomeStats() {
    const today = getToday();
    const now = new Date();

    // 侧边栏日期
    document.getElementById('current-date').textContent = now.toLocaleDateString('zh-CN', {month:'long', day:'numeric'});

    // 问候语 + 时间
    const hour = now.getHours();
    let greeting = '晚上好';
    if (hour < 12) greeting = '早上好';
    else if (hour < 18) greeting = '下午好';
    const greetingEl = document.getElementById('greeting-text');
    if (greetingEl) greetingEl.textContent = `${greeting}，宋春蕾~`;

    const timeEl = document.getElementById('greeting-time');
    if (timeEl) timeEl.textContent =
        `${String(hour).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    const weekdays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    const dateEl = document.getElementById('greeting-date');
    if (dateEl) dateEl.textContent =
        `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${weekdays[now.getDay()]}`;

    // 待办徽章
    const activeTodos = todos.filter(t => !t.done);
    document.getElementById('todo-badge').textContent = activeTodos.length;

    // 今日概览数据
    const doneTodos = todos.filter(t => t.done);
    const totalTodos = todos.length;

    const elTodo = document.getElementById('overview-todo');
    if (elTodo) elTodo.textContent = totalTodos > 0 ? `${doneTodos.length}/${totalTodos}` : '0';

    const todayDiets = diets.filter(d => d.date === today);
    const elDiet = document.getElementById('overview-diet');
    if (elDiet) elDiet.textContent = todayDiets.length > 0
        ? todayDiets.reduce((s,d) => s + d.calories, 0) + 'kcal' : '--';

    const elExercise = document.getElementById('overview-exercise');
    if (elExercise) elExercise.textContent = checkins['sport'] ? '已完成' : '未打卡';

    const todayWeights = weights.filter(w => w.date === today);
    const elWeight = document.getElementById('overview-weight');
    if (elWeight) elWeight.textContent = todayWeights.length > 0
        ? parseFloat(todayWeights[todayWeights.length-1].weight).toFixed(1) + 'kg' : '--';

    const todayDiaries = diaries.filter(d => d.date === today);
    const elDiary = document.getElementById('overview-diary');
    if (elDiary) elDiary.textContent = todayDiaries.length > 0 ? todayDiaries.length + '篇' : '未写';

    const todayRecords = records.filter(r => r.date === today);
    const elFinance = document.getElementById('overview-finance');
    if (elFinance) elFinance.textContent = todayRecords.length > 0 ? todayRecords.length + '笔' : '--';

    updateTodoBadge();
}

function updateTodoBadge() {
    const active = todos.filter(t => !t.done).length;
    document.getElementById('todo-badge').textContent = active;
}

// === 每日打卡 ===
function renderCheckins() {
    const today = getToday();
    const grid = document.getElementById('checkin-grid');
    if (!grid) return;

    grid.innerHTML = CHECKIN_ITEMS.map(item => {
        const isDone = checkins[item.id] === today;
        return `
            <div class="checkin-card ${isDone ? 'done' : 'undone'}" onclick="toggleCheckin('${item.id}')">
                <div class="checkin-icon-wrap"><img src="${item.icon}" alt="${item.name}"></div>
                <div class="checkin-name">${item.name}</div>
                <div class="checkin-status">${isDone ? '已完成' : '点击打卡'}</div>
                <div class="checkin-check">${isDone ? '✅' : ''}</div>
            </div>`;
    }).join('');
}

function toggleCheckin(id) {
    const today = getToday();
    if (checkins[id] === today) {
        delete checkins[id];
    } else {
        checkins[id] = today;
    }
    Storage.set('checkins', checkins);
    renderCheckins();
    updateHomeStats();
}

// =====================
// === 财务管理 ===
// =====================
function addRecord() {
    const type = document.getElementById('record-type').value;
    const amount = parseFloat(document.getElementById('record-amount').value);
    const category = document.getElementById('record-category').value;
    const note = document.getElementById('record-note').value;
    if (!amount || amount <= 0) { alert('请输入有效金额'); return; }

    records.unshift({ id: Date.now(), type, amount, category, note, date: getToday() });
    Storage.set('records', records);
    document.getElementById('record-amount').value = '';
    document.getElementById('record-note').value = '';
    renderRecords();
    updateFinanceSummary();
    updateHomeStats();
}

function deleteRecord(id) {
    records = records.filter(r => r.id !== id);
    Storage.set('records', records);
    renderRecords();
    updateFinanceSummary();
    updateHomeStats();
}

function renderRecords() {
    const list = document.getElementById('record-list');
    const categories = { '餐饮':'🍽️','交通':'🚗','购物':'🛍️','娱乐':'🎮','房租':'🏠','医疗':'💊','教育':'📚','其他':'📌' };
    list.innerHTML = records.length === 0 ? '<p style="color:#94a3b8;text-align:center;padding:20px;">暂无记录</p>' :
        records.map(r => `
        <div class="record-item">
            <div class="rec-icon ${r.type}">
                <i class="fas ${r.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
            </div>
            <div class="rec-info">
                <h5>${categories[r.category] || '📌'} ${r.category}</h5>
                <p>${r.note || ''} · ${r.date}</p>
            </div>
            <span class="rec-amount ${r.type}">${r.type==='income'?'+':'-'}¥${r.amount.toFixed(2)}</span>
            <button class="rec-delete" onclick="deleteRecord(${r.id})"><i class="fas fa-trash"></i></button>
        </div>`).join('');
}

function updateFinanceSummary() {
    const month = getToday().substring(0, 7);
    const monthRecords = records.filter(r => r.date.startsWith(month));
    const income = monthRecords.filter(r => r.type === 'income').reduce((s,r) => s + r.amount, 0);
    const expense = monthRecords.filter(r => r.type === 'expense').reduce((s,r) => s + r.amount, 0);
    document.getElementById('total-income').textContent = '¥' + income.toFixed(2);
    document.getElementById('total-expense').textContent = '¥' + expense.toFixed(2);
    document.getElementById('total-balance').textContent = '¥' + (income - expense).toFixed(2);
}

// 储蓄目标
function addSavings() {
    const name = document.getElementById('savings-name').value;
    const target = parseFloat(document.getElementById('savings-target').value);
    const current = parseFloat(document.getElementById('savings-current').value);
    if (!name || !target || target <= 0) { alert('请输入有效信息'); return; }
    savings.push({ id: Date.now(), name, target, current: current || 0 });
    Storage.set('savings', savings);
    document.getElementById('savings-name').value = '';
    document.getElementById('savings-target').value = '';
    document.getElementById('savings-current').value = '';
    renderSavings();
}

function deleteSavings(id) {
    savings = savings.filter(s => s.id !== id);
    Storage.set('savings', savings);
    renderSavings();
}

function updateSavings(id) {
    const newCurrent = prompt('更新当前已存金额:');
    if (newCurrent === null) return;
    const amount = parseFloat(newCurrent);
    if (isNaN(amount) || amount < 0) { alert('请输入有效金额'); return; }
    const s = savings.find(s => s.id === id);
    if (s) { s.current = amount; Storage.set('savings', savings); renderSavings(); }
}

function renderSavings() {
    const list = document.getElementById('savings-list');
    list.innerHTML = savings.length === 0 ? '<p style="color:#94a3b8;text-align:center;padding:20px;">暂无储蓄目标</p>' :
        savings.map(s => {
            const pct = Math.min(100, Math.round((s.current / s.target) * 100));
            return `
        <div class="savings-item">
            <div class="sav-header">
                <span class="sav-name">${s.name}</span>
                <span class="sav-amount">¥${s.current} / ¥${s.target}</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-fill" style="width:${pct}%;background:linear-gradient(135deg,#22c55e,#4ade80);"></div>
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:6px;">
                <span style="font-size:12px;color:#94a3b8;">${pct}%</span>
                <div>
                    <button style="background:none;border:none;color:#3b82f6;cursor:pointer;font-size:12px;" onclick="updateSavings(${s.id})">更新</button>
                    <button class="sav-delete" onclick="deleteSavings(${s.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>`;
        }).join('');
}

// =====================
// === 体重管理 ===
// =====================
function addWeightRecord() {
    const weight = parseFloat(document.getElementById('today-weight').value);
    const calories = parseInt(document.getElementById('today-calories').value) || 0;
    if (!weight || isNaN(weight)) { alert('请输入有效的体重数值'); return; }
    if (weight < 20 || weight > 300) { alert('体重数值似乎不太对哦，请输入 20~300 kg 之间的数值'); return; }
    weights.push({ date: getToday(), weight, calories });
    Storage.set('weights', weights);
    document.getElementById('today-weight').value = '';
    document.getElementById('today-calories').value = '';
    updateWeightStats();
    renderWeightChart();
}

function updateWeightStats() {
    // 自动清理异常体重数据（防止历史脏数据影响显示）
    const badCount = weights.filter(w => !w.weight || w.weight < 10 || w.weight > 500).length;
    if (badCount > 0) {
        weights = weights.filter(w => w.weight && w.weight >= 10 && w.weight <= 500);
        Storage.set('weights', weights);
    }
    if (weights.length > 0) {
        const latest = weights[weights.length-1].weight;
        document.getElementById('current-weight').textContent = parseFloat(latest).toFixed(1) + ' kg';
        const remaining = latest - targetWeight;
        if (remaining > 0) {
            document.getElementById('weight-remaining').textContent = remaining.toFixed(1) + ' kg';
        } else if (remaining < 0) {
            document.getElementById('weight-remaining').textContent = '已达成! 🎉';
        } else {
            document.getElementById('weight-remaining').textContent = '已达标!';
        }
    } else {
        document.getElementById('current-weight').textContent = '--';
        document.getElementById('weight-remaining').textContent = '--';
    }
}

let weightChart = null;
function renderWeightChart() {
    const ctx = document.getElementById('weightChart')?.getContext('2d');
    if (!ctx) return;
    if (weightChart) weightChart.destroy();
    const data = weights.slice(-30);
    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(w => w.date.slice(5)),
            datasets: [{
                label: '体重(kg)',
                data: data.map(w => w.weight),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59,130,246,0.1)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#3b82f6',
                pointRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { min: targetWeight - 10, max: targetWeight + 15, grid: { color: '#f1f5f9' } },
                x: { grid: { display: false } }
            }
        }
    });
}

// 饮食记录
function addDiet() {
    const name = document.getElementById('diet-name').value;
    const calories = parseInt(document.getElementById('diet-calories').value);
    const meal = document.getElementById('diet-meal').value;
    if (!name || !calories) { alert('请输入食物名称和热量'); return; }
    diets.unshift({ id: Date.now(), date: getToday(), name, calories, meal });
    Storage.set('diets', diets);
    document.getElementById('diet-name').value = '';
    document.getElementById('diet-calories').value = '';
    renderDiets();
    updateHomeStats();
}

function deleteDiet(id) {
    diets = diets.filter(d => d.id !== id);
    Storage.set('diets', diets);
    renderDiets();
    updateHomeStats();
}

function renderDiets() {
    const list = document.getElementById('diet-list');
    const today = getToday();
    const todayDiets = diets.filter(d => d.date === today);
    const totalCal = todayDiets.reduce((s,d) => s + d.calories, 0);
    let html = todayDiets.length === 0 ? '<p style="color:#94a3b8;text-align:center;padding:16px;">今日暂无记录</p>' :
        todayDiets.map(d => `
        <div class="diet-item">
            <span class="diet-meal-tag ${d.meal}">${d.meal}</span>
            <div class="diet-info">
                <h5>${d.name}</h5>
                <p>${d.date}</p>
            </div>
            <span class="diet-cal">${d.calories} kcal</span>
            <button class="diet-delete" onclick="deleteDiet(${d.id})"><i class="fas fa-trash"></i></button>
        </div>`).join('');
    if (todayDiets.length > 0) {
        html += `<div style="text-align:right;padding:8px;color:#f97316;font-weight:600;">本日摄入: ${totalCal} kcal</div>`;
    }
    list.innerHTML = html;
}

// 拍照分析 - 模拟AI识别
document.getElementById('food-photo').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        const foods = mockAnalyzeFood();
        let html = `<div class="photo-result">
            <h4>📸 识别结果:</h4>
            <img src="${ev.target.result}" style="max-width:100%;max-height:200px;border-radius:10px;margin:10px 0;object-fit:cover;">
            <div class="food-items">`;
        foods.forEach(f => {
            html += `<span class="food-tag">${f.name} ~${f.cal} kcal</span>`;
        });
        const total = foods.reduce((s,f) => s + f.cal, 0);
        html += `</div><p class="total-cal">预估总热量: ${total} kcal</p>
            <button onclick="confirmFoodAnalysis(${total})" class="btn-primary" style="margin-top:8px;">确认并记录</button>
        </div>`;
        document.getElementById('photo-analysis').innerHTML = html;
    };
    reader.readAsDataURL(file);
});

function mockAnalyzeFood() {
    const foodDb = [
        [{name:'米饭',cal:200},{name:'炒青菜',cal:80},{name:'红烧肉',cal:350}],
        [{name:'面包',cal:150},{name:'鸡蛋',cal:70},{name:'牛奶',cal:120}],
        [{name:'意面',cal:300},{name:'沙拉',cal:100},{name:'鸡胸肉',cal:180}],
        [{name:'火锅',cal:800},{name:'饮料',cal:150}],
        [{name:'三明治',cal:350},{name:'咖啡',cal:50}],
        [{name:'水果拼盘',cal:120},{name:'酸奶',cal:90}],
        [{name:'寿司',cal:280},{name:'味噌汤',cal:40}],
        [{name:'烤鱼',cal:220},{name:'蒸蛋',cal:80},{name:'米饭',cal:200}],
    ];
    return foodDb[Math.floor(Math.random() * foodDb.length)];
}

function confirmFoodAnalysis(calories) {
    diets.unshift({ id: Date.now(), date: getToday(), name: 'AI识别食物', calories, meal: '午餐' });
    Storage.set('diets', diets);
    renderDiets();
    updateHomeStats();
    document.getElementById('photo-analysis').innerHTML = '<p style="color:#22c55e;">✅ 已记录!</p>';
}

// 目标体重变化
document.getElementById('target-weight').addEventListener('change', function() {
    targetWeight = parseFloat(this.value) || 55;
    Storage.set('targetWeight', targetWeight);
    updateWeightStats();
});

// =====================
// === 运动 ===
// =====================
const exercises = [
    { id:1, name:'哑铃弯举', cat:'strength', icon:'fa-dumbbell', desc:'锻炼肱二头肌。双手持哑铃，上臂固定，弯曲肘部将哑铃举起，缓慢放下。每组12-15次，3-4组。要点: 保持背部挺直，控制动作节奏，顶峰收缩1秒。', tags:['肱二头肌','手臂']},
    { id:2, name:'深蹲', cat:'strength', icon:'fa-person-rifle', desc:'锻炼大腿和臀部。双脚与肩同宽，缓慢下蹲至大腿与地面平行，膝盖不要超过脚尖。每组15-20次，3组。要点: 保持背部挺直，核心收紧，重心在脚跟。', tags:['腿部','臀部']},
    { id:3, name:'平板支撑', cat:'strength', icon:'fa-person-through-window', desc:'核心力量训练。俯卧，肘部撑地，身体呈一条直线，收紧腹部。每组30-60秒，3组。要点: 不要塌腰或翘臀，保持匀速呼吸。', tags:['核心','腹肌']},
    { id:4, name:'卧推', cat:'strength', icon:'fa-weight-scale', desc:'锻炼胸肌和肱三头肌。仰卧杠铃凳，双手略宽于肩握杠铃。缓慢下放至胸前，发力推起。要点: 肩胛骨收紧，控制下放速度。需有人保护。', tags:['胸肌','肱三头肌']},
    { id:5, name:'引体向上', cat:'strength', icon:'fa-arrow-trend-up', desc:'锻炼背阔肌和肱二头肌。正握或反握单杠，用背部发力将身体拉起至下巴过杠。每组尽量多做，3-4组。初学者可用弹力带辅助。', tags:['背部','肱二头肌']},
    { id:6, name:'跑步', cat:'cardio', icon:'fa-person-running', desc:'有氧运动之王。建议配速6-8分钟/公里，持续30-45分钟。注意: 穿减震跑鞋，落地时用前脚掌，保持呼吸节奏。', tags:['有氧','燃脂']},
    { id:7, name:'动感单车', cat:'cardio', icon:'fa-bicycle', desc:'室内有氧训练。调整座椅高度至髋关节位置，阻力适中，保持踏频80-100rpm，持续30分钟。注意: 膝盖不要内扣或外翻。', tags:['有氧','下肢']},
    { id:8, name:'跳绳', cat:'cardio', icon:'fa-arrow-down-wide-short', desc:'高效燃脂运动。每分钟120-150次，每组3-5分钟，间歇30秒，共4-6组。注意: 落地时膝盖微屈缓冲，选择平坦地面。', tags:['有氧','全身']},
    { id:9, name:'瑜伽-下犬式', cat:'stretch', icon:'fa-person-praying', desc:'经典拉伸动作。双手和双脚撑地，臀部向上推送，身体呈倒V字形。保持5-8个深呼吸。功效: 拉伸腿后侧、脊柱和肩背。', tags:['拉伸','放松']},
    { id:10, name:'泡沫轴放松', cat:'stretch', icon:'fa-braille', desc:'筋膜放松。将泡沫轴置于肌肉下方，利用身体自重缓慢滚动，每次每部位30-60秒。针对: 大腿前后侧、臀肌、背部。注意: 避开关节和骨骼。', tags:['筋膜','恢复']},
    { id:11, name:'硬拉', cat:'strength', icon:'fa-weight-scale', desc:'锻炼后链肌群。双脚与肩同宽，杠铃贴近小腿，保持背部挺直，用髋关节发力拉起。每组8-12次，3-4组。要点: 铃杆始终贴近身体，锁定上背部。', tags:['后链','力量']},
    { id:12, name:'椭圆机', cat:'cardio', icon:'fa-person-walking', desc:'低冲击有氧器械。踏板滑动减少膝关节压力。持续30-40分钟，调整坡度加大强度。适合: 关节康复、减脂期。注意: 不要靠扶手支撑体重。', tags:['低冲击','有氧']},
];

function searchExercise() {
    const keyword = document.getElementById('exercise-search').value.toLowerCase();
    const activeCat = document.querySelector('.cat-btn.active').dataset.cat;
    renderExercises(activeCat, keyword);
}

document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        searchExercise();
    });
});

function renderExercises(cat = 'all', keyword = '') {
    const grid = document.getElementById('exercise-grid');
    let filtered = exercises;
    if (cat !== 'all') filtered = filtered.filter(e => e.cat === cat);
    if (keyword) filtered = filtered.filter(e => e.name.includes(keyword) || e.tags.some(t => t.includes(keyword)));
    grid.innerHTML = filtered.map(e => `
        <div class="exercise-item" onclick="showExerciseDetail(${e.id})">
            <div class="ex-img">
                <i class="fas ${e.icon}"></i>
            </div>
            <div class="ex-name">${e.name}</div>
            <div class="ex-category">${e.cat === 'cardio' ? '有氧' : e.cat === 'strength' ? '力量' : '拉伸'}</div>
            <div class="ex-desc">${e.desc.slice(0, 60)}...</div>
            <div>${e.tags.map(t => `<span class="ex-tag">${t}</span>`).join(' ')}</div>
        </div>`).join('');
}

function showExerciseDetail(id) {
    const e = exercises.find(ex => ex.id === id);
    if (!e) return;
    const modal = document.createElement('div');
    modal.className = 'exercise-detail-modal';
    modal.innerHTML = `
        <div class="exercise-detail">
            <button class="close-btn" onclick="this.closest('.exercise-detail-modal').remove()"><i class="fas fa-times"></i></button>
            <div class="ex-img" style="height:180px;margin-bottom:16px;background:linear-gradient(135deg, #e0f2fe, #bae6fd);border-radius:14px;display:flex;align-items:center;justify-content:center;">
                <i class="fas ${e.icon}" style="font-size:64px;color:#3b82f6;"></i>
            </div>
            <h3 style="margin-bottom:8px;">${e.name}</h3>
            <p style="color:#64748b;margin-bottom:16px;">${e.cat === 'cardio' ? '有氧运动' : e.cat === 'strength' ? '力量训练' : '拉伸放松'}</p>
            <div style="background:#f8fafc;border-radius:12px;padding:16px;margin-bottom:16px;">
                <h4 style="margin-bottom:8px;">📋 训练方法</h4>
                <p style="line-height:1.8;font-size:14px;color:#334155;">${e.desc}</p>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                ${e.tags.map(t => `<span style="background:#dbeafe;color:#1e40af;padding:4px 12px;border-radius:8px;font-size:13px;">${t}</span>`).join('')}
            </div>
        </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', function(ev) { if (ev.target === modal) modal.remove(); });
}

// =====================
// === 待办事项 ===
// =====================
function addTodo() {
    const text = document.getElementById('todo-input').value.trim();
    const priority = document.getElementById('todo-priority').value;
    const due = document.getElementById('todo-due').value;
    if (!text) return;
    todos.unshift({ id: Date.now(), text, priority, done: false, date: getToday(), due });
    Storage.set('todos', todos);
    document.getElementById('todo-input').value = '';
    document.getElementById('todo-due').value = '';
    renderTodos('all');
    updateHomeStats();
    updateTodoBadge();
}

function toggleTodo(id) {
    const t = todos.find(t => t.id === id);
    if (t) { t.done = !t.done; Storage.set('todos', todos); renderTodos(currentTodoFilter); updateHomeStats(); updateTodoBadge(); }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    Storage.set('todos', todos);
    renderTodos(currentTodoFilter);
    updateHomeStats();
    updateTodoBadge();
}

let currentTodoFilter = 'all';
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentTodoFilter = this.dataset.filter;
        renderTodos(currentTodoFilter);
    });
});

function renderTodos(filter = 'all') {
    const list = document.getElementById('todo-list');
    let filtered = todos;
    if (filter === 'active') filtered = todos.filter(t => !t.done);
    if (filter === 'completed') filtered = todos.filter(t => t.done);
    list.innerHTML = filtered.length === 0 ? '<p style="color:#94a3b8;text-align:center;padding:20px;">暂无事项</p>' :
        filtered.map(t => {
            let dueHtml = '';
            if (t.due) {
                const today = getToday();
                const isOverdue = t.due < today && !t.done;
                const isToday = t.due === today;
                let dueLabel = t.due.slice(5);
                if (isToday) dueLabel = '今天';
                dueHtml = `<span class="todo-due ${isOverdue ? 'overdue' : isToday ? 'today' : ''}">${isOverdue ? '⚠️ ' : '📅 '}${dueLabel}</span>`;
            }
            return `
        <div class="todo-item">
            <div class="todo-check ${t.done ? 'checked' : ''}" onclick="toggleTodo(${t.id})">
                ${t.done ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <div class="todo-main">
                <span class="todo-text ${t.done ? 'done' : ''}">${t.text}</span>
                <div class="todo-meta">${dueHtml}<span class="todo-priority ${t.priority}">${t.priority === 'high' ? '高' : t.priority === 'medium' ? '中' : '低'}</span></div>
            </div>
            <button class="todo-delete" onclick="deleteTodo(${t.id})"><i class="fas fa-trash"></i></button>
        </div>`;
        }).join('');
    document.getElementById('todo-total').textContent = todos.length;
    document.getElementById('todo-completed').textContent = todos.filter(t => t.done).length;
}

// =====================
// === 每日日记 - 手账风格 ===
// =====================
let diaryTags = [];
let diaryPhotos = [];
let selectedWeather = '';
let selectedMood = '';

function pickWeather(btn) {
    document.querySelectorAll('.weather-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedWeather = btn.dataset.weather;
}

function pickMood(btn) {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedMood = btn.dataset.mood;
}

function toggleTag(btn) {
    const tag = btn.dataset.tag;
    if (diaryTags.includes(tag)) {
        diaryTags = diaryTags.filter(t => t !== tag);
        btn.classList.remove('active');
    } else {
        diaryTags.push(tag);
        btn.classList.add('active');
    }
}

document.getElementById('diary-photos').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    const preview = document.getElementById('photo-preview');
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(ev) {
            const img = document.createElement('img');
            img.src = ev.target.result;
            img.title = file.name;
            preview.appendChild(img);
            diaryPhotos.push(ev.target.result);
        };
        reader.readAsDataURL(file);
    });
});

function saveDiary() {
    const date = document.getElementById('diary-date').value || getToday();
    const content = document.getElementById('diary-content').value.trim();
    if (!content && diaryPhotos.length === 0) { alert('请至少输入内容或添加照片'); return; }
    diaries.unshift({
        id: Date.now(),
        date,
        weather: selectedWeather || '☀️',
        mood: selectedMood || '😊',
        content: content || '📸 图片日记',
        tags: [...diaryTags],
        photos: [...diaryPhotos],
    });
    Storage.set('diaries', diaries);
    document.getElementById('diary-content').value = '';
    document.getElementById('photo-preview').innerHTML = '';
    diaryTags = [];
    diaryPhotos = [];
    selectedWeather = '';
    selectedMood = '';
    document.querySelectorAll('.tag-btn, .weather-btn, .mood-btn').forEach(b => b.classList.remove('active'));
    renderDiaries();
}

function deleteDiary(id) {
    if (confirm('确定要删除这篇日记吗？')) {
        diaries = diaries.filter(d => d.id !== id);
        Storage.set('diaries', diaries);
        renderDiaries();
    }
}

function renderDiaries() {
    const container = document.getElementById('diary-entries');
    const moodLabels = { '😊':'开心','🥰':'幸福','😌':'平静','😤':'生气','😢':'难过','🤔':'思考' };
    
    container.innerHTML = diaries.length === 0 ? 
        `<div style="text-align:center;padding:50px 20px;color:#a8a29e;">
            <div style="font-size:60px;margin-bottom:16px;">📖</div>
            <p style="font-size:16px;font-weight:600;margin-bottom:6px;">开始写第一篇日记吧</p>
            <p style="font-size:13px;">记录每一天的美好</p>
        </div>` :
        diaries.map(d => `
        <div class="diary-entry">
            <button class="diary-delete" onclick="deleteDiary(${d.id})"><i class="fas fa-trash-alt"></i></button>
            <div class="diary-header">
                <span class="diary-date">📅 ${formatDate(d.date)}</span>
                <div class="diary-meta">
                    ${d.weather ? `<span class="diary-weather">${d.weather}</span>` : ''}
                    ${d.mood ? `<span class="diary-mood" style="background:${d.mood === '😊' || d.mood === '🥰' ? '#fef3c7' : d.mood === '😌' ? '#e0f2fe' : d.mood === '😤' ? '#ffe4e6' : d.mood === '😢' ? '#e0e7ff' : '#f3e8ff'};color:#292524;">${d.mood} ${moodLabels[d.mood] || ''}</span>` : ''}
                </div>
            </div>
            ${d.tags && d.tags.length > 0 ? `<div class="diary-tags-list">${d.tags.map(t => `<span class="diary-tag">#${t}</span>`).join(' ')}</div>` : ''}
            <div class="diary-content">${d.content}</div>
            ${d.photos && d.photos.length > 0 ? `<div class="diary-photos">${d.photos.map(p => `<img src="${p}" alt="日记图片" loading="lazy">`).join('')}</div>` : ''}
            <div class="diary-footer">
                <span>${formatDate(d.date)}</span>
                <span>📝 ${(d.content || '').length} 字 · ${d.photos ? d.photos.length : 0} 张图</span>
            </div>
        </div>`).join('');
}

// =====================
// === 工作板块 ===
// =====================
const qaData = {
    gear: {
        title: '齿轮专业知识问答',
        questions: [
            { q: '齿轮精度等级是如何划分的？', a: '中国标准GB/T 10095将齿轮精度分为13个等级，从0级（最高）到12级（最低）。常用等级为5-9级。精度等级通过三个公差组评定: 运动精度（I组）、平稳性精度（II组）、接触精度（III组）。实际应用中需根据齿轮用途选择合适精度等级。' },
            { q: '什么是齿轮模数和压力角？', a: '模数(m)是齿轮的基本参数，表示齿距p与圆周率π的比值(m=p/π)，单位mm。标准模数系列: 1, 1.25, 1.5, 2, 2.5, 3, 4...标准压力角为20°，也是渐开线齿轮最常用的压力角。特殊场合也有14.5°和25°。' },
            { q: '齿轮常见的热处理方式有哪些？', a: '1)渗碳淬火: 表面高硬度(58-62HRC)，心部韧性好，适用于重载齿轮；2)氮化处理: 变形小，表面硬度高；3)高频淬火: 适用于中碳钢齿轮，效率高；4)调质处理: 淬火+高温回火，改善综合力学性能；5)正火: 消除应力，细化晶粒，为后续加工准备。' },
            { q: '齿轮检测中常用哪些检测仪器？', a: '1)齿轮测量中心（如Klingelnberg、Gleason）: 检测齿形、齿向、齿距；2)三坐标测量机(CMM): 检测齿轮几何尺寸；3)双面啮合检查仪: 检测综合偏差；4)齿厚卡尺/公法线千分尺: 测量齿厚；5)表面粗糙度仪: 测量齿面粗糙度；6)磁粉探伤仪: 检测裂纹。' },
            { q: '齿轮常见的失效形式有哪些？', a: '1)齿面点蚀: 接触疲劳引起的小坑；2)轮齿折断: 过载或疲劳断裂；3)齿面磨损: 润滑不良或杂质；4)齿面胶合: 高速重载下油膜破裂；5)塑性变形: 齿面材料屈服。预防措施: 合理选材、正确热处理、良好润滑、适当载荷。' },
        ]
    },
    tools: {
        title: '质量工具手法问答',
        questions: [
            { q: 'QC七大手法是什么？', a: '1)检查表: 收集数据；2)层别法: 分类分析；3)柏拉图: 找出重点问题；4)因果图(鱼骨图): 分析原因；5)直方图: 观察分布；6)散布图: 分析相关性；7)控制图: 监控过程稳定性。另有新QC七大手法: 亲和图、关联图、系统图、矩阵图、矩阵数据分析法、PDPC法、箭头图法。' },
            { q: 'SPC中Cp和Cpk的区别？', a: 'Cp（过程能力指数）衡量过程变异与规格范围的比值，不考虑中心偏移。Cpk（过程性能指数）同时考虑变异和中心偏移。公式: Cp=(USL-LSL)/6σ, Cpk=min[(USL-μ)/3σ, (μ-LSL)/3σ]。Cpk总是≤Cp。一般要求Cpk≥1.33(过程能力充足)，1.0≤Cpk<1.33(可接受)。' },
            { q: 'FMEA的步骤是什么？', a: 'FMEA（失效模式与影响分析）步骤: 1)确定分析对象；2)识别潜在失效模式；3)分析失效影响(严重度S)；4)分析失效原因(发生度O)；5)确认现行控制(探测度D)；6)计算RPN=S×O×D；7)制定改进措施；8)跟踪验证。S/O/D均用1-10评分，RPN>100或S≥9需强制采取措施。' },
            { q: 'MSA（测量系统分析）包含哪些内容？', a: 'MSA主要分析测量系统的变差: 1)偏倚(Bias): 测量均值与真值之差；2)线性(Linearity): 不同量程的偏倚变化；3)稳定性(Stability): 随时间的变化；4)重复性(Repeatability): 同一人/同一量具的变异；5)再现性(Reproducibility): 不同人/方法的变异。GR&R≤10%为优秀，≤30%为可接受。' },
            { q: '8D报告是什么？', a: '8D(八项纪律)是解决问题的方法论: D1组建团队；D2描述问题(5W2H)；D3临时措施(围堵)；D4根本原因分析(5Why/鱼骨图)；D5永久纠正措施；D6实施验证；D7预防措施(防再发)；D8团队表彰。适用于客户投诉和重大质量问题。' },
        ]
    },
    office: {
        title: 'Office快捷问答',
        questions: [
            { q: 'Excel中VLOOKUP怎么用？', a: 'VLOOKUP(查找值, 查找区域, 返回列序数, [匹配类型])。示例: =VLOOKUP(A2, B:C, 2, FALSE)在B列找A2的值，返回C列对应值。FALSE=精确匹配。提示: XLOOKUP是更强大的替代方案(Office 365/2021)。常用快捷键: Ctrl+Shift+L自动筛选，Alt+=自动求和，Ctrl+;插入当前日期。' },
            { q: 'Excel如何快速生成图表？', a: '选中数据区域后按F11快速生成默认图表，或按Alt+F1在当前工作表生成。推荐使用"插入"选项卡中的"推荐图表"功能。常用图表类型: 柱状图(比较)、折线图(趋势)、饼图(占比)、散点图(相关性)。数据量小时用饼图，多类别用柱状图，时间序列用折线图。' },
            { q: 'Word中如何设置多级标题自动编号？', a: '1)开始→多级列表→定义新多级列表；2)在弹出框中设置级别1链接到标题1样式；3)级别2链接到标题2；以此类推。设置后输入标题文字按Enter会自动编号。要点: 在"更多>>"中设置编号格式和起始值。Ctrl+Alt+1/2/3快速应用标题1/2/3。' },
            { q: 'PPT如何快速统一格式？', a: '1)使用幻灯片母版: 视图→幻灯片母版，修改一次应用到所有幻灯片；2)格式刷: 双击格式刷可连续应用；3)主题: 设计→主题，一键替换配色和字体；4)替换字体: 开始→替换→替换字体；5)对齐工具: 格式→对齐(左/右/中/顶/底)，Ctrl+Shift+G组合形状。' },
            { q: 'Excel数据透视表怎么用？', a: '1)选中数据→插入→数据透视表；2)行区域拖入分类字段；3)列区域拖入对比字段；4)值区域拖入数值字段(可设置求和/计数/平均等)；5)筛选区域添加筛选器。右键刷新数据。快捷键: Alt+N+V。高级: 切片器(可视化筛选)、时间线(日期筛选)、计算字段(自定义公式)。' },
        ]
    },
    standards: {
        title: '标准与规范查询',
        questions: [
            { q: '齿轮常用国内外标准有哪些？', a: '国标GB: GB/T 10095(精度)、GB/T 1356(基本齿廓)、GB/T 3480(强度计算)。国际ISO: ISO 1328(精度)、ISO 53(基本齿廓)、ISO 6336(强度计算)。德国DIN: DIN 3960~3967。美国AGMA: AGMA 2001(基本标准)、AGMA 2015(精度)。日本JIS: JIS B 1702(精度)。' },
            { q: 'GB/T 10095与ISO 1328的关系？', a: 'GB/T 10095等效采用ISO 1328标准。GB/T 10095.1-2022(原2008版)对应ISO 1328-1，规定齿轮同侧齿面偏差的定义和允许值。GB/T 10095.2对应ISO 1328-2，规定径向综合偏差。两个标准在技术内容上基本一致，最常用的是GB/T 10095.1。' },
            { q: '齿轮检测报告的判据是什么？', a: '根据GB/T 10095或图纸要求，主要判据: 1)齿廓总偏差(Fα)≤Fα允许值；2)螺旋线总偏差(Fβ)≤Fβ允许值；3)单个齿距偏差(fpt)≤fpt允许值；4)齿距累积总偏差(Fp)≤Fp允许值；5)齿厚(或公法线)偏差在公差范围内。通常以上5项都合格才算齿轮合格。' },
            { q: '什么是齿轮的"6σ"质量控制要求？', a: '在汽车和高端齿轮制造中，过程能力Cpk≥1.67(即5σ水平)或Cpk≥2.0(6σ)是常见要求。对应: 6σ水平下每百万个零件中只有3.4个不合格。对于齿轮关键特性(齿形、齿向)通常要求Cpk≥1.67，一般特性要求Cpk≥1.33。需要SPC实时监控。' },
        ]
    }
};

let currentQA = null;
function showQA(type) {
    currentQA = type;
    const data = qaData[type];
    const panel = document.getElementById('qa-panel');
    document.getElementById('qa-title').textContent = data.title;
    renderQAList(data.questions);
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth' });
}

function closeQA() {
    document.getElementById('qa-panel').style.display = 'none';
    currentQA = null;
}

function searchQA() {
    if (!currentQA) return;
    const keyword = document.getElementById('qa-search-input').value.toLowerCase();
    const data = qaData[currentQA];
    if (!keyword) { renderQAList(data.questions); return; }
    const filtered = data.questions.filter(item => item.q.includes(keyword) || item.a.includes(keyword));
    renderQAList(filtered);
}

function renderQAList(items) {
    const list = document.getElementById('qa-list');
    list.innerHTML = items.map((item, i) => `
        <div class="qa-item" onclick="toggleQA(${i})" id="qa-item-${i}">
            <div class="qa-q"><i class="fas fa-question-circle"></i>${item.q}</div>
            <div class="qa-a" id="qa-a-${i}">${item.a}</div>
        </div>`).join('');
}

function toggleQA(index) {
    const answer = document.getElementById('qa-a-' + index);
    if (answer) answer.classList.toggle('show');
}

// === AI 问答 ===
let aiMessages = [];
let aiSystemPrompt = '你是一位资深的齿轮行业质量工程师专家，精通齿轮设计、制造、检测、热处理、质量管理等领域。请用专业但易懂的中文回答用户的问题。如果问题与齿轮或质量管理无关，也请尽量提供帮助。';

function loadAIConfig() {
    const cfg = Storage.get('aiConfig', {});
    if (cfg.apiKey) document.getElementById('ai-api-key').value = cfg.apiKey;
    if (cfg.apiUrl) document.getElementById('ai-api-url').value = cfg.apiUrl;
    if (cfg.model) document.getElementById('ai-model').value = cfg.model;
}

function saveAIConfig() {
    Storage.set('aiConfig', {
        apiKey: document.getElementById('ai-api-key').value,
        apiUrl: document.getElementById('ai-api-url').value,
        model: document.getElementById('ai-model').value
    });
}

function setAIProvider(provider) {
    const urlEl = document.getElementById('ai-api-url');
    const modelEl = document.getElementById('ai-model');
    if (provider === 'deepseek') {
        urlEl.value = 'https://api.deepseek.com/v1/chat/completions';
        modelEl.value = 'deepseek-chat';
    } else if (provider === 'siliconflow') {
        urlEl.value = 'https://api.siliconflow.cn/v1/chat/completions';
        modelEl.value = 'Qwen/Qwen2.5-7B-Instruct';
    }
    saveAIConfig();
    // 视觉反馈
    document.querySelectorAll('.provider-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

async function testAIConnection() {
    const apiKey = document.getElementById('ai-api-key').value.trim();
    const apiUrl = document.getElementById('ai-api-url').value.trim();
    const model = document.getElementById('ai-model').value.trim();
    if (!apiKey) { alert('请先填写 API Key'); return; }
    if (!apiUrl) { alert('请先填写 API 地址'); return; }

    const testMsg = { role: 'user', content: 'Hi' };
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
            body: JSON.stringify({ model: model, messages: [testMsg], max_tokens: 5 })
        });
        if (response.ok) {
            alert('✅ 连接成功！API 配置正确');
        } else {
            const err = await response.text();
            let errMsg = err;
            try { const j = JSON.parse(err); errMsg = j.error?.message || j.message || err; } catch {}
            alert('❌ 连接失败：' + errMsg);
        }
    } catch (e) {
        alert('❌ 网络错误：' + e.message);
    }
}

function switchQATab(tab) {
    document.querySelectorAll('.qa-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.getElementById('qa-tab-kb').style.display = tab === 'kb' ? 'block' : 'none';
    document.getElementById('qa-tab-ai').style.display = tab === 'ai' ? 'block' : 'none';
}

function renderAIChat() {
    const chat = document.getElementById('ai-chat');
    chat.innerHTML = aiMessages.map((m, i) => `
        <div class="ai-msg ${m.role}">
            <div class="ai-msg-avatar">${m.role === 'user' ? '👩‍💼' : '🐱'}</div>
            <div class="ai-msg-content">${formatAIContent(m.content)}</div>
        </div>`).join('');
    chat.scrollTop = chat.scrollHeight;
}

function formatAIContent(text) {
    // 简单处理markdown：换行转<br>，代码块保留
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
}

async function askAI() {
    const input = document.getElementById('ai-question');
    const question = input.value.trim();
    if (!question) return;

    const cfg = Storage.get('aiConfig', {});
    const apiKey = cfg.apiKey || document.getElementById('ai-api-key').value;
    const apiUrl = cfg.apiUrl || document.getElementById('ai-api-url').value || 'https://api.deepseek.com/v1/chat/completions';
    const model = cfg.model || document.getElementById('ai-model').value || 'deepseek-chat';

    if (!apiKey) {
        alert('请先配置 API Key（点击 ⚙️ API 设置）');
        document.querySelector('.ai-config details').open = true;
        return;
    }

    aiMessages.push({ role: 'user', content: question });
    input.value = '';
    renderAIChat();

    // 添加思考中提示
    const thinkingIndex = aiMessages.length;
    aiMessages.push({ role: 'assistant', content: '🐱 Kitty正在思考中...' });
    renderAIChat();

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: aiSystemPrompt },
                    ...aiMessages.filter(m => m.content !== '🐱 Kitty正在思考中...').map(m => ({ role: m.role, content: m.content }))
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const status = response.status;
            const err = await response.text();
            let errMsg;
            try { const j = JSON.parse(err); errMsg = j.error?.message || j.message || err; } catch { errMsg = err; }
            if (status === 401) throw new Error('🔑 API Key 无效，请检查密钥是否正确');
            else if (status === 402) throw new Error('💰 账户余额不足，请充值或换用免费API');
            else if (status === 404) throw new Error('🔗 接口地址或模型名有误：' + errMsg);
            else if (status === 429) throw new Error('⏱️ 请求太频繁，请稍后再试');
            else throw new Error('(' + status + ') ' + errMsg);
        }

        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content || '抱歉，没有获取到回答。';
        aiMessages[thinkingIndex] = { role: 'assistant', content: answer };
    } catch (e) {
        let errMsg = e.message;
        if (errMsg.includes('Failed to fetch') || errMsg.includes('NetworkError')) {
            errMsg = '🌐 网络请求失败，请确认：\n1️⃣ 地址栏是 http:// 开头（不能是 file://）\n2️⃣ 电脑和手机在同一个WiFi\n3️⃣ API地址填写正确';
        }
        aiMessages[thinkingIndex] = { role: 'assistant', content: '❌ ' + errMsg };
    }
    renderAIChat();
}

// =====================
// === 初始渲染 ===
// =====================
function init() {
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
    document.getElementById('diary-date').value = getToday();
    document.getElementById('target-weight').value = targetWeight;

    renderRecords();
    updateFinanceSummary();
    renderSavings();
    updateWeightStats();
    renderDiets();
    renderTodos('all');
    renderDiaries();
    renderExercises();
    renderCheckins();
    updateHomeStats();
    updateTodoBadge();
    loadAIConfig();
}

// =====================
// === 手机访问 ===
// =====================
const MOBILE_URL = 'http://172.20.10.2:5500';
let qrGenerated = false;

function openMobileAccess() {
    const modal = document.getElementById('mobile-modal');
    modal.classList.add('show');
    if (!qrGenerated) {
        new QRCode(document.getElementById('qrcode'), {
            text: MOBILE_URL,
            width: 180,
            height: 180,
            colorDark: '#E8537A',
            colorLight: '#ffffff',
        });
        qrGenerated = true;
    }
}

function closeMobileAccess(e) {
    if (e && e.target !== document.getElementById('mobile-modal')) return;
    document.getElementById('mobile-modal').classList.remove('show');
}

function copyMobileUrl() {
    navigator.clipboard.writeText(MOBILE_URL).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.innerHTML = '<i class="fas fa-check"></i> 已复制';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i> 复制';
            btn.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        // 降级方案
        const input = document.createElement('input');
        input.value = MOBILE_URL;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert('链接已复制: ' + MOBILE_URL);
    });
}

init();
