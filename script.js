const mobileBtn = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

mobileBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});
