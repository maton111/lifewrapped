# Design System Strategy: The Neon Reliquary

## 1. Overview & Creative North Star
The Creative North Star for this system is **"The Neon Reliquary."** 

We are not building a utility app; we are building a digital shrine to the user's data-driven existence. This system rejects the "friendly" corporate aesthetics of the modern web in favor of high-contrast, editorial brutalism. It is premium because it is unapologetic. We use vast expanses of `#0a0a0a` (pure dark) to create a void, then punctuate it with aggressive typography and vibrant neon accents that represent the digital footprints left on various platforms. 

The layout should feel like a high-end fashion magazine crossed with a command line interface—intentional asymmetry, overlapping elements that defy standard grid constraints, and a hierarchy that prioritizes raw data (the "Stats") over comforting UI fluff.

## 2. Colors & Surface Philosophy
The palette is built on the tension between the "Void" and "The Pulse."

### The "No-Line" Rule
**Borders are a failure of imagination.** In this design system, 1px solid lines are strictly prohibited. Sectioning must be achieved through:
1.  **Tonal Shifts:** Moving from `surface` (#0e0e0e) to `surface-container-low` (#131313).
2.  **Negative Space:** Using the Spacing Scale to create "islands" of content.
3.  **Glow Thresholds:** Defining an edge using a low-opacity glow rather than a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, light-emitting panels.
*   **Base:** `surface` (#0e0e0e) for the global background.
*   **Sections:** `surface-container-low` (#131313) for large content blocks.
*   **Cards/Elements:** `surface-container-high` (#201f1f) to create "lift" against the background.
*   **Interaction States:** Use `surface-bright` (#2c2c2c) only for active or focused states.

### The "Glass & Gradient" Rule
To elevate the "Dark Neon" theme, floating elements (modals, tooltips) must use semi-transparent `surface-container` colors with a `backdrop-filter: blur(20px)`. Main CTAs should utilize a subtle vertical gradient from `primary` (#cc97ff) to `primary_dim` (#9c48ea) to provide a "liquid neon" feel that flat hex codes cannot replicate.

## 3. Typography: The Editorial Voice
Typography is our primary tool for sarcasm and authority. We pair the utilitarian precision of **Inter** with the aggressive, wide-set nature of **Space Grotesk** for data.

*   **The Hero Stat (display-lg):** Using Space Grotesk at 3.5rem. This is for the "cold, hard facts" (e.g., "You spent 400 hours watching trash"). It should feel confrontational.
*   **The Narrative (headline-md):** Space Grotesk at 1.75rem. Used for sarcastic headers that provide context to the data.
*   **The Truth (body-lg):** Inter at 1rem. For the "fine print" of the user's life. 

High contrast is non-negotiable. Use `on_surface` (#ffffff) for all primary text to ensure it "burns" through the dark background. Use `on_surface_variant` (#adaaaa) only for metadata or truly secondary information.

## 4. Elevation & Depth
Depth is conveyed through **Tonal Layering** and **Luminance**, never through drop shadows that imply a sun-like light source. 

*   **The Layering Principle:** Stack surfaces to create focus. A `surface-container-highest` (#262626) element sitting on `surface` should feel like an OLED screen turning on in a dark room.
*   **Ambient Shadows (Glows):** When a "floating" effect is required, use a shadow color derived from the `primary` or platform-specific color (e.g., Spotify Green). 
    *   *Spec:* `box-shadow: 0 0 40px 0px rgba(168, 85, 247, 0.15);` (using Primary Accent).
*   **The Ghost Border:** If a boundary is required for accessibility, use `outline_variant` at 15% opacity. It should be felt, not seen.
*   **Glassmorphism:** For mobile navigation bars or top headers, use a semi-transparent `surface` with a heavy blur. This allows the neon "stats" to bleed through as the user scrolls, maintaining the "Neon Reliquary" vibe.

## 5. Components

### Buttons
*   **Primary:** No border. Gradient fill (`primary` to `primary_dim`). White text (`on_primary_fixed`). On hover, increase the outer glow, do not change the background color.
*   **Secondary:** No fill. `on_surface` text. A "Ghost Border" that becomes 100% opaque `primary` on interaction.
*   **Tertiary:** Text only. `primary` color. High-contrast and underlined only on hover.

### Chips (The Platform Tags)
Chips should use the specific **Platform Colors** provided (Spotify, Netflix, etc.) but with a twist:
*   **Style:** Background at 10% opacity of the brand color, text at 100% opacity. This prevents the "rainbow" effect from over-powering the dark theme.
*   **Radii:** Always `full` (9999px) for chips to contrast against the sharper `md` (0.375rem) cards.

### Cards & Lists
*   **Rule:** Forbid divider lines. 
*   **Implementation:** Separate list items using a 12px vertical gap. For cards, use `surface-container-low` (#131313) as the base and `surface-container-high` (#201f1f) for the hover state. 
*   **Interaction:** On hover, a card should not move "up" (Y-axis); it should simply increase its outer glow.

### Input Fields
*   **Base:** `surface-container-lowest` (#000000). 
*   **Focus:** The glow effect should transition from a subtle white to a vibrant `primary` (#cc97ff). Helper text should be `body-sm` and written in a tone that questions the user's input.

## 6. Do's and Don'ts

### Do
*   **Embrace the Void:** Leave more whitespace than you think is necessary. Space is premium.
*   **Use Intentional Asymmetry:** Align stats to the far left and sarcastic commentary to the far right to create eye movement.
*   **Respect the Brand:** Use the platform-specific colors (e.g., `#1db954` for Spotify) accurately when displaying data from those sources.

### Don't
*   **Don't use 1px borders:** Ever. If you need a line, use a 1px height `surface-variant` div with 20% opacity.
*   **Don't use standard "Grey":** All "greys" in this system are actually deeply desaturated versions of the background or primary. Stick to the provided `surface` tokens.
*   **Don't be "Nice":** The sarcastic tone extends to the UI. If a user's stats are low, the UI shouldn't try to cheer them up with rounded, bubbly shapes. Keep it sharp and minimal.