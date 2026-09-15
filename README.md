# AsterMech Corp

Cinematic website for AsterMech Corp, an independent software studio.

## Live site

- GitHub repo: https://github.com/robbb9000/astermech-corp
- GitHub Pages (after you enable it): https://robbb9000.github.io/astermech-corp/

On a computer, scroll through the hangar film. The mech assembles as you scroll.

## Deploy on Railway

1. Open [railway.com/new](https://railway.com/new)
2. Choose **Deploy from GitHub repo**
3. Select **astermech-corp**
4. Railway will use the Dockerfile and serve the cinematic site
5. Open the service → **Settings → Networking → Generate domain**
6. Visit that URL on a desktop and scroll

## Local

```bash
npm install
npm run dev
```

The full React app lives in `src/`. The static film (GitHub Pages / Railway) is in `docs/`.
