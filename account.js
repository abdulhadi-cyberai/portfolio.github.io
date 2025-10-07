// account.js

document.addEventListener('DOMContentLoaded', () => {
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw9OKBW9joSM_4piyZ8Y0sZ54tXr21_Ir7xyiNzowYxFw48gY63Yc9VRqhUFfFIM1e4/exec"; // Ensure this is your correct URL

    const userEmail = localStorage.getItem('site_user_email');
    if (!userEmail) {
        window.location.href = 'auth.html'; // Redirect if not logged in
        return;
    }

    const nameInput = document.getElementById('acc-name');
    const usernameInput = document.getElementById('acc-username');
    const emailInput = document.getElementById('acc-email');
    const passwordInput = document.getElementById('acc-password');
    const updateBtn = document.getElementById('updateBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const msgEl = document.getElementById('update-msg');

    emailInput.value = userEmail;

    // Fetch and display user data
    async function fetchUserData() {
        try {
            const res = await fetch(WEB_APP_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'get_user', email: userEmail })
            });
            const data = await res.json();
            if (data.ok) {
                nameInput.value = data.userData.name;
                usernameInput.value = data.userData.username;
            } else {
                showMsg('Failed to load user data.', false);
            }
        } catch (error) {
            showMsg('Error fetching user data.', false);
        }
    }

    fetchUserData();

    // Update Profile
    updateBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!name) {
            showMsg('Full name is required.', false);
            return;
        }

        showMsg('Updating...');
        const payload = { action: 'update_user', email: userEmail, name, username };

        if (password) {
            const salt = genSalt(16);
            const hash = await hashSalted(salt, password);
            payload.salt = salt;
            payload.hash = hash;
        }

        try {
            const res = await fetch(WEB_APP_URL, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.ok) {
                showMsg('Profile updated successfully!');
            } else {
                showMsg(data.message || 'Update failed.', false);
            }
        } catch (error) {
            showMsg('An error occurred during update.', false);
        }
    });

    // Delete Account
    deleteBtn.addEventListener('click', async () => {
        const confirmation = prompt("This is irreversible. Type 'DELETE' to confirm you want to delete your account.");
        if (confirmation !== 'DELETE') {
            showMsg('Account deletion cancelled.', true);
            return;
        }

        showMsg('Deleting account...');
        try {
            const res = await fetch(WEB_APP_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'delete_user', email: userEmail })
            });
            const data = await res.json();
            if (data.ok) {
                localStorage.removeItem('site_user_email');
                alert('Account deleted successfully.');
                window.location.href = 'index.html';
            } else {
                showMsg(data.message || 'Deletion failed.', false);
            }
        } catch (error) {
            showMsg('An error occurred during deletion.', false);
        }
    });

    // --- Utility Functions ---
    function showMsg(text, ok = true) {
        msgEl.textContent = text;
        msgEl.style.color = ok ? 'lightgreen' : '#ffb4b4';
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
