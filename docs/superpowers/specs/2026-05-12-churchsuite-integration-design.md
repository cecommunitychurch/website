# ChurchSuite Integration Design: Approach 1

**Date:** 2026-05-12  
**Status:** Planning (not yet implemented)  
**Scope:** Event listings and widget embedding for CECC website  

---

## Overview

Implement automated event synchronization from ChurchSuite to the website using GitHub Actions and client-side JavaScript rendering. This allows the administrator to update events in ChurchSuite, and changes appear on the website automatically (near real-time) without any code modifications.

**Key constraint:** Administrator should never need to touch code or commit anything to GitHub.

---

## Architecture

### Components

1. **GitHub Actions Workflow** (Automated, runs on schedule)
   - Runs every 5-10 minutes (configurable)
   - Authenticates to ChurchSuite API using credentials stored as GitHub Secrets
   - Fetches event data from ChurchSuite
   - Transforms the data into a JSON format our website understands
   - Writes the JSON to `data/events.json` in the repository
   - Auto-commits and pushes changes (only when data changes)
   - Workflow is hands-off once set up

2. **Data File** (`data/events.json`)
   - Contains all event information from ChurchSuite
   - Updated automatically by GitHub Actions
   - Consumed by JavaScript on the frontend
   - Example structure:
     ```json
     {
       "events": [
         {
           "id": "event-123",
           "title": "Coopers Kids",
           "date": "2026-05-17",
           "startTime": "15:30",
           "endTime": "16:30",
           "location": "The Edge Community Centre",
           "description": "Fun activities for children aged 5-11",
           "leaders": ["Simon", "Jennifer"],
           "capacity": 30,
           "signupStatus": "open",
           "recurring": "weekly"
         }
       ]
     }
     ```

3. **JavaScript Rendering** (`js/events.js`)
   - Loads `data/events.json` on page load
   - Renders events on the dedicated Events page
   - Powers embedded event widgets on other pages
   - Filters by date, recurring status, etc.
   - No page reload required; updates happen as soon as the JSON file changes and the page is refreshed

4. **Events Page** (`events.html`)
   - Dedicated page displaying all upcoming events
   - Filtered/sorted by date
   - Shows detailed information (title, date, time, location, description, leaders, capacity, sign-up status)
   - Uses the `js/events.js` rendering logic

5. **Event Widgets** (Optional, future)
   - "Upcoming Events" widget on home page (next 3 events)
   - "Volunteer Opportunities" section on a community/getting-involved page
   - All reuse the same `js/events.js` and `data/events.json`

---

## How It Works (Step by Step)

1. **Administrator updates ChurchSuite** with new events, changes times, leaders, etc.
2. **GitHub Actions detects the scheduled trigger** (every 5-10 minutes) and runs
3. **Workflow fetches from ChurchSuite API** using a stored API key
4. **Data is transformed and written** to `data/events.json`
5. **Changes are committed and pushed** to the repository (auto-deploys via GitHub Pages)
6. **Website visitors load the Events page** and see the latest data
7. **JavaScript renders the events** from the JSON file
8. **Next time the page loads**, users see any updates from the last GA run

**Update frequency:** Near real-time within the polling interval (5-10 minutes max lag)

---

## Implementation Prerequisites

Before building this, you need to clarify with the administrator:

### ChurchSuite API Access
- [ ] Do they have a ChurchSuite account with API access enabled?
- [ ] What is their ChurchSuite organization/account identifier?
- [ ] Do they have or can they generate an API key for authentication?
- [ ] Which ChurchSuite module contains the events/rotas data? (e.g., "Events," "Resources," "Rotas")

### Event Data Requirements
- [ ] Which events/activities should be included? (All, or specific categories/groups?)
- [ ] What fields are mandatory for display? (title, date, time, location, leaders, capacity, description, sign-up status, recurring pattern)
- [ ] Are there any events that should NOT be displayed publicly?
- [ ] How far ahead should events display? (Next 30 days? 3 months? Ongoing?)
- [ ] Should past events be archived or hidden?

### Recurring Events
- [ ] Does ChurchSuite track recurring events (e.g., "every Sunday 4pm")?
- [ ] How should recurring events be displayed? (Individual instances or as a series?)
- [ ] Should the website show "Sundays 4pm ongoing" or individual upcoming Sundays?

### Sign-up / Volunteering Status
- [ ] Should the website show who's volunteered/signed up?
- [ ] Is capacity/availability tracking needed?
- [ ] Can members sign up directly from the website, or is it informational only?

### Contact/Leader Information
- [ ] Which contact details should be shown? (Names only, or email/phone?)
- [ ] Are there privacy concerns with displaying volunteer names?

---

## Technical Setup (High Level)

1. **GitHub Actions Workflow**
   - Create `.github/workflows/sync-churchsuite.yml`
   - Configure API credentials as GitHub Secrets
   - Set schedule (e.g., `*/5 * * * *` for every 5 minutes)
   - Handle GitHub authentication for auto-commit

2. **Data Directory**
   - Create `data/` directory in repository
   - Add `data/events.json` (initially empty, populated by GA)

3. **JavaScript Module**
   - Create `js/events.js`
   - Function to fetch and parse `data/events.json`
   - Function to render event cards/lists with detailed info
   - Reusable for both page and widgets

4. **Events Page**
   - Create `events.html`
   - Load and render all events from `js/events.js`
   - Style to match existing design system

5. **GitHub Pages Deployment**
   - No changes needed; existing setup will auto-deploy when JSON updates

---

## Future Enhancements

Once the basic event listing works:

- **Embedded widgets** on home page, about page, or community/involvement pages
- **Rota/volunteering schedules** (separate from events)
- **Calendar view** (instead of list)
- **Filtering** (by category, leader, date range)
- **Email notifications** when new events are added
- **Direct sign-up forms** (if ChurchSuite API supports)

---

## Questions for Your Administrator

Before we proceed to implementation, gather these details:

1. **ChurchSuite Configuration**
   - Do you have API access set up in ChurchSuite?
   - Can you provide (or generate) an API key?

2. **Event Scope**
   - Which activities/events should appear on the website?
   - Should all be public, or some restricted?

3. **Data to Display**
   - What information is most important? (Date/time, leaders, capacity, description, recurring schedule)
   - Any privacy constraints on who can be listed?

4. **Update Frequency**
   - Is near-real-time (every 5-10 minutes) acceptable?
   - Or would daily/weekly updates be fine?

5. **Sign-up Integration**
   - Should the website just show events, or allow people to sign up?
   - Is there a preferred way to handle sign-ups? (Link to ChurchSuite, separate form, etc.)

---

## Success Criteria

- [ ] Administrator can update events in ChurchSuite
- [ ] Updates appear on the website within 10 minutes automatically
- [ ] No code changes required by administrator
- [ ] Events page displays all required information clearly
- [ ] Widgets can be embedded on multiple pages using the same data
- [ ] Mobile-responsive design (consistent with existing site)

---

## Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| API key exposure | Store in GitHub Secrets, never in code |
| API rate limiting | Check ChurchSuite API limits; adjust polling frequency if needed |
| Workflow failures | Monitor GA logs; set up email alerts for failures |
| Data transformation errors | Validate JSON schema; add error handling in JS |
| Administrator needs urgent changes | Can manually update JSON temporarily if GA fails (but this should be rare) |

---

## Related Docs

- ChurchSuite API documentation (to be gathered from administrator)
- Existing site design system: `css/style.css` (for styling event cards)
- Current JavaScript patterns: `js/main.js` (for rendering approach)
