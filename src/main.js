import { servicesByCategory } from './servicesData.js';

// Main JavaScript for Skin Care Website 
class SkinCareApp {
    constructor() {
        this.currentRoute = '';
        this.routes = {
            '': this.renderHome,
            'home': this.renderHome,
            'services': this.renderServices,
            'gallery': this.renderGallery,
            'reviews': this.renderReviews,
            'about': this.renderAbout,
            'contact': this.renderContact,
            
        };

        this.selectedServiceCategory = 'all';
        this.serviceSearchQuery = '';
        this.serviceSearchFocused = false;
        this.serviceSearchCaret = null;
        this.serviceSearchDebounce = null;
        this.bookingUrl = 'https://skincarebylaxmi.glossgenius.com/';
        this.selectedGalleryCategory = 'all';
        this.galleryStorageKey = 'skincare-app-gallery-images';
        this.defaultGalleryImages = [
            { src: 'public/images/photo-1519823551278-64ac92734fb1.jpg', alt: 'Luxurious facial treatment in progress', category: 'Treatments' },
           
        ];
        this.customGalleryImages = this.loadStoredGalleryImages();
        this.galleryImages = [];

        this.reviewStorageKey = 'skincare-app-reviews';
        this.testimonials = [
            { name: 'Priya S.', rating: 5, quote: 'My skin has never felt better! The personalized care and attention to detail made the experience unforgettable.', date: '2025-09-12' },
            { name: 'Emily R.', rating: 5, quote: 'The ambience is so calming and every treatment feels luxurious. Highly recommend the signature facial!', date: '2025-09-18' },
            { name: 'Monica D.', rating: 4, quote: 'Wonderful service and results. The team is knowledgeable and genuinely cares about your skin health.', date: '2025-09-21' }
        ];
        this.reviews = this.loadStoredReviews();
        this.pendingReviewFeedback = null;
        this.boundLightboxKeydownHandler = null;
        this.galleryAdminOpen = false;
        this.pendingGalleryAdminFeedback = null;
        this.galleryAdminSessionKey = 'skincare-gallery-admin-session';
        this.galleryAdminSecret = 'TGF4bWkuYWRtaW5AMTIhIQ=='; // Base64 encoded passphrase 'laxmi.admin@123!!'
        this.isGalleryAdmin = this.loadGalleryAdminSession();

        
        this.init();
    }

    init() {
        this.enforceHttps();
        this.ensureSecurityCookie();
        // Initialize navigation
        this.initNavigation();
        
        // Handle initial route
        this.handleRouteChange();
        
        // Listen for popstate events (browser back/forward)
        window.addEventListener('popstate', () => this.handleRouteChange());
        
        // Initialize animations
        this.initAnimations();

        // Prepare gallery images after initialisation
        this.refreshGalleryImages();
    }

    enforceHttps() {
        if (window.location.protocol === 'https:') {
            return;
        }

        const hostname = window.location.hostname;
        const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(hostname) || /^127\.\d+\.\d+\.\d+$/.test(hostname);
        if (isLocalHost) {
            console.warn('HTTPS enforcement skipped for local development environment.');
            return;
        }

        const targetUrl = `https://${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}`;
        window.location.replace(targetUrl);
    }

    ensureSecurityCookie() {
        const cookieName = 'skincare_app_trusted_session';
        if (this.hasSecureCookie(cookieName)) {
            return;
        }

        const sessionToken = this.generateSecureToken(16);
        this.setSecureCookie(cookieName, sessionToken, {
            days: 365,
            sameSite: 'Strict'
        });
    }

    setSecureCookie(name, value, options = {}) {
        if (!name) {
            return;
        }

        const { days = 365, sameSite = 'Strict' } = options;
        const encodedName = encodeURIComponent(name);
        const encodedValue = encodeURIComponent(value);
        const segments = [`${encodedName}=${encodedValue}`];

        const maxAgeSeconds = Number.isFinite(days) ? Math.max(0, Math.floor(days * 86400)) : 0;
        if (maxAgeSeconds > 0) {
            segments.push(`Max-Age=${maxAgeSeconds}`);
            const expiresAt = new Date(Date.now() + maxAgeSeconds * 1000);
            segments.push(`Expires=${expiresAt.toUTCString()}`);
        }

        segments.push('Path=/');

        const allowedSameSite = ['Strict', 'Lax', 'None'];
        const normalizedSameSite = allowedSameSite.includes(sameSite) ? sameSite : 'Lax';
        segments.push(`SameSite=${normalizedSameSite}`);

        if (normalizedSameSite === 'None' && window.location.protocol !== 'https:') {
            console.warn('SameSite=None cookies require HTTPS for the Secure attribute. Current page is not served over HTTPS.');
        }

        if (window.location.protocol === 'https:') {
            segments.push('Secure');
        } else {
            console.warn('Secure cookies can only be set over HTTPS. Cookie will be set without the Secure attribute.');
        }

        document.cookie = segments.join('; ');
    }

    hasSecureCookie(name) {
        if (!name || !document.cookie) {
            return false;
        }

        const encodedName = `${encodeURIComponent(name)}=`;
        return document.cookie.split(';').some((cookiePart) => cookiePart.trim().startsWith(encodedName));
    }

    generateSecureToken(byteLength = 16) {
        const length = Math.max(1, Math.floor(byteLength));
        if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
            const randomBytes = new Uint8Array(length);
            window.crypto.getRandomValues(randomBytes);
            return Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
        }

        let fallbackToken = '';
        const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let index = 0; index < length * 2; index += 1) {
            const randomIndex = Math.floor(Math.random() * possibleChars.length);
            fallbackToken += possibleChars.charAt(randomIndex);
        }
        return fallbackToken;
    }

    initNavigation() {
        // Mobile menu toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Handle navigation links
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                const route = href.replace('#', '');
                this.navigateTo(route);
                
                // Close mobile menu if open
                if (navMenu && navToggle) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    }

    navigateTo(route) {
        window.history.pushState(null, null, `#${route}`);
        this.handleRouteChange();
    }

    handleRouteChange() {
        const hash = window.location.hash.slice(1) || 'home';
        this.currentRoute = hash;
        
        // Update active nav link
        this.updateActiveNavLink(hash);
        
        // Render the appropriate page
        if (this.routes[hash]) {
            this.routes[hash].call(this);
        } else {
            this.render404();
        }
    }

    renderAdminGalleryList() {
        if (!this.customGalleryImages.length) {
            return '<p class="no-custom-images">No custom images added yet.</p>';
        }

        return this.customGalleryImages.map((image, index) => {
            const sourceLabel = image.sourceType === 'upload' ? 'Uploaded image' : 'External URL';
            const fileName = image.originalName ? ` (${image.originalName})` : '';
            const addedOn = image.createdAt ? this.formatReviewDate(image.createdAt) : 'Recently';
            const viewLabel = image.sourceType === 'upload' ? 'Preview' : 'View';
            return `
            <div class="gallery-admin-item" data-index="${index}">
                <div class="gallery-admin-thumb">
                    <img src="${image.thumbnail || image.src}" alt="${image.alt}">
                </div>
                <div class="gallery-admin-details">
                    <p><strong>Alt:</strong> ${image.alt}</p>
                    <p><strong>Category:</strong> ${image.category}</p>
                    <div class="gallery-admin-meta">
                        <span><strong>Source:</strong> ${sourceLabel}${fileName}</span>
                        <span><strong>Added:</strong> ${addedOn}</span>
                        <a href="${image.src}" target="_blank" rel="noopener noreferrer">${viewLabel}</a>
                    </div>
                </div>
                <button type="button" class="btn btn-secondary gallery-admin-remove" data-remove-index="${index}">
                    Remove
                </button>
            </div>
        `;
        }).join('');
    }

    initGalleryAdmin() {
        const loginButton = document.getElementById('gallery-admin-login');
        if (loginButton && !this.isGalleryAdmin) {
            loginButton.addEventListener('click', () => {
                this.promptGalleryAdminLogin();
            });
        }

        const logoutButton = document.getElementById('gallery-admin-logout');
        if (logoutButton && this.isGalleryAdmin) {
            logoutButton.addEventListener('click', () => {
                this.isGalleryAdmin = false;
                this.galleryAdminOpen = false;
                this.saveGalleryAdminSession(false);
                this.pendingGalleryAdminFeedback = {
                    message: 'Logged out from admin mode.',
                    isSuccess: true
                };
                this.renderGallery();
            });
        }

        if (!this.isGalleryAdmin) {
            return;
        }

        const toggleButton = document.getElementById('gallery-admin-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                this.galleryAdminOpen = !this.galleryAdminOpen;
                this.renderGallery();
            });
        }

        const adminPanel = document.getElementById('gallery-admin-panel');
        if (!adminPanel) {
            return;
        }

        const form = document.getElementById('gallery-admin-form');
        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await this.handleGalleryAdminSubmit(form);
            });
        }

        const listContainer = document.getElementById('gallery-admin-list');
        if (listContainer) {
            listContainer.addEventListener('click', (event) => {
                const removeButton = event.target.closest('[data-remove-index]');
                if (!removeButton) {
                    return;
                }
                const index = Number(removeButton.getAttribute('data-remove-index'));
                if (Number.isNaN(index)) {
                    return;
                }
                this.removeCustomGalleryImage(index);
            });
        }
    }

    async handleGalleryAdminSubmit(form) {
        const formData = new FormData(form);
        const file = formData.get('file');
        const srcInput = (formData.get('src') || '').toString().trim();
        const alt = (formData.get('alt') || '').toString().trim();
        const category = (formData.get('category') || '').toString().trim();
        const thumbnailInput = (formData.get('thumbnail') || '').toString().trim();

        if (!alt || !category) {
            this.setGalleryAdminFeedback('Please provide both a description and a category.', false);
            return;
        }

        const hasFile = file instanceof File && file.size > 0;
        if (!hasFile && !srcInput) {
            this.setGalleryAdminFeedback('Upload an image or provide an image URL.', false);
            return;
        }

        let imageSource = '';
        let sourceType = 'url';
        let originalName;

        if (hasFile) {
            try {
                imageSource = await this.readFileAsDataUrl(file);
            } catch (error) {
                this.setGalleryAdminFeedback('Unable to read the selected file. Please try another image.', false);
                return;
            }
            sourceType = 'upload';
            originalName = file.name;
        } else {
            try {
                new URL(srcInput);
            } catch (error) {
                this.setGalleryAdminFeedback('Please enter a valid image URL.', false);
                return;
            }
            imageSource = srcInput;
        }

        let finalThumbnail = thumbnailInput;
        if (thumbnailInput) {
            try {
                new URL(thumbnailInput);
            } catch (error) {
                this.setGalleryAdminFeedback('Please enter a valid thumbnail URL.', false);
                return;
            }
        } else {
            finalThumbnail = imageSource;
        }

        const newImage = {
            src: imageSource,
            alt,
            category,
            thumbnail: finalThumbnail || undefined,
            sourceType,
            originalName,
            createdAt: new Date().toISOString()
        };

        this.customGalleryImages = [newImage, ...this.customGalleryImages];
        this.saveGalleryImages();
        this.refreshGalleryImages();
        this.pendingGalleryAdminFeedback = {
            message: 'Image added successfully to the gallery.',
            isSuccess: true
        };
        this.renderGallery();
    }

    removeCustomGalleryImage(index) {
        if (index < 0 || index >= this.customGalleryImages.length) {
            return;
        }

        this.customGalleryImages.splice(index, 1);
        this.saveGalleryImages();
        this.refreshGalleryImages();
        this.pendingGalleryAdminFeedback = {
            message: 'Custom image removed.',
            isSuccess: true
        };
        this.renderGallery();
    }

    setGalleryAdminFeedback(message, isSuccess) {
        this.pendingGalleryAdminFeedback = { message, isSuccess };
        this.showPendingGalleryAdminFeedback();
    }

    showPendingGalleryAdminFeedback() {
        if (!this.pendingGalleryAdminFeedback) {
            return;
        }

        const feedback = document.getElementById('gallery-admin-feedback');
        if (feedback) {
            feedback.textContent = this.pendingGalleryAdminFeedback.message;
            feedback.classList.toggle('success', this.pendingGalleryAdminFeedback.isSuccess);
            feedback.classList.toggle('error', !this.pendingGalleryAdminFeedback.isSuccess);
        }

        this.pendingGalleryAdminFeedback = null;
    }

    updateActiveNavLink(route) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current route link
        const activeLink = document.querySelector(`.nav-link[href="#${route}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    renderHome() {
        this.refreshGalleryImages();
        const mainContent = document.getElementById('main-content');
        const galleryItems = this.galleryImages.slice(0, 6).map((image) => {
            const imageSrc = image.thumbnail || image.src;
            return `
            <figure class="gallery-item fade-in">
                <img src="${imageSrc}" alt="${image.alt}" loading="lazy">
            </figure>
        `;
        }).join('');

        const testimonialsHTML = this.testimonials.map((review) => {
            const cappedRating = Math.max(0, Math.min(5, review.rating));
            const stars = Array.from({ length: cappedRating })
                .map(() => '<i class="fas fa-star" aria-hidden="true"></i>')
                .join('');

            return `
                <article class="testimonial-card fade-in">
                    <div class="testimonial-rating" aria-label="${review.rating} out of 5 stars">${stars}</div>
                    <p class="testimonial-quote">“${review.quote}”</p>
                    <p class="testimonial-name">${review.name}</p>
                </article>
            `;
        }).join('');

        mainContent.innerHTML = `
            <section class="hero" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.4)), url('public/images/hero-background.jpg') center/cover no-repeat;">
                <div class="container">
                    <div class="hero-content fade-in">
                        <h1>Welcome to Skin Care by Laxmi</h1>
                        <p>Experience ultimate relaxation and rejuvenation with our premium skin care and wellness services. Your journey to radiant confidence begins here.</p>
                        <div class="hero-buttons">
                            <a href="#services" class="btn btn-secondary" data-link>View Services</a>
                            <a href="https://skincarebylaxmi.glossgenius.com/" class="btn btn-booking" target="_blank" rel="noopener noreferrer">
                                <i class="far fa-calendar-alt"></i> Book Now
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <section class="services">
                <div class="container">
                    <h2 class="text-center fade-in">Our Featured Services</h2>
                    <div class="services-grid">
                        <div class="service-card fade-in">
                            <div class="service-image">
                                <img src="public/images/services/OIP.jpg" alt="Laxmi's Facial Special" loading="lazy">
                            </div>
                            <div class="service-icon">
                                <i class="fas fa-seedling"></i>
                            </div>
                            <h3>Laxmi's Facial Special</h3>
                            <p>Indulge in our luxurious facial treatment, now at a discounted price for a limited time.</p>
                            <a href="https://skincarebylaxmi.glossgenius.com/" class="btn-booking" target="_blank">
                                <i class="far fa-calendar-alt"></i> Book Now
                            </a>
                        </div>
                        <div class="service-card fade-in">
                            <div class="service-image">
                                <img src="public/images/services/OIP4.jpg" alt="Microdermabrasion" loading="lazy">
                            </div>
                            <div class="service-icon">
                                <i class="fas fa-leaf"></i>
                            </div>
                            <h3>Microdermabrasion</h3>
                            <p>Exfoliate and refresh your skin with this rejuvenating microdermabrasion treatment.</p>
                            <a href="https://skincarebylaxmi.glossgenius.com/services" class="btn-booking" target="_blank">
                                <i class="far fa-calendar-alt"></i> Book Now
                            </a>
                        </div>
                        <div class="service-card fade-in">
                            <div class="service-image">
                                <img src="public/images/services/R.jpg" alt="Lash Lift" loading="lazy">
                            </div>
                            <div class="service-icon">
                                <i class="fas fa-hot-tub"></i>
                            </div>
                           <h3>Lash Lift</h3>
                            <p>Lift and curl your lashes for a natural, wide-eyed look.</p>
                            <a href="https://skincarebylaxmi.glossgenius.com/" class="btn-booking" target="_blank">
                                <i class="far fa-calendar-alt"></i> Book Now
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <section class="gallery-section">
                <div class="container">
                    <h2 class="text-center fade-in">Gallery</h2>
                    <p class="text-center fade-in gallery-intro">A glimpse into our serene studio and rejuvenating treatments.</p>
                    <div class="gallery-grid">
                        ${galleryItems}
                    </div>
                    <div class="gallery-cta text-center">
                        <a href="#gallery" class="btn btn-primary" data-link>View Full Gallery</a>
                    </div>
                </div>
            </section>
            <section class="testimonial-section">
                <div class="container">
                    <h2 class="text-center fade-in">Client Reviews</h2>
                    <p class="text-center fade-in testimonial-intro">Hear from our guests about their experiences at Skin Care by Laxmi.</p>
                    <div class="testimonials-grid">
                        ${testimonialsHTML}
                    </div>
                </div>
            </section>
            <div class="map">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3159.651539454785!2d-122.49098114669323!3d37.63388370001684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f7a54560eff75%3A0x49e35ccbd343541d!2s80%20Eureka%20Dr%20%23136%2C%20Pacifica%2C%20CA%2094044%2C%20USA!5e0!3m2!1sen!2snp!4v1758955751221!5m2!1sen!2snp" width="100%" height="450" style="border:0;" allowfullscreen="" loading="eager" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>`;
        
        this.initAnimations();
    }

    renderServices() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            return;
        }

        const sortedCategories = Object.entries(servicesByCategory).sort(([nameA], [nameB]) => {
            const matchA = nameA.match(/^(\d+)\./);
            const matchB = nameB.match(/^(\d+)\./);
            if (matchA && matchB) {
                return parseInt(matchA[1], 10) - parseInt(matchB[1], 10);
            }
            if (matchA) return -1;
            if (matchB) return 1;
            return nameA.localeCompare(nameB);
        });

        const categoryOptions = sortedCategories.map(([categoryName]) => {
            const displayCategoryName = categoryName.replace(/^\d+\.\s*/, '');
            return `<option value="${categoryName}">${displayCategoryName}</option>`;
        }).join('');

        const filterCategories = (query) => {
            const filteredCategories = this.selectedServiceCategory === 'all'
                ? sortedCategories
                : sortedCategories.filter(([categoryName]) => categoryName === this.selectedServiceCategory);

            const searchQuery = (query ?? this.serviceSearchQuery).trim().toLowerCase();

            return filteredCategories
                .map(([categoryName, services]) => {
                    if (!searchQuery) {
                        return [categoryName, services];
                    }

                    const matchingServices = services.filter((service) => {
                        const nameMatch = service.name.toLowerCase().includes(searchQuery);
                        const descriptionMatch = service.description.toLowerCase().includes(searchQuery);
                        return nameMatch || descriptionMatch;
                    });

                    return [categoryName, matchingServices];
                })
                .filter(([, services]) => services.length > 0);
        };

        const renderServicesMarkup = ([categoryName, services]) => {
            const displayCategoryName = categoryName.replace(/^\d+\.\s*/, '');

            const cardsHTML = services.map((service) => {
                const iconClass = service.icon.startsWith('fa-') ? `fas ${service.icon}` : service.icon;
                return `
                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/${service.image}') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="${iconClass}"></i>
                            </div>
                            <h3>${service.name}</h3>
                            <p>${service.description}</p>
                            <strong>${service.price} | ${service.duration}</strong>
                            <a href="${this.bookingUrl}" class="btn-booking" target="_blank" rel="noopener noreferrer">
                                <i class="far fa-calendar-alt"></i> Book Now
                            </a>
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="category-section">
                    <h2 class="category-title fade-in">${displayCategoryName}</h2>
                    <div class="services-grid">
                        ${cardsHTML}
                    </div>
                </div>
            `;
        };

        const updateServicesContent = (query) => {
            const categoriesWithServices = filterCategories(query);
            const servicesWrapper = document.getElementById('services-wrapper');
            if (!servicesWrapper) {
                return;
            }

            const servicesHTML = categoriesWithServices.map(renderServicesMarkup).join('');
            servicesWrapper.innerHTML = servicesHTML || `
                <div class="category-section">
                    <p class="text-center fade-in">No services match your current filters.</p>
                </div>
            `;

            this.initAnimations();
        };

        mainContent.innerHTML = `
            <section class="services">
                <div class="container">
                    <h1 class="text-center fade-in">Our Services</h1>
                    <p class="text-center fade-in">Explore our range of luxurious treatments designed to help you relax, unwind, and rejuvenate.</p>
                    <div class="services-controls fade-in">
                        <div class="category-filter">
                            <label for="service-category-filter" class="filter-label">Filter by category:</label>
                            <select id="service-category-filter" class="filter-select">
                                <option value="all">All Categories</option>
                                ${categoryOptions}
                            </select>
                        </div>
                        <div class="search-filter">
                            <label for="service-search" class="filter-label">Search services:</label>
                            <input type="search" id="service-search" class="filter-input" placeholder="Search by name or description" aria-label="Search services">
                        </div>
                    </div>
                    <div id="services-wrapper"></div>
                </div>
            </section>
        `;

        const categoryFilter = document.getElementById('service-category-filter');
        if (categoryFilter) {
            categoryFilter.value = this.selectedServiceCategory;
            categoryFilter.addEventListener('change', (event) => {
                this.selectedServiceCategory = event.target.value;
                this.renderServices();
            });
        }

        const serviceSearchInput = document.getElementById('service-search');
        if (serviceSearchInput) {
            serviceSearchInput.value = this.serviceSearchQuery;
            if (this.serviceSearchFocused) {
                const caretPosition = typeof this.serviceSearchCaret === 'number'
                    ? Math.min(this.serviceSearchCaret, this.serviceSearchQuery.length)
                    : this.serviceSearchQuery.length;
                serviceSearchInput.focus();
                try {
                    serviceSearchInput.setSelectionRange(caretPosition, caretPosition);
                } catch (error) {
                    // Some browsers may not allow setting selection on certain input types
                }
            }
            serviceSearchInput.addEventListener('input', (event) => {
                const target = event.target;
                this.serviceSearchQuery = target.value;
                this.serviceSearchFocused = true;
                this.serviceSearchCaret = typeof target.selectionStart === 'number'
                    ? target.selectionStart
                    : target.value.length;
                if (this.serviceSearchDebounce) {
                    clearTimeout(this.serviceSearchDebounce);
                }
                this.serviceSearchDebounce = window.setTimeout(() => {
                    this.serviceSearchDebounce = null;
                    updateServicesContent();
                }, 300);
            });
            serviceSearchInput.addEventListener('focus', (event) => {
                const target = event.target;
                this.serviceSearchFocused = true;
                this.serviceSearchCaret = typeof target.selectionStart === 'number'
                    ? target.selectionStart
                    : target.value.length;
            });
            serviceSearchInput.addEventListener('blur', () => {
                this.serviceSearchFocused = false;
                this.serviceSearchCaret = null;
                if (this.serviceSearchDebounce) {
                    clearTimeout(this.serviceSearchDebounce);
                    this.serviceSearchDebounce = null;
                    updateServicesContent();
                }
            });
        }

        // Initial render to ensure results reflect existing query
        updateServicesContent();

        this.initAnimations();
    }
    
    renderGallery() {
        this.refreshGalleryImages();
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            return;
        }

        const categories = ['all', ...new Set(this.galleryImages.map((image) => image.category))];
        const filteredImages = this.selectedGalleryCategory === 'all'
            ? this.galleryImages
            : this.galleryImages.filter((image) => image.category === this.selectedGalleryCategory);

        const filterButtons = categories.map((category) => {
            const isActive = category === this.selectedGalleryCategory ? 'active' : '';
            const label = category === 'all' ? 'All' : category;
            return `<button type="button" class="filter-btn ${isActive}" data-category="${category}">${label}</button>`;
        }).join('');

        const galleryGrid = filteredImages.map((image, index) => {
            const imageSrc = image.thumbnail || image.src;
            return `
            <figure class="gallery-card fade-in" data-src="${image.src}" data-alt="${image.alt}" data-index="${index}">
                <img src="${imageSrc}" alt="${image.alt}" loading="lazy">
                <figcaption>${image.alt}</figcaption>
            </figure>
        `;
        }).join('');

        const galleryMarkup = galleryGrid || `
            <p class="text-center fade-in">No images found for this category.</p>
        `;

        const adminPanelMarkup = this.isGalleryAdmin ? `
                    <section id="gallery-admin-panel" class="gallery-admin-panel ${this.galleryAdminOpen ? 'open' : ''}">
                        <h2>Gallery Admin</h2>
                        <p>Add new images to the gallery. Stored locally in your browser.</p>
                        <form id="gallery-admin-form" class="gallery-admin-form" novalidate>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="gallery-image-file">Upload Image</label>
                                    <input type="file" id="gallery-image-file" name="file" accept="image/*">
                                </div>
                                <div class="form-group">
                                    <label for="gallery-image-src">Image URL (optional)</label>
                                    <input type="url" id="gallery-image-src" name="src" placeholder="https://example.com/image.jpg">
                                </div>
                                <div class="form-group">
                                    <label for="gallery-image-alt">Description (Alt Text)</label>
                                    <input type="text" id="gallery-image-alt" name="alt" placeholder="Describe the image" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="gallery-image-category">Category</label>
                                    <input type="text" id="gallery-image-category" name="category" placeholder="Category" required>
                                </div>
                                <div class="form-group">
                                    <label for="gallery-image-thumb">Optional Thumbnail URL</label>
                                    <input type="url" id="gallery-image-thumb" name="thumbnail" placeholder="Defaults to image URL or uploaded file">
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-plus-circle"></i> Add Image
                            </button>
                        </form>
                        <div class="gallery-admin-feedback" id="gallery-admin-feedback"></div>
                        <div class="gallery-admin-stored">
                            <h3>Stored Custom Images (${this.customGalleryImages.length})</h3>
                            <div id="gallery-admin-list" class="gallery-admin-list">
                                ${this.renderAdminGalleryList()}
                            </div>
                        </div>
                    </section>
        ` : '';

        mainContent.innerHTML = `
            <section class="gallery-page">
                <div class="container">
                    <header class="gallery-header fade-in">
                        <h1>Gallery</h1>
                        <p>Explore moments from our studio, treatments, and client experiences.</p>
                    </header>
                    <div class="gallery-filters" role="tablist">
                        ${filterButtons}
                    </div>
                    <div class="gallery-page-grid">
                        ${galleryMarkup}
                    </div>
                    ${adminPanelMarkup}
                    <div class="gallery-admin-controls">
                        ${this.isGalleryAdmin ? `
                        <button type="button" id="gallery-admin-toggle" class="btn btn-secondary gallery-admin-toggle">
                            ${this.galleryAdminOpen ? 'Close Admin Panel' : 'Open Admin Panel'}
                        </button>
                        <button type="button" id="gallery-admin-logout" class="btn btn-tertiary gallery-admin-logout">
                            Log out
                        </button>
                        ` : `
                        <button type="button" id="gallery-admin-login" class="gallery-admin-logo-button gallery-admin-toggle" aria-label="Admin Login">
                            <img src="public/images/logo.png" alt="Admin Login" class="gallery-admin-logo">
                        </button>
                        `}
                    </div>
                </div>
                <div class="lightbox" id="gallery-lightbox" aria-hidden="true" role="dialog" aria-modal="true">
                    <div class="lightbox-content">
                        <button class="lightbox-close" type="button" aria-label="Close gallery preview">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <img id="lightbox-image" src="" alt="">
                        <p id="lightbox-caption"></p>
                    </div>
                </div>
            </section>
        `;

        this.initGalleryInteractions();
        this.initGalleryAdmin();
        this.showPendingGalleryAdminFeedback();
        this.initAnimations();
    }

    renderReviews() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            return;
        }

        const reviews = this.reviews.length ? this.reviews : this.testimonials;
        const averageRating = reviews.length
            ? (reviews.reduce((total, review) => total + Math.max(0, Math.min(5, Number(review.rating) || 0)), 0) / reviews.length).toFixed(1)
            : '0.0';

        const reviewsMarkup = reviews.length ? reviews.map((review) => {
            const cappedRating = Math.max(0, Math.min(5, Number(review.rating) || 0));
            const stars = Array.from({ length: cappedRating })
                .map(() => '<i class="fas fa-star" aria-hidden="true"></i>')
                .join('');
            const displayDate = review.date ? this.formatReviewDate(review.date) : 'Recently';
            const message = review.quote || review.message || '';
            return `
                <article class="review-card fade-in">
                    <div class="review-card-header">
                        <div class="review-rating" aria-label="${cappedRating} out of 5 stars">
                            ${stars}
                        </div>
                        <span class="review-date">${displayDate}</span>
                    </div>
                    <p class="review-message">“${message}”</p>
                    <p class="review-author">${review.name}</p>
                </article>
            `;
        }).join('') : `
            <p class="text-center fade-in">No reviews yet. Be the first to share your experience.</p>
        `;

        mainContent.innerHTML = `
            <section class="reviews-page">
                <div class="container">
                    <header class="reviews-header fade-in">
                        <h1>Client Reviews</h1>
                        <p>We love hearing from our guests. Share your experience and read what others have to say.</p>
                    </header>
                    <section class="review-summary fade-in" aria-label="Average rating">
                        <div>
                            <span class="summary-rating">${averageRating}</span>
                            <span class="summary-out-of">/ 5.0</span>
                        </div>
                        <p>${reviews.length} review${reviews.length === 1 ? '' : 's'} shared</p>
                    </section>
                    <section class="review-form-section fade-in" aria-labelledby="review-form-title">
                        <h2 id="review-form-title">Share Your Experience</h2>
                        <form id="review-form" class="review-form" novalidate>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="reviewer-name">Full Name</label>
                                    <input type="text" id="reviewer-name" name="name" placeholder="Your name" required>
                                </div>
                                <div class="form-group">
                                    <label for="review-rating">Rating</label>
                                    <select id="review-rating" name="rating" required>
                                        <option value="" disabled selected>Select rating</option>
                                        <option value="5">5 - Excellent</option>
                                        <option value="4">4 - Great</option>
                                        <option value="3">3 - Good</option>
                                        <option value="2">2 - Fair</option>
                                        <option value="1">1 - Needs improvement</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="review-message">Your Review</label>
                                <textarea id="review-message" name="message" placeholder="Tell us about your visit" minlength="10" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary submit-review-btn">
                                <i class="fas fa-paper-plane"></i> Submit Review
                            </button>
                            <p class="form-disclaimer">By submitting, you agree to let us display your first name and review on our site.</p>
                        </form>
                    </section>
                    <section class="review-list" aria-live="polite">
                        ${reviewsMarkup}
                    </section>
                </div>
            </section>
        `;

        this.initReviewForm();
        this.showPendingReviewFeedback();
        this.initAnimations();
    }

    renderAbout() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <section class="about">
                <div class="container">
                    <div class="about-content">
                        <div class="about-text fade-in">
                            <h2>About Skin Care by Laxmi</h2>
                            <p>Founded in 2025, Skin Care by Laxmi has been dedicated to providing exceptional wellness experiences in a tranquil, nurturing environment. Our mission is to help you achieve balance, relaxation, and rejuvenation through our comprehensive range of therapeutic treatments.</p>
                            
                            
                            <h3>Why Choose Skin Care by Laxmi?</h3>
                            <ul>
                                <li>Licensed Skin Therapist (Esthetician) delivering advanced skincare services in a relaxing, rejuvenating environment.</li>
                                <li>Graduate of the San Francisco Institute of Esthetics and Cosmetology with over a decade of industry experience across esteemed Bay Area spas.</li>
                                <li>Specializes in anti-aging therapies including LED light therapy, microcurrent, microdermabrasion, oxygen treatments, hydra facials, threading hair removal, full-body waxing, and advanced eyebrow services.</li>
                                <li>Certified professional with extensive knowledge of leading skincare brands such as Dermalogica, Osmosis, Skin Scripts, and Eminence.</li>
                                <li>Integrates innovative Korean skincare lines like Ao Medical, Sculplla, and GeneO+ into tailored treatment plans.</li>
                            </ul>
                        </div>
                        
                        <div class="about-image fade-in">
                            <div style="background: linear-gradient(135deg, var(--accent-color), var(--light-bg)); height: 400px; border-radius: 15px; display: flex; align-items: center; justify-content: center; color: var(--primary-color); font-size: 4rem;">
                                <i class="fas fa-seedling"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        this.initAnimations();
    }

    renderContact() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <section class="contact">
                <div class="container">
                    <h1 class="text-center fade-in">Contact Us</h1>
                    <p class="text-center fade-in">Get in touch with us to schedule your appointment or ask any questions.</p>
                    
                    <div class="contact-content">
                        
                        
                        <div class="contact-info fade-in">
                            <h3>Visit Us</h3>
                            <div class="contact-details">
                                <div class="contact-item">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <div class="contact-text">
                                        <span class="contact-label">Address:</span>
                                        <span class="contact-value"><a href="https://www.google.com/maps/place/80+Eureka+Dr+%23136,+Pacifica,+CA+94044,+USA/@37.633884,-122.488792,16z/data=!4m6!3m5!1s0x808f7a54560eff75:0x49e35ccbd343541d!8m2!3d37.6338839!4d-122.4887925!16s%2Fg%2F11ll6tgzzg?hl=en&entry=ttu&g_ep=EgoyMDI1MDkyNC4wIKXMDSoASAFQAw%3D%3D">80 Eureka Dr #136
80 Eureka Dr, Pacifica, CA 94044, USA</a></span>
                                    </div>
                                </div>
                                
                                <div class="contact-item">
                                    <i class="fas fa-phone"></i>
                                    <div class="contact-text">
                                        <span class="contact-label">Phone:</span>
                                        <span class="contact-value"><a href="tel:+1-415-967-9554">+1-415-967-9554</a></span>
                                    </div>
                                </div>
                                
                                <div class="contact-item">
                                    <i class="fas fa-envelope"></i>
                                    <div class="contact-text">
                                        <span class="contact-label">Email:</span>
                                        <span class="contact-value">
                                            <a href="mailto:skincarebylaxmi@gmail.com">skincarebylaxmi@gmail.com</a>
                                            <br>
                                            <a href="mailto:laxmi_sanu2@yahoo.com">laxmi_sanu2@yahoo.com</a>
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="contact-item">
                                    <i class="fas fa-clock"></i>
                                    <div class="contact-text">
                                        <span class="contact-label">Hours:</span>
                                        <div class="hours-info">
                                            <div class="hours-row">
                                                <span class="days">Monday:</span>
                                                <span class="times">10:00 AM - 6:00 PM</span>
                                            </div>
                                            <div class="hours-row">
                                                <span class="days">Tuesday:</span>
                                                <span class="times">Closed</span>
                                            </div>
                                            <div class="hours-row">
                                                <span class="days">Wednesday:</span>
                                                <span class="times">Closed</span>
                                            </div>
                                           
                                            <div class="hours-row">
                                                <span class="days">Thursday:</span>
                                                <span class="times">10:00 AM - 6:00 PM</span>
                                            </div>
                                            <div class="hours-row">
                                                <span class="days">Friday:</span>
                                                <span class="times">10:00 AM - 6:00 PM</span>
                                            </div>
                                            <div class="hours-row">
                                                <span class="days">Saturday:</span>
                                                <span class="times">12:00 PM - 6:00 PM</span>
                                            </div>
                                            <div class="hours-row">
                                                <span class="days">Sunday:</span>
                                                <span class="times">10:00 AM - 6:00 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="social-section mt-2">
                                <h4>Follow Us</h4>
                                <div class="social-links">
                                    <a href="https://www.facebook.com/laxmi.bhandari.507/#" aria-label="Facebook" target="_blank"><i class="fab fa-facebook"></i></a>
                                    <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                                    <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                                </div>
                            </div>

                            <div class="policy-section fade-in">
                                <h4>Cancellation Policy</h4>
                                <p>We will charge a 50% cancellation fee for any no-show or cancellations within 24 hours of the scheduled appointment.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        this.initAnimations();
        this.initContactForm();
    }

     
    render404() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <section class="hero">

                <div class="container text-center">
                    <h1>Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                    <a href="#home" class="btn btn-primary" data-link>Return Home</a>
                </div>
            </section>
        `;
    }

    initAnimations() {
        // Intersection Observer for fade-in animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    refreshGalleryImages() {
        this.galleryImages = [...this.customGalleryImages, ...this.defaultGalleryImages];
    }

    readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read file.'));
            reader.readAsDataURL(file);
        });
    }

    loadGalleryAdminSession() {
        try {
            const stored = window.localStorage.getItem(this.galleryAdminSessionKey);
            if (!stored) {
                return false;
            }
            const decoded = window.atob(stored);
            return decoded === window.atob(this.galleryAdminSecret);
        } catch (error) {
            console.warn('Failed to read admin session', error);
            return false;
        }
    }

    saveGalleryAdminSession(isAdmin) {
        if (!isAdmin) {
            window.localStorage.removeItem(this.galleryAdminSessionKey);
            return;
        }
        try {
            const value = window.btoa(window.atob(this.galleryAdminSecret));
            window.localStorage.setItem(this.galleryAdminSessionKey, value);
        } catch (error) {
            console.warn('Failed to persist admin session', error);
        }
    }

    promptGalleryAdminLogin() {
        const expectedPassphrase = window.atob(this.galleryAdminSecret);
        const input = window.prompt('Enter admin passphrase to manage the gallery:');
        if (input === null) {
            return;
        }

        if (input.trim() === expectedPassphrase) {
            this.isGalleryAdmin = true;
            this.galleryAdminOpen = true;
            this.saveGalleryAdminSession(true);
            this.pendingGalleryAdminFeedback = {
                message: 'Admin mode enabled. You can now manage gallery images.',
                isSuccess: true
            };
            this.renderGallery();
        } else {
            window.alert('Incorrect passphrase. Access denied.');
        }
    }

    initContactForm() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmit(form);
            });
        }
    }

    initGalleryInteractions() {
        const filterContainer = document.querySelector('.gallery-filters');
        if (filterContainer) {
            filterContainer.addEventListener('click', (event) => {
                const button = event.target.closest('.filter-btn');
                if (!button) {
                    return;
                }
                const category = button.getAttribute('data-category');
                if (category && category !== this.selectedGalleryCategory) {
                    this.selectedGalleryCategory = category;
                    this.renderGallery();
                }
            });
        }

        const galleryGrid = document.querySelectorAll('.gallery-card');
        const lightbox = document.getElementById('gallery-lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxCaption = document.getElementById('lightbox-caption');

        const openLightbox = (src, alt) => {
            if (!lightbox || !lightboxImage) {
                return;
            }
            lightboxImage.src = src;
            lightboxImage.alt = alt;
            if (lightboxCaption) {
                lightboxCaption.textContent = alt;
            }
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            if (!lightbox) {
                return;
            }
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        galleryGrid.forEach((card) => {
            card.addEventListener('click', () => {
                const src = card.getAttribute('data-src');
                const alt = card.getAttribute('data-alt');
                if (src) {
                    openLightbox(src, alt || 'Gallery image');
                }
            });
        });

        if (lightbox) {
            if (this.boundLightboxKeydownHandler) {
                document.removeEventListener('keydown', this.boundLightboxKeydownHandler);
                this.boundLightboxKeydownHandler = null;
            }

            lightbox.addEventListener('click', (event) => {
                if (event.target === lightbox || event.target.closest('.lightbox-close')) {
                    closeLightbox();
                }
            });

            this.boundLightboxKeydownHandler = (event) => {
                if (event.key === 'Escape' && lightbox.classList.contains('visible')) {
                    closeLightbox();
                }
            };

            document.addEventListener('keydown', this.boundLightboxKeydownHandler);
        }
    }

    initReviewForm() {
        const form = document.getElementById('review-form');
        if (!form) {
            return;
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleReviewSubmit(form);
        });
    }

    handleReviewSubmit(form) {
        const formData = new FormData(form);
        const name = (formData.get('name') || '').toString().trim();
        const rating = Number(formData.get('rating'));
        const message = (formData.get('message') || '').toString().trim();

        if (!name || !message || !(rating >= 1 && rating <= 5)) {
            this.displayFormFeedback(form, 'Please complete all fields and provide a rating between 1 and 5.', false);
            return;
        }

        const newReview = {
            name,
            rating,
            message,
            date: new Date().toISOString()
        };

        this.reviews = [newReview, ...this.reviews];
        this.saveReviews();
        this.pendingReviewFeedback = {
            message: 'Thank you for sharing your experience! Your review has been added.',
            isSuccess: true
        };
        this.renderReviews();
    }

    displayFormFeedback(form, message, isSuccess) {
        let feedback = form.querySelector('.form-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'form-feedback';
            form.insertBefore(feedback, form.firstChild);
        }

        feedback.textContent = message;
        feedback.classList.toggle('success', isSuccess);
        feedback.classList.toggle('error', !isSuccess);
        feedback.setAttribute('role', 'alert');

        if (isSuccess) {
            setTimeout(() => {
                if (feedback && feedback.parentElement) {
                    feedback.remove();
                }
            }, 5000);
        }
    }

    showPendingReviewFeedback() {
        if (!this.pendingReviewFeedback) {
            return;
        }
        const form = document.getElementById('review-form');
        if (form) {
            this.displayFormFeedback(form, this.pendingReviewFeedback.message, this.pendingReviewFeedback.isSuccess);
            if (this.pendingReviewFeedback.isSuccess) {
                form.reset();
            }
        }
        this.pendingReviewFeedback = null;
    }

    loadStoredReviews() {
        try {
            const stored = window.localStorage.getItem(this.reviewStorageKey);
            if (!stored) {
                return [...this.testimonials];
            }
            const parsed = JSON.parse(stored);
            if (!Array.isArray(parsed)) {
                return [...this.testimonials];
            }
            return parsed.map((review) => ({
                ...review,
                rating: Math.max(0, Math.min(5, Number(review.rating) || 0))
            }));
        } catch (error) {
            console.error('Failed to load saved reviews', error);
            return [...this.testimonials];
        }
    }

    saveReviews() {
        try {
            window.localStorage.setItem(this.reviewStorageKey, JSON.stringify(this.reviews));
        } catch (error) {
            console.error('Failed to save reviews', error);
        }
    }

    loadStoredGalleryImages() {
        try {
            const stored = window.localStorage.getItem(this.galleryStorageKey);
            if (!stored) {
                return [];
            }
            const parsed = JSON.parse(stored);
            if (!Array.isArray(parsed)) {
                return [];
            }
            return parsed.filter((image) => typeof image === 'object' && image !== null && typeof image.src === 'string')
                .map((image) => ({
                    src: image.src,
                    alt: (image.alt || 'Gallery image').toString(),
                    category: (image.category || 'Uncategorized').toString(),
                    thumbnail: typeof image.thumbnail === 'string' ? image.thumbnail : undefined,
                    sourceType: image.sourceType === 'upload' ? 'upload' : 'url',
                    originalName: typeof image.originalName === 'string' ? image.originalName : undefined,
                    createdAt: image.createdAt || new Date().toISOString()
                }));
        } catch (error) {
            console.error('Failed to load gallery images', error);
            return [];
        }
    }

    saveGalleryImages() {
        try {
            window.localStorage.setItem(this.galleryStorageKey, JSON.stringify(this.customGalleryImages));
        } catch (error) {
            console.error('Failed to save gallery images', error);
        }
    }

    formatReviewDate(date) {
        if (!date) {
            return 'Recently';
        }
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) {
            return 'Recently';
        }
        return parsedDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    handleContactSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Remove any previous success message
        let successMsg = form.parentElement.querySelector('.form-success-message');
        if (successMsg) {
            successMsg.remove();
        }

        // Create and display success message
        successMsg = document.createElement('div');
        successMsg.className = 'form-success-message';
        successMsg.style.marginTop = '1rem';
        successMsg.style.padding = '1rem';
        successMsg.style.backgroundColor = '#e6ffe6';
        successMsg.style.border = '1px solid #b2ffb2';
        successMsg.style.color = '#207520';
        successMsg.style.borderRadius = '6px';
        successMsg.innerHTML = `Thank you for your message! We will get back to you within 24 hours.`;

        form.parentElement.insertBefore(successMsg, form.nextSibling);
        
        // Reset form
        form.reset();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successMsg) {
                successMsg.remove();
            }
        }, 5000);
    }

    handleBookingSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Remove any previous success message
        let successMsg = form.parentElement.querySelector('.booking-success-message');
        if (successMsg) {
            successMsg.remove();
        }

        // Create and display success message
        successMsg = document.createElement('div');
        successMsg.className = 'booking-success-message';
        successMsg.style.marginTop = '1rem';
        successMsg.style.padding = '1rem';
        successMsg.style.backgroundColor = '#e6ffe6';
        successMsg.style.border = '1px solid #b2ffb2';
        successMsg.style.color = '#207520';
        successMsg.style.borderRadius = '6px';
        successMsg.innerHTML = `Thank you for your booking request! We will confirm your appointment for <strong>${data.date}</strong> at <strong>${data.time}</strong> via email or phone.`;

        form.parentElement.insertBefore(successMsg, form.nextSibling);
        
        // Reset form
        form.reset();
        
        // Remove success message after 7 seconds
        setTimeout(() => {
            if (successMsg) {
                successMsg.remove();
            }
        }, 7000);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SkinCareApp();
});

// Export for potential testing or external use
export default SkinCareApp;
