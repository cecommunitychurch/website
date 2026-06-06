#!/usr/bin/env python3
"""
Fetch upcoming events from ChurchSuite public embed API and write to data/events.json.

No API key required — uses the public embed endpoint.

Local use:  python scripts/sync_churchsuite.py
GitHub Actions: runs automatically on schedule, no secrets needed.
"""

import html
import json
import re
import sys
from datetime import date, timedelta
from pathlib import Path

try:
    import requests
except ImportError:
    print("Error: 'requests' not installed. Run: pip install requests", file=sys.stderr)
    sys.exit(1)

EMBED_URL = "https://cecommunitychurch.churchsuite.com/embed/calendar/json"

today = date.today()
date_end = today + timedelta(days=121)

print(f"Fetching ChurchSuite events for {today} → {date_end}...")

try:
    response = requests.get(
        EMBED_URL,
        params={
            "date_start": today.isoformat(),
            "date_end": date_end.isoformat(),
            "num_results": 100,
        },
        timeout=30,
    )
    response.raise_for_status()
    raw = response.json()
except requests.RequestException as e:
    print(f"Error fetching from ChurchSuite: {e}", file=sys.stderr)
    sys.exit(1)

# Response is a direct array or {"events": [...]}
events_raw = raw if isinstance(raw, list) else raw.get('events', [])


def strip_html(raw_html):
    """Convert ChurchSuite HTML descriptions to plain text with paragraph breaks."""
    if not raw_html:
        return ''
    text = re.sub(r'</p>', '\n\n', raw_html, flags=re.IGNORECASE)
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<[^>]+>', '', text)
    text = html.unescape(text).replace(' ', ' ')
    text = '\n'.join(line.strip() for line in text.split('\n'))
    return re.sub(r'\n{3,}', '\n\n', text).strip()


def categorise(event):
    name = (event.get('name') or '').lower()
    cat_name = (event.get('category') or {}).get('name', '').lower() if isinstance(event.get('category'), dict) else ''
    text = name + ' ' + cat_name
    if any(k in text for k in ('sunday', 'gathering', 'equip', 'celebrate')):
        return 'sunday'
    if any(k in text for k in ('children', 'kids', 'coopers')):
        return 'childrens'
    if any(k in text for k in ('ark', 'toddler', 'baby', 'parent')):
        return 'toddler'
    if 'prayer' in text:
        return 'prayer'
    return 'general'


def _safe_colour(value):
    c = str(value).strip()
    return c if re.match(r'^#[0-9a-fA-F]{3,8}$', c) else ''


def parse_image(event):
    """Extract the best available image URL from a ChurchSuite event.

    The embed API returns images as a dict where each size key maps to
    an object with a 'url' field, e.g. {"lg": {"url": "https://...", "px": 1024}}.
    """
    images = event.get('images')
    if isinstance(images, dict):
        for size in ('lg', 'md', 'sm', 'original'):
            val = images.get(size)
            if isinstance(val, dict) and val.get('url'):
                return val['url']
            if isinstance(val, str) and val.startswith('http'):
                return val
        # Fallback: scan all values for a direct URL string
        for val in images.values():
            if isinstance(val, str) and val.startswith('http'):
                return val
    if isinstance(images, str) and images.startswith('http'):
        return images
    img = event.get('image')
    if isinstance(img, str) and img.startswith('http'):
        return img
    return ''


def parse_location(event):
    loc = event.get('location')
    if isinstance(loc, dict):
        if loc.get('type') == 'online':
            return loc.get('name') or 'Online'
        return loc.get('name') or loc.get('address') or ''
    return str(loc).strip() if loc else ''


def parse_time(dt_str):
    """Extract HH:MM from 'YYYY-MM-DD HH:MM:SS'."""
    if not dt_str or ' ' not in str(dt_str):
        return ''
    return str(dt_str).split(' ')[1][:5]


events_out = []
for e in events_raw:
    dt_start = e.get('datetime_start', '')
    dt_end = e.get('datetime_end', '')
    date_str = str(dt_start)[:10] if dt_start else ''
    if not date_str:
        continue
    cat = e.get('category') if isinstance(e.get('category'), dict) else {}
    events_out.append({
        "id": str(e.get('id', '')),
        "title": (e.get('name') or 'Untitled event').strip(),
        "date": date_str,
        "startTime": parse_time(dt_start),
        "endTime": parse_time(dt_end),
        "location": parse_location(e),
        "description": strip_html(e.get('description') or ''),
        "category": categorise(e),
        "categoryLabel": (cat.get('name') or '').strip(),
        "categoryColour": _safe_colour((cat.get('color') or cat.get('colour') or '')),
        "imageUrl": parse_image(e),
    })

events_out.sort(key=lambda x: x['date'])

output = {
    "lastUpdated": today.isoformat() + "T00:00:00Z",
    "events": events_out,
}

output_path = Path(__file__).parent.parent / 'data' / 'events.json'
output_path.parent.mkdir(exist_ok=True)
output_path.write_text(json.dumps(output, indent=2, ensure_ascii=False) + '\n')

print(f"Done — wrote {len(events_out)} events to {output_path}")
