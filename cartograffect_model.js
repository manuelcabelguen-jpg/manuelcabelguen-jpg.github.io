/**
 * CARTOGRAFFECT - Modèle Géométrique Officiel (176 entrées)
 * Algorithme du système émotionnel par catégories et groupes
 * Dr Manuel Cabelguen, Ph. D. en psychologie, psychologue clinicien • OPIC n° 1233199
 * 
 * 6 Opérateurs Centraux (Z=0 à Z=5) à (0,0,Z)
 * 80 Positions Affectives réparties sur 6 couronnes (Z=2 à Z=5) selon |X| + |Y| = 2Z - 2
 * Typologie : Axiales (X=0 ou Y=0), Diagonales (|X|=|Y|), Latérales (|X|≠|Y|)
 */

(function(root) {
    const CartograffectModel = {};

    // 6 Strates descriptives
    CartograffectModel.strata = [
        { z: 0, budget: 0, count: 1, name: "Point de Veille", operator: "Point de Veille", title: "Strate Z=0 : Point de Veille (0,0,0)", desc: "Origine structurale du modèle. Bassin attracteur de stabilité homéostatique de fond." },
        { z: 1, budget: 0, count: 1, name: "Surprise", operator: "Surprise", title: "Strate Z=1 : Opérateur Surprise (0,0,1)", desc: "Opérateur ascendant de rupture et de saillance amorçant la trajectoire sans former de couronne." },
        { z: 2, budget: 2, count: 8, name: "Première Couronne", operator: "Anticipation", title: "Strate Z=2 : 8 Prototypes fondamentaux (|X|+|Y|=2)", desc: "Anticipation centrale (0,0,2) et 8 satellites fondamentaux (4 axiaux, 4 diagonaux)." },
        { z: 3, budget: 4, count: 16, name: "Émotions réactives", operator: "Émoi", title: "Strate Z=3 : 16 Émotions réactives (|X|+|Y|=4)", desc: "Émoi central (0,0,3). Différenciation rapide face à l'événement et son contexte immédiat." },
        { z: 4, budget: 6, count: 24, name: "États relationnels", operator: "Réserve", title: "Strate Z=4 : 24 États émotionnels relationnels (|X|+|Y|=6)", desc: "Réserve centrale (0,0,4). Évaluation d'ordre supérieur (autrui, modèle de soi, intersubjectivité)." },
        { z: 5, budget: 8, count: 32, name: "Dispositions durables", operator: "Recul", title: "Strate Z=5 : 32 Dispositions et traits durables (|X|+|Y|=8)", desc: "Recul central (0,0,5). Paramètres lents et humeurs régissant de larges classes de situations." },
        { z: 6, budget: 10, count: 40, name: "Identités Affectives", operator: "Saisie / Saisissement", title: "Strate Z=6 : 40 Identités affectives (|X|+|Y|=10)", desc: "Saisie centrale (0,0,6). Affects de grande profondeur." },
        { z: 7, budget: 12, count: 48, name: "Sentiments transcendantaux", operator: "Suspension", title: "Strate Z=7 : 48 Sentiments transcendantaux (|X|+|Y|=12)", desc: "Suspension centrale (0,0,7). Arrêt du modèle face à l'incommensurable." }
    ];

    // Inventaire complet des 176 entrées (8 opérateurs + 168 positions)
    CartograffectModel.emotions = [
        // ==========================================
        // 8 OPÉRATEURS CENTRAUX (Z=0 à Z=7)
        // ==========================================
        { id: 0, name: "Point de Veille", x: 0, y: 0, z: 0, category: 0, group: "Veille", code: "X0/Y0/Z0", type: "operator", desc: "Origine structurale du modèle (0,0,0). Bassin attracteur de repos homéostatique de fond." },
        { id: 1, name: "Surprise", x: 0, y: 0, z: 1, category: 1, group: "Surprise", code: "X0/Y0/Z1", type: "operator", desc: "Opérateur ascendant de rupture et de saillance (0,0,1). Amorce la trajectoire des huit prototypes sans constituer de couronne." },
        { id: 2, name: "Anticipation", x: 0, y: 0, z: 2, category: 2, group: "Anticipation", code: "X0/Y0/Z2", type: "operator", desc: "Opérateur central descendant d'orientation (0,0,2). Les huit prototypes fondamentaux sont ses satellites sur la première couronne." },
        { id: 3, name: "Émoi", x: 0, y: 0, z: 3, category: 3, group: "Émoi", code: "X0/Y0/Z3", type: "operator", desc: "Opérateur central de la strate Z=3 (0,0,3). Suspension précédant l'allocation attentionnelle réactive." },
        { id: 4, name: "Réserve", x: 0, y: 0, z: 4, category: 4, group: "Réserve", code: "X0/Y0/Z4", type: "operator", desc: "Opérateur central de la strate Z=4 (0,0,4). Suspension réflexive précédant l'évaluation relationnelle et sociale." },
        { id: 5, name: "Recul", x: 0, y: 0, z: 5, category: 5, group: "Recul", code: "X0/Y0/Z5", type: "operator", desc: "Opérateur central de la strate Z=5 (0,0,5). Suspension intégratrice précédant l'ancrage des humeurs et dispositions durables." },

        // ==========================================
        // STRATE Z=2 : PREMIÈRE COURONNE (8 prototypes, |X|+|Y|=2)
        // ==========================================
        // Axiaux
        { id: 8, name: "Joie", x: 0, y: 2, z: 2, category: 2, group: "Joie", code: "X0/Y+2/Z2", type: "axial", desc: "Orientation géométrique axiale Y+2 (contrôlabilité du monde maximale, attente non résolue)." },
        { id: 9, name: "Tristesse", x: 0, y: -2, z: 2, category: 2, group: "Tristesse", code: "X0/Y-2/Z2", type: "axial", desc: "Orientation géométrique axiale Y-2 (incontrôlabilité du monde constatée, attente non résolue)." },
        { id: 10, name: "Peur", x: -2, y: 0, z: 2, category: 2, group: "Peur", code: "X-2/Y0/Z2", type: "axial", desc: "Orientation géométrique axiale X-2 (modèle interne rigide/non-révisable face à la menace)." },
        { id: 11, name: "Courage", x: 2, y: 0, z: 2, category: 2, group: "Courage", code: "X+2/Y0/Z2", type: "axial", desc: "Orientation géométrique axiale X+2 (modèle interne révisable, engagement de mise à jour)." },
        // Diagonaux
        { id: 12, name: "Colère", x: -1, y: 1, z: 2, category: 2, group: "Colère", code: "X-1/Y+1/Z2", type: "diagonal", desc: "Position diagonale : modèle non révisable (X-1) et tentative de contrôle sur le monde (Y+1)." },
        { id: 13, name: "Calme", x: 1, y: -1, z: 2, category: 2, group: "Calme", code: "X+1/Y-1/Z2", type: "diagonal", desc: "Position diagonale : modèle révisable (X+1) et acceptation de non-contrôle sur le monde (Y-1)." },
        { id: 14, name: "Désir", x: 1, y: 1, z: 2, category: 2, group: "Désir", code: "X+1/Y+1/Z2", type: "diagonal", desc: "Position diagonale : modèle révisable (X+1) et contrôlabilité positive du monde (Y+1)." },
        { id: 15, name: "Dégoût", x: -1, y: -1, z: 2, category: 2, group: "Dégoût", code: "X-1/Y-1/Z2", type: "diagonal", desc: "Position diagonale : modèle non révisable (X-1) et rejet d'un monde non contrôlable (Y-1)." },

        // ==========================================
        // CATÉGORIE 3 : ÉMOTIONS RÉACTIVES (16 positions, Z=3, |X|+|Y|=4)
        // ==========================================
        // Axiaux
        { id: 16, name: "Enthousiasme", x: 0, y: 4, z: 3, category: 3, group: "Joie", code: "X0/Y+4/Z3", type: "axial", desc: "Groupe Joie (axial) : projection vive d'énergie motrice sur le monde." },
        { id: 17, name: "Ennui", x: 0, y: -4, z: 3, category: 3, group: "Tristesse", code: "X0/Y-4/Z3", type: "axial", desc: "Groupe Tristesse (axial) : absence de relief et retrait du contrôle sensorimoteur." },
        { id: 18, name: "Crainte", x: -4, y: 0, z: 3, category: 3, group: "Peur", code: "X-4/Y0/Z3", type: "axial", desc: "Groupe Peur (axial) : attente fermée sur la potentialité d'un coût adaptatif." },
        { id: 19, name: "Curiosité", x: 4, y: 0, z: 3, category: 3, group: "Courage", code: "X+4/Y0/Z3", type: "axial", desc: "Groupe Courage (axial) : ouverture épistémique maximale, recherche active d'information." },
        // Latéraux
        { id: 20, name: "Consternation", x: -1, y: 3, z: 3, category: 3, group: "Joie", code: "X-1/Y+3/Z3", type: "lateral", desc: "Groupe Joie (latéral) : choc de contrôle face à un modèle temporairement heurté." },
        { id: 21, name: "Euphorie", x: 1, y: 3, z: 3, category: 3, group: "Joie", code: "X+1/Y+3/Z3", type: "lateral", desc: "Groupe Joie (latéral) : emballement positif conjoignant contrôle et révision fluide." },
        { id: 22, name: "Soulagement", x: 1, y: -3, z: 3, category: 3, group: "Tristesse", code: "X+1/Y-3/Z3", type: "lateral", desc: "Groupe Tristesse (latéral) : relâchement consécutif à l'évitement d'une issue défavorable." },
        { id: 23, name: "Chagrin", x: -1, y: -3, z: 3, category: 3, group: "Tristesse", code: "X-1/Y-3/Z3", type: "lateral", desc: "Groupe Tristesse (latéral) : douleur de la perte inscrite dans un modèle réticent." },
        { id: 24, name: "Panique", x: -3, y: 1, z: 3, category: 3, group: "Peur", code: "X-3/Y+1/Z3", type: "lateral", desc: "Groupe Peur (latéral) : désorganisation réactive avec sursaut d'action motrice." },
        { id: 25, name: "Effroi", x: -3, y: -1, z: 3, category: 3, group: "Peur", code: "X-3/Y-1/Z3", type: "lateral", desc: "Groupe Peur (latéral) : sidération apeurée avec inhibition du contrôle." },
        { id: 26, name: "Émerveillement", x: 3, y: -1, z: 3, category: 3, group: "Courage", code: "X+3/Y-1/Z3", type: "lateral", desc: "Groupe Courage (latéral) : saisissement contemplatif face à une grandeur non modifiable." },
        { id: 27, name: "Aplomb", x: 3, y: 1, z: 3, category: 3, group: "Courage", code: "X+3/Y+1/Z3", type: "lateral", desc: "Groupe Courage (latéral) : assurance motrice et calme épistémique en situation vive." },
        // Diagonaux
        { id: 28, name: "Exaspération", x: -2, y: 2, z: 3, category: 3, group: "Colère", code: "X-2/Y+2/Z3", type: "diagonal", desc: "Groupe Colère (diagonal) : amplification de l'effort correctif contre un obstacle irritant." },
        { id: 29, name: "Détente", x: 2, y: -2, z: 3, category: 3, group: "Calme", code: "X+2/Y-2/Z3", type: "diagonal", desc: "Groupe Calme (diagonal) : dissolution des tensions somatiques et flexibilité interne." },
        { id: 30, name: "Attrait", x: 2, y: 2, z: 3, category: 3, group: "Désir", code: "X+2/Y+2/Z3", type: "diagonal", desc: "Groupe Désir (diagonal) : traction positive guidée par une promesse de renforcement." },
        { id: 31, name: "Retrait", x: -2, y: -2, z: 3, category: 3, group: "Dégoût", code: "X-2/Y-2/Z3", type: "diagonal", desc: "Groupe Dégoût (diagonal) : mouvement d'écartement physique et refus d'assimilation." },

        // ==========================================
        // CATÉGORIE 4 : ÉTATS ÉMOTIONNELS RELATIONNELS (24 émotions, Z=4, |X|+|Y|=6)
        // ==========================================
        // Axiaux
        { id: 32, name: "Exaltation", x: 0, y: 6, z: 4, category: 4, group: "Joie", code: "X0/Y+6/Z4", type: "axial", desc: "Groupe Joie (axial) : haute intensité de contrôle partagé ou célébré." },
        { id: 33, name: "Solitude", x: 0, y: -6, z: 4, category: 4, group: "Tristesse", code: "X0/Y-6/Z4", type: "axial", desc: "Groupe Tristesse (axial) : sentiment d'isolement et de déconnexion relationnelle." },
        { id: 34, name: "Doute", x: -6, y: 0, z: 4, category: 4, group: "Peur", code: "X-6/Y0/Z4", type: "axial", desc: "Groupe Peur (axial) : oscillation paralysante des hypothèses d'action." },
        { id: 35, name: "Assurance", x: 6, y: 0, z: 4, category: 4, group: "Courage", code: "X+6/Y0/Z4", type: "axial", desc: "Groupe Courage (axial) : solidité affirmée des priors épistémiques." },
        // Latéraux
        { id: 36, name: "Envie", x: -2, y: 4, z: 4, category: 4, group: "Joie", code: "X-2/Y+4/Z4", type: "lateral", desc: "Groupe Joie (latéral) : comparaison sociale avec désir d'appropriation du bien d'autrui." },
        { id: 37, name: "Haine", x: -1, y: 5, z: 4, category: 4, group: "Joie", code: "X-1/Y+5/Z4", type: "lateral", desc: "Groupe Joie (latéral) : focalisation destructrice sur l'objet haï avec fort levier de contrôle." },
        { id: 38, name: "Amour", x: 1, y: 5, z: 4, category: 4, group: "Joie", code: "X+1/Y+5/Z4", type: "lateral", desc: "Groupe Joie (latéral) : don relationnel bienveillant et adhésion féconde à l'autre." },
        { id: 39, name: "Ferveur", x: 2, y: 4, z: 4, category: 4, group: "Joie", code: "X+2/Y+4/Z4", type: "lateral", desc: "Groupe Joie (latéral) : élan passionné et dévouement ardent." },
        { id: 40, name: "Sérénité", x: 2, y: -4, z: 4, category: 4, group: "Tristesse", code: "X+2/Y-4/Z4", type: "lateral", desc: "Groupe Tristesse (latéral) : paix intérieure acquise par le renoncement au contrôle forcé." },
        { id: 41, name: "Plénitude", x: 1, y: -5, z: 4, category: 4, group: "Tristesse", code: "X+1/Y-5/Z4", type: "lateral", desc: "Groupe Tristesse (latéral) : sentiment de complétude paisible sans revendication motrice." },
        { id: 42, name: "Honte", x: -2, y: -4, z: 4, category: 4, group: "Tristesse", code: "X-2/Y-4/Z4", type: "lateral", desc: "Groupe Tristesse (latéral) : effondrement du modèle de soi sous le regard d'autrui." },
        { id: 43, name: "Vide", x: -1, y: -5, z: 4, category: 4, group: "Tristesse", code: "X-1/Y-5/Z4", type: "lateral", desc: "Groupe Tristesse (latéral) : perte de sens et creux existentiel dénué de ressource." },
        { id: 44, name: "Anxiété", x: -4, y: 2, z: 4, category: 4, group: "Peur", code: "X-4/Y+2/Z4", type: "lateral", desc: "Groupe Peur (latéral) : anticipation craintive diffuse couplée à une hyperactivation de contrôle." },
        { id: 45, name: "Manque", x: -5, y: 1, z: 4, category: 4, group: "Peur", code: "X-5/Y+1/Z4", type: "lateral", desc: "Groupe Peur (latéral) : tension douloureuse de la privation d'un lien essentiel." },
        { id: 46, name: "Mépris", x: -5, y: -1, z: 4, category: 4, group: "Peur", code: "X-5/Y-1/Z4", type: "lateral", desc: "Groupe Peur (latéral) : dévalorisation d'autrui servant de bouclier défensif." },
        { id: 47, name: "Défiance", x: -4, y: -2, z: 4, category: 4, group: "Peur", code: "X-4/Y-2/Z4", type: "lateral", desc: "Groupe Peur (latéral) : suspicion vigilante limitant l'engagement dans la relation." },
        { id: 48, name: "Fierté", x: 4, y: 2, z: 4, category: 4, group: "Courage", code: "X+4/Y+2/Z4", type: "lateral", desc: "Groupe Courage (latéral) : valorisation légitime de la valeur de soi et des accomplissements." },
        { id: 49, name: "Épanouissement", x: 5, y: 1, z: 4, category: 4, group: "Courage", code: "X+5/Y+1/Z4", type: "lateral", desc: "Groupe Courage (latéral) : expansion harmonieuse des compétences et des liens." },
        { id: 50, name: "Affection", x: 5, y: -1, z: 4, category: 4, group: "Courage", code: "X+5/Y-1/Z4", type: "lateral", desc: "Groupe Courage (latéral) : chaleur relationnelle désintéressée sans visée de maîtrise." },
        { id: 51, name: "Admiration", x: 4, y: -2, z: 4, category: 4, group: "Courage", code: "X+4/Y-2/Z4", type: "lateral", desc: "Groupe Courage (latéral) : reconnaissance joyeuse de l'excellence chez autrui." },
        // Diagonaux
        { id: 52, name: "Frustration", x: -3, y: 3, z: 4, category: 4, group: "Colère", code: "X-3/Y+3/Z4", type: "diagonal", desc: "Groupe Colère (diagonal) : contrariété issue d'une attente contrariée persistante." },
        { id: 53, name: "Acceptation", x: 3, y: -3, z: 4, category: 4, group: "Calme", code: "X+3/Y-3/Z4", type: "diagonal", desc: "Groupe Calme (diagonal) : accord volontaire avec ce qui est, sans résistance stérile." },
        { id: 54, name: "Estime", x: 3, y: 3, z: 4, category: 4, group: "Désir", code: "X+3/Y+3/Z4", type: "diagonal", desc: "Groupe Désir (diagonal) : appréciation positive élevée consolidant le lien." },
        { id: 55, name: "Rejet", x: -3, y: -3, z: 4, category: 4, group: "Dégoût", code: "X-3/Y-3/Z4", type: "diagonal", desc: "Groupe Dégoût (diagonal) : exclusion catégorique d'un élément jugé inacceptable." },

        // ==========================================
        // CATÉGORIE 5 : DISPOSITIONS ET TRAITS DURABLES (32 positions, Z=5, |X|+|Y|=8)
        // ==========================================
        // Axiaux
        { id: 56, name: "Puissance", x: 0, y: 8, z: 5, category: 5, group: "Joie", code: "X0/Y+8/Z5", type: "axial", desc: "Groupe Joie (axial) : sentiment souverain de capacité motrice et d'efficience globale." },
        { id: 57, name: "Impuissance", x: 0, y: -8, z: 5, category: 5, group: "Tristesse", code: "X0/Y-8/Z5", type: "axial", desc: "Groupe Tristesse (axial) : conviction profonde d'incapacité d'action face au réel." },
        { id: 58, name: "Méfiance", x: -8, y: 0, z: 5, category: 5, group: "Peur", code: "X-8/Y0/Z5", type: "axial", desc: "Groupe Peur (axial) : posture durable de suspicion et de fermeture des priors." },
        { id: 59, name: "Confiance", x: 8, y: 0, z: 5, category: 5, group: "Courage", code: "X+8/Y0/Z5", type: "axial", desc: "Groupe Courage (axial) : solidité sereine accordée à la fiabilité des prédictions." },
        // Latéraux
        { id: 60, name: "Invulnérabilité", x: 1, y: 7, z: 5, category: 5, group: "Joie", code: "X+1/Y+7/Z5", type: "lateral", desc: "Groupe Joie (latéral) : croyance inébranlable en son immunité face aux heurts du monde." },
        { id: 61, name: "Attachement", x: 2, y: 6, z: 5, category: 5, group: "Joie", code: "X+2/Y+6/Z5", type: "lateral", desc: "Groupe Joie (latéral) : lien stable et nourricier envers des figures d'ancrage." },
        { id: 62, name: "Engagement", x: 3, y: 5, z: 5, category: 5, group: "Joie", code: "X+3/Y+5/Z5", type: "lateral", desc: "Groupe Joie (latéral) : dévouement actif et structuré envers un projet ou un être." },
        { id: 63, name: "Désenchantement", x: -2, y: 6, z: 5, category: 5, group: "Joie", code: "X-2/Y+6/Z5", type: "lateral", desc: "Groupe Joie (latéral) : lucidité amère consécutive à l'effondrement d'une illusion." },
        { id: 64, name: "Intolérance", x: -3, y: 5, z: 5, category: 5, group: "Joie", code: "X-3/Y+5/Z5", type: "lateral", desc: "Groupe Joie (latéral) : rejet actif de ce qui ne s'aligne pas avec le cadre rigide." },
        { id: 65, name: "Injustice", x: -1, y: 7, z: 5, category: 5, group: "Joie", code: "X-1/Y+7/Z5", type: "lateral", desc: "Groupe Joie (latéral) : révolte contre l'iniquité perçue du monde." },
        { id: 66, name: "Quiétude", x: 3, y: -5, z: 5, category: 5, group: "Tristesse", code: "X+3/Y-5/Z5", type: "lateral", desc: "Groupe Tristesse (latéral) : tranquillité d'âme profonde affranchie des soucis immédiats." },
        { id: 67, name: "Sécurité", x: 2, y: -6, z: 5, category: 5, group: "Tristesse", code: "X+2/Y-6/Z5", type: "lateral", desc: "Groupe Tristesse (latéral) : sentiment stabilisé d'abri et de protection éprouvée." },
        { id: 68, name: "Patience", x: 1, y: -7, z: 5, category: 5, group: "Tristesse", code: "X+1/Y-7/Z5", type: "lateral", desc: "Groupe Tristesse (latéral) : acceptation calme de la temporalité sans forçage." },
        { id: 69, name: "Pessimisme", x: -2, y: -6, z: 5, category: 5, group: "Tristesse", code: "X-2/Y-6/Z5", type: "lateral", desc: "Groupe Tristesse (latéral) : prévision systématique d'issues défavorables." },
        { id: 70, name: "Fermeture", x: -3, y: -5, z: 5, category: 5, group: "Tristesse", code: "X-3/Y-5/Z5", type: "lateral", desc: "Groupe Tristesse (latéral) : hermétisme protecteur bloquant les échanges extérieurs." },
        { id: 71, name: "Désespoir", x: -1, y: -7, z: 5, category: 5, group: "Tristesse", code: "X-1/Y-7/Z5", type: "lateral", desc: "Groupe Tristesse (latéral) : effondrement de toute perspective d'issue positive." },
        { id: 72, name: "Insécurité", x: -6, y: 2, z: 5, category: 5, group: "Peur", code: "X-6/Y+2/Z5", type: "lateral", desc: "Groupe Peur (latéral) : vulnérabilité permanente avec hypervigilance motrice." },
        { id: 73, name: "Inquiétude", x: -5, y: 3, z: 5, category: 5, group: "Peur", code: "X-5/Y+3/Z5", type: "lateral", desc: "Groupe Peur (latéral) : souci persistant anticipant des dérèglements futurs." },
        { id: 74, name: "Impatience", x: -7, y: 1, z: 5, category: 5, group: "Peur", code: "X-7/Y+1/Z5", type: "lateral", desc: "Groupe Peur (latéral) : intolérance à l'attente avec agitation fébrile." },
        { id: 75, name: "Vulnérabilité", x: -7, y: -1, z: 5, category: 5, group: "Peur", code: "X-7/Y-1/Z5", type: "lateral", desc: "Groupe Peur (latéral) : conscience aiguë de sa fragilité somatique ou affective." },
        { id: 76, name: "Détachement", x: -6, y: -2, z: 5, category: 5, group: "Peur", code: "X-6/Y-2/Z5", type: "lateral", desc: "Groupe Peur (latéral) : désinvestissement affectif protecteur face aux menaces." },
        { id: 77, name: "Désengagement", x: -5, y: -3, z: 5, category: 5, group: "Peur", code: "X-5/Y-3/Z5", type: "lateral", desc: "Groupe Peur (latéral) : retrait concerté des politiques d'action partagées." },
        { id: 78, name: "Optimisme", x: 6, y: 2, z: 5, category: 5, group: "Courage", code: "X+6/Y+2/Z5", type: "lateral", desc: "Groupe Courage (latéral) : anticipation confiante de dynamiques favorables." },
        { id: 79, name: "Ouverture", x: 5, y: 3, z: 5, category: 5, group: "Courage", code: "X+5/Y+3/Z5", type: "lateral", desc: "Groupe Courage (latéral) : réceptivité bienveillante aux nouveautés du monde." },
        { id: 80, name: "Espoir", x: 7, y: 1, z: 5, category: 5, group: "Courage", code: "X+7/Y+1/Z5", type: "lateral", desc: "Groupe Courage (latéral) : aspiration active et nourrie vers un avenir désirable." },
        { id: 81, name: "Enchantement", x: 6, y: -2, z: 5, category: 5, group: "Courage", code: "X+6/Y-2/Z5", type: "lateral", desc: "Groupe Courage (latéral) : ravissement contemplatif stabilisé face à la beauté." },
        { id: 82, name: "Tolérance", x: 5, y: -3, z: 5, category: 5, group: "Courage", code: "X+5/Y-3/Z5", type: "lateral", desc: "Groupe Courage (latéral) : bienveillance patiente accueillant la divergence." },
        { id: 83, name: "Justice", x: 7, y: -1, z: 5, category: 5, group: "Courage", code: "X+7/Y-1/Z5", type: "lateral", desc: "Groupe Courage (latéral) : adhésion rigoureuse aux équilibres éthiques équitables." },
        // Diagonaux
        { id: 84, name: "Insatisfaction", x: -4, y: 4, z: 5, category: 5, group: "Colère", code: "X-4/Y+4/Z5", type: "diagonal", desc: "Groupe Colère (diagonal) : discordance durable entre attente exigeante et réalité." },
        { id: 85, name: "Satisfaction", x: 4, y: -4, z: 5, category: 5, group: "Calme", code: "X+4/Y-4/Z5", type: "diagonal", desc: "Groupe Calme (diagonal) : contentement éprouvé d'un ajustement réussi." },
        { id: 86, name: "Intérêt", x: 4, y: 4, z: 5, category: 5, group: "Désir", code: "X+4/Y+4/Z5", type: "diagonal", desc: "Groupe Désir (diagonal) : attention captivée durablement par un domaine ou un être." },
        { id: 87, name: "Désintérêt", x: -4, y: -4, z: 5, category: 5, group: "Dégoût", code: "X-4/Y-4/Z5", type: "diagonal", desc: "Groupe Dégoût (diagonal) : atonie et délaissement complet sans animosité." },

        // ==========================================
        // CATÉGORIE 6 : IDENTITÉS AFFECTIVES (40 dispositions, Z=6, |X|+|Y|=10)
        // ==========================================
        { id: 6, name: "Saisie / Saisissement", x: 0, y: 0, z: 6, category: 6, group: "Saisie", code: "X0/Y0/Z6", type: "operator", desc: "Opérateur central de la strate Z=6 (0,0,6)." },
        // Axiaux
        { id: 88, name: "Élan", x: 0, y: 10, z: 6, category: 6, group: "Joie", code: "X0/Y+10/Z6", type: "axial", desc: "Groupe Joie (axial)" },
        { id: 89, name: "Inertie", x: 0, y: -10, z: 6, category: 6, group: "Tristesse", code: "X0/Y-10/Z6", type: "axial", desc: "Groupe Tristesse (axial)" },
        { id: 90, name: "Effacement", x: -10, y: 0, z: 6, category: 6, group: "Peur", code: "X-10/Y0/Z6", type: "axial", desc: "Groupe Peur (axial)" },
        { id: 91, name: "Affirmation", x: 10, y: 0, z: 6, category: 6, group: "Courage", code: "X+10/Y0/Z6", type: "axial", desc: "Groupe Courage (axial)" },
        // Latéraux Joie (8)
        { id: 92, name: "Ardeur", x: 3, y: 7, z: 6, category: 6, group: "Joie", code: "X+3/Y+7/Z6", type: "lateral", desc: "Groupe Joie (latéral)" },
        { id: 93, name: "Angoisse", x: -3, y: 7, z: 6, category: 6, group: "Joie", code: "X-3/Y+7/Z6", type: "lateral", desc: "Groupe Joie (latéral)" },
        { id: 94, name: "Allégresse", x: 4, y: 6, z: 6, category: 6, group: "Joie", code: "X+4/Y+6/Z6", type: "lateral", desc: "Groupe Joie (latéral)" },
        { id: 95, name: "Fureur", x: -4, y: 6, z: 6, category: 6, group: "Joie", code: "X-4/Y+6/Z6", type: "lateral", desc: "Groupe Joie (latéral)" },
        { id: 96, name: "Ivresse", x: 2, y: 8, z: 6, category: 6, group: "Joie", code: "X+2/Y+8/Z6", type: "lateral", desc: "Groupe Joie (latéral)" },
        { id: 97, name: "Affolement (Joie)", x: -2, y: 8, z: 6, category: 6, group: "Joie", code: "X-2/Y+8/Z6", type: "lateral", desc: "Groupe Joie (latéral)" },
        { id: 98, name: "Jubilation", x: 1, y: 9, z: 6, category: 6, group: "Joie", code: "X+1/Y+9/Z6", type: "lateral", desc: "Groupe Joie (latéral)" },
        { id: 99, name: "Terreur", x: -1, y: 9, z: 6, category: 6, group: "Joie", code: "X-1/Y+9/Z6", type: "lateral", desc: "Groupe Joie (latéral)" },
        // Latéraux Tristesse (8)
        { id: 100, name: "Béatitude", x: 3, y: -7, z: 6, category: 6, group: "Tristesse", code: "X+3/Y-7/Z6", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        { id: 101, name: "Accablement", x: -3, y: -7, z: 6, category: 6, group: "Tristesse", code: "X-3/Y-7/Z6", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        { id: 102, name: "Apaisement", x: 4, y: -6, z: 6, category: 6, group: "Tristesse", code: "X+4/Y-6/Z6", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        { id: 103, name: "Morosité", x: -4, y: -6, z: 6, category: 6, group: "Tristesse", code: "X-4/Y-6/Z6", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        { id: 104, name: "Contemplation", x: 2, y: -8, z: 6, category: 6, group: "Tristesse", code: "X+2/Y-8/Z6", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        { id: 105, name: "Prostration", x: -2, y: -8, z: 6, category: 6, group: "Tristesse", code: "X-2/Y-8/Z6", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        { id: 106, name: "Félicité", x: 1, y: -9, z: 6, category: 6, group: "Tristesse", code: "X+1/Y-9/Z6", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        { id: 107, name: "Désolation", x: -1, y: -9, z: 6, category: 6, group: "Tristesse", code: "X-1/Y-9/Z6", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        // Latéraux Peur (8)
        { id: 108, name: "Irritation", x: -6, y: 4, z: 6, category: 6, group: "Peur", code: "X-6/Y+4/Z6", type: "lateral", desc: "Groupe Peur (latéral)" },
        { id: 109, name: "Amertume", x: -6, y: -4, z: 6, category: 6, group: "Peur", code: "X-6/Y-4/Z6", type: "lateral", desc: "Groupe Peur (latéral)" },
        { id: 110, name: "Affolement (Peur)", x: -7, y: 3, z: 6, category: 6, group: "Peur", code: "X-7/Y+3/Z6", type: "lateral", desc: "Groupe Peur (latéral)" },
        { id: 111, name: "Écrasement", x: -7, y: -3, z: 6, category: 6, group: "Peur", code: "X-7/Y-3/Z6", type: "lateral", desc: "Groupe Peur (latéral)" },
        { id: 112, name: "Agonie", x: -8, y: 2, z: 6, category: 6, group: "Peur", code: "X-8/Y+2/Z6", type: "lateral", desc: "Groupe Peur (latéral)" },
        { id: 113, name: "Anéantissement", x: -8, y: -2, z: 6, category: 6, group: "Peur", code: "X-8/Y-2/Z6", type: "lateral", desc: 'Groupe Peur (latéral)' },
        { id: 114, name: "Désarroi", x: -9, y: 1, z: 6, category: 6, group: "Peur", code: "X-9/Y+1/Z6", type: "lateral", desc: "Groupe Peur (latéral)" },
        { id: 115, name: "Lassitude", x: -9, y: -1, z: 6, category: 6, group: "Peur", code: "X-9/Y-1/Z6", type: "lateral", desc: "Groupe Peur (latéral)" },
        // Latéraux Courage (8)
        { id: 116, name: "Entrain", x: 6, y: 4, z: 6, category: 6, group: "Courage", code: "X+6/Y+4/Z6", type: "lateral", desc: "Groupe Courage (latéral)" },
        { id: 117, name: "Placidité", x: 6, y: -4, z: 6, category: 6, group: "Courage", code: "X+6/Y-4/Z6", type: "lateral", desc: "Groupe Courage (latéral)" },
        { id: 118, name: "Liesse", x: 7, y: 3, z: 6, category: 6, group: "Courage", code: "X+7/Y+3/Z6", type: "lateral", desc: "Groupe Courage (latéral)" },
        { id: 119, name: "Limpidité", x: 7, y: -3, z: 6, category: 6, group: "Courage", code: "X+7/Y-3/Z6", type: "lateral", desc: "Groupe Courage (latéral)" },
        { id: 120, name: "Extase", x: 8, y: 2, z: 6, category: 6, group: "Courage", code: "X+8/Y+2/Z6", type: "lateral", desc: "Groupe Courage (latéral)" },
        { id: 121, name: "Équanimité", x: 8, y: -2, z: 6, category: 6, group: "Courage", code: "X+8/Y-2/Z6", type: "lateral", desc: "Groupe Courage (latéral)" },
        { id: 122, name: "Exultation", x: 9, y: 1, z: 6, category: 6, group: "Courage", code: "X+9/Y+1/Z6", type: "lateral", desc: "Groupe Courage (latéral)" },
        { id: 123, name: "Harmonie", x: 9, y: -1, z: 6, category: 6, group: "Courage", code: "X+9/Y-1/Z6", type: "lateral", desc: "Groupe Courage (latéral)" },
        // Diagonaux
        { id: 124, name: "Tourment", x: -5, y: 5, z: 6, category: 6, group: "Colère", code: "X-5/Y+5/Z6", type: "diagonal", desc: "Groupe Colère (diagonal)" },
        { id: 125, name: "Ataraxie", x: 5, y: -5, z: 6, category: 6, group: "Calme", code: "X+5/Y-5/Z6", type: "diagonal", desc: "Groupe Calme (diagonal)" },
        { id: 126, name: "Triomphe", x: 5, y: 5, z: 6, category: 6, group: "Désir", code: "X+5/Y+5/Z6", type: "diagonal", desc: "Groupe Désir (diagonal)" },
        { id: 127, name: "Abattement", x: -5, y: -5, z: 6, category: 6, group: "Dégoût", code: "X-5/Y-5/Z6", type: "diagonal", desc: "Groupe Dégoût (diagonal)" },

        // ==========================================
        // CATÉGORIE 7 : SENTIMENTS TRANSCENDANTAUX (48 sentiments, Z=7, |X|+|Y|=12)
        // ==========================================
        { id: 7, name: "Suspension", x: 0, y: 0, z: 7, category: 7, group: "Suspension", code: "X0/Y0/Z7", type: "operator", desc: "Opérateur central de la strate Z=7 (0,0,7)." },
        // Axiaux
        { id: 128, name: "Infini", x: 0, y: 12, z: 7, category: 7, group: "Joie", code: "X0/Y+12/Z7", type: "axial", desc: "Groupe Joie (axial)" },
        { id: 129, name: "Néant", x: 0, y: -12, z: 7, category: 7, group: "Tristesse", code: "X0/Y-12/Z7", type: "axial", desc: "Groupe Tristesse (axial)" },
        { id: 130, name: "Déréliction", x: -12, y: 0, z: 7, category: 7, group: "Peur", code: "X-12/Y0/Z7", type: "axial", desc: "Groupe Peur (axial)" },
        { id: 131, name: "Communion", x: 12, y: 0, z: 7, category: 7, group: "Courage", code: "X+12/Y0/Z7", type: "axial", desc: "Groupe Courage (axial)" },
        // Latéraux Joie (10)
        { id: 132, name: "Transcendance", x: 2, y: 10, z: 7, category: 7, group: "Joie", code: "X+2/Y+10/Z7", type: "lateral", desc: "Groupe Joie (latéral)" },
        { id: 133, name: "Déchirement", x: -2, y: 10, z: 7, category: 7, group: "Joie", code: "X-2/Y+10/Z7", type: "lateral", desc: "Groupe Joie (latéral)" },
        { id: 134, name: "Exubérance", x: 4, y: 8, z: 7, category: 7, group: "Joie", code: "X+4/Y+8/Z7", type: "lateral", desc: "Groupe Joie (latéral)" },
        { id: 135, name: "Horreur", x: -4, y: 8, z: 7, category: 7, group: "Joie", code: "X-4/Y+8/Z7", type: "lateral", desc: "Groupe Joie (latéral)" },
        { id: 136, name: "Grâce", x: 1, y: 11, z: 7, category: 7, group: "Joie", code: "X+1/Y+11/Z7", type: "lateral", desc: "Groupe Joie (latéral)" },
        { id: 137, name: "Pérennité", x: -1, y: 11, z: 7, category: 7, group: "Joie", code: "X-1/Y+11/Z7", type: "lateral", desc: "Groupe Joie (latéral)" },
        { id: 138, name: "Élévation", x: 3, y: 9, z: 7, category: 7, group: "Joie", code: "X+3/Y+9/Z7", type: "lateral", desc: "Groupe Joie (latéral)" },
        { id: 139, name: "Détresse", x: -3, y: 9, z: 7, category: 7, group: "Joie", code: "X-3/Y+9/Z7", type: "lateral", desc: "Groupe Joie (latéral)" },
        { id: 140, name: "Enivrement", x: 5, y: 7, z: 7, category: 7, group: "Joie", code: "X+5/Y+7/Z7", type: "lateral", desc: "Groupe Joie (latéral)" },
        { id: 141, name: "Révolte", x: -5, y: 7, z: 7, category: 7, group: "Joie", code: "X-5/Y+7/Z7", type: "lateral", desc: "Groupe Joie (latéral)" },
        // Latéraux Tristesse (10)
        { id: 142, name: "Nirvana", x: 2, y: -10, z: 7, category: 7, group: "Tristesse", code: "X+2/Y-10/Z7", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        { id: 143, name: "Perdition", x: -2, y: -10, z: 7, category: 7, group: "Tristesse", code: "X-2/Y-10/Z7", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        { id: 144, name: "Paix", x: 4, y: -8, z: 7, category: 7, group: "Tristesse", code: "X+4/Y-8/Z7", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        { id: 145, name: "Oppression", x: -4, y: -8, z: 7, category: 7, group: "Tristesse", code: "X-4/Y-8/Z7", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        { id: 146, name: "Vertige", x: 1, y: -11, z: 7, category: 7, group: "Tristesse", code: "X+1/Y-11/Z7", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        { id: 147, name: "Abîme", x: -1, y: -11, z: 7, category: 7, group: "Tristesse", code: "X-1/Y-11/Z7", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        { id: 148, name: "Abandon", x: 3, y: -9, z: 7, category: 7, group: "Tristesse", code: "X+3/Y-9/Z7", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        { id: 149, name: "Damnation", x: -3, y: -9, z: 7, category: 7, group: "Tristesse", code: "X-3/Y-9/Z7", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        { id: 150, name: "Silence", x: 5, y: -7, z: 7, category: 7, group: "Tristesse", code: "X+5/Y-7/Z7", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        { id: 151, name: "Résignation", x: -5, y: -7, z: 7, category: 7, group: "Tristesse", code: "X-5/Y-7/Z7", type: "lateral", desc: "Groupe Tristesse (latéral)" },
        // Latéraux Peur (10)
        { id: 152, name: "Frayeur", x: -10, y: 2, z: 7, category: 7, group: "Peur", code: "X-10/Y+2/Z7", type: "lateral", desc: "Groupe Peur (latéral)" },
        { id: 153, name: "Isolement", x: -10, y: -2, z: 7, category: 7, group: "Peur", code: "X-10/Y-2/Z7", type: "lateral", desc: "Groupe Peur (latéral)" },
        { id: 154, name: "Affliction", x: -8, y: 4, z: 7, category: 7, group: "Peur", code: "X-8/Y+4/Z7", type: "lateral", desc: "Groupe Peur (latéral)" },
        { id: 155, name: "Mélancolie", x: -8, y: -4, z: 7, category: 7, group: "Peur", code: "X-8/Y-4/Z7", type: "lateral", desc: "Groupe Peur (latéral)" },
        { id: 156, name: "Épouvante", x: -11, y: 1, z: 7, category: 7, group: "Peur", code: "X-11/Y+1/Z7", type: "lateral", desc: "Groupe Peur (latéral)" },
        { id: 157, name: "Extinction", x: -11, y: -1, z: 7, category: 7, group: "Peur", code: "X-11/Y-1/Z7", type: "lateral", desc: "Groupe Peur (latéral)" },
        { id: 158, name: "Sidération", x: -9, y: 3, z: 7, category: 7, group: "Peur", code: "X-9/Y+3/Z7", type: "lateral", desc: "Groupe Peur (latéral)" },
        { id: 159, name: "Engloutissement", x: -9, y: -3, z: 7, category: 7, group: "Peur", code: "X-9/Y-3/Z7", type: "lateral", desc: "Groupe Peur (latéral)" },
        { id: 160, name: "Tumulte", x: -7, y: 5, z: 7, category: 7, group: "Peur", code: "X-7/Y+5/Z7", type: "lateral", desc: "Groupe Peur (latéral)" },
        { id: 161, name: "Pétrification", x: -7, y: -5, z: 7, category: 7, group: "Peur", code: "X-7/Y-5/Z7", type: "lateral", desc: "Groupe Peur (latéral)" },
        // Latéraux Courage (10)
        { id: 162, name: "Éblouissement", x: 10, y: 2, z: 7, category: 7, group: "Courage", code: "X+10/Y+2/Z7", type: "lateral", desc: "Groupe Courage (latéral)" },
        { id: 163, name: "Recueillement", x: 10, y: -2, z: 7, category: 7, group: "Courage", code: "X+10/Y-2/Z7", type: "lateral", desc: "Groupe Courage (latéral)" },
        { id: 164, name: "Rayonnement", x: 8, y: 4, z: 7, category: 7, group: "Courage", code: "X+8/Y+4/Z7", type: 'lateral', desc: "Groupe Courage (latéral)" },
        { id: 165, name: "Contentement", x: 8, y: -4, z: 7, category: 7, group: "Courage", code: "X+8/Y-4/Z7", type: "lateral", desc: "Groupe Courage (latéral)" },
        { id: 166, name: "Ravissement", x: 11, y: 1, z: 7, category: 7, group: "Courage", code: "X+11/Y+1/Z7", type: "lateral", desc: "Groupe Courage (latéral)" },
        { id: 167, name: "Épiphanie", x: 11, y: -1, z: 7, category: 7, group: "Courage", code: "X+11/Y-1/Z7", type: "lateral", desc: "Groupe Courage (latéral)" },
        { id: 168, name: "Louange", x: 9, y: 3, z: 7, category: 7, group: "Courage", code: "X+9/Y+3/Z7", type: "lateral", desc: "Groupe Courage (latéral)" },
        { id: 169, name: "Lucidité", x: 9, y: -3, z: 7, category: 7, group: "Courage", code: "X+9/Y-3/Z7", type: "lateral", desc: "Groupe Courage (latéral)" },
        { id: 170, name: "Effusion", x: 7, y: 5, z: 7, category: 7, group: "Courage", code: "X+7/Y+5/Z7", type: "lateral", desc: "Groupe Courage (latéral)" },
        { id: 171, name: "Consentement", x: 7, y: -5, z: 7, category: 7, group: "Courage", code: "X+7/Y-5/Z7", type: "lateral", desc: "Groupe Courage (latéral)" },
        // Diagonaux
        { id: 172, name: "Effondrement", x: -6, y: 6, z: 7, category: 7, group: "Colère", code: "X-6/Y+6/Z7", type: "diagonal", desc: "Groupe Colère (diagonal)" },
        { id: 173, name: "Impassibilité", x: 6, y: -6, z: 7, category: 7, group: "Calme", code: "X+6/Y-6/Z7", type: "diagonal", desc: "Groupe Calme (diagonal)" },
        { id: 174, name: "Sublimation", x: 6, y: 6, z: 7, category: 7, group: "Désir", code: "X+6/Y+6/Z7", type: "diagonal", desc: "Groupe Désir (diagonal)" },
        { id: 175, name: "Dissolution", x: -6, y: -6, z: 7, category: 7, group: "Dégoût", code: "X-6/Y-6/Z7", type: "diagonal", desc: "Groupe Dégoût (diagonal)" }
    ];

    // ==========================================
    // CORRESPONDANCES EXACTES DU PDF
    // ==========================================

    // Correspondances Axiales : (X,Y) -> (-X,-Y) sur un axe principal (X=0 ou Y=0)
    CartograffectModel.axialPairs = [
        // Groupe 2
        ["Joie", "Tristesse"],         // X0/Y+2/Z2 <-> X0/Y-2/Z2
        ["Peur", "Courage"],           // X-2/Y0/Z2 <-> X+2/Y0/Z2
        // Groupe 3
        ["Enthousiasme", "Ennui"],     // X0/Y+4/Z3 <-> X0/Y-4/Z3
        ["Curiosité", "Crainte"],      // X+4/Y0/Z3 <-> X-4/Y0/Z3
        // Groupe 4
        ["Exaltation", "Solitude"],    // X0/Y+6/Z4 <-> X0/Y-6/Z4
        ["Assurance", "Doute"],        // X+6/Y0/Z4 <-> X-6/Y0/Z4
        // Groupe 5
        ["Puissance", "Impuissance"],  // X0/Y+8/Z5 <-> X0/Y-8/Z5
        ["Confiance", "Méfiance"],     // X+8/Y0/Z5 <-> X-8/Y0/Z5
        // Groupe 6
        ["Élan", "Inertie"],           // X0/Y+10/Z6 <-> X0/Y-10/Z6
        ["Affirmation", "Effacement"], // X+10/Y0/Z6 <-> X-10/Y0/Z6
        // Groupe 7
        ["Infini", "Néant"],           // X0/Y+12/Z7 <-> X0/Y-12/Z7
        ["Communion", "Déréliction"]   // X+12/Y0/Z7 <-> X-12/Y0/Z7
    ];

    // Correspondances Diagonales : |X|=|Y|, (X,Y) -> (-X,-Y)
    CartograffectModel.diagonalPairs = [
        // Groupe 2
        ["Colère", "Calme"],              // X-1/Y+1/Z2 <-> X+1/Y-1/Z2
        ["Désir", "Dégoût"],              // X+1/Y+1/Z2 <-> X-1/Y-1/Z2
        // Groupe 3
        ["Exaspération", "Détente"],      // X-2/Y+2/Z3 <-> X+2/Y-2/Z3
        ["Attrait", "Retrait"],           // X+2/Y+2/Z3 <-> X-2/Y-2/Z3
        // Groupe 4
        ["Frustration", "Acceptation"],   // X-3/Y+3/Z4 <-> X+3/Y-3/Z4
        ["Estime", "Rejet"],              // X+3/Y+3/Z4 <-> X-3/Y-3/Z4
        // Groupe 5
        ["Intérêt", "Désintérêt"],        // X+4/Y+4/Z5 <-> X-4/Y-4/Z5
        ["Satisfaction", "Insatisfaction"], // X+4/Y-4/Z5 <-> X-4/Y+4/Z5
        // Groupe 6
        ["Tourment", "Ataraxie"],         // X-5/Y+5/Z6 <-> X+5/Y-5/Z6
        ["Triomphe", "Abattement"],       // X+5/Y+5/Z6 <-> X-5/Y-5/Z6
        // Groupe 7
        ["Effondrement", "Impassibilité"],// X-6/Y+6/Z7 <-> X+6/Y-6/Z7
        ["Sublimation", "Dissolution"]    // X+6/Y+6/Z7 <-> X-6/Y-6/Z7
    ];

    // Correspondances Controlatérales strictes (pages 9 & 10 du document PDF)
    CartograffectModel.controlateralPairs = [
        // Groupe 3 (Z=3)
        ["Consternation", "Émerveillement"], // X-1/Y+3/Z3 <-> X+3/Y-1/Z3 (Ti)
        ["Euphorie", "Effroi"],              // X+1/Y+3/Z3 <-> X-3/Y-1/Z3 (Ti)
        ["Soulagement", "Panique"],          // X+1/Y-3/Z3 <-> X-3/Y+1/Z3 (Ti)
        ["Chagrin", "Aplomb"],               // X-1/Y-3/Z3 <-> X+3/Y+1/Z3 (Ti)

        // Groupe 4 (Z=4)
        ["Envie", "Admiration"],             // X-2/Y+4/Z4 <-> X+4/Y-2/Z4
        ["Haine", "Affection"],              // X-1/Y+5/Z4 <-> X+5/Y-1/Z4
        ["Amour", "Mépris"],                 // X+1/Y+5/Z4 <-> X-5/Y-1/Z4
        ["Ferveur", "Défiance"],             // X+2/Y+4/Z4 <-> X-4/Y-2/Z4
        ["Sérénité", "Anxiété"],             // X+2/Y-4/Z4 <-> X-4/Y+2/Z4
        ["Plénitude", "Manque"],             // X+1/Y-5/Z4 <-> X-5/Y+1/Z4
        ["Honte", "Fierté"],                 // X-2/Y-4/Z4 <-> X+4/Y+2/Z4
        ["Vide", "Épanouissement"],          // X-1/Y-5/Z4 <-> X+5/Y+1/Z4

        // Groupe 5 (Z=5)
        ["Invulnérabilité", "Vulnérabilité"], // X+1/Y+7/Z5 <-> X-7/Y-1/Z5
        ["Attachement", "Détachement"],       // X+2/Y+6/Z5 <-> X-6/Y-2/Z5
        ["Engagement", "Désengagement"],     // X+3/Y+5/Z5 <-> X-5/Y-3/Z5
        ["Désenchantement", "Enchantement"], // X-2/Y+6/Z5 <-> X+6/Y-2/Z5
        ["Intolérance", "Tolérance"],         // X-3/Y+5/Z5 <-> X+5/Y-3/Z5
        ["Injustice", "Justice"],             // X-1/Y+7/Z5 <-> X+7/Y-1/Z5
        ["Quiétude", "Inquiétude"],           // X+3/Y-5/Z5 <-> X-5/Y+3/Z5
        ["Sécurité", "Insécurité"],           // X+2/Y-6/Z5 <-> X-6/Y+2/Z5
        ["Patience", "Impatience"],           // X+1/Y-7/Z5 <-> X-7/Y+1/Z5
        ["Pessimisme", "Optimisme"],          // X-2/Y-6/Z5 <-> X+6/Y+2/Z5
        ["Fermeture", "Ouverture"],           // X-3/Y-5/Z5 <-> X+5/Y+3/Z5
        ["Désespoir", "Espoir"],              // X-1/Y-7/Z5 <-> X+7/Y+1/Z5

        // Groupe 6 (Z=6)
        ["Ardeur", "Écrasement"],
        ["Béatitude", "Affolement (Peur)"],
        ["Angoisse", "Limpidité"],
        ["Accablement", "Liesse"],
        ["Allégresse", "Amertume"],
        ["Apaisement", "Irritation"],
        ["Fureur", "Placidité"],
        ["Morosité", "Entrain"],
        ["Ivresse", "Anéantissement"],
        ["Contemplation", "Agonie"],
        ["Affolement (Joie)", "Équanimité"],
        ["Prostration", "Extase"],
        ["Jubilation", "Lassitude"],
        ["Félicité", "Désarroi"],
        ["Terreur", "Harmonie"],
        ["Désolation", "Exultation"],

        // Groupe 7 (Z=7)
        ["Transcendance", "Isolement"],
        ["Nirvana", "Frayeur"],
        ["Déchirement", "Recueillement"],
        ["Perdition", "Éblouissement"],
        ["Exubérance", "Mélancolie"],
        ["Paix", "Affliction"],
        ["Horreur", "Contentement"],
        ["Oppression", "Rayonnement"],
        ["Grâce", "Extinction"],
        ["Vertige", "Épouvante"],
        ["Pérennité", "Abîme"],
        ["Abîme", "Ravissement"],
        ["Élévation", "Engloutissement"],
        ["Abandon", "Sidération"],
        ["Détresse", "Lucidité"],
        ["Damnation", "Louange"],
        ["Enivrement", "Pétrification"],
        ["Silence", "Tumulte"],
        ["Révolte", "Consentement"],
        ["Résignation", "Effusion"]
    ];

    // Palette des groupes géométriques
    CartograffectModel.groupColors = {
        "Joie": "#facc15",
        "Tristesse": "#60a5fa",
        "Peur": "#c084fc",
        "Courage": "#4ade80",
        "Colère": "#f87171",
        "Calme": "#38bdf8",
        "Désir": "#f472b6",
        "Dégoût": "#94a3b8",
        // Opérateurs centraux
        "Veille": "#64748b",
        "Surprise": "#fbbf24",
        "Anticipation": "#a855f7",
        "Émoi": "#ec4899",
        "Réserve": "#818cf8",
        "Recul": "#06b6d4",
        "Saisie": "#10b981", // Example: emerald
        "Suspension": "#f43f5e" // Example: rose
    };

    // Helper functions
    CartograffectModel.getById = function(id) {
        return this.emotions.find(e => e.id === Number(id));
    };

    CartograffectModel.getByName = function(name) {
        if (!name) return null;
        const norm = String(name).trim().toLowerCase();
        return this.emotions.find(e => e.name.toLowerCase() === norm);
    };

    CartograffectModel.getByStrata = function(z) {
        return this.emotions.filter(e => e.z === Number(z));
    };

    CartograffectModel.getStrataMeta = function(z) {
        return this.strata.find(s => s.z === Number(z));
    };

    CartograffectModel.getOpposite = function(name) {
        if (!name) return null;
        const norm = String(name).trim().toLowerCase();
        
        let matchName = null;
        let relation = 'axial';

        // 1. Axial pairs
        if (this.axialPairs) {
            for (const p of this.axialPairs) {
                if (p[0].toLowerCase() === norm) { matchName = p[1]; relation = 'axial'; break; }
                if (p[1].toLowerCase() === norm) { matchName = p[0]; relation = 'axial'; break; }
            }
        }
        // 2. Diagonal pairs
        if (!matchName && this.diagonalPairs) {
            for (const p of this.diagonalPairs) {
                if (p[0].toLowerCase() === norm) { matchName = p[1]; relation = 'diagonal'; break; }
                if (p[1].toLowerCase() === norm) { matchName = p[0]; relation = 'diagonal'; break; }
            }
        }
        // 3. Controlateral pairs
        if (!matchName && this.controlateralPairs) {
            for (const p of this.controlateralPairs) {
                if (p[0].toLowerCase() === norm) { matchName = p[1]; relation = 'controlateral'; break; }
                if (p[1].toLowerCase() === norm) { matchName = p[0]; relation = 'controlateral'; break; }
            }
        }

        if (!matchName) return null;
        const obj = this.getByName(matchName);
        if (!obj) return { name: matchName, relation: relation };
        return Object.assign({}, obj, { relation: relation });
    };

    CartograffectModel.getSymmetryPair = function(name) {
        const opp = this.getOpposite(name);
        return opp ? opp.name : null;
    };

    // Exportation
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = CartograffectModel;
    } else {
        root.CartograffectModel = CartograffectModel;
    }
})(typeof window !== 'undefined' ? window : this);
