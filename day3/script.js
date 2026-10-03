
const notes = [
    { text: "Buy groceries", category: "personal" },
    { text: "Finish project report", category: "work" },
    { text: "Study JavaScript", category: "study" },
    { text: "Call mum", category: "personal" },
    { text: "Prepare presentation", category: "work" }
];

// 1. Search notes, ignoring uppercase/lowercase differences.
function searchNotes(word) {
    return notes.filter(note =>
        note.text.toLowerCase().includes(word.toLowerCase())
    );
}

// 2. Return the longest note, or null if there are no notes.
function longestNote() {
    if (notes.length === 0) {
        return null;
    }

    let longest = notes[0];

    for (const note of notes) {
        if (note.text.length > longest.text.length) {
            longest = note;
        }
    }

    return longest;
}

// 3. Count notes in each category.
function countByCategory() {
    const counts = {};

    for (const note of notes) {
        counts[note.category] = (counts[note.category] || 0) + 1;
    }

    return counts;
}

// 4. Return a sentence summarizing the notes.
function getSummary() {
    const total = notes.length;
    const counts = countByCategory();
    const noun = total === 1 ? "note" : "notes";

    const categorySummary = Object.entries(counts)
        .map(([category, count]) => `${count} ${category}`)
        .join(", ");

    if (total === 0) {
        return "0 notes.";
    }

    return `${total} ${noun}: ${categorySummary}.`;
}

// 5. Check for duplicate text, ignoring case and extra spaces.
function isDuplicate(text) {
    const normalizedText = text.trim().toLowerCase();

    return notes.some(note =>
        note.text.trim().toLowerCase() === normalizedText
    );
}

// 6. Add a note only if its text and category are valid.
function addNote(text, category) {
    const validCategories = ["personal", "work", "study"];

    if (typeof text !== "string" || text.trim().length < 1 ||
        text.trim().length > 200) {
        return false;
    }

    if (!validCategories.includes(category)) {
        return false;
    }

    if (isDuplicate(text)) {
        return false;
    }

    notes.push({
        text: text.trim(),
        category: category
    });

    return true;
}


// ========== TESTS ==========

// searchNotes
console.log(searchNotes("JAVASCRIPT"));
// Expected: [{ text: "Study JavaScript", category: "study" }]

console.log(searchNotes("pizza"));
// Expected: []


// longestNote
console.log(longestNote());
// Expected: { text: "Finish project report", category: "work" }

const savedNotes = notes.splice(0);
console.log(longestNote());
// Expected: null

notes.push(...savedNotes);


// countByCategory
console.log(countByCategory());
// Expected: { personal: 2, work: 2, study: 1 }

const savedForCount = notes.splice(0);
console.log(countByCategory());
// Expected: {}

notes.push(...savedForCount);


// getSummary
console.log(getSummary());
// Expected: "5 notes: 2 personal, 2 work, 1 study."

const savedForSummary = notes.splice(0);
console.log(getSummary());
// Expected: "0 notes."

notes.push(...savedForSummary);


// isDuplicate
console.log(isDuplicate("  BUY GROCERIES  "));
// Expected: true

console.log(isDuplicate("Buy bread"));
// Expected: false


// addNote
console.log(addNote("Read a book", "personal"));
// Expected: true

console.log(addNote("read A BOOK", "personal"));
// Expected: false (duplicate)

console.log(addNote("Complete assignment", "invalid"));
// Expected: false (invalid category)

console.log(addNote("   ", "study"));
// Expected: false (empty text)