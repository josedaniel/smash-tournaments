# 🏆 Smash Scrubs Saga - Tournament Website

Página oficial del torneo de Smash Bros. Visualiza el cronograma de partidos, tabla de posiciones y reglas del torneo.

## 🌐 Ver el torneo

**[https://torneo-smash.josepaternina.com](https://torneo-smash.josepaternina.com)**

## 📁 Archivos

```
├── index.html              # Página principal del torneo
├── admin.html             # Panel de administración para marcar resultados
├── matches.json           # Datos de los partidos
├── logo.png               # Logo del torneo
├── reglamento_torneo.pdf  # Reglamento oficial
├── AGENTS.md              # Guía para desarrolladores
└── README.md             # Este archivo
```

## 🎮 Características

- **Cronograma de Partidos**: Visualiza todos los encuentros de la Fase 1 (Round Robin)
- **Tabla de Posiciones**: Se actualiza automáticamente según los resultados
- **Sistema de Ganadores**: Los partidos jugados muestran quién ganó con highlight dorado
- **Reglas del Torneo**: Reglamento completo en formato colapsable
- **Enlaces**: Twitch para ver en vivo y PDF del reglamento

## ⚙️ Configuración

### Actualizar Resultados

1. Abre `admin.html` en tu navegador
2. Haz clic en el nombre del ganador de cada partido
3. Copia el JSON generado
4. Reemplaza la variable `matchData` en `index.html` (dentro de `<script>`)

### Paleta de Colores

```css
--orange: #F68109;
--blue: #2B638E;
--sky: #1AA3DF;
--gold: #E8D557;
```

## 🚀 Deployment

El sitio está desplegado en **Cloudflare Pages**.

### Deployment manual

```bash
# Con npx
npx serve .

# Con Python
python -m http.server 8000
```

### Desplegar en Cloudflare Pages

1. Sube el proyecto a GitHub
2. Ve a Cloudflare Dashboard > Pages > Create project
3. Conecta tu repositorio
4. Configura:
   - Build command: (vacío)
   - Output directory: (vacío)
5. Deploy

## 📱 Diseño

- Fully responsive (mobile, tablet, desktop)
- Modo claro con colores vibrantes
- Tipografía: Bebas Neue (headings) + Outfit (body)
- Animaciones suaves en interacciones

## 🏅 Premiación

| Lugar | Premio |
|-------|--------|
| 1ero | $80.000 COP |
| 2do | $50.000 COP |
| 3ero | $30.000 COP |

**Inscripción**: $20.000 COP

## 📅 Formato del Torneo

- **Fase 1**: Round Robin (todos contra todos) - 8 jugadores, Bo3
- **Fase 2**: Eliminación Directa (Final Four) - Semifinales Bo3, Finales Bo5

---
