# 🎯 Team 15 Demo Pitch Presentation

## Quick 5-Minute Demo for Competitions/Judges

This is a **concise pitch presentation** designed for:
- 🏆 Hackathon demos
- 🎤 Demo day presentations
- 📊 Investor pitches
- 🎓 Class presentations

**Total time**: ~5 minutes

---

## 🚀 Quick Start

### Open the Presentation:
```bash
cd team-15-app/slides/non-technical
open pitch.html              # macOS
xdg-open pitch.html          # Linux
start pitch.html             # Windows
```

Or serve locally:
```bash
python3 -m http.server 8082
```

Then open: **http://localhost:8082**

---

## 📚 The Script (Follow This!)

### SLIDE 1: Title (10 seconds)
> "Hi, we're Team 15, and this is ReVive."

---

### SLIDE 2: HOOK (30 seconds)

**Problem in one sentence:**
> "50 million tons of electronics get thrown away every year."

**Who hurts:**
> "Families who can't afford devices. Our planet drowning in e-waste."

**Why it matters:**
> "Perfectly good phones and laptops sit in drawers while students can't do homework."

---

### SLIDE 3: SOLUTION (30 seconds)

**We built:**
> "ReVive — a free platform that connects donors with people who need devices."

**For:**
> "Anyone with old electronics to give, and anyone who needs them."

**Simple flow:**
> "List → Connect → Reuse"

---

### SLIDE 4: DEMO INTRO (15 seconds)

> "Let me show you how it works."
> "Follow along at [YOUR LIVE URL]"
> "Sarah has an old iPad. A teacher needs one for class."

---

### SLIDE 5: DEMO STEP 1 (60 seconds)

**Live demo on your running app:**

> "Watch: I click 'Donate Item'..."

**Do this LIVE:**
1. Navigate to donate page
2. Fill out form (use sample data)
3. Take/upload a photo
4. Click "Post"

**Say:**
> "In 30 seconds, Sarah's iPad is listed and visible to people nearby."

---

### SLIDE 6: DEMO STEPS 2 & 3 (120 seconds)

**Continue LIVE demo:**

> "Now, the teacher sees it and clicks 'Request'..."

**Do this LIVE:**
1. Switch to teacher's view (or show notification)
2. Click "Request"
3. Show chat/messaging
4. Show pickup scheduling

**The payoff:**
> "They meet at a coffee shop, hand off the iPad, and now 30 students have a device for class. That's the 'oh, nice' moment."

---

### SLIDE 7: TECH HIGHLIGHT (45 seconds)

**Hardest thing:**
> "Building an isomorphic API client that works on both server and client side with automatic token-based authentication — so the app is fast AND secure."

**Which AI tool did it:**
> "Claude helped us architect the authentication flow and debug complex async patterns across the full stack."

**Tech stack badges:**
> "We used Next.js 16, React 19, FastAPI, and PostgreSQL."

---

### SLIDE 8: WHAT'S NEXT (30 seconds)

> "For real users, next we'd add:"
> - Map view to find devices near you
> - Push notifications for new items
> - Trust ratings for safe meetups
> - Impact dashboard showing e-waste prevented

---

### SLIDE 9: OUTRO (15 seconds)

> "That's Team 15. Thanks for watching."
> "ReVive — Giving old tech a second life."

---

## ⌨️ Navigation

| Action | Key |
|--------|-----|
| Next slide | `→` or `Space` |
| Previous slide | `←` |
| Jump to slide | `1` through `9` |

---

## ⏱️ Timing Guide

| Section | Slides | Time |
|---------|--------|------|
| Title | 1 | 10s |
| Hook | 2 | 30s |
| Solution | 3 | 30s |
| Demo Intro | 4 | 15s |
| Demo Steps | 5-6 | 3.5 min |
| Tech Highlight | 7 | 45s |
| What's Next | 8 | 30s |
| Outro | 9 | 15s |
| **Total** | **9** | **~5 min** |

---

## 🎨 Presentation Structure

```
┌─────────────────────────────────────────┐
│  SLIDE 1: Title (10s)                  │
├─────────────────────────────────────────┤
│  SLIDE 2: HOOK (30s)                   │
│  • Problem in one sentence             │
│  • Who hurts                           │
│  • Why it matters                      │
├─────────────────────────────────────────┤
│  SLIDE 3: SOLUTION (30s)               │
│  • We built                            │
│  • For whom                            │
│  • Simple 3-step flow                  │
├─────────────────────────────────────────┤
│  SLIDE 4: DEMO INTRO (15s)             │
│  • "Let me show you"                   │
│  • Setup the personas                  │
├─────────────────────────────────────────┤
│  SLIDES 5-6: LIVE DEMO (3.5 min)       │
│  • Step 1: List an item                │
│  • Step 2: Request & chat              │
│  • Step 3: Meet up & payoff            │
├─────────────────────────────────────────┤
│  SLIDE 7: TECH HIGHLIGHT (45s)         │
│  • Hardest problem solved              │
│  • AI tool used                        │
├─────────────────────────────────────────┤
│  SLIDE 8: WHAT'S NEXT (30s)            │
│  • Future features                     │
├─────────────────────────────────────────┤
│  SLIDE 9: OUTRO (15s)                  │
│  • "That's Team 15"                    │
│  • Thank you                           │
└─────────────────────────────────────────┘
```

---

## 🎯 Key Tips

### DO:
✅ Practice the demo flow beforehand
✅ Have the app running before you start
✅ Speak clearly and confidently
✅ Pause after key points
✅ Make eye contact
✅ Show enthusiasm!

### DON'T:
❌ Rush through the demo
❌ Read from slides directly
❌ Skip the "oh, nice" moment
❌ Apologize for technical issues
❌ Go over 5 minutes

---

## 🎬 Demo Preparation Checklist

Before your presentation:

- [ ] App is running at localhost:3000
- [ ] Test the full demo flow
- [ ] Have sample data ready
- [ ] Clear browser history/cache
- [ ] Close unnecessary tabs
- [ ] Test on the projector/screen
- [ ] Have backup slides ready
- [ ] Practice 2-3 times

---

## 🚨 If Something Goes Wrong

**App crashes:**
> "Let me show you a recorded version..."
> (Have screenshots or video ready)

**Slow loading:**
> "While this loads, let me explain what's happening..."

**Can't connect:**
> "The demo shows the concept — let me walk you through the screenshots..."

---

## 📱 Files Created

```
non-technical/
├── pitch.html          # The 9-slide pitch presentation
├── pitch-styles.css    # Clean, minimal styling
├── pitch-script.js     # Navigation logic
└── PITCH_README.md     # This file
```

---

## 🎨 Design Features

- **Clean white background** — professional look
- **Large, readable text** — easy to see from back of room
- **Simple animations** — not distracting
- **Mobile responsive** — works on any screen
- **Phone mockup** — shows the app in context
- **Notification flow** — visual demo of user experience

---

## 💡 Customization

### Change Team Number
In `pitch.html`, slide 9:
```html
<h1>That's Team [YOUR NUMBER].</h1>
```

### Change Live URL
In `pitch.html`, slide 4:
```html
<p class="demo-note">Follow along at <strong>[YOUR URL]</strong></p>
```

### Update Tech Stack
In `pitch.html`, slide 7, update the badges:
```html
<span class="tech-badge">Your Tech 1</span>
<span class="tech-badge">Your Tech 2</span>
```

---

## 🏆 Success Criteria

You know it's working when:

- ✅ Judges are nodding along
- ✅ Demo flows smoothly
- ✅ "Oh, nice" moment lands
- ✅ Questions are about the product
- ✅ You finish in under 5 minutes

---

**Good luck with your demo! 🚀**

**Remember**: Tell the story, show the demo, land the payoff!
