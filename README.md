# Weld Inspector - Svetsvalideringsapp

En mobil-app för att registrera och hantera svetsvalidering och elsäkerhetstest.

## 🎯 Funktioner

- ✅ Registrera nya svetstester
- 📅 Automatisk beräkning av nästa valideringsdatum (+1 år)
- 📊 Lätt överblick över alla registrerade svetsar
- 🔔 Varning när validering närmar sig slutet
- 📝 Noteringar och testresultat
- 💾 Lokal lagring på enheten (fungerar offline)
- 🗑️ Möjlighet att ta bort registreringar

## 🚀 Kom igång

### Installation

1. **Klona repot**
   ```bash
   git clone https://github.com/bols-dot/weld-inspection-app.git
   cd weld-inspection-app
   ```

2. **Installera beroenden**
   ```bash
   npm install
   # eller
   yarn install
   ```

3. **Starta appen**
   ```bash
   npm start
   # eller
   yarn start
   ```

4. **Öppna på iPhone**
   - Installera Expo Go från App Store
   - Skanna QR-koden som visas i terminalen med Expo Go
   - Appen öppnas automatiskt

## 📱 Skärmar

### Hemskärm (Svetsar)
- Visa alla registrerade svetsar i en lista
- Sorterade efter senaste testdatum
- Status-badge visar testresultat
- Klicka för att se detaljerad info
- Svipa för att ta bort

### Lägg till test
- Fyll i svets-ID
- Välj testdatum
- Nästa validering beräknas automatiskt
- Välj testresultat (Godkänd/Misslyckad/Väntar)
- Lägg till valfria noteringar

### Detaljer
- Se all information om en svets
- Varning om validering är förfallen
- Räknare för dagar kvar till nästa validering

## 💾 Data

Allt data sparas lokalt på din iPhone med SQLite.
Ingen internet krävs för att använda appen.

## 🔄 Framtida förbättringar

- [ ] Cloud-synkronisering
- [ ] Push-notifikationer för kommande valideringar
- [ ] Exportera som PDF
- [ ] Foto av svetsar
- [ ] Barcode-scanning
- [ ] Offline-synkronisering

## 📝 Licens

MIT
