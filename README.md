## Gallery Admin Guide

- **Default images** are defined in `src/main.js` within `defaultGalleryImages`.
- **Custom uploads** are stored in the browser via `localStorage` (`spa-app-gallery-images`).
- **Admin panel** is locked behind a passphrase prompt. Click **Admin Login** in the Gallery section, enter the passphrase, and the admin panel will appear below the gallery grid.
- **Uploading images** supports file uploads (converted to base64) or external URLs. Optional thumbnails default to the main image source.
- **Lightbox** previews use the full-size image URL (`src`) while thumbnails can use smaller assets for faster grids.
- **Session persistence**: Admin state is remembered in `localStorage` (`spa-gallery-admin-session`). Use **Log out** at the bottom of the Gallery page to end admin mode.

# Spa Massage Website - Responsive SPA

A responsive single-page application (SPA) for a spa and massage business built with vanilla HTML, CSS, and JavaScript.
## Features

- 📱 **Fully Responsive Design** - Works on all devices and screen sizes
- 🎯 **Single Page Application** - Fast navigation with client-side routing
- 🎨 **Modern UI/UX** - Clean, elegant design with smooth animations
- 📝 **Interactive Forms** - Contact form with validation
- 🔍 **Smart Service Discovery** - Category filtering combined with live search
- 📅 **Instant Booking Links** - Every service includes a "Book Now" action
- 🎭 **Smooth Animations** - Fade-in effects and hover transitions
- 📱 **Mobile-First Approach** - Optimized for mobile devices
- ♿ **Accessibility Features** - Proper ARIA labels and semantic HTML
- 🖼️ **Dynamic Gallery** - Filterable gallery with persistent custom uploads and lightbox previews
- 🔐 **Admin Panel** - Password-protected gallery management with local browser storage

## Pages

- **Home** - Hero section with featured services
- **Services** - Filterable and searchable treatments with pricing and booking links
- **About** - Company information and team details  
- **Contact** - Contact form and business information
- **Gallery** - Category filters, lightbox previews, and admin-only management tools

## Services Featured

Services are organized into categories such as facials, add-on treatments, lash & brow care, waxing, threading, and gentlemen's offerings. Each entry includes imagery, descriptions, pricing, durations, and a direct booking shortcut.

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vite** - Build tool and development server
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Playfair Display & Inter)

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your system:
- [Node.js](https://nodejs.org/) (version 14 or higher)

### Installation

1. **Clone or download the project**
   ```bash
   cd spa-massage-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - The website will automatically open at `http://localhost:3000`
   - If it doesn't open automatically, navigate to the URL manually

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build locally
- `npm start` - Alias for `npm run dev`

## Project Structure

```
spa-massage-website/
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── vite.config.js         # Vite configuration
├── README.md              # This file
├── src/
│   └── main.js            # Main JavaScript application
├── assets/
│   ├── css/
│   │   ├── main.css       # Main stylesheet
│   │   └── responsive.css # Responsive design styles
│   ├── js/                # Additional JavaScript files
│   └── images/            # Image assets
└── public/                # Static assets
```

## Customization

### Colors
The color scheme can be modified in `assets/css/main.css` by updating the CSS custom properties in the `:root` selector:

```css
:root {
    --primary-color: #8B7355;
    --secondary-color: #D4AF37;
    --accent-color: #E8DDD4;
    /* ... other colors */
}
```

### Content
- Update business information in `src/main.js`
- Modify services and pricing in the `renderServices()` method
- Change contact details in `renderContact()` and `renderBooking()` methods
- Configure gallery defaults in `defaultGalleryImages` and manage admin settings in `renderGallery()`

### Styling
- Main styles: `assets/css/main.css`
- Responsive styles: `assets/css/responsive.css`
- Add custom styles or override existing ones

## Responsive Breakpoints

- **Mobile**: 480px and below
- **Tablet**: 481px - 768px  
- **Desktop**: 769px and above
- **Large Desktop**: 1025px and above

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Production Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder**
   - Upload the contents of the `dist` folder to your web server
   - The built files are optimized and minified for production

### HTTPS & Secure Cookies

- **Force HTTPS**: The app automatically redirects to HTTPS outside local development (see `src/main.js` `enforceHttps()`), ensuring the `Secure` cookie flag can be applied.
- **Local testing**: Redirects are skipped for `localhost` and `127.0.0.0/8`. Expect console warnings when running over HTTP.
- **Verification steps**:
  1. Serve the site via HTTPS.
  2. Open DevTools → Application → Cookies → your domain.
  3. Confirm `skincare_app_trusted_session` shows `SameSite=Strict`, `Max-Age` (or `Expires`), and `Secure`.
  4. You can also run `document.cookie` in the console to verify the cookie value is present.

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues and pull requests to improve the project.

---

**Note**: This is a demo website for a spa and massage business. All contact information and services are fictional and for demonstration purposes only.
