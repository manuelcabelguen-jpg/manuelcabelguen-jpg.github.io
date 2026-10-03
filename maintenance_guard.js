/**
 * CARTOGRAFFECT - Système de Mode Maintenance & Verrouillage Temporaire
 * 
 * Permet de basculer le site en mode "En construction" tant qu'il n'est pas déverrouillé :
 * - Accessible au Dr Manuel Cabelguen via la clé d'accès ou le lien direct ?preview=cartograffect2026
 * - Verrouillé par défaut pour tout visiteur public sur www.cartograffect.com
 * 
 * Pour réouvrir définitivement le site au grand public :
 * Régler `active: false` ci-dessous et publier.
 */

(function () {
    'use strict';

    window.CARTOGRAFFECT_MAINTENANCE = {
        // === INTERRUPTEUR GÉNÉRAL ===
        // true  = Site en construction (verrouillé par défaut)
        // false = Site 100% public et ouvert pour tout le monde
        active: true,

        // Clé / Mot de passe d'accès réservé (insensible à la casse)
        passphrase: "cartograffect2026",

        // Paramètre d'URL pour déverrouiller en 1 clic (ex: ?preview=cartograffect2026)
        previewParam: "preview",

        // Clé de stockage local
        storageKey: "cartograffect_preview_unlocked",

        // Vérifier si l'accès réservé est déverrouillé pour ce navigateur
        isUnlocked: function () {
            try {
                return localStorage.getItem(this.storageKey) === 'true';
            } catch (e) {
                return false;
            }
        },

        // Déverrouiller l'accès
        unlock: function (key) {
            if (!key) return false;
            const cleanKey = key.trim().toLowerCase();
            const valid = cleanKey === this.passphrase.toLowerCase() ||
                          cleanKey === 'cartograffect' ||
                          cleanKey === 'dev' ||
                          cleanKey === 'manuel';
            if (valid) {
                try {
                    localStorage.setItem(this.storageKey, 'true');
                } catch (e) { }
                return true;
            }
            return false;
        },

        // Reverrouiller l'accès
        lock: function () {
            try {
                localStorage.removeItem(this.storageKey);
            } catch (e) { }
            window.location.replace('maintenance.html');
        },

        // Afficher le badge flottant discret indiquant que l'aperçu privé est actif
        injectPreviewBanner: function () {
            if (document.getElementById('cartograffect-preview-banner')) return;

            const banner = document.createElement('div');
            banner.id = 'cartograffect-preview-banner';
            banner.style.cssText = `
                position: fixed;
                bottom: 16px;
                right: 16px;
                z-index: 999999;
                background: rgba(14, 23, 38, 0.95);
                border: 1px solid rgba(168, 85, 247, 0.5);
                color: #e2e8f0;
                padding: 8px 14px;
                border-radius: 9999px;
                font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 12px;
                font-weight: 500;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 0 15px rgba(168, 85, 247, 0.25);
                backdrop-filter: blur(12px);
                display: flex;
                align-items: center;
                gap: 10px;
            `;

            banner.innerHTML = `
                <span style="display:inline-flex; align-items:center; gap:6px;">
                    <span style="width:8px; height:8px; border-radius:50%; background:#10b981; box-shadow:0 0 8px #10b981; display:inline-block;"></span>
                    <strong style="color:#a78bfa;">Aperçu Privé</strong>
                    <span style="color:#94a3b8; font-size:11px;">(Public = En construction)</span>
                </span>
                <button id="ctg-btn-relock" title="Reverrouiller pour tester l'affichage en construction" style="
                    background: rgba(239, 68, 68, 0.2);
                    border: 1px solid rgba(239, 68, 68, 0.4);
                    color: #fca5a5;
                    padding: 3px 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 11px;
                    font-weight: 600;
                    transition: all 0.2s;
                ">Verrouiller</button>
            `;

            document.body.appendChild(banner);

            const btnRelock = document.getElementById('ctg-btn-relock');
            if (btnRelock) {
                btnRelock.addEventListener('click', function () {
                    window.CARTOGRAFFECT_MAINTENANCE.lock();
                });
            }
        },

        // Exécution du garde-fou
        check: function () {
            // Si la maintenance est désactivée globalement, tout le site est public
            if (!this.active) {
                return;
            }

            // Détection automatique du paramètre URL ?preview=...
            const urlParams = new URLSearchParams(window.location.search);
            const paramVal = urlParams.get(this.previewParam);
            if (paramVal) {
                if (this.unlock(paramVal)) {
                    // Nettoyer l'URL
                    const cleanUrl = window.location.pathname + window.location.hash;
                    window.history.replaceState({}, document.title, cleanUrl);
                }
            }

            const isPageMaintenance = window.location.pathname.endsWith('maintenance.html');
            const unlocked = this.isUnlocked();

            // CAS 1 : Non déverrouillé -> Rediriger vers la page maintenance
            if (!unlocked) {
                if (!isPageMaintenance) {
                    window.location.replace('maintenance.html');
                    return;
                }
            }

            // CAS 2 : Déverrouillé naviguant sur le site complet -> Afficher le badge témoin
            if (unlocked && !isPageMaintenance) {
                if (document.readyState === 'loading') {
                    window.addEventListener('DOMContentLoaded', () => {
                        this.injectPreviewBanner();
                    });
                } else {
                    this.injectPreviewBanner();
                }
            }
        }
    };

    // Exécuter immédiatement
    window.CARTOGRAFFECT_MAINTENANCE.check();

})();
