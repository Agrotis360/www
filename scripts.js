document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();
    alert("Το μήνυμα σας στάλθηκε επιτυχώς! Θα επικοινωνήσουμε σύντομα.");
});

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
        const answer = button.nextElementSibling;
        const arrow = button.querySelector(".arrow");

        if (answer.classList.contains("active")) {
            answer.classList.remove("active");
            setTimeout(() => {
                answer.style.display = "none";
            }, 300);
            arrow.style.transform = "rotate(0deg)";
        } else {
            // Κλείνει όλα τα ανοιχτά FAQ πριν ανοίξει το νέο
            document.querySelectorAll(".faq-answer").forEach(ans => {
                ans.classList.remove("active");
                
                    ans.style.display = "none";
                    
            });

            document.querySelectorAll(".arrow").forEach(arr => arr.style.transform = "rotate(0deg)");

            answer.style.display = "block";
            setTimeout(() => {
                answer.classList.add("active");
            }, 10);
            arrow.style.transform = "rotate(180deg)";
        }
    });
});
