const HUBSPOT_PORTAL_ID = "";
const HUBSPOT_FORM_ID_LEAD = "";
const HUBSPOT_FORM_ID_CONTACT = "";
const HUBSPOT_FORM_ID_EXIT = "";

// UX/content config
const TRIAL_DAYS = 90;

const LANG_STORAGE_KEY = "gl_lang";
const EXIT_INTENT_KEY = "gl_exit_intent_shown";

let translations = null;
let currentLang = "el";

function $(selector, root = document) {
    return root.querySelector(selector);
}

function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
}

function getSystemLanguage() {
    const userLang = navigator.language || "";
    return userLang.toLowerCase().startsWith("el") ? "el" : "en";
}

function getPreferredLanguage() {
    return localStorage.getItem(LANG_STORAGE_KEY) || getSystemLanguage();
}

async function loadTranslations() {
    if (translations) return translations;

    // Primary source: the inlined `window.__LANG_JSON__` provided by lang.js
    if (window.__LANG_JSON__) {
        translations = window.__LANG_JSON__;
        return translations;
    }

    // Final fallback: minimal built-in translations to keep UI functional
    translations = {
        en: {
            metaTitle: "GaiaLogica",
            metaDescription: "",
            leadSuccess: "Thanks — we'll be in touch.",
            leadError: "Submission failed.",
            contactSuccess: "Message sent.",
            contactError: "Sending failed.",
            hubspotNotConfigured: "HubSpot not configured",
            planStarter: "Starter",
            planProfessional: "Professional",
            planEnterprise: "Enterprise",
            faq: []
        },
        el: {
            metaTitle: "GaiaLogica",
            metaDescription: "",
            leadSuccess: "Ευχαριστούμε — θα επικοινωνήσουμε μαζί σας.",
            leadError: "Η αποστολή απέτυχε.",
            contactSuccess: "Το μήνυμα στάλθηκε.",
            contactError: "Η αποστολή απέτυχε.",
            hubspotNotConfigured: "Το HubSpot δεν είναι ρυθμισμένο",
            planStarter: "Starter",
            planProfessional: "Professional",
            planEnterprise: "Enterprise",
            faq: []
        }
    };

    console.warn("Using built-in lang fallback; include lang.js to provide translations.");
    return translations;
}

function t(key) {
    const langPack = translations?.[currentLang];
    if (!langPack) return "";

    const raw = langPack[key];
    if (typeof raw !== "string") return "";

    return raw.replaceAll("{TRIAL_DAYS}", String(TRIAL_DAYS));
}

function setMeta() {
    const title = t("metaTitle") || "GaiaLogica";
    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t("metaDescription") || metaDesc.getAttribute("content") || "");
}

function applyI18n() {
    document.documentElement.lang = currentLang;

    $all("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (!key) return;
        el.textContent = t(key);
    });

    $all("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (!key) return;
        el.setAttribute("placeholder", t(key));
    });

    $all("[data-i18n-title]").forEach((el) => {
        const key = el.getAttribute("data-i18n-title");
        if (!key) return;
        el.setAttribute("title", t(key));
    });

    $all("[data-set-lang]").forEach((btn) => {
        const lang = btn.getAttribute("data-set-lang");
        btn.disabled = lang === currentLang;
        btn.setAttribute("aria-pressed", String(lang === currentLang));
    });

    setMeta();
}

function renderFaq() {
    const list = $("#faq-list");
    if (!list) return;
    list.innerHTML = "";

    const faqs = translations?.[currentLang]?.faq;
    if (!Array.isArray(faqs)) return;

    faqs.forEach(({ q, a }, idx) => {
        const details = document.createElement("details");
        details.className = "faq-item";
        details.setAttribute("name", "faq");
        details.open = idx === 0;

        const summary = document.createElement("summary");
        summary.textContent = q;
        summary.id = `faq-q-${idx}`;

        const p = document.createElement("p");
        p.textContent = a;

        details.appendChild(summary);
        details.appendChild(p);
        list.appendChild(details);
    });

    // UX: behave like an accordion (only one open at a time)
    if (list.dataset.accordionBound !== "1") {
        list.dataset.accordionBound = "1";
        list.addEventListener(
            "toggle",
            (e) => {
                const target = e.target;
                if (!(target instanceof HTMLDetailsElement)) return;
                if (!target.open) return;
                $all("details.faq-item", list).forEach((d) => {
                    if (d !== target) d.open = false;
                });
            },
            true
        );
    }

    // JSON-LD
    const jsonLdEl = $("#faq-jsonld");
    if (jsonLdEl) {
        const mainEntity = faqs.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a }
        }));

        jsonLdEl.textContent = JSON.stringify(
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity
            },
            null,
            0
        );
    }
}

async function renderTestimonials() {
    const track = $("#testimonials-track");
    if (!track) return;
    track.innerHTML = "";

    const res = await fetch("./testimonials.json", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    const items = Array.isArray(data) ? data.filter((x) => x.lang === currentLang) : [];

    // UX: if we don't have enough items, hide carousel navigation and avoid empty side columns
    const carousel = track.closest(".carousel");
    const hasNav = items.length >= 2;
    if (carousel) {
        carousel.classList.toggle("carousel--no-nav", !hasNav);
        $all(".carousel-btn", carousel).forEach((btn) => {
            btn.hidden = !hasNav;
        });
    }

    items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "testimonial";

        const quote = document.createElement("p");
        quote.className = "testimonial-quote";
        quote.textContent = `“${item.quote}”`;

        const meta = document.createElement("p");
        meta.className = "testimonial-meta";
        meta.textContent = `${item.metric} · ${item.farmSizeHa} ha · ${item.region}`;

        const name = document.createElement("p");
        name.className = "testimonial-name";
        name.textContent = item.name;

        card.appendChild(quote);
        card.appendChild(meta);
        card.appendChild(name);

        track.appendChild(card);
    });
}

function scrollCarousel(direction) {
    const track = $("#testimonials-track");
    if (!track) return;
    const amount = Math.max(280, Math.floor(track.clientWidth * 0.9));
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.hidden = false;
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");

    const focusTarget = modal.querySelector("input, textarea, button");
    if (focusTarget) focusTarget.focus();
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.hidden = true;
    document.body.classList.remove("modal-open");
}

function getOpenModal() {
    return document.querySelector('.modal.is-open');
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = String(text ?? "");
    return div.innerHTML;
}

async function submitToHubSpot(formId, fields) {
    if (!HUBSPOT_PORTAL_ID || !formId) {
        throw new Error("NOT_CONFIGURED");
    }

    const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${encodeURIComponent(HUBSPOT_PORTAL_ID)}/${encodeURIComponent(formId)}`;
    const payload = {
        fields: Object.entries(fields).map(([name, value]) => ({ name, value })),
        context: {
            pageUri: window.location.href,
            pageName: document.title
        }
    };

    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HubSpot submission failed: ${res.status} ${escapeHtml(text)}`);
    }
}

function setStatus(el, msg, kind = "") {
    if (!el) return;
    el.textContent = msg;
    el.dataset.kind = kind;
}

function initExitIntent() {
    const isTouch = window.matchMedia?.("(pointer: coarse)")?.matches;
    if (isTouch) return;

    document.addEventListener("mouseout", (e) => {
        if (sessionStorage.getItem(EXIT_INTENT_KEY) === "1") return;
        if (getOpenModal()) return;

        const to = e.relatedTarget || e.toElement;
        if (to) return;
        if (e.clientY > 0) return;

        sessionStorage.setItem(EXIT_INTENT_KEY, "1");
        openModal("exit-modal");
    });
}

function initEvents() {
    document.addEventListener("click", (e) => {
        const open = e.target.closest("[data-open-modal]");
        if (open) {
            const id = open.getAttribute("data-open-modal");
            if (id) openModal(id);
            return;
        }

        const closeBtn = e.target.closest("[data-close-modal]");
        if (closeBtn) {
            const modal = e.target.closest(".modal");
            closeModal(modal);
            return;
        }

        if (e.target.classList.contains("modal")) {
            closeModal(e.target);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        const modal = getOpenModal();
        if (modal) closeModal(modal);
    });

    $all("[data-set-lang]").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const lang = btn.getAttribute("data-set-lang");
            if (!lang) return;
            currentLang = lang;
            localStorage.setItem(LANG_STORAGE_KEY, lang);
            applyI18n();
            renderFaq();
            await renderTestimonials();
        });
    });

    const leadForm = $("#lead-form");
    if (leadForm) {
        leadForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const status = $("#lead-status");
            setStatus(status, "…");

            const fd = new FormData(leadForm);
            try {
                await submitToHubSpot(HUBSPOT_FORM_ID_LEAD, {
                    email: String(fd.get("email") || ""),
                    zip: String(fd.get("zip") || "")
                });
                setStatus(status, t("leadSuccess"), "ok");
            } catch (err) {
                const msg = err?.message === "NOT_CONFIGURED" ? t("hubspotNotConfigured") : t("leadError");
                setStatus(status, msg, "err");
            }
        });
    }

    const contactForm = $("#contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const status = $("#contact-status");
            setStatus(status, "…");

            const fd = new FormData(contactForm);
            try {
                await submitToHubSpot(HUBSPOT_FORM_ID_CONTACT, {
                    firstname: String(fd.get("name") || ""),
                    email: String(fd.get("email") || ""),
                    message: String(fd.get("message") || "")
                });
                setStatus(status, t("contactSuccess"), "ok");
                contactForm.reset();
            } catch (err) {
                const msg = err?.message === "NOT_CONFIGURED" ? t("hubspotNotConfigured") : t("contactError");
                setStatus(status, msg, "err");
            }
        });
    }

    const exitForm = $("#exit-form");
    if (exitForm) {
        exitForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const status = $("#exit-status");
            setStatus(status, "…");

            const fd = new FormData(exitForm);
            try {
                await submitToHubSpot(HUBSPOT_FORM_ID_EXIT, {
                    email: String(fd.get("email") || "")
                });
                setStatus(status, t("leadSuccess"), "ok");
            } catch (err) {
                const msg = err?.message === "NOT_CONFIGURED" ? t("hubspotNotConfigured") : t("leadError");
                setStatus(status, msg, "err");
            }
        });
    }

    $all("[data-carousel]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const dir = btn.getAttribute("data-carousel") === "next" ? 1 : -1;
            scrollCarousel(dir);
        });
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadTranslations();
    currentLang = getPreferredLanguage();
    applyI18n();
    renderFaq();
    await renderTestimonials();
    initExitIntent();
    initEvents();
});
