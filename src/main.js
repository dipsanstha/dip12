import { servicesByCategory } from './servicesData.js';

// Main JavaScript for Spa Massage Website SPA
class SpaApp {
    constructor() {
        this.currentRoute = '';
        this.routes = {
            '': this.renderHome,
            'home': this.renderHome,
            'services': this.renderServices,
            'about': this.renderAbout,
            'contact': this.renderContact,
            
        };

        this.selectedServiceCategory = 'all';
        
        this.init();
    }

    init() {
        // Initialize navigation
        this.initNavigation();
        
        // Handle initial route
        this.handleRouteChange();
        
        // Listen for popstate events (browser back/forward)
        window.addEventListener('popstate', () => this.handleRouteChange());
        
        // Initialize animations
        this.initAnimations();
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
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <section class="hero" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.4)), url('public/images/hero-background.jpg') center/cover no-repeat;">
                <div class="container">
                    <div class="hero-content fade-in">
                        <h1>Welcome to Skin Care by Laxmi</h1>
                        <p>Experience ultimate relaxation and rejuvenation with our premium spa and massage services. Your journey to wellness begins here.</p>
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
                                <i class="fas fa-spa"></i>
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
                            <a href="https://skincarebylaxmi.glossgenius.com/" class="btn-booking" target="_blank">
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
            </section>`;
        
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

        const filteredCategories = this.selectedServiceCategory === 'all'
            ? sortedCategories
            : sortedCategories.filter(([categoryName]) => categoryName === this.selectedServiceCategory);

        const servicesHTML = filteredCategories.map(([categoryName, services]) => {
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
        }).join('');

        const servicesContent = servicesHTML || `
            <div class="category-section">
                <p class="text-center fade-in">No services available for the selected category.</p>
            </div>
        `;

        mainContent.innerHTML = `
            <section class="services">
                <div class="container">
                    <h1 class="text-center fade-in">Our Services</h1>
                    <p class="text-center fade-in">Explore our range of luxurious treatments designed to help you relax, unwind, and rejuvenate.</p>
                    <div class="category-filter fade-in">
                        <label for="service-category-filter" class="filter-label">Filter by category:</label>
                        <select id="service-category-filter" class="filter-select">
                            <option value="all">All Categories</option>
                            ${categoryOptions}
                        </select>
                    </div>
                    ${servicesContent}
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
                            
                            <p>Our team of licensed massage therapists and wellness professionals bring years of experience and passion for healing to every session. We believe in the power of touch therapy to not only relax the body but also restore the mind and spirit.</p>
                            
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
                                <i class="fas fa-spa"></i>
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
                                        <span class="contact-value"><a href="">123 Wellness Avenue<br>Peaceful City, State 12345</a></span>
                                    </div>
                                </div>
                                
                                <div class="contact-item">
                                    <i class="fas fa-phone"></i>
                                    <div class="contact-text">
                                        <span class="contact-label">Phone:</span>
                                        <span class="contact-value"><a href="tel:">(555) 123-4567</a></span>
                                    </div>
                                </div>
                                
                                <div class="contact-item">
                                    <i class="fas fa-envelope"></i>
                                    <div class="contact-text">
                                        <span class="contact-label">Email:</span>
                                        <span class="contact-value"><a href="mailto:">info@SkinCarebyLaxmi.com</a></span>
                                    </div>
                                </div>
                                
                                <div class="contact-item">
                                    <i class="fas fa-clock"></i>
                                    <div class="contact-text">
                                        <span class="contact-label">Hours:</span>
                                        <div class="hours-info">
                                            <div class="hours-row">
                                                <span class="days">Monday:</span>
                                                <span class="times">10:00 AM - 5:00 PM</span>
                                            </div>
                                            <div class="hours-row">
                                                <span class="days">Tuesday:</span>
                                                <span class="times">10:00 AM - 5:00 PM</span>
                                            </div>
                                            <div class="hours-row">
                                                <span class="days">Wednesday:</span>
                                                <span class="times">10:00 AM - 5:00 PM</span>
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
                                                <span class="times">10:00 AM - 5:00 PM</span>
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

    initContactForm() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmit(form);
            });
        }
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
    new SpaApp();
});

// Export for potential testing or external use
export default SpaApp;
