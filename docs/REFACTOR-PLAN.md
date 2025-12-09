# amina docs refactor plan

> **goal:** transform the current astro starlight template into a fully-branded amina documentation site matching the official design system.

**important:** this is for **end users** who want to use amina in their discord servers. developers and self-hosters should use the **[wiki](https://github.com/iamvikshan/amina/wiki)** instead.

---

## 🎯 Current State vs Target State

### Current State

- ✅ Astro Starlight foundation
- ✅ Basic "bubly amina" theme applied
- ✅ Template structure from ScrewFast
- ⚠️ Generic colors and styling
- ⚠️ Placeholder content
- ⚠️ Not matching official Amina design system

### target state

- 🎯 Full Amina design system implementation
- 🎯 Akame ga Kill color palette
- 🎯 Amina's personality in copy/tone
- 🎯 Real command documentation
- 🎯 Character-driven UI elements
- 🎯 Consistent with main bot brand

---

## refactor phases

## phase 1: design system foundation (high priority)

### 1.1 color system implementation

**Files to Create/Update:**

- `src/styles/design-tokens.css` - CSS custom properties for all colors
- `tailwind.config.mts` - Extend with Amina color palette
- `astro.config.mjs` - Update Starlight theme overrides

**Color Variables to Define:**

```css
/* Primary Brand */
--amina-crimson: #dc143c;
--blood-red: #8b0000;
--rose-red: #e63946;

/* Backgrounds */
--midnight-black: #0a0a0a;
--shadow-gray: #1a1a1a;
--steel-gray: #2d2d2d;

/* Accents */
--electric-blue: #1e90ff;
--cyber-blue: #00ced1;
--imperial-gold: #ffd700;

/* Discord Integration */
--discord-blurple: #5865f2;
--discord-green: #57f287;
--discord-red: #ed4245;
```

**Success Criteria:**

- [ ] All design tokens defined as CSS variables
- [ ] Tailwind config extends with custom colors
- [ ] Starlight theme uses new colors
- [ ] Dark mode is default

---

### 1.2 Typography System

**Files to Create/Update:**

- `src/styles/typography.css` - Font imports and definitions
- `public/fonts/` - Local font files (if needed)

**Fonts to Integrate:**

```css
/* Headings - Sharp, Energetic */
--font-heading: 'Rajdhani', 'Orbitron', 'Space Grotesk', sans-serif;

/* Body - Clean, Readable */
--font-body: 'Inter', 'Poppins', sans-serif;

/* Character Dialogue - Personality */
--font-dialogue: 'Quicksand', 'Comfortaa', cursive;

/* Code - Technical */
--font-mono: 'Fira Code', 'JetBrains Mono', monospace;
```

**Success Criteria:**

- [ ] All fonts loaded (CDN or local)
- [ ] Font families applied to appropriate elements
- [ ] Type scale implemented
- [ ] Font weights defined

---

### 1.3 Visual Effects

**Files to Create/Update:**

- `src/styles/effects.css` - Shadows, glows, animations

**Key Effects:**

```css
/* Glow Effects */
--glow-crimson: 0 0 20px rgba(220, 20, 60, 0.6);
--glow-blue: 0 0 20px rgba(30, 144, 255, 0.6);
--glow-gold: 0 0 20px rgba(255, 215, 0, 0.6);

/* Shadows */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
```

**Success Criteria:**

- [ ] Glow effects defined and applied to interactive elements
- [ ] Shadow system implemented
- [ ] Hover states use appropriate effects
- [ ] Animations smooth and consistent

---

## Phase 2: Component Refactoring ⭐ HIGH PRIORITY

### 2.1 Navigation & Header

**Files to Update:**

- `src/components/sections/navbar&footer/Navbar.astro`
- `src/components/sections/navbar&footer/NavbarMegaMenu.astro`
- `src/components/ui/starlight/SiteTitle.astro`

**Changes:**

- [ ] Apply crimson accents to active nav items
- [ ] Add subtle glow to logo on hover
- [ ] Update colors to match design system
- [ ] Ensure mobile menu matches desktop theme
- [ ] Implement glassmorphism backdrop

**Color Usage:**

- Background: `--midnight-black` with opacity
- Text: `--off-white` (default), `--amina-crimson` (hover)
- Border: `--steel-gray`
- Glow: `--glow-crimson` on hover

---

### 2.2 Buttons & CTAs

**Files to Update:**

- `src/components/ui/buttons/DashBtn.astro`
- Create: `src/components/ui/buttons/PrimaryBtn.astro`
- Create: `src/components/ui/buttons/SecondaryBtn.astro`

**Button Types:**

1. **Primary** - Crimson gradient with glow
2. **Secondary** - Electric blue outline
3. **Danger** - Blood red solid
4. **Discord** - Discord blurple

**Success Criteria:**

- [ ] All button types implemented
- [ ] Hover states with lift animation
- [ ] Glow effects on hover
- [ ] Consistent sizing and spacing

---

### 2.3 Cards & Panels

**Files to Update:**

- Delete old card components (CardBlog, CardInsight, etc.)
- Create: `src/components/ui/cards/CommandCard.astro`
- Create: `src/components/ui/cards/FeatureCard.astro`

**Card Specifications:**

- Background: `--shadow-gray`
- Border: 1px solid `--steel-gray`
- Border radius: `--radius-xl`
- Hover: Lift + blue border glow
- Active: Crimson border + glow

**Success Criteria:**

- [ ] Old card components removed
- [ ] New card components created
- [ ] Hover animations implemented
- [ ] Active states styled

---

### 2.4 Theme Toggle

**Files to Update:**

- `src/components/ui/starlight/ThemeSelect.astro`
- `src/components/ThemeIcon.astro`

**Changes:**

- [ ] Default to dark mode
- [ ] Use cyber blue for dark mode icon
- [ ] Use imperial gold for light mode icon
- [ ] Smooth transition between themes

---

## Phase 3: Content Migration 📝 MEDIUM PRIORITY

### 3.1 Home Page

**Files to Update:**

- `src/content/docs/index.mdx`
- Landing page components

**Content Updates:**

- [ ] Update hero section with Amina branding
- [ ] Replace placeholder text with real bot features
- [ ] Add command category overview
- [ ] Include personality-driven copy (lowercase, direct)
- [ ] Add call-to-action buttons (Invite, Dashboard, Support)

**Tone Example:**

```markdown
# hey, i'm mina.

multipurpose discord bot. guardian. protector. not just a fun toy.

i handle moderation, economy, music, and more. all while keeping your server safe.

ready? let's go.
```

---

### 3.2 Command Documentation

**Structure to Create:**

```text
src/content/docs/
├── commands/
│   ├── admin/
│   ├── moderation/
│   ├── economy/
│   ├── fun/
│   ├── music/
│   ├── social/
│   ├── info/
│   ├── utility/
│   └── stats/
```

**For Each Command Category:**

- [ ] Create category overview page
- [ ] List all commands in category
- [ ] Use appropriate color theme
- [ ] Include usage examples
- [ ] Add permission requirements
- [ ] Cross-reference related commands

**Reference Data:**

- Source: `iamvikshan/amina/src/data/resp*.json`
- Use GitHub MCP to fetch actual command data

---

### 3.3 Features & Systems

**Pages to Create:**

- `/features/ai` - Amina's AI capabilities
- `/features/moderation` - Automod, logging
- `/features/economy` - Currency system
- `/features/tickets` - Support ticket system
- `/features/music` - Music player features

**Success Criteria:**

- [ ] All major features documented
- [ ] Screenshots/examples included
- [ ] Color-coded by feature type
- [ ] Links to related commands

---

## Phase 4: Character Integration 🎭 MEDIUM PRIORITY

### 4.1 Amina Portrait Component

**File to Create:**

- `src/components/character/AminaPortrait.astro`

**Features:**

- [ ] Circular portrait with crimson border
- [ ] Idle breathing animation
- [ ] Active pulse animation
- [ ] Crimson glow effect

---

### 4.2 Speech Bubble Component

**File to Create:**

- `src/components/character/SpeechBubble.astro`

**Features:**

- [ ] Dialogue font family
- [ ] Cyber blue color scheme
- [ ] Blue glow border
- [ ] Tail/pointer to portrait

**Usage:**
Display Amina's personality in tips, warnings, and helper text throughout docs.

---

### 4.3 Personality-Driven Copy

**Files to Update:**

- All `.mdx` content files
- UI component labels
- Error messages
- Success messages

**Tone Guidelines:**

- Use lowercase (except for proper nouns, code)
- Keep sentences short and direct
- Use gen-z slang naturally
- Be helpful but not overly cheerful
- Occasional ASCII emoticons (not emojis)

**Examples:**

```markdown
# instead of:

"Welcome to Amina Documentation! We're excited to help you get started."

# use:

"hey. here's everything you need to know. no fluff."

# instead of:

"Error: Invalid command syntax. Please try again."

# use:

"...what? try that again but make it make sense."
```

---

## Phase 5: Interactive Elements ✨ LOW PRIORITY

### 5.1 Command Search

**File to Create:**

- `src/components/features/CommandSearch.astro`

**Features:**

- [ ] Search all commands
- [ ] Filter by category
- [ ] Autocomplete
- [ ] Color-coded results

---

### 5.2 Interactive Code Examples

**Component to Create:**

- `src/components/features/CommandDemo.astro`

**Features:**

- [ ] Syntax highlighting
- [ ] Copy button
- [ ] Live parameter editing
- [ ] Expected output preview

---

### 5.3 Badges & Achievements Display

**Component to Create:**

- `src/components/ui/Badge.astro`

**Types:**

- Achievement badge (gold)
- Rank badge (gradient)
- Status tag (category-specific colors)

---

## Phase 6: Assets & Media 🖼️ LOW PRIORITY

### 6.1 Logo & Branding

**Files to Update:**

- `src/components/BrandLogo.astro`
- `public/` - Add official Amina assets

**Assets Needed:**

- Amina logo (SVG)
- Amina portrait/avatar
- Favicon set
- OG images for social sharing

---

### 6.2 Screenshots & Visuals

**Directories to Create:**

- `public/images/commands/` - Command examples
- `public/images/features/` - Feature screenshots
- `public/images/dashboard/` - Dashboard previews

---

## Phase 7: Configuration & Build 🔧 HIGH PRIORITY

### 7.1 Astro Config

**File to Update:**

- `astro.config.mjs`

**Changes:**

- [ ] Update site title and description
- [ ] Configure Starlight with Amina branding
- [ ] Set default theme to dark
- [ ] Add custom CSS files
- [ ] Configure social links

---

### 7.2 Package Dependencies

**File to Update:**

- `package.json`

**Potential Additions:**

- Font packages (if using local fonts)
- Animation libraries (if needed)
- Additional Astro integrations

---

### 7.3 Build & Deploy

**Tasks:**

- [ ] Test build process (`bun run build`)
- [ ] Verify type checking (`bun check`)
- [ ] Test dev server (`bun dev`)
- [ ] Optimize images
- [ ] Configure deployment platform

---

## 🔄 Implementation Workflow

### Step-by-Step Process

1. **Setup Phase (Phase 1)**
   - Implement design tokens
   - Set up typography
   - Add visual effects

2. **Component Phase (Phase 2)**
   - Refactor existing components
   - Create new components
   - Apply design system

3. **Content Phase (Phase 3)**
   - Migrate command docs
   - Update copy and tone
   - Add real data

4. **Polish Phase (Phases 4-6)**
   - Add character elements
   - Implement interactive features
   - Finalize assets

5. **Testing Phase (Phase 7)**
   - Type checking
   - Build verification
   - Cross-browser testing

---

## ✅ Success Metrics

### Design System

- [ ] All colors match `colors.json`
- [ ] Typography uses specified fonts
- [ ] Visual effects consistent throughout
- [ ] Dark mode is default and polished

### Content

- [ ] All command categories documented
- [ ] Tone matches Amina's personality
- [ ] No placeholder content remains
- [ ] Cross-references accurate

### Components

- [ ] All components use design system
- [ ] Hover states work consistently
- [ ] Animations smooth and purposeful
- [ ] Mobile responsive

### Build

- [ ] No type errors
- [ ] Build completes successfully
- [ ] Dev server runs without errors
- [ ] Performance optimized

---

## 🚨 Potential Challenges

### 1. Starlight Theme Overrides

**Challenge:** Starlight has strong default styles
**Solution:** Use CSS custom properties and `!important` where needed

### 2. Content Tone Consistency

**Challenge:** Maintaining lowercase, sassy tone throughout
**Solution:** Create content guidelines and review checklist

### 3. Color Contrast

**Challenge:** Dark theme accessibility
**Solution:** Test contrast ratios, ensure WCAG compliance

### 4. Font Loading Performance

**Challenge:** Multiple custom fonts may slow load
**Solution:** Use font-display: swap, consider font subsetting

### 5. Data Source Updates

**Challenge:** Command data may change in main repo
**Solution:** Document data fetch process, consider automation

---

## 📝 Notes for Agent

### When Working on This Refactor:

1. **Always check design system docs first** - Reference `DESIGN-SYSTEM.md` before making style decisions
2. **Use GitHub MCP for real data** - Fetch actual command data from `iamvikshan/amina` repo
3. **Maintain type safety** - All types in `/types/*`, use barrel exports
4. **Test after changes** - Run `bun check` after each significant change
5. **Preview frequently** - Use `bun dev` to see changes (after type check passes)
6. **Keep voice consistent** - Amina's personality: lowercase, direct, helpful but sassy
7. **Color by category** - Each command category has its designated color
8. **Dark first** - Design and test in dark mode, light mode is secondary

### Priority Order for Implementation:

1. **Phase 1 (Design System)** - Foundation is critical
2. **Phase 2 (Components)** - UI must match design
3. **Phase 7 (Config)** - Ensure build works
4. **Phase 3 (Content)** - Add real documentation
5. **Phase 4 (Character)** - Polish and personality
6. **Phases 5-6 (Extras)** - Nice-to-haves

---

## 🔗 References

- **Design System:** `./DESIGN-SYSTEM.md`
- **Commands:** `./COMMANDS-REFERENCE.md`
- **Source Repo:** `github.com/iamvikshan/amina`
- **Design Docs Branch:** `dash/docs`
- **Data Branch:** `main/src/data`
