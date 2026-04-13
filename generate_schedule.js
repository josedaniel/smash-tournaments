// ─────────────────────────────────────────────────────────────────────────────
// Generador de calendario Round Robin
// Uso: node generate_schedule.js
//
// Configura PLAYERS y, opcionalmente, FECHA_1 (para preservar una fecha ya
// jugada). Si no hay fecha previa, deja FECHA_1 = null y el script genera
// todo desde cero.
// ─────────────────────────────────────────────────────────────────────────────

// ── CONFIGURACIÓN ────────────────────────────────────────────────────────────

const PLAYERS = [
    'Jacko', 'Negro', 'Sayo', 'Corne', 'Gordo',
    'Jr', 'Ross', 'Azita', 'Pater', 'Camachine'
];

// Si ya tienes una primera fecha jugada, ponla aquí como array de pares.
// Si no, pon null y el script genera todas las fechas.
const FECHA_1 = [
    ['Jacko',  'Gordo'],
    ['Sayo',   'Ross'],
    ['Negro',  'Camachine'],
    ['Corne',  'Azita'],
    ['Pater',  'Jr'],
];

// ─────────────────────────────────────────────────────────────────────────────

const players = [...PLAYERS].sort();
const n = players.length;

if (n % 2 !== 0) {
    console.error('❌ El número de jugadores debe ser par');
    process.exit(1);
}

const totalRounds  = n - 1;
const matchesPerRound = n / 2;
const totalMatches = n * (n - 1) / 2;

console.log(`Jugadores (${n}): ${players.join(', ')}`);
console.log(`Fechas: ${totalRounds}  |  Partidos por fecha: ${matchesPerRound}  |  Total: ${totalMatches}\n`);

// Registrar peleas de fecha 1 si existe
const usedPairs = new Set();
let startFecha = 1;

if (FECHA_1) {
    FECHA_1.forEach(([p1, p2]) => {
        usedPairs.add([p1, p2].sort().join('|'));
    });
    startFecha = 2;
    console.log('📅 Fecha 1 (preservada):');
    FECHA_1.forEach((m, i) => console.log(`   ${i + 1}. ${m[0]} vs ${m[1]}`));
    console.log();
}

// ── BACKTRACKING ─────────────────────────────────────────────────────────────

function generateRound(available, used, current) {
    if (available.length === 0) return current.length === matchesPerRound ? [current] : [];

    const p1   = available[0];
    const rest = available.slice(1);
    const results = [];

    for (let i = 0; i < rest.length; i++) {
        const p2  = rest[i];
        const key = [p1, p2].sort().join('|');
        if (used.has(key)) continue;

        const newAvailable = rest.filter((_, idx) => idx !== i);
        const sub = generateRound(newAvailable, new Set([...used, key]), [...current, [p1, p2]]);
        results.push(...sub);
        if (results.length) return results; // first solution found
    }
    return results;
}

console.log('🔄 Generando calendario...');

const schedule = FECHA_1 ? [FECHA_1] : [];
let pairs = new Set(usedPairs);

for (let r = startFecha; r <= totalRounds; r++) {
    const solutions = generateRound(players, pairs, []);
    if (!solutions.length) {
        console.error(`❌ No se pudo generar la Fecha ${r}`);
        process.exit(1);
    }
    const round = solutions[0];
    schedule.push(round);
    round.forEach(([p1, p2]) => pairs.add([p1, p2].sort().join('|')));
}

// ── VERIFICACIONES ───────────────────────────────────────────────────────────

console.log('\n🔍 VERIFICACIONES:');

let ok = true;

// 1. Un jugador por fecha
schedule.forEach((round, ri) => {
    const seen = new Set(round.flat());
    if (seen.size !== n) {
        console.log(`   ❌ Fecha ${ri + 1}: jugadores repetidos`);
        ok = false;
    }
});

// 2. Sin peleas duplicadas
const allPairs = new Map();
schedule.forEach((round, ri) => {
    round.forEach(([p1, p2]) => {
        const key = [p1, p2].sort().join('|');
        if (allPairs.has(key)) {
            console.log(`   ❌ Pelea duplicada: ${key} (Fecha ${allPairs.get(key)} y ${ri + 1})`);
            ok = false;
        } else {
            allPairs.set(key, ri + 1);
        }
    });
});

// 3. Cada jugador juega exactamente (n-1) partidos
const counts = {};
players.forEach(p => counts[p] = 0);
schedule.forEach(round => round.forEach(([p1, p2]) => { counts[p1]++; counts[p2]++; }));
players.forEach(p => {
    if (counts[p] !== totalRounds) {
        console.log(`   ❌ ${p}: ${counts[p]} partidos (esperado ${totalRounds})`);
        ok = false;
    }
});

if (!ok) process.exit(1);

console.log(`   ✅ ${schedule.length} fechas, ${allPairs.size} peleas únicas, todos los jugadores juegan ${totalRounds} partidos\n`);

// ── SALIDA ───────────────────────────────────────────────────────────────────

console.log('📅 CALENDARIO COMPLETO\n' + '─'.repeat(50));
schedule.forEach((round, ri) => {
    console.log(`\nFecha ${ri + 1}`);
    round.forEach((m, i) => console.log(`   ${i + 1}. ${m[0].padEnd(12)} vs ${m[1]}`));
});

// JSON listo para usar
const json = {
    fase1: schedule.map((round, ri) => ({
        fecha: ri + 1,
        partidos: round.map((m, mi) => ({
            id: `f${ri + 1}-${mi + 1}`,
            player1: m[0],
            player2: m[1],
            ganador: null
        }))
    }))
};

const fs = require('fs');
fs.writeFileSync('schedule_output.json', JSON.stringify(json, null, 2));
console.log('\n💾 Guardado en schedule_output.json');
