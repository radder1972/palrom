document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Header Scroll Effect & Mobile Menu
    // ==========================================
    const header = document.querySelector('.main-header');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    mobileNavToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        mobileNavToggle.classList.toggle('active');
        
        // Animated hamburger transform
        const bars = mobileNavToggle.querySelectorAll('.bar');
        if (mobileNavToggle.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close mobile menu on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            mobileNavToggle.classList.remove('active');
            const bars = mobileNavToggle.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    // ==========================================
    // 2. Active Link Highlighting via Scroll
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the middle area
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ==========================================
    // 3. Product Catalogue Filter
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and add to clicked
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    // Show matching card
                    card.classList.remove('hidden');
                    // Trigger fade-in animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Hide non-matching card
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.85)';
                    // Delay hiding from display to allow transition
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });

    // Setup initial transition styles for cards
    productCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    });

    // ==========================================
    // 4. Entrance Scroll Animations
    // ==========================================
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    const scrollObserverOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before element enters view
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                
                // If it's a timeline section, make sure items animate in sequence
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('visible');
                }
                scrollObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, scrollObserverOptions);

    scrollElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // Special observer for timeline items explicitly
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        scrollObserver.observe(item);
    });

    // ==========================================
    // 5. Contact Form Handler (Simulated Submit)
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.strip ? document.getElementById('name').value.strip() : document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const product = document.getElementById('product_type').value;
            const message = document.getElementById('message').value;

            // Simple check
            if (!name || !email || !product || !message) {
                showFeedback('Please fill out all required fields.', 'error');
                return;
            }

            // Simulate server request
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin icon-left"></i> Sending inquiry...';

            setTimeout(() => {
                // Success
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                showFeedback(`Thank you, ${name}! Your inquiry regarding our "${product}" beechwood products has been sent to our Brad office. We will reply in 24 hours.`, 'success');
                contactForm.reset();
            }, 1800);
        });
    }

    function showFeedback(msg, type) {
        formFeedback.textContent = msg;
        formFeedback.className = `form-feedback ${type}`;
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide success message after 10 seconds, keep error
        if (type === 'success') {
            setTimeout(() => {
                formFeedback.className = 'form-feedback hidden';
            }, 10000);
        }
    }

    // ==========================================
    // 6. Cookie Consent popup Modal
    // ==========================================
    const cookieModal = document.getElementById('cookieModal');
    const denyCookies = document.getElementById('denyCookies');
    const allowCookies = document.getElementById('allowCookies');
    const openCookieSettings = document.getElementById('openCookieSettings');

    function checkCookieConsent() {
        const consent = localStorage.getItem('palrom_cookies_accepted');
        if (consent === null) {
            // Show modal after 1.5 seconds
            setTimeout(() => {
                cookieModal.classList.remove('hidden');
            }, 1500);
        }
    }

    if (allowCookies && denyCookies && cookieModal) {
        allowCookies.addEventListener('click', () => {
            localStorage.setItem('palrom_cookies_accepted', 'true');
            cookieModal.classList.add('hidden');
        });

        denyCookies.addEventListener('click', () => {
            localStorage.setItem('palrom_cookies_accepted', 'false');
            cookieModal.classList.add('hidden');
        });
    }

    if (openCookieSettings) {
        openCookieSettings.addEventListener('click', (e) => {
            e.preventDefault();
            cookieModal.classList.remove('hidden');
        });
    }

    // ==========================================
    // 7. Query Parameter Routing & Form Pre-selection
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product');
    
    if (productParam) {
        const productSelect = document.getElementById('product_type');
        const contactSection = document.getElementById('contact');
        
        if (productSelect) {
            const validParams = ['dowels', 'planed', 'profiles', 'specials'];
            if (validParams.includes(productParam)) {
                productSelect.value = productParam;
            }
        }
        
        if (contactSection) {
            setTimeout(() => {
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }

    checkCookieConsent();
});
