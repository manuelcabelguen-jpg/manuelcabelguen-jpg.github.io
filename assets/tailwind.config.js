/**
 * CARTOGRAFFECT® — Configuration Tailwind CSS Unifiée
 * Partagée par l'ensemble des pages du site (zéro-build CDN)
 */
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                heading: ['Outfit', 'Inter', 'sans-serif'],
                serif: ['Newsreader', 'Georgia', 'serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
            },
            colors: {
                cosmic: {
                    950: '#03060a',
                    900: '#070b14',
                    850: '#0b1120',
                    800: '#0e1726',
                    750: '#152136',
                    700: '#1a2744',
                    600: '#1f2e4a'
                },
                slate: {
                    750: '#1e293b',
                    850: '#0f172a'
                }
            }
        }
    }
};

