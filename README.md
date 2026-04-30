# 💰 Budget App

Une application web de suivi de budget mensuel — entièrement en HTML/CSS/JS vanilla, zéro dépendance, zéro serveur.

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
