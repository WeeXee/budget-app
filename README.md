# 💰 Budget App

Une application web de suivi de budget mensuel — entièrement en HTML/CSS/JS vanilla, zéro dépendance, zéro serveur.

![Preview](https://img.shields.io/badge/HTML-CSS-JS-vanilla-6c63ff?style=for-the-badge)

## ✨ Fonctionnalités

- **Tableau de bord** avec KPIs, graphique donut et barres de progression par catégorie
- **Détail des dépenses** modifiable inline — saisie directe des montants réels
- **Suivi abonnements** avec vue mensuelle et annuelle
- **Alertes automatiques** en cas de dépassement de budget
- **Export / Import JSON** pour sauvegarder et partager tes données
- **Persistance locale** via `localStorage` — les données restent entre les sessions
- Navigation par mois
- Recherche de postes de dépenses

## 🗂️ Structure

```
budget-app/
├── index.html     # Structure HTML + navigation
├── style.css      # Thème sombre, typography, composants
├── app.js         # Logique, calculs, interactions
├── data.js        # Données initiales (modifiables)
└── README.md
```

## 🚀 Utilisation

Ouvre simplement `index.html` dans ton navigateur — aucune installation requise.

```bash
git clone https://github.com/ton-user/budget-app.git
cd budget-app
open index.html   # macOS
# ou
xdg-open index.html  # Linux
```

## ✏️ Personnaliser tes données

Édite `data.js` pour adapter les catégories, postes et montants prévus à ta situation :

```js
const BUDGET_DATA = {
  income: [
    { id: "sal", name: "Salaire net", planned: 2500, actual: null },
  ],
  categories: [
    { id: "logement", icon: "🏠", label: "Logement", color: "#6366f1", items: [
      { id: "loyer", name: "Loyer / Charges", planned: 800, actual: null, freq: "Mensuel" },
    ]},
    // ...
  ]
};
```

## 💾 Format des données exportées

```json
{
  "version": "1.0.0",
  "meta": { "title": "Budget Mensuel", "month": "Mai 2025" },
  "income": [...],
  "categories": [...]
}
```

## 🛠️ Contribuer

PRs bienvenues ! Quelques idées d'améliorations :
- [ ] Graphique d'évolution sur plusieurs mois
- [ ] Catégories personnalisables depuis l'UI
- [ ] Mode clair / sombre
- [ ] Export CSV
- [ ] PWA / mode hors-ligne

## 📄 Licence

MIT — fais-en ce que tu veux.
