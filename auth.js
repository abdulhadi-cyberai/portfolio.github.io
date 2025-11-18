// auth.js (Updated)

document.addEventListener('DOMContentLoaded', () => {
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw9OKBW9joSM_4piyZ8Y0sZ54tXr21_Ir7xyiNzowYxFw48gY63Yc9VRqhUFfFIM1e4/exec"; // <-- REPLACE with your Web App URL

    /* ---------------- Utilities ---------------- */
    function el(id) { return document.getElementById(id) }
    function showMsg(text, ok = true) { const m = el('msg'); m.textContent = text; m.style.color = ok ? 'lightgreen' : '#ffb4b4' }
    
    /**
     * NEW: Email validation function
     */
    function isValidEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    function genSalt(len = 16) {
        const arr = crypto.getRandomValues(new Uint8Array(len));
        return Array.from(arr).map(b => ("0" + b.toString(16)).slice(-2)).join("");
    }

    async function hashSalted(salt, password) {
        const enc = new TextEncoder();
        const data = enc.encode(salt + password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /* ---------------- UI Toggle ---------------- */
    let mode = 'signup';
    const tabSignup = el('tabSignup');
    const tabLogin = el('tabLogin');
    
    if (tabSignup) tabSignup.onclick = () => setMode('signup');
    if (tabLogin) tabLogin.onclick = () => setMode('login');

    function setMode(m) {
        mode = m;
        if (m === 'signup') {
            tabSignup.classList.add('active');
            tabLogin.classList.remove('active');
            el('title').textContent = 'Create your account';
            el('nameField').style.display = 'block';
            el('submitBtn').textContent = 'Create account';
        } else {
            tabLogin.classList.add('active');
            tabSignup.classList.remove('active');
            el('title').textContent = 'Welcome back';
            el('nameField').style.display = 'none';
            el('submitBtn').textContent = 'Sign in';
        }
    }
    setMode('signup');

    /* ---------------- Signup / Login Flows ---------------- */
    el('submitBtn').addEventListener('click', async () => {
        const email = el('email').value.trim().toLowerCase();
        const password = el('password').value;
        const name = el('name').value.trim();
        const username = el('username').value.trim();

        if (!email || !password) { showMsg('Please enter email & password', false); return; }

        /**
         * NEW: Added email validation check
         */
        if (!isValidEmail(email)) {
            showMsg('Please enter a valid email address', false);
            return;
        }

        if (mode === 'signup') {
            if (!name) { showMsg('Please enter your full name', false); return; }
            showMsg('Creating account...');
            try {
                const salt = genSalt(16);
                const hash = await hashSalted(salt, password);
                const body = { action: 'signup', email, name, username, salt, hash };
                const res = await fetch(WEB_APP_URL, { method: 'POST', body: JSON.stringify(body) });
                const j = await res.json();
                if (j.ok) {
                    localStorage.setItem('site_user_email', email);
                    showMsg('Signup successful — you are logged in');
                    setTimeout(() => window.location.href = 'index.html', 800);
                } else {
                    showMsg(j.message || 'Signup failed', false);
                }
            } catch (err) {
                showMsg('Signup error: ' + err.message, false);
            }
        } else { // Login Flow
            showMsg('Signing in...');
            try {
                const saltResp = await fetch(WEB_APP_URL, { method: 'POST', body: JSON.stringify({ action: 'get_salt', email }) });
                const saltJson = await saltResp.json();
                if (!saltJson.ok) { showMsg(saltJson.message || 'No such account', false); return; }
                const salt = saltJson.salt || '';
                const hash = await hashSalted(salt, password);
                const res = await fetch(WEB_APP_URL, { method: 'POST', body: JSON.stringify({ action: 'login', email, hash }) });
                const j = await res.json();
                if (j.ok) {
                    localStorage.setItem('site_user_email', email);
                    showMsg('Login successful — redirecting...');
                    setTimeout(() => window.location.href = 'index.html', 700);
                } else {
                    showMsg(j.message || 'Login failed', false);
                }
            } catch (err) {
                showMsg('Login error: ' + err.message, false);
            }
        }
    });

    /* Optional: if already logged in, show message */
    const existing = localStorage.getItem('site_user_email');
    if (existing) showMsg('Already signed in as ' + existing);

    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordField = this.previousElementSibling;
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

});
