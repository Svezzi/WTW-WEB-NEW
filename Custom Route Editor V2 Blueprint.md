# 🛠️ Custom Route Editor – V2 Blueprint

## 🎯 Goal  
Design and build a fully custom route editor that allows:
- Segment-level route control
- Draggable control points (like Google Maps blue dots)
- Snap-back or undo for individual edits
- Visual styling and feedback tailored to Walk This Way’s UX

---

## 🔍 Why We Need This (Later, Not Now)

The Google Maps SDK (`DirectionsRenderer`) does **not** support:
- Per-segment editing
- Snap-back-on-click
- Draggable blue dots in `WALKING` mode via SDK

We’ve confirmed through dev experience and research that this functionality is **only available in the Google Maps product**, not in the public SDK.

To provide full creator control and match the native Google UX, we’ll eventually need a custom system.

---

## 🔧 Core Components

### 1. Manual Polyline Rendering
- Use `google.maps.Polyline` with `editable: true`
- Manually draw the walking path based on waypoints
- Track and render the path with visual cues (dotted lines, highlight on hover)

### 2. Custom Draggable Markers
- Add draggable markers at:
  - Waypoints
  - Segment midpoints (for finer path shaping)
- On drag:
  - Use `DirectionsService.route()` to recalculate the affected segment
  - Snap dragged point to a valid walking path

### 3. Undo Logic
- Use a deep copy approach (`JSON.parse(JSON.stringify(...))`) to store route state
- Maintain a history stack (e.g., max 10 states)
- “Undo” and “Redo” buttons to allow multi-step editing
- Optional: Click on a segment marker to revert that segment only

### 4. Route Validation & Snapping
- Validate dragged paths by re-routing through `DirectionsService`
- If the route becomes invalid (e.g. across a river), restore previous valid segment
- Optional: Add soft error messages (e.g., "Invalid drag – snapping back")

### 5. Hybrid Rendering Approach (Optional)
- Use `DirectionsRenderer` for initial path display
- Switch to custom Polyline + Markers on "Edit Mode"
- Gives users a clean initial map, but full control when editing

---

## ⚙️ Technical Considerations

- Might require abandoning `@react-google-maps/api` in favor of direct JS SDK usage
- Use `refs` for precise map object access
- Use `throttle` or `debounce` when dragging to avoid spamming route requests
- Test performance on mobile – route editor must remain fluid

---

## 🚀 Phased Implementation

### Phase 1 – MVP Hybrid
- Keep `DirectionsRenderer` for initial route
- Add basic drag handles on waypoints
- Store route history for single-step undo
- Keep "Reset to Original" fallback

### Phase 2 – Full Custom Editor
- Remove `DirectionsRenderer`
- Draw route manually with `Polyline`
- Add mid-segment control points
- Multi-step undo stack
- Segment-level snapping

### Phase 3 – UX Polish
- Smooth transitions between edits
- Hover + drag affordances
- Live route previews before confirming
- Optional: "Scenic mode" toggle to prioritize interesting streets

---

## 📌 Dependencies & Notes

- High complexity — should not block MVP
- Must be mobile-friendly from day one
- Replaces Google’s high-trust path rendering with our own — need fallback for failures
- Ideal for phase after creator onboarding & monetization are in place
