document.addEventListener("DOMContentLoaded", function() {
    // Scarcity counter logic
    function updateSlotCounter() {
        const counterEl = document.getElementById('slot-counter-el');
        const counterEn = document.getElementById('slot-counter-en');
        
        // Check if we have a stored count for today
        const today = new Date().toDateString();
        const storedData = sessionStorage.getItem('slotCounterData');
        
        let count = 12; // Default value
        
        if (storedData) {
            const data = JSON.parse(storedData);
            if (data.date === today) {
                count = Math.max(1, data.count); // Never go below 1
            }
        }
        
        if (counterEl) counterEl.textContent = count;
        if (counterEn) counterEn.textContent = count;
        
        // Save the initial count
        sessionStorage.setItem('slotCounterData', JSON.stringify({ date: today, count: count }));
    }
    
    // Decrement counter when CTA is clicked
    document.querySelectorAll('.cta-primary').forEach(button => {
        button.addEventListener('click', function() {
            const today = new Date().toDateString();
            const storedData = sessionStorage.getItem('slotCounterData');
            
            if (storedData) {
                const data = JSON.parse(storedData);
                if (data.date === today && data.count > 1) {
                    data.count -= 1;
                    sessionStorage.setItem('slotCounterData', JSON.stringify(data));
                    
                    const counterEl = document.getElementById('slot-counter-el');
                    const counterEn = document.getElementById('slot-counter-en');
                    if (counterEl) counterEl.textContent = data.count;
                    if (counterEn) counterEn.textContent = data.count;
                }
            }
        });
    });
    
    // Initialize counter
    updateSlotCounter();
    

// Παίρνουμε τα CTA κουμπιά και το modal
const ctaButtons = document.querySelectorAll(".cta-button");
const modal = document.getElementById("signup-modal");
const closeModal = document.querySelector(".close");
const selectedPlan = document.getElementById("selected-plan");

// Όταν κάποιος πατάει CTA κουμπί
ctaButtons.forEach(button => {
    button.addEventListener("click", () => {
        const plan = button.getAttribute("data-plan");
        selectedPlan.textContent = plan; // Ενημερώνει το modal με το επιλεγμένο πλάνο
        modal.style.display = "flex";
    });
});

// Κλείσιμο modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Κλείσιμο modal αν πατήσει εκτός πλαισίου
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
const faqButtons = document.querySelectorAll(".faq-question");
faqButtons.forEach(button => {
    button.addEventListener("click", () => {
        const answer = button.parentElement.querySelector(`.faq-answer[data-lang="${document.documentElement.lang}"]`);
        const arrow = button.querySelector(".arrow");

        if (answer.classList.contains("active")) {
            answer.classList.remove("active");
            setTimeout(() => {
                answer.style.display = "none";
            }, 300);
            arrow.style.transform = "rotate(0deg)";
        } else {
            // Close all open FAQ answers for the current locale
            document.querySelectorAll(`.faq-answer[data-lang="${document.documentElement.lang}"]`).forEach(ans => {
                ans.classList.remove("active");
                ans.style.display = "none";
            });

            document.querySelectorAll(".faq-question .arrow").forEach(arr => {
                arr.style.transform = "rotate(0deg)";
            });

            // Open the selected FAQ answer
            answer.style.display = "block";
            setTimeout(() => {
                answer.classList.add("active");
            }, 10);
            arrow.style.transform = "rotate(180deg)";
        }
    });
});

    // Add "coming-soon" label to specific services
    const services = document.querySelectorAll(".service");
    services.forEach(service => {
        if (service.classList.contains("coming-soon")) {
            // Additional logic can be added here if needed
        }
    });

});
