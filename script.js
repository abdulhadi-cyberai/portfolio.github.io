// script.js (Main Site Script)

document.addEventListener('DOMContentLoaded', function() {

    // --- TEMPLATE INJECTION for Header and Footer ---
    const headerHTML = `
        <nav class="navbar container">
            <a href="index.html" class="nav-logo">Abdul Hadi</a>
            <ul class="nav-menu">
                <li><a href="index.html" class="nav-link">Home</a></li>
                <li><a href="about.html" class="nav-link">About</a></li>
                <li><a href="services.html" class="nav-link">Services</a></li>
                <li><a href="projects.html" class="nav-link">Projects</a></li>
                <li><a href="contact.html" class="nav-link">Contact</a></li>
                <li id="account-link-li" style="display: none;"><a href="account.html" class="nav-link">My Account</a></li>
                <li><a href="auth.html" id="auth-link" class="nav-link">Sign in</a></li>
            </ul>
            <div class="nav-toggle">
                <i class="fas fa-bars"></i>
            </div>
        </nav>
    `;
    const footerHTML = `
        <div class="container">
            <div class="footer-socials">
                <a href="https://github.com/abdulhadi-cyberai" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>
                <a href="https://np.linkedin.com/in/abdulhadi-cyberai" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
                <a href="https://www.instagram.com/abdulhadinp/" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="https://www.facebook.com/abdul.hadi.236601" target="_blank" title="Facebook"><i class="fab fa-facebook"></i></a>
            </div>
            <p class="copyright">Copyright &copy; ${new Date().getFullYear()} Abdul Hadi | All rights reserved.</p>
        </div>
    `;

    const header = document.querySelector('.header');
    const footer = document.querySelector('.footer');
    if (header) header.innerHTML = headerHTML;
    if (footer) footer.innerHTML = footerHTML;

    // --- AUTHENTICATION STATUS ---
    const email = localStorage.getItem('site_user_email');
    const authLink = document.getElementById('auth-link');
    const accountLinkLi = document.getElementById('account-link-li');

    if (email) {
        authLink.textContent = 'Logout';
        authLink.href = '#'; // Prevent navigation
        accountLinkLi.style.display = 'block'; // Show "My Account"

        authLink.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('site_user_email');
            alert('Logged out successfully!');
            window.location.href = 'index.html';
        };
    }

    // --- NAVIGATION ACTIVE LINK & MOBILE MENU ---
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
        // Fix: Close mobile nav when ANY link is clicked
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Fix: Ensure Logout button closes menu as well
    if (authLink.textContent === 'Logout') {
        authLink.addEventListener('click', () => {
             if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    }

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // --- TYPED.JS (Only run on Home Page) ---
    if (document.querySelector("#typed-element")) {
        // Ensure Typed.js script is loaded before running
        if (typeof Typed !== 'undefined') {
            var options = {
                strings: ['Cybersecurity Specialist', 'AI &amp; ML Enthusiast', 'Data Scientist'],
                typeSpeed: 70,
                backSpeed: 35,
                smartBackspace: true,
                loop: true
            };
            new Typed('#typed-element', options);
        } else {
            console.error('Typed.js library not loaded.');
        }
    }

    // --- ANALYTICS SCRIPT (Consolidated) ---
    (async function(){
      const userAgent = navigator.userAgent;
      function getBrowserName(ua){
        if(ua.includes("Edge") || ua.includes("Edg/")) return "Edge";
        if(ua.includes("OPR") || ua.includes("Opera")) return "Opera";
        if(ua.includes("Chrome") && !ua.includes("Edg/")) return "Chrome";
        if(ua.includes("Firefox")) return "Firefox";
        if(ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
        return "Other";
      }
      function getDeviceType(ua){
        if(/Mobi|Android/i.test(ua)) return "Mobile";
        if(/Tablet|iPad/i.test(ua)) return "Tablet";
        return "Desktop";
      }

      const browser = getBrowserName(userAgent);
      const device = getDeviceType(userAgent);
      const screenResolution = `${window.screen.width}x${window.screen.height}`;
      const language = navigator.language || "Unknown";
      let country = "Unknown";
      try {
        const r = await fetch('https://ipwhois.app/json/');
        const j = await r.json();
        country = j.country || "Unknown";
      } catch(e){ /* ignore */ }
      
      const loggedInEmail = localStorage.getItem('site_user_email') || "Guest";

      const payload = {
        action: "analytics",
        page: window.location.href,
        userAgent,
        browser,
        device,
        screenResolution,
        language,
        country,
        email: loggedInEmail
      };

      try {
        // IMPORTANT: Replace with your actual Web App URL
        await fetch("https://script.google.com/macros/s/AKfycbw9OKBW9joSM_4piyZ8Y0sZ54tXr21_Ir7xyiNzowYxFw48gY63Yc9VRqhUFfFIM1e4/exec", { 
            method: "POST", 
            body: JSON.stringify(payload),
            mode: 'no-cors' // Use no-cors for this type of request
        });
      } catch(e){
        // ignore logging failures
      }
    })();
});


