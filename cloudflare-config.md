# Configuration CDN avec Cloudflare

## Étapes pour configurer Cloudflare

1. **Créer un compte Cloudflare**
   - Rendez-vous sur [cloudflare.com](https://www.cloudflare.com/) et créez un compte.

2. **Ajouter votre domaine**
   - Ajoutez votre domaine dans le tableau de bord Cloudflare.
   - Configurez les serveurs DNS pour pointer vers Cloudflare.

3. **Configurer les règles de cache**
   - Activez le cache pour les assets statiques (images, CSS, JS).
   - Ajoutez une règle pour ignorer le cache des pages dynamiques.

4. **Activer le mode développement**
   - Utilisez le mode développement pour tester les modifications sans cache.

5. **Configurer les headers de sécurité**
   - Ajoutez des headers comme `Content-Security-Policy` et `Strict-Transport-Security`.

6. **Optimisation des performances**
   - Activez la compression Brotli.
   - Utilisez le réseau CDN pour réduire la latence.

## Exemple de configuration dans Next.js

Ajoutez cette configuration dans `next.config.js` :

```javascript
module.exports = {
  images: {
    domains: ['localhost', 'cloudflare.com'],
    loader: 'default',
  },
};
```

---

**Note** : Assurez-vous que votre domaine est correctement configuré pour pointer vers Cloudflare.
