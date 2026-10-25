# Hébergement du site

Le site RACHCO227 est actuellement statique : les pages HTML, CSS et JavaScript sont publiées sans compilation. Le workflow GitHub Actions **Deploy to GitHub Pages (manual)** copie la racine du dépôt dans la branche `gh-pages` uniquement après un déclenchement manuel.

## Préparer GitHub Pages

1. Fusionnez les fichiers du site et `.github/workflows/deploy-pages.yml` dans `main`. Le workflow doit être présent sur la branche par défaut pour être proposé dans GitHub Actions.
2. Dans **Settings > Pages**, choisissez **Deploy from a branch**, puis `gh-pages` et le dossier `/ (root)`.
3. Dans **Settings > Actions > General > Workflow permissions**, choisissez **Read and write permissions** si le dépôt ou l’organisation ne permet pas déjà l’écriture. Le workflow demande uniquement `contents: write`; une politique d’organisation plus restrictive peut bloquer la publication.
4. Pour un domaine personnalisé, configurez les enregistrements DNS recommandés par GitHub Pages et vérifiez que le fichier `CNAME` présent sur `gh-pages` contient le domaine voulu. Attendez la validation DNS et HTTPS avant d’annoncer le site.

## Publier une version

1. Ouvrez **Actions > Deploy to GitHub Pages (manual) > Run workflow**.
2. Sélectionnez `main` comme branche source, puis confirmez **Run workflow**.
3. Attendez la réussite du workflow et vérifiez l’URL fournie dans **Settings > Pages**.

Le workflow utilise le `GITHUB_TOKEN` temporaire de l’exécution et ne nécessite pas de secret ajouté au dépôt. Il ne publie pas automatiquement chaque modification. La publication met à jour `gh-pages`; contrôlez la source et le contenu avant de lancer le workflow.

## Limites de sécurité

La page `agents.html` est un aperçu de démonstration, pas un espace privé. `noindex` demande aux moteurs de recherche de ne pas indexer la page mais ne restreint pas son accès. Les profils d’agents du tableau d’administration sont stockés dans le navigateur et ne correspondent pas à des comptes de connexion. Avant toute utilisation opérationnelle, ajoutez une authentification et une API côté serveur, puis protégez les routes et les données avec des permissions vérifiées côté serveur. Ne stockez pas de mots de passe, de secrets ou de pièces d’identité dans le site statique.
