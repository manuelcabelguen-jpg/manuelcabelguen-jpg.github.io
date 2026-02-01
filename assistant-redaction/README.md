# Assistant Rédaction Correctionnel (Vite + React)

Cette application est une refonte moderne de l'outil d'aide à la rédaction correctionnelle.

## Fonctionnalités Clés

1.  **Architecture Moderne** : Base de code React + Vite pour une meilleure performance et maintenabilité.
2.  **Persistance des Données** : Vos écrits et configurations sont sauvegardés automatiquement dans le navigateur (`localStorage`).
3.  **Éditeur Riche** : Mise en forme du texte (gras, italique, listes) avec React Quill.
4.  **Export PDF** : Téléchargez votre rapport en un clic.
5.  **Bibliothèque Intelligente** : Glissez-déposez vos fichiers (Drag & Drop) pour les ajouter aux sources.
6.  **Mode Focus** : Repliez la barre latérale pour vous concentrer sur l'écriture.
7.  **Configuration IA** : Choisissez entre le mode Simulation (démo), OpenAI, ou Local (Ollama) via les paramètres.

## Installation et Lancement

1.  Installez les dépendances :
    ```bash
    cd assistant-redaction
    npm install
    ```

2.  Lancez le serveur de développement :
    ```bash
    npm run dev
    ```

3.  Ouvrez votre navigateur sur l'URL indiquée (généralement `http://localhost:5173`).

## Structure du Projet

- `src/components/` : Composants UI (Sidebar, Editor, Library, SettingsModal).
- `src/hooks/` : Hooks personnalisés (ex: `useLocalStorage`).
- `src/services/` : Logique métier (ex: `aiService`).
- `src/data/` : Données initiales et modèles.

## Technologies

- React 18
- Tailwind CSS
- React Quill
- jsPDF
- Lucide React (Icônes)
