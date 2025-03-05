function setLanguage(language) {
    document.querySelectorAll('[data-en]').forEach(element => {
        element.innerText = element.getAttribute(`data-${language}`);
    });
    document.getElementById('btn-en').classList.toggle('d-none', language === 'en');
    document.getElementById('btn-el').classList.toggle('d-none', language === 'el');
}

// Set default language based on browser's language
document.addEventListener('DOMContentLoaded', () => {
    const userLang = navigator.language || navigator.userLanguage;
    const defaultLang = userLang.startsWith('el') ? 'el' : 'en';
    setLanguage(defaultLang);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
