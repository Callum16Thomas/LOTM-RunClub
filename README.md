# Longwood on the Move — website

A plain HTML/CSS/JS site, no build step, no framework. Everything renders
from static files, which is what makes it free to host on GitHub Pages.

```
index.html      Home page
routes.html     Interactive map of routes (Leaflet + GPX)
events.html     Upcoming group runs
blog.html       Club news / posts
contact.html    Sign-up form (via Formspree)
css/style.css   All styling
js/routes.js    Loads data/routes.json, drives the map
js/events.js    Loads data/events.json, renders the schedule
data/routes.json    Route info: name, distance, difficulty, GPX file
data/events.json    Event info: date, title, location, description
routes/*.gpx    GPX track files, one per route
```

## 1. Put this on GitHub Pages (free hosting)

1. Create a new repository on GitHub (e.g. `runclub-site`). Public repos
   get free Pages hosting; private repos need a paid plan for Pages.
2. Push this folder's contents to the repo (from inside this folder):
   ```
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/runclub-site.git
   git push -u origin main
   ```
3. On GitHub: go to the repo's **Settings → Pages**. Under "Build and
   deployment", set **Source** to "Deploy from a branch", branch `main`,
   folder `/ (root)`. Save.
4. GitHub gives you a URL like `https://YOUR_USERNAME.github.io/runclub-site/`
   within a minute or two. Every `git push` after that updates the live
   site automatically.

If you'd rather have a shorter URL later, you
can add a custom domain in that same Pages settings page — that step
costs money (buying the domain) but the hosting itself stays free.

## 2. Rename the club

The club is currently named "Longwood on the Move". To rename it again,
search-and-replace that name across the `.html` files — it appears in the
`<title>`, the nav brand link, and the footer of each page.

## 3. Add or edit routes

1. Get a GPX file for the route. Easiest sources: export from Strava
   (an activity's "..." menu → Export GPX), or from RideWithGPS/Komoot
   if you plan the route there first.
2. Drop the `.gpx` file into the `routes/` folder.
3. Add an entry to `data/routes.json`:
   ```json
   {
     "bib": "04",
     "id": "your-route-id",
     "name": "Route Name",
     "distanceMi": 4.2,
     "elevationFt": 150,
     "blaze": "yellow",
     "difficulty": "Moderate",
     "description": "One or two sentences about the route.",
     "gpx": "routes/your-file.gpx"
   }
   ```
   `blaze` must be `blue`, `yellow`, or `red` — that's what colors the tag
   and the line on the map.

The sample route (`routes/riverside-loop.gpx`) is a made-up loop near the
Charles River so the map isn't empty out of the box — swap it out along
with the three sample entries in `routes.json`.

## 4. Add or edit group runs

Edit `data/events.json`. Each entry needs `date` (YYYY-MM-DD), `title`,
`location`, and `description`. The page automatically hides anything
before today's date and sorts what's left by date — you don't need to
delete old entries, though it's fine to.

## 5. Set up the sign-up form

The contact form posts to [Formspree](https://formspree.io), which is
free for up to 50 submissions/month and emails them straight to you —
no backend needed.

1. Sign up at formspree.io, create a new form.
2. Copy the endpoint it gives you (`https://formspree.io/f/xxxxxxxx`).
3. In `contact.html`, replace `YOUR_FORM_ID` in the `<form action="...">`
   line with your real endpoint.

If you'd rather not use a third-party form service, a plain `mailto:`
link works too, though it opens the visitor's email client instead of
submitting in-page.

## 6. Add blog posts

`blog.html` has no CMS — each post is just an `<article class="post">`
block. Copy one of the existing three, edit the date/title/text, and
paste it above the others so posts stay newest-first.

## 7. Customize the look

Colors, fonts, and spacing all live at the top of `css/style.css` as
CSS custom properties (the `:root { ... }` block). Changing a color
there updates it everywhere it's used.

## Notes

- Leaflet (the map library) and its GPX plugin load from a public CDN
  (unpkg.com) via `<script>` tags in `routes.html` — no npm install
  needed.
- The site has no server-side code at all, which is exactly what makes
  free static hosting possible. Anything that needs a real backend
  (user accounts, a database of members) would need a different,
  usually paid, hosting setup.
