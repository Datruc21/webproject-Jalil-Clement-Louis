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

let today = new Date();

const printOfficeHours = async () => {
    try {
        const p = document.getElementById("current");
        p.textContent = today.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
            });
        const tbody = document.querySelector("table tbody");
        tbody.innerHTML = ""; // 🔥 reset complet

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

        let sessions = data.sessions.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= monday && eventDate <= saturday;
        });

        sessions = sortSessions(sessions);

        const occupied = new Set();

        // 🔥 on recrée chaque ligne (8h → 22h)
        for (let hour = 8; hour <= 22; hour++) {

            const row = document.createElement("tr");

            // colonne heure
            const timeCell = document.createElement("td");
            timeCell.textContent = `${hour}:00`;
            row.appendChild(timeCell);

            // colonnes jours
            for (let col = 1; col <= 6; col++) {

                const key = `${hour}-${col}`;
                if (occupied.has(key)) continue;

                const cell = document.createElement("td");

                // trouver un event qui commence ici
                const event = sessions.find(e => {
                    return (
                        dayToIndex[e.day.toLowerCase()] === col &&
                        parseInt(e.start) === hour
                    );
                });

                if (event) {
                    const start = parseInt(event.start);
                    const end = parseInt(event.end);
                    const duration = end - start;

                    cell.rowSpan = duration;
                    cell.classList.add("course");

                    cell.innerHTML = `
                        <strong>${event.title}</strong><br>
                        ${event.start} - ${event.end}<br>
                        ${event.teacher}<br>
                        ${event.location || ""}
                    `;

                    // marquer comme occupé
                    for (let h = start; h < end; h++) {
                        occupied.add(`${h}-${col}`);
                    }
                }

                row.appendChild(cell);
            }

            tbody.appendChild(row);
        }

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

    document.getElementById("today").addEventListener("click", () => {
        today = new Date();
        printOfficeHours(); 
    });
}); 