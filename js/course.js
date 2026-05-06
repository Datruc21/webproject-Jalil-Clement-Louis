document.addEventListener("DOMContentLoaded", () => {
    // --- code to hide or display the module info ---
    const modules = document.querySelectorAll(".module");

    modules.forEach(module => {
        const title = module.querySelector(".module-title");
        const info = module.querySelector(".module-info");

        info.classList.remove("open");

        title.addEventListener("click", () => {
            const isOpen = info.classList.contains("open");
            info.classList.toggle("open", !isOpen);
            title.classList.toggle("open", !isOpen);
        });
    });

    // --- Quiz questions ---
    const quizData = {
        "db": {
            title: "Quiz: Database",
            questions: [
                {
                    q: "Who is the coordinator of the Database module?",
                    options: ["Nicolas Flasque", "Léna Trébaul", "Cherifa Ben Khelil"],
                    answer: 1
                },
                {
                    q: "How many hours of Practical Work (TP) are included in this module?",
                    options: ["9h", "12h", "15h"],
                    answer: 0
                },
                {
                    q: "Which language is primarily used to query relational databases?",
                    options: ["HTML", "C", "SQL"],
                    answer: 2
                },
                {
                    q: "What does SQL stand for?",
                    options: ["Structured Query Language", "Strong Question Language", "Simple Query Logic"],
                    answer: 0
                },
                {
                    q: "In a relational database, what is the purpose of a Primary Key?",
                    options: ["To encrypt the table", "To uniquely identify each record", "To link to a webpage"],
                    answer: 1
                }
            ]
        },
        "algo": {
            title: "Quiz: Data Structure and Programming",
            questions: [
                {
                    q: "Who is the coordinator of this module?",
                    options: ["Léna Trébaul", "Asma Gabis", "Nicolas Flasque"],
                    answer: 2
                },
                {
                    q: "How many hours of Directed Work (TD) does this module contain?",
                    options: ["10h", "15h", "20h"],
                    answer: 2
                },
                {
                    q: "In C, which function is used to allocate memory dynamically?",
                    options: ["malloc()", "new", "alloc()"],
                    answer: 0
                },
                {
                    q: "Which data structure operates on a First-In-First-Out (FIFO) principle?",
                    options: ["Stack (Pile)", "Queue (File)", "Tree (Arbre)"],
                    answer: 1
                },
                {
                    q: "What is a pointer in the C programming language?",
                    options: ["A graphical cursor", "A variable that stores a memory address", "A loop condition"],
                    answer: 1
                }
            ]
        },
        "java": {
            title: "Quiz: Java 1 : Fundamentals of OOP",
            questions: [
                {
                    q: "Who coordinates the Java 1 module?",
                    options: ["Cherifa Ben Khelil", "Malika Charrad", "Nicolas Flasque"],
                    answer: 0
                },
                {
                    q: "What are the four main pillars of Object-Oriented Programming?",
                    options: ["HTML, CSS, JS, PHP", "Encapsulation, Inheritance, Polymorphism, Abstraction", "Read, Write, Execute, Delete"],
                    answer: 1
                },
                {
                    q: "In Java, which keyword is used by a class to inherit from another class?",
                    options: ["extends", "implements", "inherits"],
                    answer: 0
                },
                {
                    q: "How many hours of Lectures (CM) are planned for this module?",
                    options: ["6h", "12h", "16h"],
                    answer: 1
                },
                {
                    q: "What is the correct syntax to declare the main method in Java?",
                    options: ["void main()", "public main()", "public static void main(String[] args)"],
                    answer: 2
                }
            ]
        }
    };

    // --- Modal window and quiz logic ---
    const modal = document.getElementById("quiz-modal");
    const closeBtn = document.querySelector(".close-btn");
    const quizTitle = document.getElementById("quiz-title");
    const quizBody = document.getElementById("quiz-body");
    const submitBtn = document.getElementById("submit-quiz");
    const resultDiv = document.getElementById("quiz-result");

    let currentModule = null;

    // Open modal window on click
    const quizButtons = document.querySelectorAll(".quiz-btn:not(#submit-quiz)");
    quizButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modKey = btn.getAttribute("data-module");
            loadQuiz(modKey);
            modal.style.display = "block";
        });
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // Quiz
    function loadQuiz(modKey) {
        currentModule = modKey;
        const data = quizData[modKey];
        quizTitle.textContent = data.title;
        quizBody.innerHTML = "";
        resultDiv.style.display = "none";
        submitBtn.style.display = "block";

        data.questions.forEach((qObj, qIndex) => {
            const qDiv = document.createElement("div");
            qDiv.classList.add("question-block");
            
            const qTitle = document.createElement("div");
            qTitle.classList.add("question-text");
            qTitle.textContent = `${qIndex + 1}. ${qObj.q}`;
            qDiv.appendChild(qTitle);

            qObj.options.forEach((opt, optIndex) => {
                const label = document.createElement("label");
                label.classList.add("option-label");
                
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = `question-${qIndex}`;
                radio.value = optIndex;

                label.appendChild(radio);
                label.appendChild(document.createTextNode(opt));
                qDiv.appendChild(label);
            });

            quizBody.appendChild(qDiv);
        });
    }

    submitBtn.addEventListener("click", () => {
        const data = quizData[currentModule];
        let score = 0;
        let allAnswered = true;

        data.questions.forEach((qObj, qIndex) => {
            const selectedOpt = document.querySelector(`input[name="question-${qIndex}"]:checked`);
            const allLabels = document.querySelectorAll(`input[name="question-${qIndex}"]`);
            
            if (!selectedOpt) {
                allAnswered = false;
            }

            allLabels.forEach(radio => {
                const label = radio.parentElement;
                radio.disabled = true;

                // Color correct answer green
                if (parseInt(radio.value) === qObj.answer) {
                    label.classList.add("correct");
                } 
                // Color selected wrong answer red
                else if (radio.checked && parseInt(radio.value) !== qObj.answer) {
                    label.classList.add("wrong");
                }
            });

            if (selectedOpt && parseInt(selectedOpt.value) === qObj.answer) {
                score++;
            }
        });

        if (!allAnswered) {
            // ...maybe we will add a warning later
        }

        submitBtn.style.display = "none";
        resultDiv.style.display = "block";
        resultDiv.textContent = `You scored ${score} out of 5!`;
        
        if (score === 5) {
            resultDiv.style.backgroundColor = "#d4edda";
            resultDiv.style.color = "#155724";
        } else if (score >= 3) {
            resultDiv.style.backgroundColor = "#fff3cd";
            resultDiv.style.color = "#856404";
        } else {
            resultDiv.style.backgroundColor = "#f8d7da";
            resultDiv.style.color = "#721c24";
        }
    });
});