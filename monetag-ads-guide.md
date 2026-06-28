# Monetag Ads Implementation Guide

A complete reference for adding Monetag ads to any website.

---

## 1. Setup — Verify Your Website

1. Sign up at [monetag.com](https://monetag.com)
2. Go to **Sites** → **Add Site** → enter your domain
3. Add their verification meta tag inside `<head>` and wait for approval
4. Once approved, go to **Ad Zones** to create zones

---

## 2. Ad Zone Types

| Format | Visibility | Revenue | How It Works |
|---|---|---|---|
| **Popunder** | Auto | Highest ($1–5+ CPM) | Opens a full ad tab behind the browser on any click |
| **Interstitial** | Auto | High ($2–8+ CPM) | Full-screen overlay between page transitions |
| **In-Page Push** | Auto | Medium ($0.5–2 CPM) | Floating notification card appears in corner |
| **Vignette Banner** | Auto | Medium | Overlay banner shown occasionally |
| **Direct Link** | Manual | Low–Medium | A URL that earns when opened in a new tab |

> **Direct Link zones give you a URL like `https://omg10.com/4/XXXXXXX`** — they earn revenue when that URL is opened. They do NOT show any visible ad on the page by themselves.

---

## 3. Getting Your Zone Scripts

After creating a zone in the Monetag dashboard, it gives you a `<script>` tag. Copy it exactly.

### Popunder example
```html
<script src="https://5gvci.com/act/files/tag.min.js?z=ZONE_ID" data-cfasync="false" async></script>
```
Place inside `<head>`.

### In-Page Push example
```html
<script>(function(s){s.dataset.zone='ZONE_ID',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>
```
Place before `</body>`.

### Direct Link
Just a URL: `https://omg10.com/4/ZONE_ID`  
Open it in a new tab on a user click to earn.

---

## 4. Implementation — Paste Into Your HTML

### 4.1 Popunder (place in `<head>`)

```html
<!-- Monetag Popunder -->
<script src="https://5gvci.com/act/files/tag.min.js?z=YOUR_ZONE_ID" data-cfasync="false" async></script>
```

Fires automatically on the first click anywhere on the page. No extra code needed.

---

### 4.2 Direct Link — onClick Triggers (place before `</body>`)

Attach Direct Link URLs to user actions like button clicks. Use a cooldown to avoid opening the same ad twice quickly.

```html
<script>
(function() {
  var zones = [
    'https://omg10.com/4/ZONE_ID_1',
    'https://omg10.com/4/ZONE_ID_2',
    'https://omg10.com/4/ZONE_ID_3'
  ];
  var COOLDOWN = 3 * 60 * 1000; // 3 minutes per zone
  var lastOpened = {};

  function tryOpen(zone) {
    var now = Date.now();
    if (!lastOpened[zone] || now - lastOpened[zone] > COOLDOWN) {
      window.open(zone, '_blank', 'noopener,noreferrer');
      lastOpened[zone] = now;
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Zone 1 — fires on primary CTA buttons
    document.querySelectorAll('.btn-primary, .nav-cta').forEach(function(el) {
      el.addEventListener('click', function() { tryOpen(zones[0]); });
    });
    // Zone 2 — fires on secondary buttons / cards
    document.querySelectorAll('.card, .btn-secondary').forEach(function(el) {
      el.addEventListener('click', function() { tryOpen(zones[1]); });
    });
    // Zone 3 — fires on footer / social links
    document.querySelectorAll('.social-link, footer a').forEach(function(el) {
      el.addEventListener('click', function() { tryOpen(zones[2]); });
    });
  });
})();
</script>
```

> Replace `.btn-primary`, `.card`, etc. with the actual CSS selectors in your website.

---

### 4.3 Bottom Sticky Ad Bar (place before `</body>`)

A fixed bar at the bottom of the page with rotating ad slides. Highly visible, non-intrusive.

**Behavior:**
- Slides rotate every **5 seconds**
- User can close it with the **✕** button
- After closing, it **automatically reappears after 30 seconds**
- To change the reappear delay, edit `30000` in the JS (value is in milliseconds — e.g. `60000` = 1 min)
- **Visible on both desktop and mobile** — on mobile the "AD / Sponsored" meta label is hidden to save space, but the slides and button remain fully visible

```html
<!-- Bottom Sticky Bar CSS -->
<style>
#mtag-bar {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999;
  background: #0B1120; border-top: 1px solid rgba(244,185,66,0.3);
  display: flex; align-items: center; gap: 12px;
  padding: 10px 16px; transition: transform 0.3s ease;
}
#mtag-bar.hidden { transform: translateY(100%); }
#mtag-bar-meta { display: flex; flex-direction: column; align-items: flex-start; flex-shrink: 0; }
.mtag-ad-chip {
  display: inline-block; background: rgba(244,185,66,0.15);
  border: 1px solid rgba(244,185,66,0.4); color: #F4B942;
  font-size: 0.55rem; font-weight: 800; padding: 1px 5px;
  border-radius: 4px; letter-spacing: 0.08em;
}
#mtag-bar-label { font-size: 0.6rem; color: #475569; margin-top: 2px; }
#mtag-bar-slides { flex: 1; min-width: 0; position: relative; height: 44px; }
.mtag-slide {
  position: absolute; inset: 0;
  display: flex; align-items: center; gap: 10px;
  opacity: 0; transition: opacity 0.5s ease; pointer-events: none;
}
.mtag-slide.active { opacity: 1; pointer-events: all; }
.mtag-slide-icon { font-size: 1.3rem; flex-shrink: 0; }
.mtag-slide-text { font-size: 0.78rem; color: #CBD5E1; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mtag-slide-btn {
  background: linear-gradient(135deg,#F4B942,#E8A020); color: #0B1120;
  border: none; border-radius: 6px; padding: 6px 14px;
  font-size: 0.72rem; font-weight: 700; cursor: pointer; flex-shrink: 0;
}
#mtag-bar-close {
  background: none; border: none; color: #475569; cursor: pointer;
  font-size: 1rem; padding: 4px; flex-shrink: 0;
}
/* Mobile — keep bar visible, tighten layout */
@media(max-width:600px){
  #mtag-bar { padding: 8px 10px; gap: 8px; }
  #mtag-bar-meta { display: none; }
  #mtag-bar-slides { height: 40px; }
  .mtag-slide-icon { font-size: 1.1rem; }
  .mtag-slide-text { font-size: 0.7rem; }
  .mtag-slide-btn { padding: 5px 10px; font-size: 0.65rem; }
}
</style>

<!-- Bottom Bar HTML -->
<div id="mtag-bar">
  <div id="mtag-bar-meta">
    <span class="mtag-ad-chip">AD</span>
    <span id="mtag-bar-label">Sponsored</span>
  </div>
  <div id="mtag-bar-slides">
    <div class="mtag-slide active">
      <span class="mtag-slide-icon">🔥</span>
      <span class="mtag-slide-text"><strong>Hot Deal:</strong> Exclusive offers handpicked for you</span>
      <button class="mtag-slide-btn" onclick="mtagOpen('https://omg10.com/4/ZONE_ID_1')">Claim Now →</button>
    </div>
    <div class="mtag-slide">
      <span class="mtag-slide-icon">🎁</span>
      <span class="mtag-slide-text"><strong>Special Reward:</strong> You've been selected for a bonus</span>
      <button class="mtag-slide-btn" onclick="mtagOpen('https://omg10.com/4/ZONE_ID_2')">Get It →</button>
    </div>
    <div class="mtag-slide">
      <span class="mtag-slide-icon">💰</span>
      <span class="mtag-slide-text"><strong>Earn Online:</strong> Work from home opportunities available</span>
      <button class="mtag-slide-btn" onclick="mtagOpen('https://omg10.com/4/ZONE_ID_3')">Start →</button>
    </div>
  </div>
  <button id="mtag-bar-close" title="Close">✕</button>
</div>

<!-- Bottom Bar JS -->
<script>
(function(){
  function mtagOpen(url){ window.open(url,'_blank','noopener,noreferrer'); }
  window.mtagOpen = mtagOpen;

  var bar = document.getElementById('mtag-bar');
  var slides = bar.querySelectorAll('.mtag-slide');
  var current = 0;

  setInterval(function(){
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 5000);

  document.getElementById('mtag-bar-close').addEventListener('click', function(){
    bar.classList.add('hidden');
    // Reappear after 30 seconds
    setTimeout(function(){ bar.classList.remove('hidden'); }, 30000);
  });
})();
</script>
```

---

### 4.4 Side Floating Ad Widgets — Right & Left (place before `</body>`)

**Desktop:** Narrow slide-out panels (110px) on left and right edges, auto-open after 8s, rotate every 5s.  
**Mobile:** Converts to small floating corner buttons just above the bottom bar — tap opens the ad directly. No panel needed on small screens.

```html
<!-- Side Widget CSS -->
<style>
/* ── Desktop layout ── */
.mtag-side-widget {
  position: fixed; top: 50%; transform: translateY(-50%);
  z-index: 9990; display: flex; align-items: stretch;
}
#mtag-side-r { right: 0; flex-direction: row-reverse; }
#mtag-side-l { left: 0; flex-direction: row; }

.mtag-side-tab {
  background: linear-gradient(180deg,#F4B942,#E8A020);
  color: #0B1120; font-size: 0.6rem; font-weight: 800;
  padding: 12px 8px; cursor: pointer; border-radius: 8px 0 0 8px;
  letter-spacing: 0.1em; writing-mode: vertical-lr; user-select: none;
}
#mtag-side-l .mtag-side-tab {
  background: linear-gradient(180deg,#06B6D4,#0284C7);
  border-radius: 0 8px 8px 0; transform: rotate(180deg);
}

.mtag-side-panel {
  width: 110px; background: #0B1120;
  border: 1px solid rgba(244,185,66,0.3);
  overflow: hidden; max-width: 0; opacity: 0;
  padding-left: 0; padding-right: 0;
  transition: max-width 0.4s ease, opacity 0.4s ease, padding 0.4s ease;
}
.mtag-side-panel.open { max-width: 110px; opacity: 1; padding: 10px; }
#mtag-side-r .mtag-side-panel { border-right: none; border-radius: 8px 0 0 8px; }
#mtag-side-l .mtag-side-panel { border-left: none; border-radius: 0 8px 8px 0; }

.mtag-side-panel-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
}
.mtag-side-panel-title { font-size: 0.6rem; color: #475569; text-transform: uppercase; letter-spacing: 0.06em; }

.mtag-side-slide { display: none; }
.mtag-side-slide.active { display: block; }
.mtag-side-slide-icon { font-size: 1.4rem; display: block; text-align: center; margin-bottom: 4px; }
.mtag-side-slide-title { font-size: 0.7rem; font-weight: 700; color: #F1F5F9; margin-bottom: 4px; }
.mtag-side-slide-text  { font-size: 0.63rem; color: #94A3B8; line-height: 1.3; margin-bottom: 8px; }
.mtag-side-slide-btn {
  display: block; width: 100%; background: linear-gradient(135deg,#F4B942,#E8A020);
  color: #0B1120; border: none; border-radius: 5px;
  padding: 5px 4px; font-size: 0.63rem; font-weight: 700; cursor: pointer; text-align: center;
}
#mtag-side-l .mtag-side-slide-btn { background: linear-gradient(135deg,#06B6D4,#0284C7); color: #fff; }

/* ── Mobile: convert to floating corner buttons above the bottom bar ── */
@media(max-width:768px){
  .mtag-side-widget {
    top: auto; bottom: 58px; transform: none;
    flex-direction: column; align-items: flex-end;
  }
  #mtag-side-l { align-items: flex-start; }
  .mtag-side-panel { display: none; }        /* no panel on mobile */
  .mtag-side-tab {
    writing-mode: horizontal-tb; transform: none !important;
    width: 48px; height: 48px; padding: 0;
    border-radius: 10px; display: flex;
    align-items: center; justify-content: center;
    font-size: 1.2rem; letter-spacing: 0;    /* show emoji icon instead of "AD" text */
    border-radius: 50%;
  }
}
</style>

<!-- Right Side Widget -->
<div id="mtag-side-r" class="mtag-side-widget">
  <div class="mtag-side-tab" id="mtag-tab-r" onclick="mtagTabClick('r')">AD</div>
  <div class="mtag-side-panel" id="mtag-panel-r">
    <div class="mtag-side-panel-header">
      <span class="mtag-side-panel-title">Sponsored</span>
      <span class="mtag-ad-chip">AD</span>
    </div>
    <div class="mtag-side-slide active" data-url="https://omg10.com/4/ZONE_ID_1">
      <span class="mtag-side-slide-icon">🔥</span>
      <div class="mtag-side-slide-title">Hot Deal</div>
      <div class="mtag-side-slide-text">Exclusive offers just for you</div>
      <button class="mtag-side-slide-btn" onclick="mtagOpen('https://omg10.com/4/ZONE_ID_1')">Claim →</button>
    </div>
    <div class="mtag-side-slide" data-url="https://omg10.com/4/ZONE_ID_2">
      <span class="mtag-side-slide-icon">🎁</span>
      <div class="mtag-side-slide-title">Reward</div>
      <div class="mtag-side-slide-text">Special bonus selected for you</div>
      <button class="mtag-side-slide-btn" onclick="mtagOpen('https://omg10.com/4/ZONE_ID_2')">Get It →</button>
    </div>
    <div class="mtag-side-slide" data-url="https://omg10.com/4/ZONE_ID_3">
      <span class="mtag-side-slide-icon">💰</span>
      <div class="mtag-side-slide-title">Earn Cash</div>
      <div class="mtag-side-slide-text">Work from anywhere online</div>
      <button class="mtag-side-slide-btn" onclick="mtagOpen('https://omg10.com/4/ZONE_ID_3')">Start →</button>
    </div>
  </div>
</div>

<!-- Left Side Widget -->
<div id="mtag-side-l" class="mtag-side-widget">
  <div class="mtag-side-tab" id="mtag-tab-l" onclick="mtagTabClick('l')" style="writing-mode:vertical-lr;transform:rotate(180deg)">AD</div>
  <div class="mtag-side-panel" id="mtag-panel-l">
    <div class="mtag-side-panel-header">
      <span class="mtag-side-panel-title">Sponsored</span>
      <span class="mtag-ad-chip">AD</span>
    </div>
    <div class="mtag-side-slide active" data-url="https://omg10.com/4/ZONE_ID_1">
      <span class="mtag-side-slide-icon">🚀</span>
      <div class="mtag-side-slide-title">Level Up</div>
      <div class="mtag-side-slide-text">Tools to grow your income fast</div>
      <button class="mtag-side-slide-btn" onclick="mtagOpen('https://omg10.com/4/ZONE_ID_1')">Explore →</button>
    </div>
    <div class="mtag-side-slide" data-url="https://omg10.com/4/ZONE_ID_2">
      <span class="mtag-side-slide-icon">⚡</span>
      <div class="mtag-side-slide-title">Smart Deal</div>
      <div class="mtag-side-slide-text">Flash offer ending very soon</div>
      <button class="mtag-side-slide-btn" onclick="mtagOpen('https://omg10.com/4/ZONE_ID_2')">View →</button>
    </div>
    <div class="mtag-side-slide" data-url="https://omg10.com/4/ZONE_ID_3">
      <span class="mtag-side-slide-icon">🌟</span>
      <div class="mtag-side-slide-title">Top Rated</div>
      <div class="mtag-side-slide-text">Most popular pick this week</div>
      <button class="mtag-side-slide-btn" onclick="mtagOpen('https://omg10.com/4/ZONE_ID_3')">See →</button>
    </div>
  </div>
</div>

<!-- Side Widgets JS -->
<script>
(function(){
  var panelState = { r: false, l: false };
  var isMobile = function(){ return window.innerWidth <= 768; };

  // On mobile: tap opens the active slide's URL directly
  // On desktop: tap toggles the panel open/close
  window.mtagTabClick = function(side) {
    if (isMobile()) {
      var active = document.querySelector('#mtag-panel-' + side + ' .mtag-side-slide.active');
      if (active) window.open(active.dataset.url, '_blank', 'noopener,noreferrer');
    } else {
      panelState[side] = !panelState[side];
      document.getElementById('mtag-panel-' + side).classList.toggle('open', panelState[side]);
    }
  };

  function rotateSlides(panelId, tabId) {
    var slides = document.querySelectorAll('#' + panelId + ' .mtag-side-slide');
    var tab    = document.getElementById(tabId);
    var cur = 0;
    setInterval(function(){
      slides[cur].classList.remove('active');
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add('active');
      // On mobile update the tab icon to match current slide
      if (isMobile()) {
        var icon = slides[cur].querySelector('.mtag-side-slide-icon');
        if (icon) tab.textContent = icon.textContent;
      }
    }, 5000);
    // Set initial icon on mobile
    if (isMobile() && slides[0]) {
      var icon = slides[0].querySelector('.mtag-side-slide-icon');
      if (icon) tab.textContent = icon.textContent;
    }
  }

  rotateSlides('mtag-panel-r', 'mtag-tab-r');
  rotateSlides('mtag-panel-l', 'mtag-tab-l');

  // Desktop only: auto-open panels after 8 seconds
  setTimeout(function(){
    if (!isMobile()) {
      panelState.r = true; panelState.l = true;
      document.getElementById('mtag-panel-r').classList.add('open');
      document.getElementById('mtag-panel-l').classList.add('open');
    }
  }, 8000);
})();
</script>
```

---

### 4.5 Rotating Push Notification Cards — Top Right (place before `</body>`)

A pool of notifications that cycle every 5 seconds, sliding in from the right. No dependency on Monetag's server frequency cap.

```html
<!-- Push Notification CSS -->
<style>
#cpush-wrap {
  position: fixed; top: 80px; right: 16px; z-index: 9990;
  display: flex; flex-direction: column; gap: 8px; width: 300px;
  pointer-events: none;
}
.cpush-card {
  background: #1E293B; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px; padding: 11px 12px;
  display: flex; align-items: flex-start; gap: 10px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.5);
  cursor: pointer; pointer-events: all;
  animation: cpushIn 0.4s cubic-bezier(.22,.68,0,1.2) forwards;
}
.cpush-card.out { animation: cpushOut 0.35s ease forwards; }
@keyframes cpushIn  { from { transform: translateX(110%); opacity:0; } to { transform: translateX(0); opacity:1; } }
@keyframes cpushOut { from { transform: translateX(0); opacity:1; } to { transform: translateX(110%); opacity:0; } }
.cpush-icon  { font-size: 1.5rem; flex-shrink: 0; line-height: 1; }
.cpush-body  { flex: 1; min-width: 0; }
.cpush-title { font-size: 0.78rem; font-weight: 700; color: #F1F5F9; margin-bottom: 3px; }
.cpush-text  { font-size: 0.7rem; color: #94A3B8; line-height: 1.35; }
.cpush-close {
  color: #475569; font-size: 0.7rem; cursor: pointer;
  padding: 2px 4px; border-radius: 4px; flex-shrink: 0; pointer-events: all;
}
.cpush-close:hover { color: #94A3B8; background: rgba(255,255,255,0.05); }
@media(max-width:480px){ #cpush-wrap{ width: calc(100vw - 32px); } }
</style>

<!-- Push Notification Container -->
<div id="cpush-wrap"></div>

<!-- Push Notification JS -->
<script>
(function(){
  var zones = [
    'https://omg10.com/4/ZONE_ID_1',
    'https://omg10.com/4/ZONE_ID_2',
    'https://omg10.com/4/ZONE_ID_3'
  ];
  var pool = [
    { icon:'🔥', title:'Hot Deal Alert!',      text:'Exclusive offers waiting — claim before they expire!', url:zones[0] },
    { icon:'🎁', title:'You\'ve Been Selected', text:'A special reward is available for you today only.',   url:zones[1] },
    { icon:'💰', title:'Earn Extra Cash',       text:'Work from anywhere. Start earning in minutes.',        url:zones[2] },
    { icon:'🚀', title:'Level Up Today',        text:'Discover tools to grow your income fast.',             url:zones[0] },
    { icon:'⚡', title:'Flash Offer',           text:'Limited-time deal ending very soon. Don\'t miss it!', url:zones[1] },
    { icon:'🌟', title:'Top Rated Pick',        text:'See why thousands of people are talking about this.',  url:zones[2] },
    { icon:'🎯', title:'Just For You',          text:'Personalised offers matched to your interests.',       url:zones[0] },
    { icon:'💎', title:'Premium Access',        text:'Unlock exclusive content — free for a limited time.',  url:zones[1] },
  ];
  var idx = 0;
  var wrap = document.getElementById('cpush-wrap');

  function makeCard(data) {
    var card = document.createElement('div');
    card.className = 'cpush-card';
    card.innerHTML =
      '<span class="cpush-icon">' + data.icon + '</span>' +
      '<div class="cpush-body">' +
        '<div class="cpush-title">' + data.title + '</div>' +
        '<div class="cpush-text">'  + data.text  + '</div>' +
      '</div>' +
      '<span class="cpush-close">✕</span>';
    card.querySelector('.cpush-close').addEventListener('click', function(e) {
      e.stopPropagation(); removeCard(card);
    });
    card.addEventListener('click', function() {
      window.open(data.url, '_blank', 'noopener,noreferrer');
    });
    return card;
  }

  function removeCard(card) {
    card.classList.add('out');
    setTimeout(function(){ if (card.parentNode) card.parentNode.removeChild(card); }, 350);
  }

  function rotatePush() {
    Array.from(wrap.children).forEach(function(c){ removeCard(c); });
    setTimeout(function(){
      wrap.appendChild(makeCard(pool[idx % pool.length])); idx++;
      setTimeout(function(){
        wrap.appendChild(makeCard(pool[idx % pool.length])); idx++;
      }, 200);
    }, 360);
  }

  // First show after 3s, then every 5s
  setTimeout(function(){
    rotatePush();
    setInterval(rotatePush, 5000);
  }, 3000);
})();
</script>
```

---

## 5. Full Placement Summary

```
<head>
  ...
  <!-- Popunder script -->
  <script src="https://5gvci.com/act/files/tag.min.js?z=ZONE_ID" data-cfasync="false" async></script>
</head>

<body>
  ... (your page content) ...

  <!-- Bottom Bar HTML + CSS -->
  <!-- Right Side Widget HTML + CSS -->
  <!-- Left Side Widget HTML + CSS -->
  <!-- Push Notification container + CSS -->

  <!-- All JS scripts -->
  <!-- Direct Link onclick triggers -->
  <!-- Bottom Bar JS -->
  <!-- Side Widgets JS -->
  <!-- Push Notification JS -->

</body>
```

---

## 6. Replace Zone IDs

Every code block above uses placeholder IDs. Replace them with your real zone IDs from the Monetag dashboard:

| Placeholder | Replace With |
|---|---|
| `ZONE_ID` (Popunder) | Your Popunder zone number |
| `ZONE_ID_1` | First Direct Link zone number |
| `ZONE_ID_2` | Second Direct Link zone number |
| `ZONE_ID_3` | Third Direct Link zone number |

The Direct Link URL format is always: `https://omg10.com/4/YOUR_ZONE_ID`

---

## 7. Tips

- Always label ads with an **"AD"** chip — required by most ad policies and builds user trust
- Side widgets show on **both desktop and mobile** — on desktop they slide out as panels, on mobile they become small floating corner buttons that open the ad on tap
- Use a **3-minute cooldown** on Direct Link openers so the same user isn't spammed
- **Popunder earns the most** — always include it if your niche allows it
- The rotating push cards and side widgets use **Direct Link zones** so they earn on click
- Do not auto-click Direct Links programmatically — that violates Monetag TOS
- The **bottom bar reappears 30 seconds** after the user closes it — change `30000` in the JS to adjust the delay
