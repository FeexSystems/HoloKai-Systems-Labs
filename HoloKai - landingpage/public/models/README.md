# HoloKai 3D Lab models

Place unit glTF/GLB assets here. Paths are referenced from `client/data/units.ts` as `modelPath` (e.g. `/models/oluwa-core.glb`).

The lab renders **photoreal full-body key art** in an orbital viewer (`FullBodyOrbital`), with optional MP4 plates in dual mode. Full-body PNGs live in `/public/images/vanguard/`.

To attempt loading glTF files at runtime instead, set:

```env
VITE_LAB_LOAD_GLB=true
```

Without that flag, the lab uses full-body orbital key art (avoids 404 noise in dev).

## Spline Lab (`/lab-spline`)

The Spline Lab expects two assets in this directory:

- `scene.splinecode` — the Spline export rendered as the primary orbital stage.
- `cyber_mannequin.gltf` — glTF chassis used by the react-three-fiber fallback.

To point the lab at a hosted Spline scene instead of the local export:

```env
VITE_SPLINE_SCENE_URL=https://prod.spline.design/<scene>/scene.splinecode
```

When the scene is absent, fails, or times out, the lab falls back to the r3f
canvas; without WebGL it renders a static notice.