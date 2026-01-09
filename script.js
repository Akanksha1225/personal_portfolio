// Portfolio JavaScript - Navigation, Animations & Contact Form

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // Active navigation link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add('active');
            } else {
                navLink?.classList.remove('active');
            }
        });
    });

    // Typing effect for hero subtitle
    const typedTexts = ['AI/ML Developer', 'Computer Vision Enthusiast', 'Web Developer', 'Data Science Learner'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedElement = document.querySelector('.typed-text');

    function typeEffect() {
        if (!typedElement) return;

        const currentText = typedTexts[textIndex];

        if (isDeleting) {
            typedElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typedTexts.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();

    // Smooth reveal animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .project-card, .skill-category, .stat-card').forEach(el => {
        el.classList.add('reveal-element');
        observer.observe(el);
    });

    // Contact Form - Discord Webhook Integration
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1459270842826494118/IPDkW_frdyGEExScM_HUdxXPT7-evV4RyBO0DzJeclYPme0P4rnws_mcEHa59yaSCf8-';

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<svg class="icon animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="30 70"/></svg> Sending...';

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Create Discord embed
        const discordPayload = {
            embeds: [{
                title: '📬 New Portfolio Contact',
                color: 0x6366f1, // Purple color
                fields: [
                    {
                        name: '👤 Name',
                        value: name,
                        inline: true
                    },
                    {
                        name: '📧 Email',
                        value: email,
                        inline: true
                    },
                    {
                        name: '📋 Subject',
                        value: subject,
                        inline: false
                    },
                    {
                        name: '💬 Message',
                        value: message,
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'Portfolio Contact Form'
                }
            }]
        };

        try {
            const response = await fetch(DISCORD_WEBHOOK, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(discordPayload)
            });

            if (response.ok) {
                formStatus.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
                formStatus.className = 'form-status success';
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            formStatus.textContent = '❌ Failed to send message. Please try again or email directly.';
            formStatus.className = 'form-status error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            // Re-initialize icon after restoring button text
            lucide.createIcons();

            // Hide status after 5 seconds
            setTimeout(() => {
                formStatus.className = 'form-status';
            }, 5000);
        }
    });
});

// Add reveal animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    .reveal-element {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .reveal-element.reveal {
        opacity: 1;
        transform: translateY(0);
    }
    
    .navbar.scrolled {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    
    .nav-link.active {
        color: var(--primary);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .animate-spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);
