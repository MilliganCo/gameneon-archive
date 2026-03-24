// game.js

// Основной объект состояния игры
const gameState = {

    keysDown: { w:false, a:false, s:false, d:false },


    
    // Игрок
    player: {
      playerPos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      class: null,
      health: 100,
      maxHealth: 100,
      energy: 100,
      maxEnergy: 100,
      level: 1,
      xp: 0,
      nextLevelXp: 100,
      credits: 0,
      kills: 0,
      damage: 10,
      defense: 0,
      speed: 5,
      skills: {
        skill1: { name: "Basic Attack", level: 1, cost: 0, cooldown: 0, currentCooldown: 0 },
        skill2: { name: "Class Ability", level: 1, cost: 20, cooldown: 5, currentCooldown: 0 },
        skill3: { name: "Defensive Move", level: 1, cost: 30, cooldown: 10, currentCooldown: 0 },
        skill4: { name: "Ultimate", level: 1, cost: 50, cooldown: 20, currentCooldown: 0 }
      },
      inventory: {
        weapon1: { name: "Basic Weapon", damage: 10, type: "melee" },
        weapon2: { name: "Basic Ranged", damage: 8, type: "ranged", ammo: 30, maxAmmo: 30 },
        item:    { name: "Health Pack",    type: "consumable", amount: 1, effect: "heal",   value: 30 }
      },
      activeWeapon: "weapon1",
      activeItem: null
    },
  
    // Настройки
    settings: {
      volume: 50,
      difficulty: "normal",
      difficulties: {
        easy:   { enemyHealth: 0.8, enemyDamage: 0.8, xpGain: 1.2, creditGain: 1.2 },
        normal: { enemyHealth: 1.0, enemyDamage: 1.0, xpGain: 1.0, creditGain: 1.0 },
        hard:   { enemyHealth: 1.2, enemyDamage: 1.2, xpGain: 0.8, creditGain: 0.8 },
        insane: { enemyHealth: 1.5, enemyDamage: 2.0, xpGain: 1.5, creditGain: 1.5 }
      }
    },
  
    // Состояние уровня
    currentLevel: 1,
    enemies: [],
    graffitiSpots: [],
    keys: [],
    chests: [],
    doors: [],
    shops: [],
    exits: [],
    boss: null,
    gameStarted: false,
    paused: false,
    inShop: false,
    inUpgrades: false,
    gameOver: false,
    levelComplete: false,
    objective: "kill",      // "kill" или "graffiti"
    graffitiTotal: 5,
    graffitiDone: 0,
    enemiesTotal: 10,
    enemiesRemaining: 10,
  
    // Классы игрока
    classes: {
      technomage: {
        name: "Technomage",
        health: 80,
        energy: 150,
        damage: 12,
        defense: 2,
        speed: 6,
        skills: {
          skill1: { name: "Plasma Bolt", description: "Shoot a bolt of plasma energy", damage: 15, cost: 5, type: "ranged" },
          skill2: { name: "Energy Surge", description: "Wave of energy", damage: 25, cost: 30, type: "aoe", radius: 100 },
          skill3: { name: "Force Field",  description: "Protective barrier", reduction: 0.5, duration: 5, cost: 40, type: "defensive" },
          skill4: { name: "Quantum Rift", description: "Damage all enemies", damage: 50, cost: 60, type: "ultimate" }
        },
        inventory: {
          weapon1: { name: "Energy Blade", damage: 12, type: "melee" },
          weapon2: { name: "Plasma Pistol", damage: 15, type: "ranged", ammo: 20, maxAmmo: 20 },
          item:    { name: "Energy Cell",   type: "consumable", amount: 1, effect: "energy", value: 50 }
        }
      },
      cyberberserk: {
        name: "Cyber Berserk",
        health: 150,
        energy: 80,
        damage: 18,
        defense: 5,
        speed: 4,
        skills: {
          skill1: { name: "Power Strike", description: "Powerful melee attack", damage: 25, cost: 10, type: "melee" },
          skill2: { name: "Berserk Rage", description: "Increase damage", multiplier: 1.5, duration: 8, cost: 30, type: "buff" },
          skill3: { name: "Shockwave",    description: "Stun enemies", duration: 3, cost: 25, type: "aoe", radius: 80 },
          skill4: { name: "Omnislash",    description: "Attack all around", hits: 5, damage: 15, cost: 50, type: "ultimate" }
        },
        inventory: {
          weapon1: { name: "Vibro Axe", damage: 20, type: "melee" },
          weapon2: { name: "Shotgun",   damage: 30, type: "ranged", ammo: 6, maxAmmo: 6, spread: 30 },
          item:    { name: "Stim Pack", type: "consumable", amount: 1, effect: "health", value: 50 }
        }
      },
      ludohacker: {
        name: "Ludo Hacker",
        health: 100,
        energy: 120,
        damage: 10,
        defense: 3,
        speed: 7,
        skills: {
          skill1: { name: "Precision Shot", description: "Accurate ranged attack", damage: 18, cost: 5, type: "ranged" },
          skill2: { name: "Hack System",     description: "Disable enemy", duration: 5, cost: 25, type: "debuff" },
          skill3: { name: "Stealth Mode",    description: "Become invisible", duration: 6, cost: 35, type: "defensive" },
          skill4: { name: "Overload",        description: "Enemy explodes", damage: 40, radius: 80, cost: 45, type: "ultimate" }
        },
        inventory: {
          weapon1: { name: "Combat Knife", damage: 12, type: "melee" },
          weapon2: { name: "SMG",          damage: 8, type: "ranged", ammo: 30, maxAmmo: 30, fireRate: 3 },
          item:    { name: "EMP Grenade", type: "consumable", amount: 1, effect: "stun", value: 3, radius: 100 }
        }
      }
    },
  
    // Магазин
    shopItems: [
      { name: "Health Pack",    type: "consumable", effect: "heal",   value: 30, price: 20, limit: 3 },
      { name: "Energy Cell",    type: "consumable", effect: "energy", value: 30, price: 20, limit: 3 },
      { name: "Stim Pack",      type: "consumable", effect: "both",   value: 20, price: 30, limit: 2 },
      { name: "EMP Grenade",    type: "consumable", effect: "stun",   value: 3,  price: 40, limit: 2 },
      { name: "Combat Knife",   type: "weapon",     damage: 15,            price: 50 },
      { name: "Plasma Pistol",  type: "weapon",     damage: 20,  ammo: 15, price: 80 },
      { name: "Body Armor",     type: "armor",      defense: 5,           price: 100 },
      { name: "Energy Shield",  type: "armor",      defense: 3, energyBonus: 20, price: 120 }
    ],
  
    // Улучшения
    upgradeOptions: [
      { name: "Increase Health",    type: "health", value: 10, cost: 50,  max: 5 },
      { name: "Increase Energy",    type: "energy", value: 10, cost: 50,  max: 5 },
      { name: "Increase Damage",    type: "damage", value: 2,  cost: 75,  max: 5 },
      { name: "Increase Defense",   type: "defense", value: 1, cost: 100, max: 5 },
      { name: "Upgrade Skill 1",    type: "skill1", value: 1, cost: 100, max: 3 },
      { name: "Upgrade Skill 2",    type: "skill2", value: 1, cost: 150, max: 3 },
      { name: "Upgrade Skill 3",    type: "skill3", value: 1, cost: 200, max: 3 },
      { name: "Upgrade Skill 4",    type: "skill4", value: 1, cost: 300, max: 3 }
    ],
  
    // Враги
    enemyTypes: [
      { name: "Drone",    health: 30, damage: 5,  speed: 3,  color: "#f00", credits: 10, xp: 20 },
      { name: "Enforcer", health: 50, damage: 8,  speed: 2,  color: "#f80", credits: 15, xp: 30 },
      { name: "Hunter",   health: 40, damage: 6,  speed: 4,  color: "#0f0", credits: 20, xp: 25 },
      { name: "Tank",     health: 80, damage: 12, speed: 1,  color: "#00f", credits: 25, xp: 40 }
    ],
  
    // Боссы
    bossTypes: [
      { name: "Security Chief", health: 200, damage: 15, speed: 2, color: "#f0f", credits: 100, xp: 150, ability: "Summon Drones" },
      { name: "AI Overseer",    health: 150, damage: 20, speed: 3, color: "#0ff", credits: 120, xp: 180, ability: "Energy Blast" },
      { name: "Warden",         health: 250, damage: 18, speed: 1, color: "#ff0", credits: 150, xp: 200, ability: "Shockwave" }
    ],
  
    moveWorld: function(offsetX, offsetY){
        document.querySelectorAll('.enemy,.graffiti-spot,.key,.chest,.door,.shop,.exit')
          .forEach(el=>{
            el.style.left = (parseFloat(el.style.left)+offsetX)+'px';
            el.style.top  = (parseFloat(el.style.top)+offsetY)+'px';
          });
      },
      

    // Скрыть все меню/экраны
    hideAllMenus: function() {
      [
        'main-menu','settings-menu','credits-menu',
        'class-select-menu','pause-menu','shop-menu',
        'upgrade-menu','death-screen','level-complete'
      ].forEach(id => {
        document.getElementById(id).style.display = 'none';
      });
    },
  
    // Инициализация
    init: function() {
      this.setupEventListeners();
      this.showMainMenu();
    },
  
    // Навешиваем клики и клавиши
    setupEventListeners: function() {

        document.addEventListener('mousedown', e=>{
            if (e.button!==0) return;      // только ЛКМ
            if (!this.gameStarted||this.paused) return;
            this.performAttack();
            });
          

      // Главное меню
      document.getElementById('start-game').addEventListener('click', () => this.showClassSelect());
      document.getElementById('settings').addEventListener('click',   () => this.showSettings());
      document.getElementById('credits').addEventListener('click',    () => this.showCredits());
      document.getElementById('exit-game').addEventListener('click',  () => window.close());
  
      // Настройки
      document.getElementById('back-to-main').addEventListener('click', () => this.showMainMenu());
      document.getElementById('volume').addEventListener('input',      e => this.settings.volume = e.target.value);
      document.getElementById('difficulty').addEventListener('change', e => this.settings.difficulty = e.target.value);
  
      // Кредиты
      document.getElementById('credits-back').addEventListener('click', () => this.showMainMenu());
  
      // Выбор класса
      document.querySelectorAll('.class-option').forEach(option => {
        option.addEventListener('click', () => {
          document.querySelectorAll('.class-option').forEach(o => o.classList.remove('selected'));
          option.classList.add('selected');
          this.player.class = option.dataset.class;
        });
      });
      document.getElementById('confirm-class').addEventListener('click', () => {
        if (!this.player.class) {
          this.showNotification("Please select a class");
          return;
        }
        this.startGame();
      });
      document.getElementById('back-to-main-from-class').addEventListener('click', () => this.showMainMenu());
  
      // Пауза / клавиши
      document.getElementById('resume-game').addEventListener('click', () => this.resumeGame());
      document.getElementById('save-game').addEventListener('click',   () => this.saveGame());
      document.getElementById('load-game').addEventListener('click',   () => this.loadGame());
      document.getElementById('quit-to-menu').addEventListener('click',()=> this.quitToMenu());
  
      document.addEventListener('keydown', e=>{
        if (e.key==='w') this.keysDown.w = true;
        if (e.key==='a') this.keysDown.a = true;
        if (e.key==='s') this.keysDown.s = true;
        if (e.key==='d') this.keysDown.d = true;
      });
      document.addEventListener('keyup', e=>{
        if (e.key==='w') this.keysDown.w = false;
        if (e.key==='a') this.keysDown.a = false;
        if (e.key==='s') this.keysDown.s = false;
        if (e.key==='d') this.keysDown.d = false;
      });
      
      // Магазин / улучшения
      document.getElementById('exit-shop').addEventListener('click',    () => this.exitShop());
      document.getElementById('exit-upgrades').addEventListener('click',()=> this.exitUpgrades());
  
      // Экран смерти
      document.getElementById('retry').addEventListener('click',         () => this.startGame());
      document.getElementById('quit-after-death').addEventListener('click',()=> this.quitToMenu());
  
      // Завершение уровня
      document.getElementById('next-level').addEventListener('click',    () => this.nextLevel());
      document.getElementById('shop-button').addEventListener('click',   () => this.showShop());
      document.getElementById('upgrade-button').addEventListener('click',()=> this.showUpgrades());
  
      // Селектор оружия
      document.querySelectorAll('.weapon-option').forEach(option => {
        option.addEventListener('click', () => {
          document.querySelectorAll('.weapon-option').forEach(o => o.classList.remove('active'));
          option.classList.add('active');
          document.querySelectorAll('.inventory-slot').forEach(s => s.classList.remove('active'));
  
          if (option.dataset.weapon === "1") {
            this.player.activeWeapon = "weapon1";
            document.getElementById('inventory-weapon1').classList.add('active');
          } else if (option.dataset.weapon === "2") {
            this.player.activeWeapon = "weapon2";
            document.getElementById('inventory-weapon2').classList.add('active');
          } else {
            this.player.activeItem = "item";
            document.getElementById('inventory-item').classList.add('active');
          }
        });
      });
  
      // Селектор умений
      document.querySelectorAll('.skill-option').forEach(option => {
        option.addEventListener('click', () => {
          if (option.classList.contains('disabled')) return;
          this.useSkill(`skill${option.dataset.skill}`);
        });
      });
  
      // Горячие клавиши
      document.addEventListener('keydown', e => {
        if (!this.gameStarted || this.paused || this.gameOver || this.levelComplete) return;
        if (e.key === 'Escape') { this.pauseGame(); return; }
        if (e.key === '1') document.querySelector('.weapon-option[data-weapon="1"]').click();
        if (e.key === '2') document.querySelector('.weapon-option[data-weapon="2"]').click();
        if (e.key === '3') document.querySelector('.weapon-option[data-weapon="item"]').click();
        if (e.key === 'q') this.useSkill('skill1');
        if (e.key === 'e') this.useSkill('skill2');
        if (e.key === 'r') this.useSkill('skill3');
        if (e.key === 'f') this.useSkill('skill4');
        if (e.key === 'g' && this.player.activeItem) this.useItem();
      });
    },
  
    performAttack: function(){
        // на ближнем оружии — проверяем врагов в радиусе 50px
        const dmg = this.player.inventory[this.player.activeWeapon].damage;
        this.enemies.forEach(en=>{
          const dx = parseFloat(en.x) - this.player.playerPos.x;
          const dy = parseFloat(en.y) - this.player.playerPos.y;
          if (Math.hypot(dx,dy) < 50){
            en.health -= dmg;
            if (en.health<=0) this.killEnemy(en.id);
          }
        });
      },
      killEnemy: function(id){
        const idx = this.enemies.findIndex(e=>e.id===id);
        if (idx<0) return;
        const en = this.enemies[idx];
        this.enemies.splice(idx,1);
        document.getElementById(`enemy-${id}`).remove();
        this.enemiesRemaining--;
        this.player.kills++;
        this.player.xp     += en.xp;
        this.player.credits+= en.credits;
        this.updateHUD();
        this.checkObjective();
      },
      

    // Показать главное меню
    showMainMenu: function() {
      this.hideAllMenus();
      document.getElementById('main-menu').style.display = 'block';
      this.gameStarted = false;
      this.paused = false;
      this.gameOver = false;
      this.levelComplete = false;
    },
  
    // Настройки
    showSettings: function() {
      this.showMainMenu();
      document.getElementById('main-menu').style.display = 'none';
      document.getElementById('settings-menu').style.display = 'block';
      document.getElementById('volume').value = this.settings.volume;
      document.getElementById('difficulty').value = this.settings.difficulty;
    },
  
    // Кредиты
    showCredits: function() {
      this.showMainMenu();
      document.getElementById('main-menu').style.display = 'none';
      document.getElementById('credits-menu').style.display = 'block';
    },
  
    // Выбор класса
    showClassSelect: function() {
      this.showMainMenu();
      document.getElementById('main-menu').style.display = 'none';
      document.getElementById('class-select-menu').style.display = 'block';
      document.querySelectorAll('.class-option').forEach(o => o.classList.remove('selected'));
      this.player.class = null;
    },
  
    // Запуск игры
    startGame: function() {
      // Скрыть все меню и показать HUD
      this.hideAllMenus();
      document.getElementById('hud').style.display = 'block';
  
      // Инициализировать параметры класса
      const c = this.classes[this.player.class];
      Object.assign(this.player, {
        health: c.health,
        maxHealth: c.health,
        energy: c.energy,
        maxEnergy: c.energy,
        damage: c.damage,
        defense: c.defense,
        speed: c.speed,
        level: 1,
        xp: 0,
        nextLevelXp: 100,
        credits: 0,
        kills: 0,
        inventory: {
          weapon1: {...c.inventory.weapon1},
          weapon2: {...c.inventory.weapon2},
          item:    {...c.inventory.item}
        },
        activeWeapon: "weapon1",
        activeItem: null,
        skills: {
          skill1: {...c.skills.skill1, level:1, currentCooldown:0},
          skill2: {...c.skills.skill2, level:1, currentCooldown:0},
          skill3: {...c.skills.skill3, level:1, currentCooldown:0},
          skill4: {...c.skills.skill4, level:1, currentCooldown:0}
        }
      });
  
      // Сброс состояния уровня
      this.currentLevel = 1;
      this.gameStarted  = true;
      this.gameOver     = false;
      this.levelComplete= false;
      this.paused       = false;
  
      // Обновить HUD
      this.updateHUD();
  
      // Создать уровень и запустить цикл
      this.generateLevel();
      this.gameLoop();
    },
  
    generateMaze: function(cols=31,rows=31){
        // рекурсивный backtracker
        const grid = Array.from({length:rows},_=>Array(cols).fill(1)); // 1‑стена
        const stack = [[1,1]];
        grid[1][1]=0;
        const dirs=[[0,2],[0,-2],[2,0],[-2,0]];
        while (stack.length){
          const [cx,cy] = stack[stack.length-1];
          const neigh = dirs
            .map(([dx,dy])=>[cx+dx,cy+dy,dx,dy])
            .filter(([nx,ny])=>nx>0&&ny>0&&nx<cols-1&&ny<rows-1&&grid[ny][nx]===1);
          if (!neigh.length){ stack.pop(); continue; }
          const [nx,ny,dx,dy] = neigh[Math.random()*neigh.length|0];
          grid[cy+dy/2][cx+dx/2]=0; grid[ny][nx]=0;
          stack.push([nx,ny]);
        }
        return grid; // 0‑проход,1‑стена
      },
      

    // Случайная генерация уровня
    generateLevel: function() {
      // Очистка предыдущего
      this.enemies = [];
      this.graffitiSpots = [];
      this.keys = [];
      this.chests = [];
      this.doors = [];
      this.shops = [];
      this.exits = [];
      this.boss = null;
      document.querySelectorAll('.enemy, .graffiti-spot, .key, .chest, .door, .shop, .exit').forEach(el => el.remove());

      const maze = this.generateMaze();
      this.lastMaze = maze;
      const cell = 40; // px
      maze.forEach((row,y)=>{
        row.forEach((v,x)=>{
          if (v===1){           // стена
            const wall=document.createElement('div');
            wall.className='wall';
            wall.style.cssText=`position:absolute;background:#222;width:${cell}px;height:${cell}px;
              left:${x*cell}px;top:${y*cell}px;`;
            document.getElementById('game-container').appendChild(wall);
          }
        });
      });
      // разместим игрока в (1,1)
      this.player.playerPos = {x: cell * 1 + cell / 2, y: cell * 1 + cell / 2};

      // Добавьте в generateLevel после размещения игрока:
      const playerEl = document.getElementById('player');
      if (!playerEl) {
        const el = document.createElement('div');
        el.id = 'player';
        el.className = 'player';
        document.getElementById('game-container').appendChild(el);
      }
      this.updatePlayerPosition();

      // выход в правом‑нижнем крайнем проходе
      this.spawnExitAt(cell*(maze[0].length-2)+cell/2, cell*(maze.length-2)+cell/2);

      // Определить цель уровня
      this.objective = Math.random()<0.5 ? "kill" : "graffiti";
      if (this.objective === "kill") {
        this.enemiesTotal = 5 + this.currentLevel*2;
        for (let i = 0; i < this.enemiesTotal; i++) {
          this.spawnEnemy();
        }
      } else {
        // ...спаун граффити...
      }
    },
  
    // Спавн отдельного врага
    spawnEnemy: function() {
      const type = this.enemyTypes[Math.floor(Math.random()*this.enemyTypes.length)];
      const mod = this.settings.difficulties[this.settings.difficulty];
      // Найти свободную клетку
      let cell = 40;
      let maze = this.lastMaze || this.generateMaze();
      let freeCells = [];
      maze.forEach((row, y) => row.forEach((v, x) => {
        if (v === 0 && (x !== 1 || y !== 1)) freeCells.push({x, y});
      }));
      const pos = freeCells[Math.floor(Math.random()*freeCells.length)];
      const enemy = {
        id: Date.now()+Math.random(),
        type: type.name,
        health: type.health * mod.enemyHealth,
        maxHealth: type.health * mod.enemyHealth,
        damage: type.damage * mod.enemyDamage,
        speed: type.speed,
        color: type.color,
        credits: type.credits,
        xp: type.xp,
        x: pos.x * cell + cell/2,
        y: pos.y * cell + cell/2,
        elite: Math.random()<0.1
      };
      if(enemy.elite){
        enemy.health*=1.5; enemy.maxHealth*=1.5;
        enemy.damage*=1.5; enemy.credits*=2; enemy.xp*=1.5;
      }
      this.enemies.push(enemy);
    
      const el = document.createElement('div');
      el.className = 'enemy';
      el.id = `enemy-${enemy.id}`;
      el.style.left = `${enemy.x}px`;
      el.style.top  = `${enemy.y}px`;
      el.style.backgroundColor = enemy.color;
      el.textContent = enemy.elite ? 'E' : enemy.type[0];
      el.title = `${enemy.type}${enemy.elite?' (Elite)':''}\nHP: ${enemy.health}/${enemy.maxHealth}\nDMG: ${enemy.damage}`;
      document.getElementById('game-container').appendChild(el);
    },
  
    // Спавн босса
    spawnBoss: function() {
      const type = this.bossTypes[Math.floor(Math.random()*this.bossTypes.length)];
      const mod = this.settings.difficulties[this.settings.difficulty];
      this.boss = {
        id: Date.now()+Math.random(),
        type: type.name,
        health: type.health * mod.enemyHealth,
        maxHealth: type.health * mod.enemyHealth,
        damage: type.damage * mod.enemyDamage,
        speed: type.speed,
        color: type.color,
        credits: type.credits,
        xp: type.xp,
        ability: type.ability,
        x: window.innerWidth/2,
        y: window.innerHeight/2
      };
      const el = document.createElement('div');
      el.className = 'enemy';
      el.id = `boss-${this.boss.id}`;
      el.style.left = `${this.boss.x}px`;
      el.style.top  = `${this.boss.y}px`;
      el.style.width  = '80px';
      el.style.height = '80px';
      el.style.fontSize = '1.5rem';
      el.style.backgroundColor = this.boss.color;
      el.textContent = 'B';
      el.title = `${this.boss.type}\nHP: ${this.boss.health}/${this.boss.maxHealth}\nDMG: ${this.boss.damage}\nAbility: ${this.boss.ability}`;
      document.getElementById('game-container').appendChild(el);
  
      document.getElementById('boss-health').style.display = 'block';
      document.getElementById('boss-name').style.display   = 'block';
      document.getElementById('boss-name').textContent     = this.boss.type;
      this.updateBossHealth();
    },
  
    // Спавн граффити-спота
    spawnGraffitiSpot: function() {
      const spot = {
        id: Date.now()+Math.random(),
        x: Math.random()*(window.innerWidth-100)+50,
        y: Math.random()*(window.innerHeight-100)+50,
        tagged: false
      };
      this.graffitiSpots.push(spot);
      const el = document.createElement('div');
      el.className = 'graffiti-spot';
      el.id = `graffiti-${spot.id}`;
      el.style.left = `${spot.x}px`;
      el.style.top  = `${spot.y}px`;
      el.textContent = 'G';
      el.addEventListener('click', ()=>this.tagGraffiti(spot.id));
      document.getElementById('game-container').appendChild(el);
    },
  
    // Спавн ключа
    spawnKey: function() {
      const key = {
        id: Date.now()+Math.random(),
        x: Math.random()*(window.innerWidth-100)+50,
        y: Math.random()*(window.innerHeight-100)+50
      };
      this.keys.push(key);
      const el = document.createElement('div');
      el.className = 'key';
      el.id = `key-${key.id}`;
      el.style.left = `${key.x}px`;
      el.style.top  = `${key.y}px`;
      el.textContent = 'K';
      el.addEventListener('click', ()=>this.pickUpKey(key.id));
      document.getElementById('game-container').appendChild(el);
    },
  
    // Спавн сундука
    spawnChest: function() {
      const chest = {
        id: Date.now()+Math.random(),
        x: Math.random()*(window.innerWidth-100)+50,
        y: Math.random()*(window.innerHeight-100)+50,
        opened: false,
        contents: {
          credits: Math.floor(Math.random()*50)+10,
          item: Math.random()<0.5?'health':'energy'
        }
      };
      this.chests.push(chest);
      const el = document.createElement('div');
      el.className = 'chest';
      el.id = `chest-${chest.id}`;
      el.style.left = `${chest.x}px`;
      el.style.top  = `${chest.y}px`;
      el.textContent = 'C';
      el.addEventListener('click', ()=>this.openChest(chest.id));
      document.getElementById('game-container').appendChild(el);
    },
  
    // Спавн двери
    spawnDoor: function() {
      const door = {
        id: Date.now()+Math.random(),
        x: Math.random()*(window.innerWidth-100)+50,
        y: Math.random()*(window.innerHeight-100)+50,
        locked: Math.random()<0.5,
        leadsTo: Math.random()<0.3?'secret':'normal'
      };
      this.doors.push(door);
      const el = document.createElement('div');
      el.className = `door${door.locked?' locked':''}`;
      el.id = `door-${door.id}`;
      el.style.left = `${door.x}px`;
      el.style.top  = `${door.y}px`;
      el.textContent = door.locked?'L':'D';
      el.addEventListener('click', ()=>this.interactWithDoor(door.id));
      document.getElementById('game-container').appendChild(el);
    },
  
    // Спавн магазина
    spawnShop: function() {
      const shop = {
        id: Date.now()+Math.random(),
        x: Math.random()*(window.innerWidth-100)+50,
        y: Math.random()*(window.innerHeight-100)+50
      };
      this.shops.push(shop);
      const el = document.createElement('div');
      el.className = 'shop';
      el.id = `shop-${shop.id}`;
      el.style.left = `${shop.x}px`;
      el.style.top  = `${shop.y}px`;
      el.textContent = '$';
      el.addEventListener('click', ()=>this.showShop());
      document.getElementById('game-container').appendChild(el);
    },
  
    // Спавн выхода
    spawnExit: function() {
      const exit = {
        id: Date.now()+Math.random(),
        x: Math.random()*(window.innerWidth-100)+50,
        y: Math.random()*(window.innerHeight-100)+50,
        locked: this.boss!==null
      };
      this.exits.push(exit);
      const el = document.createElement('div');
      el.className = 'exit';
      el.id = `exit-${exit.id}`;
      el.style.left = `${exit.x}px`;
      el.style.top  = `${exit.y}px`;
      el.textContent = 'E';
      el.style.display = exit.locked?'none':'flex';
      el.addEventListener('click', ()=>this.useExit());
      document.getElementById('game-container').appendChild(el);
    },
  
    // Метка граффити
    tagGraffiti: function(id) {
      if (this.objective!=="graffiti") return;
      const spot = this.graffitiSpots.find(s=>s.id===id);
      if (!spot||spot.tagged) return;
      spot.tagged = true; this.graffitiDone++;
      const el = document.getElementById(`graffiti-${id}`);
      el.style.backgroundColor = '#f0f'; el.textContent = 'T';
      document.getElementById('graffiti-done').textContent = this.graffitiDone;
      document.getElementById('graffiti-remaining').textContent =
        `Graffiti remaining: ${this.graffitiTotal - this.graffitiDone}`;
      this.checkObjective();
    },
  
    // Поднять ключ
    pickUpKey: function(id) {
      const key = this.keys.find(k=>k.id===id);
      if (!key) return;
      this.keys = this.keys.filter(k=>k.id!==id);
      document.getElementById(`key-${id}`).remove();
      this.showNotification("You found a key!");
      // Открыть все двери
      this.doors.forEach(d=>{
        if (d.locked) {
          d.locked = false;
          const el = document.getElementById(`door-${d.id}`);
          el.classList.remove('locked'); el.textContent = 'D'; el.style.backgroundColor = '#840';
        }
      });
      // Если босси, открыть выход
      if (this.boss) {
        this.exits.forEach(exit=>{
          exit.locked = false;
          document.getElementById(`exit-${exit.id}`).style.display = 'flex';
        });
      }
    },
  
    // Открыть сундук
    openChest: function(id) {
      const chest = this.chests.find(c=>c.id===id);
      if (!chest||chest.opened) return;
      chest.opened = true;
      const el = document.getElementById(`chest-${id}`);
      el.textContent = 'O'; el.style.backgroundColor = '#f80';
  
      this.player.credits += chest.contents.credits;
      if (chest.contents.item==='health') {
        this.player.health = Math.min(this.player.maxHealth, this.player.health+30);
        this.showNotification(`Found ${chest.contents.credits} credits and a health pack!`);
      } else {
        this.player.energy = Math.min(this.player.maxEnergy, this.player.energy+30);
        this.showNotification(`Found ${chest.contents.credits} credits and an energy cell!`);
      }
      this.updateHUD();
    },
  
    // Взаимодействие с дверью
    interactWithDoor: function(id) {
      const door = this.doors.find(d=>d.id===id);
      if (!door) return;
      if (door.locked) {
        this.showNotification("The door is locked!");
        return;
      }
      if (door.leadsTo==='secret') {
        this.showNotification("You found a secret room!");
        this.spawnChest(); this.spawnChest();
      } else {
        this.showNotification("You opened the door");
      }
      this.doors = this.doors.filter(d=>d.id!==id);
      document.getElementById(`door-${id}`).remove();
    },
  
    // Выход из уровня
    useExit: function() {
      if (this.boss && this.boss.health>0) {
        return this.showNotification("You must defeat the boss first!");
      }
      if (this.objective==="kill" && this.enemiesRemaining>0) {
        return this.showNotification("You must kill all enemies first!");
      }
      if (this.objective==="graffiti" && this.graffitiDone<this.graffitiTotal && this.enemiesRemaining>0) {
        return this.showNotification(`You must tag ${this.graffitiTotal-this.graffitiDone} more graffiti or kill all enemies!`);
      }
      this.levelComplete = true; this.showLevelComplete();
    },
  
    // Показать магазин
    showShop: function() {
      this.paused = true; this.inShop = true;
      document.getElementById('shop-menu').style.display = 'block';
      document.getElementById('shop-credits').textContent = this.player.credits;
      const container = document.getElementById('shop-items');
      container.innerHTML = '';
      this.shopItems.forEach((item,i)=>{
        const el = document.createElement('div');
        el.className = 'shop-item';
        const name = document.createElement('div');
        name.className = 'shop-item-name'; name.textContent = item.name;
        const price = document.createElement('div');
        price.className = 'shop-item-price'; price.textContent = `${item.price} credits`;
        el.appendChild(name); el.appendChild(price);
        el.addEventListener('click',()=>this.buyItem(i));
        container.appendChild(el);
      });
    },
  
    // Купить в магазине
    buyItem: function(i) {
      const item = this.shopItems[i];
      if (this.player.credits < item.price) {
        this.showNotification("Not enough credits!"); return;
      }
      // Consumable
      if (item.type==='consumable') {
        if (this.player.inventory.item.name===item.name) {
          if (this.player.inventory.item.amount >= (item.limit||3)) {
            return this.showNotification(`You can only carry ${(item.limit||3)} of this item!`);
          }
          this.player.inventory.item.amount++;
        } else {
          this.player.inventory.item = {
            name: item.name, type: item.type, amount:1, effect: item.effect, value: item.value
          };
        }
      } else if (item.type==='weapon') {
        this.player.inventory.weapon2 = {
          name: item.name, type: item.type, damage: item.damage, ammo: item.ammo, maxAmmo: item.ammo
        };
      } else if (item.type==='armor') {
        this.player.defense += item.defense;
        if (item.energyBonus) {
          this.player.maxEnergy += item.energyBonus;
          this.player.energy = this.player.maxEnergy;
        }
      }
      this.player.credits -= item.price;
      document.getElementById('shop-credits').textContent = this.player.credits;
      this.updateHUD();
      this.showNotification(`Purchased ${item.name}!`);
    },
  
    // Выйти из магазина
    exitShop: function() {
      document.getElementById('shop-menu').style.display = 'none';
      this.paused = false; this.inShop = false;
    },
  
    // Показать улучшения
    showUpgrades: function() {
      this.paused = true; this.inUpgrades = true;
      document.getElementById('upgrade-menu').style.display = 'block';
      document.getElementById('upgrade-xp').textContent = this.player.xp;
      const container = document.getElementById('upgrade-options');
      container.innerHTML = '';
      this.upgradeOptions.forEach((opt,i)=>{
        let cur = 0, mx = opt.max||5;
        if (opt.type.startsWith('skill')) cur = this.player.skills[opt.type].level;
        else cur = Math.floor((this.player[opt.type] - this.classes[this.player.class][opt.type]) / opt.value);
        if (cur >= mx) return;
        const el = document.createElement('div');
        el.className = 'upgrade-option';
        const name = document.createElement('div');
        name.className = 'upgrade-name'; name.textContent = `${opt.name} (${cur}/${mx})`;
        const cost = document.createElement('div');
        cost.className = 'upgrade-cost'; cost.textContent = `${opt.cost} XP`;
        el.appendChild(name); el.appendChild(cost);
        el.addEventListener('click', ()=>this.purchaseUpgrade(i));
        container.appendChild(el);
      });
    },
  
    // Купить улучшение
    purchaseUpgrade: function(i) {
      const opt = this.upgradeOptions[i];
      if (this.player.xp < opt.cost) {
        return this.showNotification("Not enough XP!");
      }
      if (opt.type.startsWith('skill')) {
        const sk = this.player.skills[opt.type];
        sk.level++;
        switch(opt.type) {
          case 'skill1': sk.damage *= 1.2; break;
          case 'skill2': if (sk.duration) sk.duration++; if (sk.damage) sk.damage*=1.2; if (sk.multiplier) sk.multiplier+=0.1; break;
          case 'skill3': if (sk.duration) sk.duration++; if (sk.reduction) sk.reduction+=0.1; break;
          case 'skill4': if (sk.damage) sk.damage*=1.3; if (sk.hits) sk.hits++; break;
        }
      } else {
        this.player[opt.type] += opt.value;
        if (opt.type==='health') this.player.health += opt.value;
        if (opt.type==='energy') this.player.energy += opt.value;
      }
      this.player.xp -= opt.cost;
      document.getElementById('upgrade-xp').textContent = this.player.xp;
      this.updateHUD();
      this.showNotification(`Upgraded ${opt.name}!`);
      this.showUpgrades();
    },
  
    // Выйти из улучшений
    exitUpgrades: function() {
      document.getElementById('upgrade-menu').style.display = 'none';
      this.paused = false; this.inUpgrades = false;
    },
  
    // Использовать умение
    useSkill: function(skillName) {
      if (this.paused || this.gameOver || this.levelComplete) return;
      const sk = this.player.skills[skillName];
      if (sk.currentCooldown > 0) {
        return this.showNotification(`${sk.name} is on cooldown!`);
      }
      if (this.player.energy < sk.cost) {
        return this.showNotification("Not enough energy!");
      }
      this.player.energy -= sk.cost;
      this.updateHUD();
      // Применить эффект умений (при необходимости добавьте логику)
      sk.currentCooldown = sk.cooldown;
    },
  
    // Использовать предмет
    useItem: function() {
      const it = this.player.inventory.item;
      if (!it || it.amount <= 0) return;
      if (it.effect === 'heal') {
        this.player.health = Math.min(this.player.maxHealth, this.player.health + it.value);
        this.showNotification("Used health pack!");
      } else if (it.effect === 'energy') {
        this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + it.value);
        this.showNotification("Used energy cell!");
      } else if (it.effect === 'stun') {
        this.showNotification("Threw EMP grenade!");
      }
      it.amount--;
      this.updateHUD();
    },
  
    // Проверить выполнение цели уровня
    checkObjective: function() {
      if (this.objective==="kill" && this.enemiesRemaining===0) {
        this.levelComplete=true; this.showLevelComplete();
      }
      if (this.objective==="graffiti" && (this.graffitiDone>=this.graffitiTotal || this.enemiesRemaining===0)) {
        this.levelComplete=true; this.showLevelComplete();
      }
    },
  
    // Показать экран «уровень пройден»
    showLevelComplete: function() {
      document.getElementById('level-complete').style.display = 'flex';
    },
  
    // Обновить HUD
    updateHUD: function() {
      this.$ = s=>document.getElementById(s);
      this.$('health-value').textContent = this.player.health;
      this.$('max-health').textContent   = this.player.maxHealth;
      this.$('energy-value').textContent = this.player.energy;
      this.$('max-energy').textContent   = this.player.maxEnergy;
      this.$('level').textContent        = this.player.level;
      this.$('xp').textContent           = this.player.xp;
      this.$('next-level-xp').textContent= this.player.nextLevelXp;
      this.$('credits').textContent      = this.player.credits;
      this.$('kills').textContent        = this.player.kills;
      this.$('health-fill').style.width  = `${(this.player.health/this.player.maxHealth)*100}%`;
      this.$('energy-fill').style.width  = `${(this.player.energy/this.player.maxEnergy)*100}%`;
    },
  
    // Обновить полосу босса
    updateBossHealth: function() {
      const pct = (this.boss.health/this.boss.maxHealth)*100;
      document.getElementById('boss-health-fill').style.width = `${pct}%`;
    },
  
    // Показать уведомление
    showNotification: function(txt) {
      const n = document.getElementById('notification');
      n.textContent = txt; n.style.opacity = 1;
      setTimeout(()=>n.style.opacity = 0, 1500);
    },
  
    // Перейти на следующий уровень
    nextLevel: function() {
      this.currentLevel++;
      document.getElementById('level-complete').style.display = 'none';
      this.generateLevel();
    },
  
    // Сохранить игру (stub)
    saveGame: function() {
      this.showNotification("Game saved! (stub)");
    },
  
    // Загрузить игру (stub)
    loadGame: function() {
      this.showNotification("Game loaded! (stub)");
    },
  
    // Вернуться в главное меню
    quitToMenu: function() {
      this.showMainMenu();
    },
  
    // Основной игровой цикл
    gameLoop: function() {
      const loop = () => {
        if (!this.paused && this.gameStarted && !this.gameOver && !this.levelComplete) {
          // AI врагов
          this.enemies.forEach(enemy => {
            const dx = this.player.playerPos.x - enemy.x;
            const dy = this.player.playerPos.y - enemy.y;
            const dist = Math.hypot(dx, dy);
            const radius = 300; // радиус агрессии
            if (dist < radius && dist > 5) {
              // Простое приближение (можно заменить на A*)
              const angle = Math.atan2(dy, dx);
              const step = Math.min(enemy.speed, dist);
              enemy.x += Math.cos(angle) * step * 0.5; // 0.5 — замедление
              enemy.y += Math.sin(angle) * step * 0.5;
              const el = document.getElementById(`enemy-${enemy.id}`);
              if (el) {
                el.style.left = `${enemy.x}px`;
                el.style.top  = `${enemy.y}px`;
              }
            }
          });
          // Кулдауны умений
          Object.values(this.player.skills).forEach(sk=>{
            if(sk.currentCooldown>0) sk.currentCooldown--;
          });
        }
        // Δ‑движение
        const spd = this.player.speed;
        if (this.keysDown.w) this.player.playerPos.y -= spd;
        if (this.keysDown.s) this.player.playerPos.y += spd;
        if (this.keysDown.a) this.player.playerPos.x -= spd;
        if (this.keysDown.d) this.player.playerPos.x += spd;
    
        this.updatePlayerPosition();
    
        this.moveWorld(- (this.keysDown.a - this.keysDown.d)*spd,
                       - (this.keysDown.w - this.keysDown.s)*spd);
    
        requestAnimationFrame(loop);
      };
      loop();
    },
    updatePlayerPosition: function() {
      const el = document.getElementById('player');
      if (el) {
        el.style.left = `${this.player.playerPos.x - 16}px`; // 32/2
        el.style.top  = `${this.player.playerPos.y - 16}px`;
      }
    },
  };
  
  // Конец gameState
  
  document.addEventListener('DOMContentLoaded', () => {
    gameState.init();
  });