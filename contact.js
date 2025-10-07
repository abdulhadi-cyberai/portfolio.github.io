// contact.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("status");

    if (!form || !status) return; // Exit if elements are not on the page

    // Check if the user has already submitted today
    const lastSubmit = localStorage.getItem("lastSubmit");
    const today = new Date().toDateString();

    if (lastSubmit === today) {
        form.style.display = "none";
        status.textContent = "You’ve already submitted today. Please come back tomorrow!";
        status.style.color = "lightgreen";
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the default form submission
        
        const data = new FormData(e.target);
        fetch(e.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                status.textContent = "Thanks for your submission!";
                status.style.color = "lightgreen";
                form.reset();
                localStorage.setItem("lastSubmit", today); // Save today's date on successful submission
                form.style.display = "none";
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        status.textContent = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        status.textContent = "Oops! There was a problem submitting your form";
                    }
                    status.style.color = "#ffb4b4";
                })
            }
        }).catch(error => {
            status.textContent = "Oops! There was a problem submitting your form";
            status.style.color = "#ffb4b4";
        });
    });
});