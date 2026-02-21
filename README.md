# Guerrilla Gardens Web

Web-based prototype/experiment for Guerrilla Gardens KZN — secret urban gardening game/map with real-world locations, composting economy, community features.

## Current Tech Stack
- Frontend: HTML + CSS + Vanilla JavaScript
- PWA: manifest.webmanifest + sw.js (offline support, installable)
- Backend/Data: Google Sheets + Google Apps Script (Web App deployment as API)
- Hosting: GitHub Pages

## Setup / Development

1. Clone repo
2. Open `index.html` in browser (or use Live Server)
3. For Sheets integration:
   - Create Google Sheet with tabs (e.g. Gardens, Users, Inventory, Zones)
   - Deploy Apps Script as Web App (Execute as: Me / Who has access: Anyone)
   - Paste the Web App URL into `js/config.js` or similar
   - Use `fetch()` to read/write via `doGet`/`doPost`

## Current Features Implemented
- [ ] Map view (Leaflet?)
- [ ] User authentication (simple? via Sheets?)
- [ ] Garden placement/claiming
- [ ] Wheel spin mini-game?
- [ ] PWA install prompt

## Roadmap / Next
- Connect Google Sheets read/write
- Add authentication stub
- Implement basic garden CRUD
- Style cleanup & mobile testing

## License
MIT (or whatever you choose)

Made in Durban, KZN 🌱
