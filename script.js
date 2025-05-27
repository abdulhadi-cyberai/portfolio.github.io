document.addEventListener('DOMContentLoaded', () => {
    // --- AOS Initialization ---
    AOS.init({
        duration: 800, // values from 0 to 3000, with step 50ms
        once: true, // whether animation should happen only once - while scrolling down
    });

    // --- Mobile Navigation Toggle ---
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');

    if (hamburgerMenu && mobileNavMenu) {
        hamburgerMenu.addEventListener('click', () => {
            mobileNavMenu.classList.toggle('active');
            // Optional: Change hamburger icon to X
            const icon = hamburgerMenu.querySelector('i');
            if (mobileNavMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                // Optional: Prevent body scroll when mobile menu is open
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = 'auto';
            }
        });

        // Close mobile menu when a link is clicked
        mobileNavMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNavMenu.classList.remove('active');
                hamburgerMenu.querySelector('i').classList.remove('fa-times');
                hamburgerMenu.querySelector('i').classList.add('fa-bars');
                document.body.style.overflow = 'auto';
            });
        });
    }


    // --- Basic Testimonial Slider ---
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const prevTestimonialBtn = document.getElementById('prev-testimonial');
    const nextTestimonialBtn = document.getElementById('next-testimonial');
    let currentTestimonialIndex = 0;

    function showTestimonial(index) {
        testimonialItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
    }

    if (testimonialItems.length > 0 && prevTestimonialBtn && nextTestimonialBtn) {
        prevTestimonialBtn.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonialItems.length) % testimonialItems.length;
            showTestimonial(currentTestimonialIndex);
        });

        nextTestimonialBtn.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialItems.length;
            showTestimonial(currentTestimonialIndex);
        });

        // Initialize first testimonial
        showTestimonial(currentTestimonialIndex);

        // Auto-slide (optional)
        // setInterval(() => {
        //     nextTestimonialBtn.click();
        // }, 5000); // Change slide every 5 seconds
    }


    // --- Sticky Header (Optional - if you want to change style on scroll) ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled'); // Add a 'scrolled' class in CSS for different styling
        } else {
            header.classList.remove('scrolled');
        }
    });
    // Add this to your CSS for the sticky header effect:
    /*
    header.scrolled {
        background-color: var(--bg-color); // More opaque
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    */

    // --- Smooth scroll for anchor links (if html scroll-behavior is not enough) ---
    // document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    //     anchor.addEventListener('click', function (e) {
    //         if (this.getAttribute('href').length > 1) { // Ensure it's not just "#"
    //             e.preventDefault();
    //             const targetId = this.getAttribute('href');
    //             const targetElement = document.querySelector(targetId);
    //             if (targetElement) {
    //                 targetElement.scrollIntoView({
    //                     behavior: 'smooth'
    //                 });
    //             }
    //         }
    //     });
    // });

});