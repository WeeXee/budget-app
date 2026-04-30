const BUDGET_DATA = {
  version: "1.0.0",
  meta: { title: "Budget Mensuel", month: "Mai 2025", currency: "EUR" },
  income: [
    { id: "sal", name: "Salaire net", planned: 2500, actual: null },
    { id: "extra", name: "Revenus complémentaires", planned: 0, actual: null }
  ],
  categories: [
    { id: "logement", icon: "🏠", label: "Logement", color: "#6366f1", items: [
      { id: "loyer", name: "Loyer / Charges", planned: 800, actual: 20, freq: "Mensuel" },
      { id: "elec", name: "Électricité / Gaz", planned: 80, actual: null, freq: "Mensuel" },
      { id: "internet", name: "Internet / Box", planned: 30, actual: null, freq: "Mensuel" },
      { id: "eau", name: "Eau", planned: 20, actual: null, freq: "Mensuel" },
      { id: "taxe", name: "Taxe d'habitation", planned: 0, actual: null, freq: "Mensuel", note: "Annuelle ÷ 12" }
    ]},
    { id: "transport", icon: "🚗", label: "Transport & Crédits", color: "#f59e0b", items: [
      { id: "cred_voit", name: "Crédit voiture", planned: 250, actual: 350, freq: "Mensuel" },
      { id: "cred_moto", name: "Crédit moto", planned: 150, actual: null, freq: "Mensuel" },
      { id: "carb_voit", name: "Carburant voiture", planned: 80, actual: 80, freq: "Mensuel" },
      { id: "carb_moto", name: "Carburant moto", planned: 30, actual: 50, freq: "Mensuel" },
      { id: "entretien", name: "Entretien véhicules", planned: 30, actual: null, freq: "Mensuel", note: "Moyenne mensuelle" },
      { id: "tco", name: "Transports en commun", planned: 0, actual: null, freq: "Mensuel" },
      { id: "parking", name: "Parking / Péages", planned: 10, actual: null, freq: "Mensuel" }
    ]},
    { id: "assurances", icon: "🛡️", label: "Assurances", color: "#10b981", items: [
      { id: "ass_voit", name: "Assurance voiture", planned: 60, actual: null, freq: "Mensuel" },
      { id: "ass_moto", name: "Assurance moto", planned: 40, actual: null, freq: "Mensuel" },
      { id: "ass_hab", name: "Assurance habitation", planned: 20, actual: null, freq: "Mensuel" },
      { id: "ass_vie", name: "Assurance vie / prévoyance", planned: 0, actual: null, freq: "Mensuel" },
      { id: "mutuelle", name: "Mutuelle santé", planned: 50, actual: null, freq: "Mensuel" }
    ]},
    { id: "abos", icon: "📺", label: "Abonnements", color: "#8b5cf6", items: [
      { id: "netflix", name: "Netflix", planned: 18, actual: 7, freq: "Mensuel" },
      { id: "spotify", name: "Spotify / Deezer", planned: 10, actual: null, freq: "Mensuel" },
      { id: "amazon", name: "Amazon Prime", planned: 7, actual: null, freq: "Mensuel" },
      { id: "disney", name: "Disney+", planned: 9, actual: null, freq: "Mensuel" },
      { id: "youtube", name: "YouTube Premium", planned: 0, actual: null, freq: "Mensuel" },
      { id: "apple", name: "Apple / Google / Microsoft", planned: 0, actual: null, freq: "Mensuel" },
      { id: "sport", name: "Salle de sport / Club", planned: 0, actual: null, freq: "Mensuel" },
      { id: "presse", name: "Presse / Magazines", planned: 0, actual: null, freq: "Mensuel" },
      { id: "abo1", name: "Autre abonnement 1", planned: 0, actual: null, freq: "Mensuel" },
      { id: "abo2", name: "Autre abonnement 2", planned: 0, actual: null, freq: "Mensuel" }
    ]},
    { id: "courses", icon: "🛒", label: "Courses & Alimentation", color: "#ef4444", items: [
      { id: "alim", name: "Courses alimentaires", planned: 300, actual: 200, freq: "Mensuel" },
      { id: "resto", name: "Restaurants / Takeaway", planned: 60, actual: 100, freq: "Mensuel" },
      { id: "cafe", name: "Café / Boissons", planned: 20, actual: 10, freq: "Mensuel" },
      { id: "tabac", name: "Tabac / Alcool", planned: 0, actual: null, freq: "Mensuel" }
    ]},
    { id: "loisirs", icon: "🎉", label: "Loisirs & Sorties", color: "#ec4899", items: [
      { id: "cinema", name: "Cinéma / Concerts / Sorties", planned: 30, actual: 30, freq: "Mensuel" },
      { id: "voyages", name: "Voyages / Vacances", planned: 0, actual: null, freq: "Mensuel", note: "Budget annuel ÷ 12" },
      { id: "jeux", name: "Jeux vidéo / Achats loisirs", planned: 20, actual: null, freq: "Mensuel" },
      { id: "shopping", name: "Shopping / Vêtements", planned: 50, actual: null, freq: "Mensuel" }
    ]},
    { id: "sante", icon: "🏥", label: "Santé", color: "#06b6d4", items: [
      { id: "medecin", name: "Médecin / Spécialiste", planned: 20, actual: null, freq: "Mensuel" },
      { id: "pharma", name: "Pharmacie / Médicaments", planned: 15, actual: null, freq: "Mensuel" },
      { id: "dentiste", name: "Dentiste / Ophtalmo", planned: 0, actual: null, freq: "Mensuel", note: "Budget annuel ÷ 12" }
    ]},
    { id: "divers", icon: "💡", label: "Divers", color: "#64748b", items: [
      { id: "cadeaux", name: "Cadeaux", planned: 20, actual: null, freq: "Mensuel" },
      { id: "epargne", name: "Épargne / Virement", planned: 100, actual: null, freq: "Mensuel" },
      { id: "impots", name: "Impôts (mensualisation)", planned: 0, actual: null, freq: "Mensuel" },
      { id: "autres", name: "Autres dépenses", planned: 0, actual: null, freq: "Mensuel" }
    ]}
  ]
};
