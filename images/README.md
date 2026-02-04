# Screenshots

## Current Images

- `preview.png` - Original preview (legacy)
- `theme-particles.png` - Particles theme (default) - 191KB
- `theme-fluid.png` - Fluid/lava lamp theme - 239KB
- `theme-space.png` - Space theme with moon and planets - 279KB

## Adding New Screenshots

To update theme screenshots:

1. Run development server: `npm run dev`
2. Navigate to http://localhost:3000
3. For each theme:
   - Switch to the theme using the theme button (top right)
   - Wait 2-3 seconds for full rendering
   - Take screenshot (Cmd+Shift+4 on Mac, Snipping Tool on Windows)
   - Save as `theme-[themename].png` (1920x1080 recommended)

### Recommended Screenshots

- `theme-particles.png` - Particles theme with connected particles
- `theme-fluid.png` - Fluid theme with blue lava blobs
- `theme-space.png` - Space theme with moon/sun, planets, and stars

### Optimization

Use ImageOptim or similar tools to compress images before committing:
```bash
# Example with ImageOptim CLI
imageoptim images/*.png
```

Target size: < 500KB per image
