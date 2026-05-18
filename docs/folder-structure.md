# Struktur Folder — BananaVision

Berikut struktur direktori utama proyek (snapshot):

```
LICENSE
README.md
backend/
  app.js
  server.js
  package.json
  README.md
  config/
    database.js
    firebase.js
    tugasakhir.json
  prisma/
    schema.prisma
    seed.js
  src/
    controllers/
      analysis.controller.js
      auth.controller.js
      disease.controller.js
      feedback.controller.js
      statistic.controller.js
    middleware/
      auth.js
    models/
      analysisModel.js
      authModel.js
      diseaseModel.js
      feedbackModel.js
      statisticModel.js
    routes/
      analysis.routes.js
      auth.routes.js
      disease.routes.js
      feedback.routes.js
      statistic.routes.js
    services/
      analysis.service.js
      auth.service.js
      disease.service.js
      feedback.service.js
      statistic.service.js
    utils/
      jwt.js
      response.js
    validators/
      auth.validator.js
      feedback.validator.js

frontend/
  .env
  package.json
  README.md
  public/
    index.html
    manifest.json
    offline.html
    service-worker.js
    icons/
  src/
    App.jsx
    index.css
    main.jsx
    serviceWorkerRegistration.js
    components/
      DiseaseCard.jsx
      InstallPrompt.jsx
      LoadingSpinner.jsx
      Navigation.jsx
      OfflineIndicator.jsx
      SplashScreen.jsx
      StatCard.jsx
      Toast.jsx
    hooks/
      data.js
      useToast.jsx
    pages/
      AnalyzePage.jsx
      DashboardPage.jsx
      DiseasesPage.jsx
      HistoryPage.jsx
      HomePage.jsx
      LoginPage.jsx
      ProfilePage.jsx
      RegisterPage.jsx
    utils/
      config.js
      firebaseClient.js
      token.js

python/
  bananavisionv3.ipynb
  model_mobilenetv2_final.keras
  model_resnet50_final.keras
  requirements.txt
  server.py

docs/
  api.md
  architecture.md
  database.md
  setup.md
  folder-structure.md  # (file ini)
```

Catatan:

- Jika Anda ingin saya juga membuat file `.gitkeep` untuk direktori kosong atau scaffold file README per folder, beri tahu saya.
- Mau saya buat juga visual diagram (SVG) atau versi PDF dari `docs/architecture.md`?
