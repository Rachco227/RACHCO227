Deploy the static site manually

The `Deploy to GitHub Pages (manual)` GitHub Actions workflow publishes the repository root to the existing `gh-pages` branch. It does not run automatically.

Before publishing

1. Merge the workflow and site files into the repository's default branch.
2. In **Settings > Pages**, verify the deployment source is **Deploy from a branch**, with branch `gh-pages` and folder `/ (root)`.
3. If using a custom domain, ensure its DNS records point to GitHub Pages and that the `CNAME` file on `gh-pages` contains the intended domain.

To publish, open **Actions > Deploy to GitHub Pages (manual) > Run workflow**. The workflow uses the repository-provided `GITHUB_TOKEN` to update `gh-pages`; it does not require additional secrets.
