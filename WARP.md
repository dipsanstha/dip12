# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a vanilla JavaScript Single Page Application (SPA) for a spa and massage business built with modern web technologies. The project uses ES6+ modules, Vite for build tooling, and implements client-side routing without external frameworks.

## Development Commands

### Essential Commands
```powershell
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev
# or
npm start

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Single File Testing/Development
```powershell
# For quick CSS changes, modify files in assets/css/ directory
# Changes are automatically hot-reloaded during development

# For JavaScript changes, the main application logic is in src/main.js
# Vite will hot-reload automatically during development
```

## Architecture Overview

### Application Structure
The project follows a **class-based vanilla JavaScript SPA architecture**:

- **Single Class Architecture**: The entire application is managed by the `SpaApp` class in `src/main.js`
- **Client-Side Routing**: Hash-based routing system without external libraries
- **Method-based Pages**: Each page is a method within the SpaApp class (renderHome, renderServices, etc.)
- **Event-Driven**: Uses DOM event delegation and browser APIs for interactivity

### Key Architectural Patterns
1. **Route-Method Mapping**: Routes are mapped to class methods in the `routes` object
2. **Dynamic Content Rendering**: All content is generated via template literals and innerHTML
3. **Form Handling**: Separate initialization methods for contact and booking forms
4. **Animation System**: Uses Intersection Observer API for scroll-based fade-in animations

### File Organization
```
spa-massage-website/
├── index.html              # Single HTML entry point
├── src/main.js             # Main SPA class with all application logic
├── assets/css/
│   ├── main.css           # Core styles with CSS custom properties
│   └── responsive.css     # Media queries and responsive design
├── vite.config.js         # Vite build configuration
└── package.json           # Dependencies and scripts
```

## Working with This Codebase

### Adding New Pages/Routes
1. Add route mapping in the `routes` object constructor
2. Create a new `render[PageName]()` method in the SpaApp class
3. Add navigation link to the HTML template in `index.html`

### Modifying Content
- **Services & Pricing**: Edit the service arrays in `renderServices()` method
- **Contact Information**: Update contact details in `renderContact()` and `renderBooking()` methods
- **Business Information**: Modify company details in `renderAbout()` method
- **Styling**: CSS custom properties are defined in `:root` selector of `main.css`

### Form Handling
Forms use simulated submission (alerts) rather than real backend integration. To add real form processing:
1. Modify `handleContactSubmit()` and `handleBookingSubmit()` methods
2. Replace alert() calls with actual API calls or form submission logic

### Animation System
The project uses a custom fade-in animation system:
- Add `fade-in` class to elements that should animate on scroll
- Animations are automatically initialized by `initAnimations()` method
- Uses Intersection Observer API for performance-optimized scroll detection

### Color Scheme Customization
The design uses CSS custom properties for easy theming:
```css
:root {
    --primary-color: #8B7355;    /* Main brand color */
    --secondary-color: #D4AF37;  /* Accent color */
    --accent-color: #E8DDD4;     /* Light accent */
    --text-dark: #2C2C2C;        /* Primary text */
    --text-light: #6B6B6B;       /* Secondary text */
}
```

## Build Configuration

### Vite Configuration Highlights
- **Development Server**: Runs on port 3000 with auto-open
- **Build Target**: ES2015 for broad browser compatibility
- **Assets**: Handles images, fonts, and static files automatically
- **Base Path**: Configured for relative paths (`./`) for flexible deployment

### Production Deployment
The build process outputs to `dist/` directory with:
- Minified and optimized JavaScript
- CSS bundling and optimization
- Asset optimization and hashing
- Manual chunking for vendor dependencies (vanilla-router)

## Browser Support
- Chrome, Firefox, Safari, Edge (latest versions)
- Uses ES6+ features including classes, modules, and modern APIs
- Responsive design with mobile-first approach

## Key Dependencies
- **vite**: Build tool and development server
- **vanilla-router**: Minimal routing utility (unused in current implementation)
- **Font Awesome**: Icon library (CDN)
- **Google Fonts**: Playfair Display and Inter fonts