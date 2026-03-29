// Script para generar calendario Round Robin correcto
// Genera fechas 2-9 respetando la fecha 1 existente
// Usa backtracking completo para encontrar una solución válida

const fs = require('fs');

// Leer la fecha 1 existente
const currentData = JSON.parse(fs.readFileSync('matches.json', 'utf8'));
const fecha1 = currentData.fase1[0];

// Extraer los jugadores
const jugadores = new Set();
fecha1.partidos.forEach(partido => {
    jugadores.add(partido.player1);
    jugadores.add(partido.player2);
});
const jugadoresArray = Array.from(jugadores).sort();

console.log('Jugadores:', jugadoresArray.join(', '));
console.log('Total:', jugadoresArray.length);
console.log('\n📅 Fecha 1 (preservada):');
fecha1.partidos.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.player1} vs ${p.player2}${p.ganador ? ' → Ganador: ' + p.ganador : ''}`);
});

// Registrar peleas ya realizadas en fecha 1
const peleasIniciales = new Set();
fecha1.partidos.forEach(partido => {
    const key = [partido.player1, partido.player2].sort().join('-');
    peleasIniciales.add(key);
});

console.log(`\n🔒 Peleas ya registradas: ${peleasIniciales.size}\n`);

// Función de backtracking para generar el calendario
function generarCalendarioBacktracking(fechaNum, peleasRealizadas, fechasAcumuladas) {
    // Caso base: hemos generado todas las 9 fechas
    if (fechaNum > 9) {
        // Verificar que todas las peleas se realizaron
        const totalPeleasEsperado = jugadoresArray.length * (jugadoresArray.length - 1) / 2;
        if (peleasRealizadas.size === totalPeleasEsperado) {
            return fechasAcumuladas;
        }
        return null;
    }
    
    // Si es fecha 1, usamos la existente
    if (fechaNum === 1) {
        return generarCalendarioBacktracking(2, new Set(peleasRealizadas), [fecha1]);
    }
    
    // Intentar generar la fecha actual
    const jugadoresDisponibles = [...jugadoresArray];
    
    function intentarGenerarFecha(jugadoresRestantes, partidosActuales, peleasUsadas) {
        // Si no quedan jugadores, hemos completado la fecha
        if (jugadoresRestantes.length === 0) {
            if (partidosActuales.length === 5) {
                // Fecha completada, continuar con la siguiente
                const nuevasPeleas = new Set([...peleasRealizadas, ...peleasUsadas]);
                const resultado = generarCalendarioBacktracking(
                    fechaNum + 1,
                    nuevasPeleas,
                    [...fechasAcumuladas, partidosActuales]
                );
                if (resultado) return resultado;
            }
            return null;
        }
        
        // Tomar el primer jugador disponible
        const p1 = jugadoresRestantes[0];
        const resto = jugadoresRestantes.slice(1);
        
        // Intentar emparejarlo con cada uno de los jugadores restantes
        for (let i = 0; i < resto.length; i++) {
            const p2 = resto[i];
            const key = [p1, p2].sort().join('-');
            
            // Verificar que no hayan jugado antes
            if (!peleasRealizadas.has(key) && !peleasUsadas.has(key)) {
                // Crear el partido
                const nuevoPartido = [p1, p2];
                const nuevasPeleasUsadas = new Set([...peleasUsadas, key]);
                
                // Remover ambos jugadores de los disponibles
                const nuevosDisponibles = resto.filter((_, idx) => idx !== i);
                
                // Recursión
                const resultado = intentarGenerarFecha(
                    nuevosDisponibles,
                    [...partidosActuales, nuevoPartido],
                    nuevasPeleasUsadas
                );
                
                if (resultado) return resultado;
            }
        }
        
        return null;
    }
    
    return intentarGenerarFecha(jugadoresDisponibles, [], new Set());
}

console.log('🔄 Generando calendario con backtracking...');
console.log('⏳ Esto puede tomar unos segundos...\n');

const fechasGeneradas = generarCalendarioBacktracking(1, peleasIniciales, []);

if (!fechasGeneradas) {
    console.error('❌ No se pudo generar un calendario válido');
    console.log('\n💡 Es matemáticamente imposible completar el torneo con esta fecha 1.');
    process.exit(1);
}

console.log(`✅ Calendario generado exitosamente!\n`);

// Construir el resultado final
const resultado = {
    fase1: fechasGeneradas.slice(1).map((fecha, index) => ({
        fecha: index + 2,
        partidos: fecha.map((match, matchIndex) => ({
            id: `f${index + 2}-${matchIndex + 1}`,
            player1: match[0],
            player2: match[1],
            ganador: null
        }))
    }))
};

// Insertar fecha 1 al inicio
resultado.fase1.unshift(fecha1);

// Verificaciones
console.log('🔍 VERIFICACIONES:');
console.log('='.repeat(60));

// 1. Verificar que cada jugador juegue solo una vez por fecha
console.log('\n1️⃣ Un jugador por fecha:');
let errorFecha = false;
resultado.fase1.forEach(fecha => {
    const jugadoresPorFecha = new Set();
    fecha.partidos.forEach(partido => {
        jugadoresPorFecha.add(partido.player1);
        jugadoresPorFecha.add(partido.player2);
    });
    
    const duplicados = fecha.partidos.length * 2 - jugadoresPorFecha.size;
    if (duplicados > 0) {
        console.log(`   ❌ Fecha ${fecha.fecha}: ${duplicados} jugadores repetidos`);
        errorFecha = true;
    } else {
        console.log(`   ✅ Fecha ${fecha.fecha}: ${fecha.partidos.length} partidos, ${jugadoresPorFecha.size} jugadores únicos`);
    }
});

// 2. Verificar peleas duplicadas
console.log('\n2️⃣ Sin peleas duplicadas:');
const todasLasPeleasMap = new Map();
let peleasDuplicadas = false;

resultado.fase1.forEach(fecha => {
    fecha.partidos.forEach(partido => {
        const key = [partido.player1, partido.player2].sort().join('-');
        if (todasLasPeleasMap.has(key)) {
            console.log(`   ❌ Pelea duplicada: ${key} (Fecha ${todasLasPeleasMap.get(key)} y Fecha ${fecha.fecha})`);
            peleasDuplicadas = true;
        } else {
            todasLasPeleasMap.set(key, fecha.fecha);
        }
    });
});

if (!peleasDuplicadas) {
    console.log(`   ✅ No hay peleas duplicadas (${todasLasPeleasMap.size} peleas únicas)`);
}

// 3. Verificar que cada jugador juegue exactamente 9 partidos
console.log('\n3️⃣ Cada jugador juega 9 partidos:');
const partidosPorJugador = {};
jugadoresArray.forEach(j => partidosPorJugador[j] = 0);

resultado.fase1.forEach(fecha => {
    fecha.partidos.forEach(partido => {
        partidosPorJugador[partido.player1]++;
        partidosPorJugador[partido.player2]++;
    });
});

let todosCorrectos = true;
Object.entries(partidosPorJugador).forEach(([jugador, count]) => {
    const status = count === 9 ? '✅' : '❌';
    console.log(`   ${status} ${jugador.padEnd(12)}: ${count} partidos`);
    if (count !== 9) todosCorrectos = false;
});

// Resumen final
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN:');
console.log('='.repeat(60));

const exito = !errorFecha && !peleasDuplicadas && todosCorrectos;

if (exito) {
    console.log('✅ ¡CALENDARIO PERFECTO!');
    console.log(`   - ${resultado.fase1.length} fechas generadas`);
    console.log(`   - ${todasLasPeleasMap.size} peleas únicas (esperado: 45)`);
    console.log(`   - 10 jugadores, cada uno juega 9 partidos`);
    console.log(`   - Fecha 1 preservada con resultado: Negro ganó a Camachine`);
    
    // Guardar resultado
    fs.writeFileSync('matches_new.json', JSON.stringify(resultado, null, 2));
    console.log('\n💾 Calendario guardado en matches_new.json');
    
    // Imprimir calendario completo
    console.log('\n' + '='.repeat(60));
    console.log('📅 CALENDARIO COMPLETO');
    console.log('='.repeat(60));
    resultado.fase1.forEach(fecha => {
        console.log(`\n📅 FECHA ${fecha.fecha}`);
        console.log('-'.repeat(60));
        fecha.partidos.forEach((partido, i) => {
            const ganador = partido.ganador ? ` → ${partido.ganador}` : '';
            console.log(`   ${i + 1}. ${partido.player1.padEnd(12)} vs ${partido.player2.padEnd(12)}${ganador}`);
        });
    });
    
} else {
    console.log('❌ ERROR: El calendario tiene problemas');
    process.exit(1);
}
