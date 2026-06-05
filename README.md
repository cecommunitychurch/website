# Coopers Edge Community Church — Website

This is the source code for [cecommunitychurch.com](https://cecommunitychurch.com), the public website for Coopers Edge Community Church. The site is maintained by a small team and is designed to be straightforward to look after — you don't need to be a developer to make most changes.

---

## Table of contents

1. [How the site works](#how-the-site-works)
2. [Accessing and editing the site](#accessing-and-editing-the-site)
3. [Site structure — what each file does](#site-structure--what-each-file-does)
4. [Updating content](#updating-content)
5. [Events — ChurchSuite sync](#events--churchsuite-sync)
6. [Accounts and access you will need](#accounts-and-access-you-will-need)
7. [Troubleshooting](#troubleshooting)

---

## How the site works

The site is a **static website** — meaning it is made up of plain HTML files (the text and structure), a CSS file (the visual design), and some JavaScript files (interactive behaviour like the navigation menu and events calendar). There is no database and no server-side application to maintain.

**Hosting** is provided by [GitHub Pages](https://pages.github.com/), a free service from GitHub. The source files live in a GitHub repository (think of it as a shared folder with version history), and GitHub automatically publishes whatever is in that repository to the live website. Every time a file is changed and saved to the repository, the website updates within a minute or two.

**Custom domain:** The site is served at `cecommunitychurch.com` rather than the default GitHub address. This is configured via a file called `CNAME` in the root of the repository (it contains just the domain name). The domain itself is managed separately — see [Accounts and access](#accounts-and-access-you-will-need).

**Events data** is pulled automatically from ChurchSuite (the church's administration system) and stored in a file called `data/events.json`. A scheduled automated task fetches fresh data every few hours and updates that file. See [Events — ChurchSuite sync](#events--churchsuite-sync) for details.

---

## Accessing and editing the site

All site files are stored in a GitHub repository at:

> **https://github.com/cecommunitychurch/website**

You will need a GitHub account and to be added as a member of the `cecommunitychurch` organisation (see [Accounts and access](#accounts-and-access-you-will-need)).

### Making simple edits (no technical setup needed)

For straightforward text changes — updating a description, correcting a detail, changing a date — you can edit files directly in the GitHub website without needing any software installed on your computer.

1. Go to the repository on GitHub.
2. Click on the file you want to edit (e.g. `about.html`).
3. Click the pencil icon (✏️ **Edit this file**) in the top-right of the file view.
4. Make your changes in the editor.
5. Scroll to the bottom and click **Commit changes**. Add a brief description of what you changed (e.g. "Update service time on homepage").
6. The site will update automatically within 1–2 minutes.

> **Tip:** If you are nervous about making a mistake, you can always view the file's history in GitHub to see what it looked like before — and revert to an earlier version if needed.

### Making larger changes (with a code editor)

For bigger changes — restructuring a page, adding a new section, updating the visual design — it is easier to work locally on your own computer. This requires:

- **Git** installed on your computer ([download here](https://git-scm.com/))
- A code editor such as [VS Code](https://code.visualstudio.com/) (free)

The basic workflow is:
1. "Clone" the repository to your computer (download a local copy).
2. Make and preview your changes locally by opening the HTML files in a web browser.
3. "Commit" your changes (save them with a description).
4. "Push" your changes back to GitHub — the site updates automatically.

If you are new to Git, GitHub's own [Getting Started guide](https://docs.github.com/en/get-started) is a good introduction.

---

## Site structure — what each file does

```
cecc-website/
├── index.html          Homepage
├── about.html          About page (Vision & Values, History, Who's Who)
├── whats-on.html       What's On page (services, groups, events calendar)
├── giving.html         Giving page (online, bank transfer, Gift Aid)
├── safeguarding.html   Safeguarding information
├── privacy.html        Privacy policy
│
├── css/
│   └── style.css       All visual styles — colours, fonts, layout
│
├── js/
│   ├── main.js         Navigation, scroll effects, tabs
│   └── events.js       Events calendar — loads and displays data/events.json
│
├── data/
│   └── events.json     Upcoming events data (auto-updated from ChurchSuite)
│
├── images/             Photos and graphics used on the site
│
├── scripts/
│   └── sync_churchsuite.py   Script that fetches events from ChurchSuite
│
├── .github/
│   └── workflows/
│       └── sync-churchsuite.yml   Automated workflow that runs the sync script
│
└── CNAME               Contains the custom domain name (cecommunitychurch.com)
```

---

## Updating content

### Text and page content

All page content is in the `.html` files in the root folder. HTML files are plain text files with tags like `<p>paragraph text</p>` or `<h2>Heading</h2>`. You do not need to understand all of it to make simple changes — search for the words you want to change, edit them, and save.

**Things to be careful about:**
- Don't delete or change the surrounding tags (the angle-bracket parts).
- Keep any `class="..."` attributes as they are — these control the visual styling.
- Always preview the change in a browser before considering it done.

### Service times, contact details, and other key facts

These appear in multiple places across the site. Search for the text in question (GitHub's file search will find it) and update each occurrence.

### Images

Images live in the `images/` folder. To replace an image, upload a new file with the same filename — the site will automatically use the new version. To add a new image, upload it to the `images/` folder and reference it in the relevant HTML file with an `<img src="images/your-file.jpg" ...>` tag.

### Adding a new page

1. Copy an existing HTML file (e.g. `about.html`) and rename it.
2. Update the content inside.
3. Add a link to the new page in the navigation section of each existing HTML file (look for the `<nav>` block near the top of each page).

---

## Events — ChurchSuite sync

The **What's On** page and the **This Week** widget on the homepage both display upcoming events. These events are managed in ChurchSuite (the church administration system) and are automatically pulled into the website.

### How it works

1. An external scheduling service ([cron-job.org](https://cron-job.org)) runs on a regular schedule (every few hours) and triggers an automated task on GitHub.
2. That task (called a "GitHub Actions workflow") runs a small script (`scripts/sync_churchsuite.py`) that fetches the latest events from ChurchSuite's public calendar.
3. The script writes the events into a file called `data/events.json` in the repository.
4. GitHub commits and saves that file automatically — no human action required.
5. The website reads `data/events.json` when visitors load the page and displays the events.

**No API key or password is needed** — the script uses ChurchSuite's publicly accessible calendar data (the same data used to power their embeddable calendar widgets).

### Adding or editing events

**Always manage events in ChurchSuite** — changes made there will appear on the website automatically within a few hours. Do not edit `data/events.json` directly; any manual changes will be overwritten next time the sync runs.

### Triggering a manual sync

If you have just added an event in ChurchSuite and want it to appear on the website straight away (without waiting for the next scheduled run):

1. Go to the repository on GitHub.
2. Click the **Actions** tab.
3. Click **Sync ChurchSuite Events** in the left-hand list.
4. Click the **Run workflow** button (top-right of the workflow list), then click the green **Run workflow** button in the dropdown.
5. Wait about 30 seconds, then refresh the page — you should see a new green checkmark indicating the sync ran successfully.
6. The website will update within a minute or two.

### How cron-job.org triggers the sync

The automated schedule is configured in [cron-job.org](https://cron-job.org). It works by sending a signal to GitHub's API at regular intervals, which GitHub recognises as a request to run the workflow. If you need to change the schedule or the cron-job.org account credentials, see [Accounts and access](#accounts-and-access-you-will-need).

### If events stop updating

Check the following in order:

1. **GitHub Actions tab** — look for any red ✗ marks on recent "Sync ChurchSuite Events" runs. Click a failed run to see the error message.
2. **GitHub Actions permissions** — the workflow needs "Read and write" permissions to commit the updated file. Go to repository → **Settings** → **Actions** → **General** → **Workflow permissions**, and ensure **"Read and write permissions"** is selected.
3. **cron-job.org** — log in and check the job is active and has been running without errors.
4. **ChurchSuite** — confirm events exist and are published in the CECC ChurchSuite calendar.

---

## Accounts and access you will need

| Account | Purpose | Who to contact |
|---|---|---|
| **GitHub** (cecommunitychurch org) | Editing and publishing the website | Current site maintainer |
| **Domain registrar** (cecommunitychurch.com) | Renewing the domain, DNS settings | Current site maintainer |
| **cron-job.org** | Scheduling the ChurchSuite sync | Current site maintainer |
| **ChurchSuite** | Managing events that appear on the site | Church administrator |

> **Important:** Do not let the domain name registration lapse — if it expires, the website will go offline. Set a calendar reminder well before the renewal date.

---

## Troubleshooting

### The site is not updating after I made a change

- Check the **Actions** tab on GitHub — look for any failed workflows (red ✗).
- If no workflow ran, GitHub Pages may take up to 2 minutes to rebuild. Try a hard refresh in your browser (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac).
- Check the **Pages** settings: repository → **Settings** → **Pages** — ensure the source is set to "Deploy from a branch" and the branch is `main`.

### The events calendar is empty or shows old data

- Check `data/events.json` in the repository — if it shows events, the issue is with how the page displays them (check the browser console for errors).
- If `data/events.json` is empty or outdated, trigger a manual sync (see above) and check the workflow output for errors.

### The custom domain has stopped working

- Check the `CNAME` file contains `cecommunitychurch.com` (no `https://`, no trailing slash).
- Check the domain registrar's DNS settings — there should be `A` records pointing to GitHub Pages' IP addresses, or a `CNAME` record pointing to `cecommunitychurch.github.io`.
- GitHub's own guidance: [Configuring a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

### I accidentally deleted or broke something

All changes are recorded in Git history. In GitHub:
1. Go to the file that was affected.
2. Click **History** to see all previous versions.
3. Click on the version you want to restore and use **Revert** or copy the old content back manually.

---

*Last updated: June 2026. For questions about the website, contact the church office at info@cecommunitychurch.com.*
