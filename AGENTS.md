# AGENTS.md - Smash Scrubs Saga Tournament Website

## Project Overview

This is a static website for a Smash Bros tournament, deployed on Cloudflare Pages. The project consists of plain HTML, CSS, and JavaScript with no build tools or framework dependencies.

## File Structure

```
torneo-smash/
├── index.html          # Main tournament page
├── admin.html          # Admin panel for marking match winners
├── matches.json        # Match data (used by both pages)
├── logo.png            # Tournament logo
├── reglamento_torneo.pdf # Official tournament rules
└── AGENTS.md           # This file
```

## Build / Lint / Test Commands

This project has **no build commands** - it's pure static HTML/CSS/JS.

### Deployment (Cloudflare Pages)

1. Push the project to a GitHub repository
2. Go to Cloudflare Dashboard > Pages > Create project
3. Connect your GitHub repository
4. Configure:
   - Build command: (empty)
   - Output directory: (empty)
5. Deploy

### Local Development

Simply open `index.html` in a browser, or use a local server:

```bash
# Python 3
python -m http.server 8000

# PHP
php -S localhost:8000

# npx
npx serve .
```

### Validation

- HTML: Use [W3C Validator](https://validator.w3.org/) if needed
- JSON: Ensure `matches.json` is valid JSON (use `jsonlint` or online validators)

## Code Style Guidelines

### HTML Conventions

- Use 4 spaces for indentation
- Always include `lang` attribute on `<html>` tag
- Include meta viewport for mobile responsiveness
- Use semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<footer>`)
- External resources (fonts, icons) should use HTTPS

### CSS Conventions

- Use CSS custom properties (variables) for colors in `:root`
- Use 4 spaces for indentation
- Group related styles together
- Use kebab-case for class names
- Prefer flexbox and grid for layouts
- Use responsive breakpoints with `@media (max-width: ...)`

**Color Palette (defined in :root):**

```css
--bg-light: #f5f5f7;
--bg-card: #ffffff;
--orange: #F68109;
--blue: #2B638E;
--sky: #1AA3DF;
--gold: #E8D557;
--text-primary: #1d1d1f;
--text-secondary: #6e6e73;
--border-color: #d2d2d7;
```

### JavaScript Conventions

- Use `const` by default, `let` when mutation is needed
- Avoid `var` - use ES6+ syntax
- Use template literals for string interpolation
- Use arrow functions for callbacks
- Use semantic function names (e.g., `renderSchedule`, `renderStandings`)

### JSON Data Format

The `matches.json` file follows this structure:

```json
{
  "fase1": [
    {
      "fecha": 1,
      "partidos": [
        { "id": "f1-1", "player1": "Jacko", "player2": "Gordo", "ganador": null }
      ]
    }
  ]
}
```

- `ganador`: Set to `null` for pending matches, or the winner's name when decided
- Date IDs use format: `f{fecha}-{partido}` (e.g., `f1-1`, `f2-3`)

### Naming Conventions

- **Files**: kebab-case (e.g., `admin.html`, `matches.json`)
- **CSS Classes**: kebab-case (e.g., `.schedule-section`, `.prize-card`)
- **JavaScript Functions**: camelCase (e.g., `renderSchedule`, `loadSchedule`)
- **JSON Keys**: camelCase (e.g., `player1`, `ganador`)

### Responsive Design

- Use `clamp()` for fluid typography
- Use `minmax()` in CSS Grid for responsive layouts
- Test on mobile (375px), tablet (768px), and desktop (1024px+)

### Accessibility

- Include `alt` text for images
- Use semantic headings (h1, h2, h3, etc.) in order
- Ensure color contrast meets WCAG AA standards
- Use descriptive link text (avoid "click here")

### Image Assets

- Logo should be PNG with transparency
- Optimize images before deployment (use TinyPNG or similar)

## Working with Match Data

### Updating Match Results

1. Open `admin.html` in a browser
2. Click on the winner's name for each match
3. Click "Generar JSON" to get the updated data
4. Copy the `const matchData = {...}` code
5. Replace the `matchData` variable in `index.html` (inside the `<script>` tag)

The main page will automatically display:
- Schedule with winners highlighted (gold background for winner, strikethrough for loser)
- Standings table sorted by number of victories
- Top 4 players highlighted as qualifying for elimination phase

## Common Tasks

### Adding a New Player

1. Add player's matches to `matches.json` following the existing round-robin format
2. Update the `matchData` variable in `index.html`

### Changing Colors

1. Edit CSS custom properties in `:root` within `<style>` tag
2. Use the defined palette (orange, blue, sky, gold) for consistency

### Modifying the Schedule

Edit the match data in `matches.json` or the `matchData` variable in `index.html`.

## Notes for Agents

- This is a simple static site - do not add build tools unless explicitly requested
- All JavaScript is inline in the HTML files (no external .js files)
- The site uses Google Fonts (Bebas Neue for headings, Outfit for body)
- Font loading uses `preconnect` for performance
- No testing framework is used - manual testing in browser is sufficient
