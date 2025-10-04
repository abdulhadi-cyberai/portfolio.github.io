// script.js

document.addEventListener("DOMContentLoaded", function() {
    
    // Typed.js for the hero section
    if (document.querySelector("#typed-element")) {
        var options = {
            strings: ['Cybersecurity Specialist', 'AI & ML Enthusiast', 'Data Scientist'],
            typeSpeed: 50,
            backSpeed: 25,
            loop: true
        };
        var typed = new Typed('#typed-element', options);
    }

    // Responsive Navigation Menu
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile nav when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

});
