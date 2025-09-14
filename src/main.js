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
            <section class="hero" style="background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('public/images/hero-background.jpg') center/cover no-repeat;">
                <div class="container">
                    <div class="hero-content fade-in">
                        <h1>Welcome to Serenity Spa & Massage</h1>
                        <p>Experience ultimate relaxation and rejuvenation with our premium spa and massage services. Your journey to wellness begins here.</p>
                        <div class="hero-buttons">
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
                                <img src="public/images/services/OIP.jpg" alt="Laxmi’s Facial Special" loading="lazy">
                            </div>
                            <div class="service-icon">
                                <i class="fas fa-spa"></i>
                            </div>
                            <h3>Laxmi's Facial Special</h3>
                            <p>Indulge in our luxurious facial treatment, now at a discounted price for a limited time.</p>
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
                <p class="text-center fade-in">Explore our range of luxurious treatments designed to help you relax, unwind, and rejuvenate.</p>
                
                <div class="services-grid">
                    <!-- Facial Services -->
                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/swedish-massage.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-spa"></i>
                            </div>
                            <h3>Custom Facial</h3>
                            <p>Personalized facial to address your unique skin needs and provide a radiant glow.</p>
                            <strong>$85 | 55 min</strong>
                        </div>
                    </div>
                    
                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/OIP.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-spa"></i>
                            </div>
                            <h3>Laxmi’s Facial Special</h3>
                            <p>Indulge in our luxurious facial treatment, now at a discounted price for a limited time.</p>
                            <strong>$190 (Now $150) | 75 min</strong>
                        </div>
                    </div>
                    
                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/swedish-massage.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-spa"></i>
                            </div>
                            <h3>Microchanneling Special</h3>
                            <p>Enhance your skin's texture with our microchanneling treatment, ideal for reducing fine lines and scars.</p>
                            <strong>$225 | 60 min</strong>
                        </div>
                    </div>
                    
                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/dd.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-spa"></i>
                            </div>
                            <h3>O2 Derm Oxygen Facial</h3>
                            <p>Rejuvenate your skin with the oxygen facial, perfect for hydration and revitalization.</p>
                            <strong>$150 | 65 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/acne.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-spa"></i>
                            </div>
                            <h3>Acne Facial</h3>
                            <p>Treat acne-prone skin with our specialized acne facial that helps to cleanse, balance, and reduce inflammation.</p>
                            <strong>$95 | 55 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/glow.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-spa"></i>
                            </div>
                            <h3>GlowTox Facelift Facial</h3>
                            <p>Lift and brighten your face with this signature treatment that promotes youthful radiance and tightens the skin.</p>
                            <strong>$200 | 70 min</strong>
                        </div>
                    </div>
                    
                    <!-- Add-On Treatments -->
                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/OIP4.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-fire"></i>
                            </div>
                            <h3>Microdermabrasion</h3>
                            <p>Exfoliate and refresh your skin with this rejuvenating microdermabrasion treatment.</p>
                            <strong>$45 | 10 min</strong>
                        </div>
                    </div>
                    
                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/goat.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-fire"></i>
                            </div>
                            <h3>Goat Milk Peel</h3>
                            <p>A soothing and nourishing peel, perfect for sensitive skin.</p>
                            <strong>$25 | 10 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/LED-Light-Therapy-Treatment-1080x675.png') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-lightbulb"></i>
                            </div>
                            <h3>LED Therapy</h3>
                            <p>Boost your skin’s healing process with our LED therapy, designed to treat acne, aging, and pigmentation.</p>
                            <strong>$25 | 15 min</strong>
                        </div>
                    </div>
                    
                    <!-- Body Treatments -->
                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/pbt.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-spa"></i>
                            </div>
                            <h3>Purifying Back Treatment</h3>
                            <p>Cleanse and detoxify your back with this deep-cleansing back treatment.</p>
                            <strong>$85 | 50 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/R.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-eye"></i>
                            </div>
                            <h3>Lash Lift</h3>
                            <p>Lift and curl your lashes for a natural, wide-eyed look.</p>
                            <strong>$85 | 50 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/sauna-6766761_1280.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-eye"></i>
                            </div>
                            <h3>Brow Lamination</h3>
                            <p>Shape and set your brows for a fuller, more defined look.</p>
                            <strong>$75 | 50 min</strong>
                        </div>
                    </div>

                    <!-- Tinting Services -->
                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/OIP2.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-eye"></i>
                            </div>
                            <h3>Lash Tint</h3>
                            <p>Darken your lashes for a dramatic effect without the need for mascara.</p>
                            <strong>$20 | 20 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/sauna-6766761_1280.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-eye"></i>
                            </div>
                            <h3>Brow Tint</h3>
                            <p>Enhance the shape and color of your brows with a custom tinting treatment.</p>
                            <strong>$20 | 15 min</strong>
                        </div>
                    </div>

                    <!-- Waxing Services -->
                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/liwax.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="	fa fa-bullseye"></i>
                            </div>
                            <h3>Lip Wax</h3>
                            <p>Quick and gentle waxing for a smooth and clean upper lip.</p>
                            <strong>$10 | 10 min</strong>
                        </div>
                    </div>
                    
                    <!-- Waxing Services Continued -->
                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/sauna-6766761_1280.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-bookmark"></i>
                            </div>
                            <h3>Brazilian Wax</h3>
                            <p>Experience a smooth, clean finish with our Brazilian wax treatment.</p>
                            <strong>$65+ | 30 min</strong>
                        </div>
                    </div>
                    
                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/sauna-6766761_1280.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-bookmark"></i>
                            </div>
                            <h3>Brow Wax</h3>
                            <p>Shape and define your brows with our precise waxing service.</p>
                            <strong>$25 | 20 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/Facial-Waxing-e1420480171351-1024x920.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-bookmark"></i>
                            </div>
                            <h3>Full Face Wax</h3>
                            <p>Remove unwanted hair from your entire face for smooth, flawless skin.</p>
                            <strong>$55 | 40 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/d019b8c020ccec881b14fd77bd91b992.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-bookmark"></i>
                            </div>
                            <h3>Underarm Wax</h3>
                            <p>Get smooth underarms with our quick and effective waxing treatment.</p>
                            <strong>$25 | 15 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/sauna-6766761_1280.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-hourglass-2"></i>
                            </div>
                            <h3>Bikini Extended</h3>
                            <p>Remove hair beyond the bikini line for a clean and smooth look.</p>
                            <strong>$50 | 20 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/chin.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-location-arrow"></i>
                            </div>
                            <h3>Chin Wax</h3>
                            <p>Quick and precise chin waxing for smooth, hair-free skin.</p>
                            <strong>$10 | 15 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/sauna-6766761_1280.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-location-arrow"></i>
                            </div>
                            <h3>Nostril Wax</h3>
                            <p>Quick nostril waxing for a clean and fresh feel.</p>
                            <strong>$20 | 10 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/leg.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-map"></i>
                            </div>
                            <h3>Half Legs Wax</h3>
                            <p>Remove hair from your knees down to your ankles for smooth legs.</p>
                            <strong>$50 | 35 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/legg.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-map"></i>
                            </div>
                            <h3>Full Legs Wax</h3>
                            <p>Get smooth, hair-free legs from top to bottom.</p>
                            <strong>$90 | 55 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/sauna-6766761_1280.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-map"></i>
                            </div>
                            <h3>Half Arms Wax</h3>
                            <p>Get smooth arms from your elbows down to your wrists.</p>
                            <strong>$35 | 30 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/arm.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-map"></i>
                            </div>
                            <h3>Full Arms Wax</h3>
                            <p>Wax your full arms from wrist to shoulder for smooth skin.</p>
                            <strong>$60 | 40 min</strong>
                        </div>
                    </div>

                    <!-- Threading Services -->
                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/thre.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-map"></i>
                            </div>
                            <h3>Brow Threading</h3>
                            <p>Shape your brows with precision threading for a flawless look.</p>
                            <strong>$25 | 20 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/sauna-6766761_1280.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-object-ungroup"></i>
                            </div>
                            <h3>Brow, Lip, Chin Threading</h3>
                            <p>Threading service for your brows, lip, and chin for a clean, smooth look.</p>
                            <strong>$45 | 25 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/sauna-6766761_1280.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-object-ungroup"></i>
                            </div>
                            <h3>Chin Threading</h3>
                            <p>Get a perfectly smooth chin with our precise threading service.</p>
                            <strong>$10 | 10 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/th.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-puzzle-piece"></i>
                            </div>
                            <h3>Full Face Threading</h3>
                            <p>Get rid of unwanted facial hair with our full face threading service.</p>
                            <strong>$60 | 40 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/sauna-6766761_1280.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-puzzle-piece"></i>
                            </div>
                            <h3>Neck Threading</h3>
                            <p>Thread your neck area for a smooth and clean look.</p>
                            <strong>$20 | 15 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/sauna-6766761_1280.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fa fa-leaf"></i>
                            </div>
                            <h3>Upper Lip Threading</h3>
                            <p>Get rid of unwanted upper lip hair with this gentle threading service.</p>
                            <strong>$10 | 10 min</strong>
                        </div>
                    </div>

                    <!-- Gentlemen’s Services -->
                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/Gentlemans-Facial_1157432647-LR.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <h3>Gentlemen’s Facial</h3>
                            <p>A relaxing facial tailored to a gentleman’s skincare needs.</p>
                            <strong>$120 | 60 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/sauna-6766761_1280.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <h3>Gentleman’s Abdomen Wax</h3>
                            <p>Wax your abdomen area for a clean and smooth finish.</p>
                            <strong>$35 | 25 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/sauna-6766761_1280.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <h3>Gentlemen’s Back Treatment</h3>
                            <p>A relaxing back treatment to keep your skin smooth and refreshed.</p>
                            <strong>$90 | 50 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/sauna-6766761_1280.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <h3>Gentlemen’s Brow Wax</h3>
                            <p>Get your brows shaped with precision to create a clean and neat look.</p>
                            <strong>$25 | 20 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/01604aaa4181323eeb01133d8ee0aff5.png') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <h3>Gentlemen’s Chest Wax</h3>
                            <p>Experience a smooth chest with our efficient chest waxing treatment.</p>
                            <strong>$80 | 40 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/services/back-wax.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <h3>Gentlemen’s Full Back Wax</h3>
                            <p>Get a smooth, hair-free back with our full back waxing service.</p>
                            <strong>$80 | 60 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/sauna-6766761_1280.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <h3>Gentlemen’s Half Back Wax</h3>
                            <p>Wax your back from shoulders to mid-back for a smoother look.</p>
                            <strong>$45 | 30 min</strong>
                        </div>
                    </div>

                    <div class="service-card-bg fade-in" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('public/images/sauna-6766761_1280.jpg') center/cover no-repeat;">
                        <div class="service-content">
                            <div class="service-icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <h3>Gentlemen’s Nostril Wax</h3>
                            <p>Get rid of unwanted nose hair with our nostril waxing service.</p>
                            <strong>$20 | 15 min</strong>
                        </div>
                    </div>

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
                                        <span class="contact-value"><a href="mailto:">info@serenityspa.com</a></span>
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
                                    <a href="https://www.facebook.com/laxmi.bhandari.507/#" aria-label="Facebook" target="_blank"><i class="fab fa-facebook"></i></a>
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