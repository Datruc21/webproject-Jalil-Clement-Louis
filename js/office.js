function timeToMinutes(time) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}

function sortSessions(sessions) {
    return sessions.sort((a, b) => {
        if (a.date !== b.date) {
            return new Date(a.date) - new Date(b.date);
        }
        return timeToMinutes(a.start) - timeToMinutes(b.start);
    });
}

const dayToIndex = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
};

const timeToRow = {
    "8:00": 1,
    "9:00": 2,
    "10:00": 3,
    "11:00": 4,
    "12:00": 5,
    "13:00": 6,
    "14:00": 7,
    "15:00": 8,
    "16:00": 9,
    "17:00": 10,
    "18:00": 11,
    "19:00": 12,
    "20:00": 13,
    "21:00": 14,
    "22:00": 15
};

const today = new Date();

const printOfficeHours = async () => {
    try {   

        const table = document.querySelector("table");
        const rows = table.querySelectorAll("tbody tr");
        
        rows.forEach(row => {
            // On commence à i = 1 pour ne pas vider la colonne des heures (8:00, 9:00...)
            for (let i = 1; i < row.cells.length; i++) {
                const cell = row.cells[i];
                cell.innerHTML = "";      // Vide le texte
                cell.rowSpan = 1;         // Casse les fusions
                cell.style.display = "";  // Réaffiche les cellules cachées
            }
        });

        const day = today.getDay();

        const diffToMonday = day === 0 ? -6 : 1 - day;

        const monday = new Date(today);
        monday.setDate(today.getDate() + diffToMonday);
        monday.setHours(0, 0, 0, 0);

        const saturday = new Date(monday);
        saturday.setDate(monday.getDate() + 5);
        saturday.setHours(23, 59, 59, 999);

        const response = await fetch("../json/planning.json");
        if (!response.ok) throw new Error("Fetch error");

        const data = await response.json();

        // 1. FILTER
        let sessions = data.sessions.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= monday && eventDate <= saturday;
        });

        // 2. SORT
        sessions = sortSessions(sessions);

        // 3. TRACK USED CELLS (IMPORTANT)
        const occupied = new Set();

        sessions.forEach(event => {

            const day = event.day.toLowerCase();
            const col = dayToIndex[day];
            if (col === undefined) return;

            const rowStart = timeToRow[event.start];
            const rowEnd = timeToRow[event.end];

            if (rowStart === undefined || rowEnd === undefined) return;

            const row = rows[rowStart - 1]; // IMPORTANT FIX
            if (!row) return;

            const key = `${rowStart}-${col}`;
            if (occupied.has(key)) return;
            occupied.add(key);

            const cell = row.cells[col];
            if (!cell) return;

            const duration = rowEnd - rowStart;
            cell.rowSpan = duration;

            cell.innerHTML = `
                <strong>${event.title}</strong><br>
                ${event.start} - ${event.end}<br>
                ${event.teacher}
                ${event.location || ""}
            `;

            // mark cells as occupied (NO DELETE)
            for (let i = rowStart; i < rowEnd; i++) {
                occupied.add(`${i}-${col}`);
            }
        });

    } catch (error) {
        console.log(error);
    }
};


function nextWeek() {
    today.setDate(today.getDate() + 7);
    printOfficeHours();
}

function prevWeek() {
    today.setDate(today.getDate() - 7);
    printOfficeHours();
}

document.addEventListener("DOMContentLoaded", () => {
    printOfficeHours();

    document.getElementById("btn-prev").addEventListener("click", () => {
        today.setDate(today.getDate() - 7);
        printOfficeHours();
    });

    document.getElementById("btn-next").addEventListener("click", () => {
        today.setDate(today.getDate() + 7);
        printOfficeHours();
    });
});