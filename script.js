// --- ESTADO GLOBAL ---
let player = { 
    name: "JOGADOR", 
    avatarType: "male", 
    xp: 0, 
    level: 1, 
    title: "Novato",
    achievements: [] 
};

const titles = [
    { lvl: 1, text: "Novato" },
    { lvl: 3, text: "Aventureiro" },
    { lvl: 5, text: "Guerreiro Pixel" },
    { lvl: 8, text: "Mago do Code" },
    { lvl: 10, text: "Lenda 8-Bit" }
];

let questsData = {}; // Será carregado do JSON
let gameState = { lives: 5, currentQuest: null, currentNodeId: null, history: [] };

// --- CARREGAR DADOS ---
async function loadQuests() {
    try {
        const response = await fetch('data.json');
        questsData = await response.json();
    } catch (error) {
        console.error("Erro ao carregar quests:", error);
        questsData = {};
    }
}

// --- LISTA DE CONQUISTAS ---
const achievements = [
    { id: "first_blood", name: "PRIMEIRO PASSO", desc: "Ganhou XP pela primeira vez.", condition: (p) => p.xp > 0 },
    { id: "level_5", name: "MEIO CAMINHO", desc: "Chegou ao nível 5.", condition: (p) => p.level >= 5 },
    { id: "konami", name: "TRAPAÇA!", desc: "Usou o código Konami.", condition: (p) => false }
];

// --- RÁDIO LOCAL ---
const bgmList = [
    { file: 'Little Dark Age - MGMTÒÇÉTRADU+ç+âOÒÇæ(MP3_160K).mp3', title: 'Little Dark Age - MGMT' },
    { file: 'FLARE-HENSONN(STOIC VERSION_BEST VERSION)(MP3_160K).mp3', title: 'FLARE - HENSONN' },
    { file: 'G H O S T _28 days later x John wick [ slowed ](MP3_160K).mp3', title: 'GHOST - John Wick' },
    { file: 'Gustavo Bravetti - Babel (Visualizer)(MP3_160K).mp3', title: 'Babel - Gustavo Bravetti' },
    { file: 'Gymnopedie No. 1 - Erik Satie(MP3_320K).mp3', title: 'Gymnopedie No. 1' },
    { file: 'Hippie Sabotage - Devil Eyes(MP3_160K).mp3', title: 'Devil Eyes' },
    { file: 'IMMORTAL(MP3_160K).mp3', title: 'IMMORTAL' },
    { file: 'j_p_n - amend(MP3_160K).mp3', title: 'amend - j^p^n' },
    { file: 'Je te laisserai des mots(MP3_160K).mp3', title: 'Je te laisserai des mots' },
    { file: 'JVSTIN - CLANDESTINA (TikTok Remix) [tradu+º+úo_legendado](MP3_160K).mp3', title: 'Clandestina Remix' },
    { file: 'KEROSENE [Slowed + Reverb] (320).mp3', title: 'KEROSENE' },
    { file: 'LITTLE DARK AGE x SUFFER WITH ME __ [P4nMusic TIKTOK MASHUP](MP3_160K).mp3', title: 'Dark Age x Suffer' },
    { file: 'Mareux - The Perfect Girl (Official Music Video)(MP3_160K).mp3', title: 'The Perfect Girl' },
    { file: 'Mr.Kitty - After Dark(MP3_160K).mp3', title: 'After Dark' },
    { file: 'night lovell polozhenie (s l o w e d _ reverb) Military Edit(MP3_160K).mp3', title: 'Polozhenie' },
    { file: 'Rammstein - Sonne (Slowed _ Reverb) Richard Williams Animated Extended(MP3_160K).mp3', title: 'Sonne (Slowed)' },
    { file: 'Red Hot Chili Peppers - Californication (Official Music Video) [HD UPGRADE](MP3_160K).mp3', title: 'Californication' },
    { file: 'Saddam Hussein - Gangsta_s Paradise(MP3_160K).mp3', title: 'Gangsta\'s Paradise' },
    { file: 'Sarah Blasko - All I Want (tradu+º+úo)(MP3_160K).mp3', title: 'All I Want' },
    { file: 'Say my name(MP3_160K).mp3', title: 'Say My Name' },
    { file: 'The Neighbourhood - Sweater Weather (Lyrics)(MP3_160K).mp3', title: 'Sweater Weather' },
    { file: 'The Pixies - Que Sera_ Sera (Whatever Will Be_ Will Be) TRADU+ç+âO - FROM (ORIGEM)(MP3_160K).mp3', title: 'Que Sera Sera' },
    { file: 'Three Days Grace - Time Of Dying (Legendado_Tradu+º+úo)(MP3_160K).mp3', title: 'Time of Dying' },
    { file: 'TRANSGENDER (SLOWED _ REVERB) ÔÇô CRYSTAL CASTLES (432 Hz)(MP3_160K).mp3', title: 'Transgender' },
    { file: 'Ur Final Message(MP3_160K).mp3', title: 'Ur Final Message' },
    { file: 'Vega King Ghidorah(MP3_160K).mp3', title: 'King Ghidorah' },
    { file: 'Waste (TikTok)(MP3_160K).mp3', title: 'Waste' }
];

let currentTrackIndex = 0;
const bgmAudio = document.getElementById('bgmAudio');
bgmAudio.volume = 0.3;

function loadTrack(index) {
    const track = bgmList[index];
    bgmAudio.src = `src/sounds/${encodeURIComponent(track.file)}`;
    bgmAudio.load();
    document.getElementById('radioDisplay').innerText = `♪ ${track.title}`;
}

function radioToggle() {
    if (bgmAudio.paused) {
        bgmAudio.play().catch(e => console.log("Erro ao tocar:", e));
        document.getElementById('playIcon').className = 'fa-solid fa-pause';
    } else {
        bgmAudio.pause();
        document.getElementById('playIcon').className = 'fa-solid fa-play';
    }
}

function radioNext() {
    currentTrackIndex = (currentTrackIndex + 1) % bgmList.length;
    loadTrack(currentTrackIndex);
    bgmAudio.play();
    document.getElementById('playIcon').className = 'fa-solid fa-pause';
}

function radioPrev() {
    currentTrackIndex = (currentTrackIndex - 1 + bgmList.length) % bgmList.length;
    loadTrack(currentTrackIndex);
    bgmAudio.play();
    document.getElementById('playIcon').className = 'fa-solid fa-pause';
}

function radioVolume() {
    if (bgmAudio.muted) {
        bgmAudio.muted = false;
        document.getElementById('volIcon').className = 'fa-solid fa-volume-high';
    } else {
        bgmAudio.muted = true;
        document.getElementById('volIcon').className = 'fa-solid fa-volume-xmark';
    }
}

bgmAudio.addEventListener('ended', radioNext);
loadTrack(0);

// --- SISTEMA DE SFX ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let sfxMuted = false;

function toggleSFX() {
    sfxMuted = !sfxMuted;
    const btn = document.getElementById('sfxBtn');
    if(sfxMuted) {
        btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> SFX: OFF';
    } else {
        btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> SFX: ON';
        if(audioCtx.state === 'suspended') audioCtx.resume();
    }
}

function playSound(type) {
    if (sfxMuted) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'win') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, now); 
        osc.frequency.setValueAtTime(659.25, now + 0.1); 
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'lose') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.2);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'levelup') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554, now + 0.1);
        osc.frequency.setValueAtTime(659, now + 0.2);
        osc.frequency.setValueAtTime(880, now + 0.4);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
    } else if (type === 'ui') { 
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'achievement') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.2);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
    } else if (type === 'start-adventure') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        const duration = 0.15; 
        notes.forEach((freq, index) => {
            const noteOsc = audioCtx.createOscillator();
            const noteGain = audioCtx.createGain();
            noteOsc.type = 'square'; 
            noteOsc.frequency.value = freq;
            noteOsc.connect(noteGain);
            noteGain.connect(audioCtx.destination);
            const startTime = now + (index * duration);
            noteGain.gain.setValueAtTime(0.1, startTime);
            noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            noteOsc.start(startTime);
            noteOsc.stop(startTime + duration);
        });
    }
}

function playUISound() { playSound('ui'); }
function playAdventureStartTheme() { playSound('start-adventure'); }

// --- SISTEMA DE CONQUISTAS ---
function checkAchievements() {
    achievements.forEach(ach => {
        if (!player.achievements.includes(ach.id) && ach.condition(player)) {
            unlockAchievement(ach);
        }
    });
}

function unlockAchievement(ach) {
    player.achievements.push(ach.id);
    playSound('achievement');
    
    const popup = document.getElementById('achievementPopup');
    document.getElementById('achievementText').innerText = ach.name;
    popup.style.display = 'flex';
    setTimeout(() => popup.style.display = 'none', 4000);
}

// --- SETUP E AVATAR ---
let selectedAvatarType = "male";

function selectAvatar(type) {
    playUISound(); 
    selectedAvatarType = type;
    document.getElementById('opt-male').classList.remove('selected');
    document.getElementById('opt-female').classList.remove('selected');
    document.getElementById('opt-' + type).classList.add('selected');
}

function confirmSetup() {
    playAdventureStartTheme();
    radioToggle();

    const nameInput = document.getElementById('playerNameInput').value;
    if(nameInput.trim() === "") { alert("Por favor, digite seu nome!"); return; }
    player.name = nameInput;
    player.avatarType = selectedAvatarType;
    applyPlayerSettings();
    document.getElementById('setupModal').style.display = 'none';
    
    document.body.classList.add('game-started');
    document.getElementById('mainRadio').style.display = 'flex';
    document.getElementById('sfxBtn').style.display = 'block'; 
}

function openSetup() {
    playUISound();
    document.getElementById('playerNameInput').value = player.name;
    selectAvatar(player.avatarType);
    document.getElementById('setupModal').style.display = 'flex';
}

function applyPlayerSettings() {
    document.getElementById('hud-name').innerText = player.name;
    const hudContainer = document.getElementById('hudHeroContainer');
    if(player.avatarType === 'female') {
        hudContainer.classList.add('female-avatar');
    } else {
        hudContainer.classList.remove('female-avatar');
    }
    const modalContainer = document.getElementById('modalHeroContainer');
    if(player.avatarType === 'female') {
        modalContainer.classList.add('female-avatar');
    } else {
        modalContainer.classList.remove('female-avatar');
    }
}

// --- MAPEAMENTO E CARDS ---
const tecnologias = [
    { nome: "JavaScript", icon: "fa-solid fa-scroll" }, 
    { nome: "Python", icon: "fa-solid fa-flask" }, 
    { nome: "TypeScript", icon: "fa-solid fa-shield-halved" }, 
    { nome: "Java", icon: "fa-solid fa-mug-hot" }, 
    { nome: "C#", icon: "fa-solid fa-chess-rook" }, 
    { nome: "SQL", icon: "fa-solid fa-database" }, 
    { nome: "React", icon: "fa-solid fa-atom" }, 
    { nome: "HTML", icon: "fa-brands fa-fort-awesome" }, 
    { nome: "CSS", icon: "fa-solid fa-palette" }, 
    { nome: "Git", icon: "fa-solid fa-code-branch" }, 
    { nome: "Angular", icon: "fa-solid fa-shield" }, 
    { nome: "Vue.js", icon: "fa-solid fa-eye" }, 
    { nome: "Docker", icon: "fa-solid fa-box-open" } 
];

const cores = ["#3b82f6", "#ef4444", "#22c55e", "#eab308", "#a855f7", "#ec4899"];

function getCor(index) { return cores[index % cores.length]; }

function renderizarCards(lista) {
    const container = document.getElementById('container');
    container.innerHTML = '';
    lista.forEach((tech, index) => {
        const card = document.createElement('div');
        card.className = 'tech-card';
        const cor = getCor(index);
        card.style.setProperty('--card-color', cor);
        card.style.borderColor = cor;
        card.innerHTML = `
            <div class="tech-content">
                <i class="${tech.icon} tech-icon" style="color: ${cor};"></i>
                <div class="tech-name">${tech.nome}</div>
            </div>
            <button class="start-btn">START GAME</button>
        `;
        card.querySelector('.start-btn').onclick = () => startGame(tech.nome);
        container.appendChild(card);
    });
}

// --- ENGINE DO RPG ---
function getGenericQuest(techName) {
    return {
        startNode: "intro",
        nodes: {
            "intro": {
                "text": `Você entrou na masmorra de ${techName}. Um bug gigante bloqueia a saída!`,
                "choices": [
                    { "text": "Consultar a Documentação", "next": "win", "type": "safe" },
                    { "text": "Deletar a pasta System32", "next": "fail", "type": "lose" }
                ]
            },
            "fail": { "text": "O computador explodiu! Tente ser mais prudente.", "type": "try_again" },
            "win": { "text": "Você encontrou a fraqueza do bug na documentação! Vitória!", "type": "win" }
        }
    };
}

function startGame(techName) {
    playUISound(); 
    gameState.lives = 5;
    gameState.history = [];
    
    // Usa dados carregados ou genérico
    if (questsData[techName]) {
        gameState.currentQuest = questsData[techName];
    } else {
        gameState.currentQuest = getGenericQuest(techName);
    }
    
    gameState.currentNodeId = gameState.currentQuest.startNode;
    
    document.getElementById('gameTitleText').innerText = techName.toUpperCase();
    updateLives();
    document.getElementById('gameModal').style.display = 'flex';
    renderNode();
}

function renderNode() {
    const node = gameState.currentQuest.nodes[gameState.currentNodeId];
    const contentDiv = document.getElementById('gameContent');
    contentDiv.innerHTML = '';

    if (node.type === 'win') {
        playSound('win');
        triggerHeroReaction('win'); 
        addXP(100); // XP de conclusão da jornada
        contentDiv.innerHTML = `
            <div style="text-align:center;">
                <h1 style="color:var(--accent-green); margin-bottom:2rem;">QUEST COMPLETE!</h1>
                <p class="narrative-text">${node.text}</p>
                <div style="color:var(--accent-yellow); margin:2rem; font-size:1.5rem;">+100 XP</div>
                <button class="choice-btn" onclick="closeGame()">RETORNAR AO MAPA</button>
            </div>`;
        return;
    }

    if (node.type === 'try_again') {
        contentDiv.innerHTML = `
            <div style="text-align:center;">
                <h1 style="color:var(--accent-red); margin-bottom:2rem;">MISSÃO FALHOU</h1>
                <p class="narrative-text">${node.text}</p>
                <button class="choice-btn" onclick="stepBack()">TENTAR NOVAMENTE</button>
            </div>`;
        return;
    }

    const p = document.createElement('p');
    p.className = 'narrative-text';
    p.innerText = node.text;
    contentDiv.appendChild(p);

    const choicesDiv = document.createElement('div');
    choicesDiv.className = 'choices-container';

    node.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerText = choice.text;
        btn.onclick = () => handleChoice(choice);
        choicesDiv.appendChild(btn);
    });
    contentDiv.appendChild(choicesDiv);
}

function handleChoice(choice) {
    if (choice.type === 'lose') {
        playSound('lose');
        triggerHeroReaction('lose'); 
        gameState.lives--;
        updateLives();
        
        const win = document.getElementById('gameWindow');
        win.classList.add('shake');
        setTimeout(() => win.classList.remove('shake'), 500);

        if (gameState.lives <= 0) {
            document.getElementById('gameContent').innerHTML = `
                <div style="text-align:center; color:var(--accent-red);">
                    <h1>GAME OVER</h1>
                    <p>SUA JORNADA TERMINOU AQUI.</p>
                    <button class="choice-btn" onclick="closeGame()" style="margin-top:2rem">SAIR</button>
                </div>
            `;
        } else {
            gameState.history.push(gameState.currentNodeId);
            gameState.currentNodeId = choice.next;
            renderNode();
        }
    } else {
        playSound('win');
        // *** MUDANÇA AQUI: Adiciona XP a cada acerto (nó 'safe' ou 'win') ***
        if (choice.type === 'safe') {
            addXP(20); // Ganha 20 XP por acerto intermediário
        }
        gameState.currentNodeId = choice.next;
        renderNode();
    }
}

function stepBack() {
    playUISound(); 
    if(gameState.history.length > 0) {
        gameState.currentNodeId = gameState.history.pop();
        renderNode();
    }
}

function updateLives() {
    let hearts = "";
    for(let i=0; i<gameState.lives; i++) hearts += "❤️";
    document.getElementById('gameLives').innerText = hearts;
}

function closeGame() {
    playUISound(); 
    document.getElementById('gameModal').style.display = 'none';
}

// --- REAÇÕES DO PERSONAGEM ---
function triggerHeroReaction(type) {
    const heroes = [
        document.getElementById('hudHeroContainer').querySelector('.pixel-hero-art'),
        document.getElementById('modalHeroContainer').querySelector('.pixel-hero-art')
    ];

    heroes.forEach(hero => {
        if(!hero) return;
        hero.classList.remove('hero-jump', 'hero-damage', 'hero-levelup');
        void hero.offsetWidth;

        if (type === 'win') {
            hero.classList.add('hero-jump');
        } else if (type === 'lose') {
            hero.classList.add('hero-damage');
        } else if (type === 'levelup') {
            hero.classList.add('hero-levelup');
        }
    });
}

// --- PROGRESSÃO ---
function addXP(amount) {
    player.xp += amount;
    checkAchievements(); 
    const nextLevel = player.level * 100;
    if (player.xp >= nextLevel) {
        player.level++;
        playSound('levelup');
        triggerHeroReaction('levelup'); 
        const newTitle = titles.find(t => t.lvl === player.level);
        if(newTitle) player.title = newTitle.text;
        const pop = document.getElementById('levelupPopup');
        pop.style.display = 'block';
        setTimeout(() => pop.style.display = 'none', 3000);
    }
    updateHUD();
}

function updateHUD() {
    document.getElementById('hud-title').innerText = player.title;
    document.getElementById('hud-level').innerText = String(player.level).padStart(2, '0');
    document.getElementById('hud-xp').innerText = String(player.xp).padStart(4, '0');
}

// --- INICIALIZAÇÃO ---
document.getElementById('searchInput').addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    const fil = tecnologias.filter(t => t.nome.toLowerCase().includes(val));
    renderizarCards(fil);
});

// Easter Egg
let konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;
document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            playSound('levelup');
            unlockAchievement({ id: "konami", name: "TRAPAÇA!", desc: "Konami Code Ativado!" });
            addXP(1000); 
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

loadQuests(); // Carrega JSON
renderizarCards(tecnologias);
updateHUD();