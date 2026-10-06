const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

const MAX_CHARS = 200;
const WARNING_LIMIT = 180;

function updateCounts() {
    const text = noteText.value;
    const characterCount = text.length;

    const trimmedText = text.trim();

    const words = trimmedText === ""
        ? []
        : trimmedText.split(/\s+/);

    const numberOfWords = words.length;

    charCount.textContent = `${characterCount} / ${MAX_CHARS} characters`;
    wordCount.textContent = `${numberOfWords} words`;

    charCount.classList.remove("warning", "over");

    if (characterCount > MAX_CHARS) {
        charCount.classList.add("over");
    } else if (characterCount > WARNING_LIMIT) {
        charCount.classList.add("warning");
    }
}

function saveDraft() {
    localStorage.setItem("quicknotes-draft", noteText.value);
}

function clearEverything() {
    noteText.value = "";

    localStorage.removeItem("quicknotes-draft");

    updateCounts();
}

function setThemeLabel() {
    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "Light mode";
    } else {
        themeToggle.textContent = "Dark mode";
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    localStorage.setItem("quicknotes-theme", isDark ? "dark" : "light");

    setThemeLabel();
}

noteText.addEventListener("input", () => {
    updateCounts();
    saveDraft();
});

clearBtn.addEventListener("click", () => {
    clearEverything();
});

themeToggle.addEventListener("click", () => {
    toggleTheme();
});

noteText.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        clearEverything();
    }
});

window.addEventListener("load", () => {
    const savedDraft = localStorage.getItem("quicknotes-draft");
    const savedTheme = localStorage.getItem("quicknotes-theme");

    if (savedDraft !== null) {
        noteText.value = savedDraft;
    }

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }

    setThemeLabel();
    updateCounts();
});