# Lesson pages

Each file under `lessons/{grade}/{en|ko}/{01-18}.html` is a **full HTML page**.

- Linked from the main site list in `index.html`
- Shared styles: `assets/lesson-page.css`
- Back link returns to `index.html#k1` (etc.)

Rebuild:

```powershell
powershell -ExecutionPolicy Bypass -File build-full-lesson-pages.ps1
```
