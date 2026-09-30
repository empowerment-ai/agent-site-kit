# Design system: Juniper & Rye

Read this before changing anything visual. It's how a change made six months from now,
by a person or an agent, still looks like the same website. The tokens live in
`src/app/globals.css` (`@theme`). Change a value there and the whole site follows.

## Feel

A warm, editorial neighborhood bakery: cream paper, dark ink, one deep green for action,
and a single burnt-orange accent used sparingly. It should feel handmade and calm, not
trendy. Photography does the heavy lifting, and type stays quiet around it.

## Color tokens

| Token | Hex | Use |
|---|---|---|
| `flour` | `#f6f0e5` | Page background. |
| `crumb` | `#ece2cf` | Alternate bands and card surfaces. |
| `crust` | `#2a1c13` | Primary text and the footer background. |
| `rye` | `#7b4a2b` | Eyebrows, section numbers, the italic ampersand. |
| `juniper` | `#2d4a3c` | Primary buttons, links, the visit panel, the announcement bar. |
| `juniper-ink` | `#f3efe6` | Text on juniper. |
| `ember` | `#c4622d` | Tiny accents only: the "open now" dot and the hero sticker. Never body text or large areas. |
| `muted` | `#6e5d50` | Secondary text and descriptions. |
| `line` | `#d9ccb6` | Hairlines, borders, menu dot leaders. |

Contrast rule: body text is `crust` on `flour`/`crumb`, or `juniper-ink` on `juniper`/`crust`.
Don't put `muted` text on a dark background.

## Type

- **Display:** Fraunces (variable, soft optical sizes), weight 450–500, for h1–h3 and
  menu item names. Italics are for small moments: the `&`, section numbers, and stickers.
- **Body:** Hanken Grotesk, 17px, 1.65 line height.
- **Eyebrows:** the `.eyebrow` class (small caps-style, tracked uppercase, `rye`).
- Headlines use `text-wrap: balance`, so never force line breaks.

## Layout

- Max content width `max-w-6xl`, with side padding `px-5` on mobile and `px-8` on desktop.
- Generous vertical rhythm: sections are `py-16` on mobile and `py-20` to `py-24` on desktop.
- Cards and images use `rounded-[var(--radius-card)]` (1.25rem).
- Mobile-first. Everything must work at 390px wide with no sideways scrolling, and the phone
  number stays a tap-to-call button in the header.

## Components

- **Buttons:** `.btn .btn-primary` (juniper pill) for the main action and `.btn .btn-ghost`
  (outlined) for the secondary one. At most two buttons side by side.
- **Menu rows:** name, a dotted `.leader`, then the price, with the description underneath
  in `muted`. Prices come from `content/menu.json`.
- **Seasonal panel:** the menu's holiday pre-order block, from `holiday` in `menu.json`.
  A `juniper` card with `juniper-ink` text (eyebrows and labels at 85% opacity, never
  `muted` or `rye`), italic Fraunces for dates and item numbers, and hairlines at
  `juniper-ink/25`. A price only shows when an item has one. Use this pattern for any
  seasonal feature. Turn it off with `"show": false`, never by deleting the data.
- **Hours:** always rendered by `<HoursTable>` from `business.json`, never typed out.
- **Open now:** `<OpenNow>` computes the status in the business's own time zone.

## Photography

Warm morning light, shallow depth of field, real textures (flour, linen, wood). No
people's faces. Every image gets descriptive alt text. The demo photos are AI-generated
and labeled as such in the footer; a real business should use real photos.

## Don'ts

No gradients, no drop-shadow-heavy cards, no emoji in headings, no stock "happy customer"
photos, and no carousels. Don't add a new color: use an existing token or ask.
