# ReVive Presentation Slides

Interactive HTML presentation covering the ReVive codebase architecture, design patterns, and technical implementation.

## 🚀 Quick Start

### Option 1: Direct File Opening
Simply open `index.html` in your web browser:
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

### Option 2: Local Server (Recommended)
For the best experience, serve the files using a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open http://localhost:8000 in your browser.

## ⌨️ Navigation Controls

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `→` or `Space` | Next slide |
| `←` | Previous slide |
| `Home` | First slide |
| `End` | Last slide |
| `1-9`, `0` | Jump to slide (1-10) |
| `F` | Toggle fullscreen |
| `Esc` | Exit fullscreen / Go to first slide |

### Mouse/Touch Controls
- **Click** the navigation arrows (‹ ›) on left/right sides
- **Swipe left/right** on touch devices

### On-Screen Indicators
- **Progress bar**: Shows completion at top
- **Slide counter**: Shows current/total (e.g., "5 / 15") at top-right

## 📚 Presentation Structure

### 15 Comprehensive Slides

1. **Title Slide** - Project introduction and branding
2. **Problem Statement** - E-waste crisis and our solution
3. **System Architecture** - High-level component diagram
4. **Tech Stack Overview** - Technologies used (frontend & backend)
5. **Backend Architecture** - FastAPI, routers, and patterns
6. **Data Models** - SQLAlchemy ORM structure
7. **Dependency Injection Pattern** - FastAPI's DI system explained
8. **Frontend Architecture** - Next.js app router structure
9. **Server vs Client Components** - React 19 patterns
10. **Styling Architecture** - Tailwind CSS and theme tokens
11. **Data Flow** - Step-by-step request lifecycle
12. **Key Features & Modules** - Feature overview
13. **Design Patterns Used** - Architectural patterns implemented
14. **Code Quality & Best Practices** - Quality standards
15. **Summary & Q&A** - Recap and questions

## 🎨 Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary: #10b981;        /* Emerald green */
    --accent: #22d3ee;         /* Cyan accent */
    --bg-dark: #0f1a15;        /* Dark background */
    /* ... more variables */
}
```

### Adding New Slides
1. Add a new `<section class="slide" data-slide="16">` in `index.html`
2. Update `totalSlides` variable in `script.js`
3. Add appropriate styles in `styles.css`

### Modifying Content
All content is in `index.html` - edit the text directly in the HTML structure.

## 📁 File Structure

```
slides/
├── index.html      # Main presentation file
├── styles.css      # All styling and animations
├── script.js       # Navigation and interaction logic
└── README.md       # This file
```

## 🌐 Browser Support

Tested and optimized for:
- ✅ Chrome 90+
- ✅ Firefox 90+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 Responsive Design

The presentation is fully responsive and works on:
- 🖥️ Desktop (1920x1080 and above)
- 💻 Laptops (1366x768 and above)
- 📱 Tablets (768x1024 and above)
- 📱 Mobile phones (375x667 and above)

## 🔧 Troubleshooting

### Presentation not loading
- Ensure all three files are in the same directory
- Check browser console for errors
- Try using a local server instead of file:// protocol

### Styles not applying
- Clear browser cache (Ctrl/Cmd + Shift + R)
- Verify `styles.css` is in the same folder as `index.html`

### Navigation not working
- Check if `script.js` is loaded (View page source)
- Look for JavaScript errors in browser console

## 💡 Tips for Presenters

1. **Enter fullscreen** before presenting (press `F`)
2. **Practice navigation** with keyboard shortcuts
3. **Use slide numbers** to jump between sections quickly
4. **Keep the progress bar visible** to track your position
5. **End on the Q&A slide** for audience interaction

## 📝 License

Created for Team 15 - ReVive Project Presentation
July 2026
