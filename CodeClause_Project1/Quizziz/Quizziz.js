const allQuestions = [
  {
    question: "Q1. What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    answer: "Paris",
  },
  {
    question: "Q2. Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: "Mars",
  },
  {
    question: "Q3. What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    answer: "4",
  },
  {
    question: "Q4. Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Silver", "Iron"],
    answer: "Oxygen",
  },
  {
    question: "Q5. Who painted the Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
    answer: "Da Vinci",
  },
  {
    question: "Q6. What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    answer: "Pacific",
  },
  {
    question: "Q7. Which country hosted the 2016 Summer Olympics?",
    options: ["China", "Brazil", "USA", "Japan"],
    answer: "Brazil",
  },
  {
    question: "Q8. What gas do plants primarily use for photosynthesis?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    answer: "Carbon Dioxide",
  },
  {
    question: "Q9. Who wrote 'Romeo and Juliet'?",
    options: ["Shakespeare", "Dickens", "Austen", "Hemingway"],
    answer: "Shakespeare",
  },
  {
    question: "Q10. What is the hardest natural substance known?",
    options: ["Gold", "Iron", "Diamond", "Quartz"],
    answer: "Diamond",
  },
  {
    question: "Q11. What is the capital of Japan?",
    options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
    answer: "Tokyo",
  },
  {
    question: "Q12. Which animal is known as the 'King of the Jungle'?",
    options: ["Tiger", "Lion", "Elephant", "Bear"],
    answer: "Lion",
  },
  {
    question: "Q13. What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "Nauru", "San Marino"],
    answer: "Vatican City",
  },
  {
    question: "Q14. Who discovered penicillin?",
    options: [
      "Alexander Fleming",
      "Marie Curie",
      "Isaac Newton",
      "Albert Einstein",
    ],
    answer: "Alexander Fleming",
  },
  {
    question: "Q15. What is the main ingredient in guacamole?",
    options: ["Tomato", "Avocado", "Onion", "Pepper"],
    answer: "Avocado",
  },
  {
    question: "Q16. Which gas makes up most of Earth's atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"],
    answer: "Nitrogen",
  },
  {
    question: "Q17. What is the currency of Brazil?",
    options: ["Peso", "Real", "Dollar", "Euro"],
    answer: "Real",
  },
  {
    question: "Q18. Who wrote 'Pride and Prejudice'?",
    options: [
      "Jane Austen",
      "Charlotte Brontë",
      "Emily Dickinson",
      "Mary Shelley",
    ],
    answer: "Jane Austen",
  },
  {
    question: "Q19. What is the largest desert in the world?",
    options: ["Sahara", "Gobi", "Antarctic", "Arabian"],
    answer: "Antarctic",
  },
  {
    question: "Q20. Which element has the chemical symbol 'Au'?",
    options: ["Silver", "Gold", "Copper", "Iron"],
    answer: "Gold",
  },
  {
    question: "Q21. What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    answer: "Canberra",
  },
  {
    question: "Q22. Which instrument has 88 keys?",
    options: ["Piano", "Guitar", "Drums", "Violin"],
    answer: "Piano",
  },
  {
    question: "Q23. What is the tallest mountain in the world?",
    options: ["K2", "Kangchenjunga", "Everest", "Makalu"],
    answer: "Everest",
  },
  {
    question: "Q24. Who painted the 'Starry Night'?",
    options: [
      "Claude Monet",
      "Vincent van Gogh",
      "Pablo Picasso",
      "Leonardo da Vinci",
    ],
    answer: "Vincent van Gogh",
  },
  {
    question: "Q25. What is the primary source of energy for Earth?",
    options: ["Wind", "Sun", "Water", "Geothermal"],
    answer: "Sun",
  },
];

let selectedQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 45;
let timer;
let userAnswers = [];

const startContainer = document.getElementById("start-container");
const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result-container");
const questionContainer = document.getElementById("question-container");
const optionsContainer = document.getElementById("options-container");
const submitBtn = document.getElementById("submit-btn");
const timerProgress = document.getElementById("timer-progress");
const timerElement = document.getElementById("timer");
const finalScore = document.getElementById("final-score");
const resultsList = document.getElementById("results-list");

document.getElementById("start-btn").addEventListener("click", startQuiz);
submitBtn.addEventListener("click", checkAnswer);

function startQuiz() {
  startContainer.style.display = "none";
  quizContainer.style.display = "block";
  userAnswers = [];
  selectedQuestions = shuffleArray([...allQuestions]).slice(0, 10);
  currentQuestionIndex = 0;
  loadQuestion();
}

function loadQuestion() {
  questionContainer.classList.remove("fade-in");
  optionsContainer.classList.remove("fade-in");
  void questionContainer.offsetWidth;
  void optionsContainer.offsetWidth;
  questionContainer.classList.add("fade-in");

  const q = selectedQuestions[currentQuestionIndex];
  const renumberedQuestion = q.question.replace(
    /Q\d+\.\s*/,
    `Q${currentQuestionIndex + 1}. `
  );
  questionContainer.textContent = renumberedQuestion;
  optionsContainer.innerHTML = "";

  const shuffledOptions = shuffleArray([...q.options]);
  const labels = ["A", "B", "C", "D"];

  shuffledOptions.forEach((option, index) => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "option";

    if (option.length <= 10) {
      optionDiv.classList.add("short");
    } else if (option.length <= 20) {
      optionDiv.classList.add("medium");
    } else {
      optionDiv.classList.add("long");
    }

    optionDiv.innerHTML = `<span>${labels[index]}. ${option}</span>`;
    optionDiv.classList.add("fade-in");

    optionDiv.addEventListener("click", () => {
      const prevSelected = optionsContainer.querySelector(".option.selected");
      if (prevSelected) prevSelected.classList.remove("selected");
      optionDiv.classList.add("selected");
    });
    optionsContainer.appendChild(optionDiv);
  });

  const optionsHeight = optionsContainer.offsetHeight;
  timerElement.style.height = `${
    optionsHeight + questionContainer.offsetHeight + 40
  }px`;

  submitBtn.disabled = true;
  setTimeout(() => {
    submitBtn.disabled = false;
  }, 3000);

  startTimer();
}

function startTimer() {
  timeLeft = 30;
  timerProgress.style.transition = "height 0.3s ease-out";
  timerProgress.style.height = "100%";
  timerProgress.style.bottom = "0";

  setTimeout(() => {
    timerProgress.style.transition = "height 0.05s linear";
    clearInterval(timer);

    timer = setInterval(() => {
      timeLeft -= 0.05;
      const percentage = (timeLeft / 30) * 100;
      timerProgress.style.height = `${percentage}%`;

      timerProgress.classList.remove("warning", "danger", "jerk");

      if (timeLeft <= 5) {
        timerProgress.classList.add("danger");
        timerProgress.classList.add("jerk");
      } else if (timeLeft <= 15) {
        timerProgress.classList.add("warning");
      }

      if (timeLeft <= 0) {
        clearInterval(timer);
        nextQuestion();
      }
    }, 50);
  }, 300);
}

function checkAnswer() {
  clearInterval(timer);
  const selected = optionsContainer.querySelector(".option.selected");
  const fullText = selected ? selected.textContent : "Not answered";
  const answer = fullText === "Not answered" ? fullText : fullText.substring(3);
  userAnswers[currentQuestionIndex] = answer;
  nextQuestion();
}

function nextQuestion() {
  currentQuestionIndex++;
  timerProgress.classList.remove("warning", "danger", "jerk");

  questionContainer.classList.remove("fade-in");
  questionContainer.classList.add("fade-out");

  const options = optionsContainer.querySelectorAll(".option");
  options.forEach((option) => {
    option.classList.remove("fade-in");
    option.classList.add("fade-out");
  });

  setTimeout(() => {
    if (currentQuestionIndex < 10) {
      loadQuestion();
    } else {
      showResults();
    }
  }, 500);
}

function showResults() {
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";
  finalScore.textContent = calculateScore();
  displayResults();
  document.getElementById("thank-you-message").textContent =
    "Thank you for taking the quiz!";
  document
    .getElementById("return-btn")
    .addEventListener("click", returnToStart);
}

function calculateScore() {
  score = 0;
  userAnswers.forEach((answer, index) => {
    if (answer === selectedQuestions[index].answer) score++;
  });
  return score;
}

function displayResults() {
  resultsList.innerHTML = "";
  selectedQuestions.forEach((q, index) => {
    const userAnswer = userAnswers[index] || "Not answered";
    const isCorrect = userAnswer === q.answer;
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";
    resultItem.innerHTML = `
          <p><strong>Question ${index + 1}:</strong> ${q.question}</p>
          <p><strong>Your Answer:</strong> ${userAnswer}</p>
          <p><strong>Correct Answer:</strong> <span class="${
            isCorrect ? "correct-answer" : "wrong-answer"
          }">${q.answer}</span></p>
      `;
    resultsList.appendChild(resultItem);
  });
}

function returnToStart() {
  resultContainer.style.display = "none";
  startContainer.style.display = "block";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
