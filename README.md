# Geaser Jan Gadingan — Portfolio

Portfolio built with Next.js, React, and Tailwind CSS. Existing section styles are kept in `src/components/css` and imported centrally from `app/globals.css`; new interface pieces can use Tailwind utilities.

## Run the website

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Run the chat backend

The chat API remains a separate Express server. In another terminal:

```bash
cd server
npm install
npm run dev
```

The frontend uses `http://localhost:5000` by default. Set `NEXT_PUBLIC_API_BASE_URL` when the backend is hosted elsewhere. Backend credentials belong in the server environment and must not use a `NEXT_PUBLIC_` prefix.

## Theme modes

The sidebar theme control supports System, Aqua Blue, Dark, and Light. The selection is saved in browser storage. Aqua Blue preserves the portfolio's cyan/blue look; System follows the device preference.

## Production

```bash
npm run build
npm start
```
