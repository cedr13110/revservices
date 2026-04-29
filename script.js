const GOOGLE_REVIEW_URL = "https://www.google.com/search?safe=active&sca_esv=3df39b1f29bc2f8f&sxsrf=ANbL-n5-mwh-Zg6U05nwV0dWxQ0DKSJXPw:1777444531281&q=mama+pizza+martigues&si=AL3DRZHrmvnFAVQPOO2Bzhf8AX9KZZ6raUI_dT7DG_z0kV2_x8nn62Vh4g_QrgVEKjoNZyI4fXt7c86KjcD5rjqwDE8qVy_IwLRTF5N1q_aUJaqkD7yZlQc%3D&uds=ALYpb_lLt3rF4OntvAcKw6YR8l5VKtGTxsHk5djNaWdPDXgBIfxoFdmec81OwikV-EuPqwUVpKTp5dBaTX8wBFSaPa6A7LnuwzVq4DmefQEfZaYK-guQ1TIvmL2uCCTkPtJJUFnCtH6E&sa=X&ved=2ahUKEwjRlJTvuJKUAxVSAvsDHUbzAuIQ3PALegQIGRAE&biw=1920&bih=953&dpr=1";

const starButtons = Array.from(document.querySelectorAll(".star-button"));
const feedbackPanel = document.querySelector(".feedback-panel");
const feedbackForm = document.querySelector("#feedback-form");
const redirectMessage = document.querySelector(".redirect-message");
const ratingStatus = document.querySelector(".rating-status");
const confirmationMessage = document.querySelector(".confirmation-message");
const firstFeedbackField = document.querySelector("#customer-name");

let selectedRating = 0;
let redirectTimer = null;

function setStars(value) {
  starButtons.forEach((button) => {
    const rating = Number(button.dataset.rating);
    const isActive = rating <= value;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-checked", String(rating === selectedRating));
  });
}

function updateStatus(value) {
  if (!ratingStatus) {
    return;
  }

  ratingStatus.textContent = value > 0
    ? `${value} étoile${value > 1 ? "s" : ""} sélectionnée${value > 1 ? "s" : ""}.`
    : "Aucune note sélectionnée.";
}

function showFeedbackForm() {
  if (redirectTimer) {
    window.clearTimeout(redirectTimer);
    redirectTimer = null;
  }

  if (redirectMessage) {
    redirectMessage.hidden = true;
  }

  if (feedbackPanel) {
    feedbackPanel.hidden = false;
  }

  if (confirmationMessage) {
    confirmationMessage.hidden = true;
  }

  window.requestAnimationFrame(() => {
    feedbackPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
    firstFeedbackField?.focus({ preventScroll: true });
  });
}

function redirectToGoogle() {
  if (feedbackPanel) {
    feedbackPanel.hidden = true;
  }

  if (redirectMessage) {
    redirectMessage.hidden = false;
  }

  redirectTimer = window.setTimeout(() => {
    window.location.href = GOOGLE_REVIEW_URL;
  }, 700);
}

function selectRating(value) {
  selectedRating = value;
  setStars(value);
  updateStatus(value);

  if (value >= 4) {
    redirectToGoogle();
    return;
  }

  showFeedbackForm();
}

function moveKeyboardFocus(currentIndex, direction) {
  const nextIndex = (currentIndex + direction + starButtons.length) % starButtons.length;
  starButtons[nextIndex]?.focus();
}

starButtons.forEach((button, index) => {
  const rating = Number(button.dataset.rating);

  button.addEventListener("mouseenter", () => setStars(rating));
  button.addEventListener("focus", () => setStars(rating));
  button.addEventListener("mouseleave", () => setStars(selectedRating));
  button.addEventListener("blur", () => setStars(selectedRating));
  button.addEventListener("click", () => selectRating(rating));

  button.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveKeyboardFocus(index, 1);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveKeyboardFocus(index, -1);
    }

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      selectRating(rating);
    }
  });
});

feedbackForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!feedbackForm.checkValidity()) {
    feedbackForm.reportValidity();
    return;
  }

  feedbackForm.reset();

  if (confirmationMessage) {
    confirmationMessage.hidden = false;
    confirmationMessage.focus?.();
  }
});

setStars(selectedRating);
updateStatus(selectedRating);
