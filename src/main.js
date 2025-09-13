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
            'booking': this.renderBooking
        };
        
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
            <section class="hero" style="background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/images/hero-background.jpg') center/cover no-repeat;">
                <div class="container">
                    <div class="hero-content fade-in">
                        <h1>Welcome to Serenity Spa & Massage</h1>
                        <p>Experience ultimate relaxation and rejuvenation with our premium spa and massage services. Your journey to wellness begins here.</p>
                        <div class="hero-buttons">
                            <a href="#booking" class="btn btn-primary" data-link>Book Appointment</a>
                            <a href="#services" class="btn btn-secondary" data-link>View Services</a>
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
                                <img src="public/images/services/deep-tissue-massage.jpg" alt="Deep Tissue Massage" loading="lazy">
                            </div>
                            <div class="service-icon">
                                <i class="fas fa-spa"></i>
                            </div>
                            <h3>Deep Tissue Massage</h3>
                            <p>Therapeutic massage targeting deep muscle tensions and chronic pain relief.</p>
                        </div>
                        <div class="service-card fade-in">
                            <div class="service-image">
                                <img src="public/images/services/aromatherapy-massage.jpg" alt="Aromatherapy Massage" loading="lazy">
                            </div>
                            <div class="service-icon">
                                <i class="fas fa-leaf"></i>
                            </div>
                            <h3>Aromatherapy</h3>
                            <p>Relaxing massage combined with essential oils for ultimate stress relief.</p>
                        </div>
                        <div class="service-card fade-in">
                            <div class="service-image">
                                <img src="public/images/services/hot-stone-therapy.jpg" alt="Hot Stone Therapy" loading="lazy">
                            </div>
                            <div class="service-icon">
                                <i class="fas fa-hot-tub"></i>
                            </div>
                            <h3>Hot Stone Therapy</h3>
                            <p>Heated stone massage to melt away tension and improve circulation.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        this.initAnimations();
    }

    renderServices() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <section class="services">
                <div class="container">
                    <h1 class="text-center fade-in">Our Services</h1>
                    <p class="text-center fade-in">Discover our comprehensive range of spa and massage treatments designed to restore your mind, body, and spirit.</p>
                    
                    <div class="services-grid">
                        <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/deep-tissue-massage.jpg') center/cover no-repeat;">
                            <div class="service-content">
                                <div class="service-icon">
                                    <i class="fas fa-spa"></i>
                                </div>
                                <h3>Deep Tissue Massage</h3>
                                <p>Intensive therapeutic massage targeting chronic muscle tension and pain. Perfect for athletes and those with physical stress.</p>
                                <strong>60 min - $120 | 90 min - $160</strong>
                            </div>
                        </div>
                        
                        <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/swedish-massage.jpg') center/cover no-repeat;">
                            <div class="service-content">
                                <div class="service-icon">
                                    <i class="fas fa-leaf"></i>
                                </div>
                                <h3>Swedish Massage</h3>
                                <p>Classic relaxation massage with long, flowing strokes to reduce stress and promote overall well-being.</p>
                                <strong>60 min - $100 | 90 min - $140</strong>
                            </div>
                        </div>
                        
                        <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/hot-stone-therapy.jpg') center/cover no-repeat;">
                            <div class="service-content">
                                <div class="service-icon">
                                    <i class="fas fa-hot-tub"></i>
                                </div>
                                <h3>Hot Stone Therapy</h3>
                                <p>Heated volcanic stones combined with massage techniques to deeply relax muscles and improve circulation.</p>
                                <strong>75 min - $150</strong>
                            </div>
                        </div>
                        
                        <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/aromatherapy-massage.jpg') center/cover no-repeat;">
                            <div class="service-content">
                                <div class="service-icon">
                                    <i class="fas fa-seedling"></i>
                                </div>
                                <h3>Aromatherapy Massage</h3>
                                <p>Therapeutic massage enhanced with carefully selected essential oils for emotional and physical healing.</p>
                                <strong>60 min - $110 | 90 min - $150</strong>
                            </div>
                        </div>
                        
                        <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/prenatal-massage.jpg') center/cover no-repeat;">
                            <div class="service-content">
                                <div class="service-icon">
                                    <i class="fas fa-baby"></i>
                                </div>
                                <h3>Prenatal Massage</h3>
                                <p>Specialized massage for expecting mothers to reduce pregnancy-related discomfort and stress.</p>
                                <strong>60 min - $115</strong>
                            </div>
                        </div>
                        
                        <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/sports-massage.jpg') center/cover no-repeat;">
                            <div class="service-content">
                                <div class="service-icon">
                                    <i class="fas fa-male"></i>
                                </div>
                                <h3>Sports Massage</h3>
                                <p>Performance-focused massage for athletes to prevent injuries and enhance recovery.</p>
                                <strong>60 min - $125 | 90 min - $165</strong>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-center mt-3">
                        <a href="#booking" class="btn btn-primary" data-link>Book Your Treatment</a>
                    </div>
                </div>
            </section>
        `;
        
        this.initAnimations();
    }

    renderAbout() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <section class="about">
                <div class="container">
                    <div class="about-content">
                        <div class="about-text fade-in">
                            <h2>About Serenity Spa</h2>
                            <p>Founded in 2015, Serenity Spa & Massage has been dedicated to providing exceptional wellness experiences in a tranquil, nurturing environment. Our mission is to help you achieve balance, relaxation, and rejuvenation through our comprehensive range of therapeutic treatments.</p>
                            
                            <p>Our team of licensed massage therapists and wellness professionals bring years of experience and passion for healing to every session. We believe in the power of touch therapy to not only relax the body but also restore the mind and spirit.</p>
                            
                            <h3>Why Choose Serenity Spa?</h3>
                            <ul>
                                <li>Licensed and certified massage therapists</li>
                                <li>Pristine, calming environment</li>
                                <li>Personalized treatment plans</li>
                                <li>Premium quality oils and products</li>
                                <li>Flexible scheduling options</li>
                                <li>Competitive pricing</li>
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
                        <div class="contact-form fade-in">
                            <h3>Send us a Message</h3>
                            <form id="contact-form">
                                <div class="form-group">
                                    <label for="name">Full Name</label>
                                    <input type="text" id="name" name="name" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="email">Email Address</label>
                                    <input type="email" id="email" name="email" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="phone">Phone Number</label>
                                    <input type="tel" id="phone" name="phone">
                                </div>
                                
                                <div class="form-group">
                                    <label for="service">Service Interest</label>
                                    <select id="service" name="service">
                                        <option value="">Select a service</option>
                                        <option value="deep-tissue">Deep Tissue Massage</option>
                                        <option value="swedish">Swedish Massage</option>
                                        <option value="hot-stone">Hot Stone Therapy</option>
                                        <option value="aromatherapy">Aromatherapy Massage</option>
                                        <option value="prenatal">Prenatal Massage</option>
                                        <option value="sports">Sports Massage</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="message">Message</label>
                                    <textarea id="message" name="message" placeholder="Tell us how we can help you..."></textarea>
                                </div>
                                
                                <button type="submit" class="btn btn-primary">Send Message</button>
                            </form>
                        </div>
                        
                        <div class="contact-info fade-in">
                            <h3>Visit Us</h3>
                            <div class="contact-details">
                                <div class="contact-item">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <div class="contact-text">
                                        <span class="contact-label">Address:</span>
                                        <span class="contact-value">123 Wellness Avenue<br>Peaceful City, State 12345</span>
                                    </div>
                                </div>
                                
                                <div class="contact-item">
                                    <i class="fas fa-phone"></i>
                                    <div class="contact-text">
                                        <span class="contact-label">Phone:</span>
                                        <span class="contact-value">(555) 123-4567</span>
                                    </div>
                                </div>
                                
                                <div class="contact-item">
                                    <i class="fas fa-envelope"></i>
                                    <div class="contact-text">
                                        <span class="contact-label">Email:</span>
                                        <span class="contact-value">info@serenityspa.com</span>
                                    </div>
                                </div>
                                
                                <div class="contact-item">
                                    <i class="fas fa-clock"></i>
                                    <div class="contact-text">
                                        <span class="contact-label">Hours:</span>
                                        <div class="hours-info">
                                            <div class="hours-row">
                                                <span class="days">Mon-Fri:</span>
                                                <span class="times">9:00 AM - 8:00 PM</span>
                                            </div>
                                            <div class="hours-row">
                                                <span class="days">Sat-Sun:</span>
                                                <span class="times">10:00 AM - 6:00 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="social-section mt-2">
                                <h4>Follow Us</h4>
                                <div class="social-links">
                                    <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
                                    <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                                    <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        this.initAnimations();
        this.initContactForm();
    }

    renderBooking() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <section class="contact">
                <div class="container">
                    <h1 class="text-center fade-in">Book Your Appointment</h1>
                    <p class="text-center fade-in">Schedule your relaxing spa experience with us today.</p>
                    
                    <div class="contact-content">
                        <div class="contact-form fade-in">
                            <h3>Appointment Details</h3>
                            <form id="booking-form">
                                <div class="form-group">
                                    <label for="book-name">Full Name</label>
                                    <input type="text" id="book-name" name="name" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="book-email">Email Address</label>
                                    <input type="email" id="book-email" name="email" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="book-phone">Phone Number</label>
                                    <input type="tel" id="book-phone" name="phone" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="book-service">Select Service</label>
                                    <select id="book-service" name="service" required>
                                        <option value="">Choose your treatment</option>
                                        <option value="deep-tissue-60">Deep Tissue Massage (60 min) - $120</option>
                                        <option value="deep-tissue-90">Deep Tissue Massage (90 min) - $160</option>
                                        <option value="swedish-60">Swedish Massage (60 min) - $100</option>
                                        <option value="swedish-90">Swedish Massage (90 min) - $140</option>
                                        <option value="hot-stone">Hot Stone Therapy (75 min) - $150</option>
                                        <option value="aromatherapy-60">Aromatherapy Massage (60 min) - $110</option>
                                        <option value="aromatherapy-90">Aromatherapy Massage (90 min) - $150</option>
                                        <option value="prenatal">Prenatal Massage (60 min) - $115</option>
                                        <option value="sports-60">Sports Massage (60 min) - $125</option>
                                        <option value="sports-90">Sports Massage (90 min) - $165</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="book-date">Preferred Date</label>
                                    <input type="date" id="book-date" name="date" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="book-time">Preferred Time</label>
                                    <select id="book-time" name="time" required>
                                        <option value="">Select time</option>
                                        <option value="09:00">9:00 AM</option>
                                        <option value="10:00">10:00 AM</option>
                                        <option value="11:00">11:00 AM</option>
                                        <option value="12:00">12:00 PM</option>
                                        <option value="13:00">1:00 PM</option>
                                        <option value="14:00">2:00 PM</option>
                                        <option value="15:00">3:00 PM</option>
                                        <option value="16:00">4:00 PM</option>
                                        <option value="17:00">5:00 PM</option>
                                        <option value="18:00">6:00 PM</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="book-notes">Special Requests</label>
                                    <textarea id="book-notes" name="notes" placeholder="Any specific areas of focus, allergies, or special requests..."></textarea>
                                </div>
                                
                                <button type="submit" class="btn btn-primary">Book Appointment</button>
                            </form>
                        </div>
                        
                        <div class="contact-info fade-in">
                            <h3>Booking Information</h3>
                            <div class="contact-details">
                                <div class="contact-item">
                                    <i class="fas fa-info-circle"></i>
                                    <div class="contact-text">
                                        <span class="contact-label">Booking Policy:</span>
                                        <span class="contact-value">Appointments can be cancelled or rescheduled up to 24 hours in advance.</span>
                                    </div>
                                </div>
                                
                                <div class="contact-item">
                                    <i class="fas fa-credit-card"></i>
                                    <div class="contact-text">
                                        <span class="contact-label">Payment:</span>
                                        <span class="contact-value">We accept cash, all major credit cards, and gift certificates.</span>
                                    </div>
                                </div>
                                
                                <div class="contact-item">
                                    <i class="fas fa-clock"></i>
                                    <div class="contact-text">
                                        <span class="contact-label">Arrival:</span>
                                        <span class="contact-value">Please arrive 10 minutes early for your appointment.</span>
                                    </div>
                                </div>
                                
                                <div class="contact-item">
                                    <i class="fas fa-phone"></i>
                                    <div class="contact-text">
                                        <span class="contact-label">Questions?</span>
                                        <span class="contact-value">Call us at (555) 123-4567</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="gift-section mt-2">
                                <h4>Gift Certificates Available!</h4>
                                <p>Perfect for birthdays, holidays, or any special occasion. Contact us to purchase.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        this.initAnimations();
        this.initBookingForm();
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

    initBookingForm() {
        const form = document.getElementById('booking-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleBookingSubmit(form);
            });
        }

        // Set minimum date to today
        const dateInput = document.getElementById('book-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
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
