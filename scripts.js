function setLanguage(language) {
    document.querySelectorAll('[data-en]').forEach(element => {
        element.innerText = element.getAttribute(`data-${language}`);
    });
}

// Set default language based on browser's language
document.addEventListener('DOMContentLoaded', () => {
    const userLang = navigator.language || navigator.userLanguage;
    const defaultLang = userLang.startsWith('el') ? 'el' : 'en';
    setLanguage(defaultLang);
});
