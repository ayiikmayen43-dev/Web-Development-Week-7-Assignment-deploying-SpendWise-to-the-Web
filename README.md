# SpendWise

## Project Description

SpendWise is a simple, private personal expense tracker that runs entirely in the browser. Users can:

- Add expenses with a description, amount, category and date
- Set a monthly budget and watch a progress meter fill as they spend
- See totals, remaining budget and a per-category spending breakdown
- Filter expenses by month and category
- Delete entries and export the current view to a CSV file

All data is saved in the browser's `localStorage`, so each visitor's spending stays on their own device and no account is needed.

## Technologies Used

- **HTML5** – page structure and forms
- **CSS3** – custom responsive styling (Grid, Flexbox, media queries)
- **Vanilla JavaScript (ES6+)** – app logic, rendering and `localStorage` persistence
- **Google Fonts** – Fraunces and Inter
- **Git & GitHub** – version control and source hosting
- **Netlify** – hosting, HTTPS and continuous deployment

## GitHub Repository Information

- **Repository:** `https://github.com/<your-username>/spendwise` <!-- replace with your public repo link -->
- **Visibility:** Public
- **Default branch:** `main` (every push to `main` triggers a Netlify production deploy)

### Project structure

```
spendwise/
├── index.html      # Main page (hero, tracker, insights, expense list)
├── styles.css      # All styling
├── app.js          # Expense tracker logic
├── 404.html        # Custom "page not found" page
├── assets/
│   └── favicon.svg # Logo / favicon
├── netlify.toml    # Netlify build + security header settings
└── README.md
```

## Live Netlify Website URL

**https://spendwise-deployment-a7f0b3.netlify.app**

## Running Locally

No build step or dependencies are required.

```bash
git clone https://github.com/<your-username>/spendwise.git
cd spendwise
# open index.html directly, or serve the folder:
npx serve .
```

## Deployment Process Summary

1. **Prepared the project** – organised the files at the repository root (`index.html`, `styles.css`, `app.js`, `assets/`) and used root-relative paths so assets load correctly on Netlify.
2. **Added `netlify.toml`** – set the publish directory to the project root (`.`) with no build command, and added basic security headers.
3. **Pushed to GitHub** – initialised Git, committed the project and pushed it to a public GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial SpendWise commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/spendwise.git
   git push -u origin main
   ```
4. **Connected Netlify to GitHub** – in Netlify: *Add new project → Import an existing project → GitHub*, authorised Netlify, selected the SpendWise repository, left the build command empty, and set the publish directory to `.`.
5. **Deployed** – Netlify built and published the site and issued a free HTTPS certificate at `https://spendwise-deployment-a7f0b3.netlify.app`.
6. **Tested the live site** – checked adding, filtering, deleting and exporting expenses; setting a budget; data persisting after a page refresh; the custom 404 page; and the layout on desktop and mobile screen sizes.
7. **Verified automatic deployment** – made an update (e.g. edited the footer/About text), committed and pushed to `main`, then watched the **Deploys** tab in Netlify start a new production deploy automatically and confirmed the change was visible on the live URL.

## Testing Checklist

| Test | Result |
| --- | --- |
| Page loads over HTTPS on the live URL | ✅ |
| Add an expense (valid input) | ✅ |
| Validation rejects empty description / zero amount | ✅ |
| Budget saves and progress meter updates | ✅ |
| Month and category filters work | ✅ |
| Delete an expense | ✅ |
| Export CSV downloads a file | ✅ |
| Data persists after refresh | ✅ |
| Unknown URL shows custom 404 page | ✅ |
| Responsive layout on mobile | ✅ |
| Push to `main` triggers automatic redeploy | ✅ |

## Challenges Encountered During Deployment

- **Broken asset paths** – relative paths that worked when opening the file locally needed to be checked so CSS, JavaScript and the favicon loaded correctly from the deployed site; switching to root-relative paths (`/styles.css`) fixed this.
- **Publish directory settings** – Netlify initially needed to know there was no build step; setting the publish directory to `.` (in `netlify.toml`) made deploys consistent.
- **GitHub authorisation** – Netlify had to be granted access to the repository before it appeared in the import list.
- **Browser caching** – after pushing an update, the old version sometimes appeared until a hard refresh (Ctrl/Cmd + Shift + R).
- **Data not shared between devices** – because SpendWise stores data in `localStorage`, expenses added locally did not appear on the live site or on another device; this is expected behaviour for a private, browser-based tracker.

> ✏️ Update this section with any additional issues you personally ran into.

## Lessons Learned

- Connecting a GitHub repository to Netlify gives **continuous deployment**: every push to `main` publishes a new version with no manual uploads.
- A `netlify.toml` file keeps deployment settings in version control, so they are documented and repeatable.
- Netlify's deploy log and **Deploys** history make it easy to troubleshoot and roll back to an earlier version.
- Testing on the live URL (not only locally) catches path, caching and HTTPS issues early.
- Small, frequent commits with clear messages make it easy to see which change triggered which deploy.

## Author

<!-- Add your name and course details here -->
