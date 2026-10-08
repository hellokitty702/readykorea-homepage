# Lesson pages (SEO slug URLs)

Structure from the `종합.zip` deploy package:

```
lessons/
  index.html                 <- all grades hub
  k1/
    index.html               <- K1 grade list
    greetings-hello-routine/
      index.html             <- individual lesson
  k2/ ... g6/
```

- Canonical URLs: `https://readykoreaesl.com/lessons/{grade}/{slug}/`
- Listed in root `sitemap.xml` / `robots.txt`
- Main site: `../index.html`

Optional rebuild from source:

```powershell
powershell -ExecutionPolicy Bypass -File build-lesson-dist.ps1
```
