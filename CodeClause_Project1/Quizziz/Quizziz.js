let selectedQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 45;
let timer;
let userAnswers = [];
let userName = "";

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
const nameInput = document.getElementById("name-input");

document.getElementById("start-btn").addEventListener("click", startQuiz);
submitBtn.addEventListener("click", checkAnswer);

function startQuiz() {
  userName = nameInput.value.trim();
  if (!userName) {
    alert("Please enter your name!");
    return;
  }
  startContainer.style.display = "none";
  quizContainer.style.display = "block";
  userAnswers = [];
  fetchQuestions();
}

function fetchQuestions() {
  fetch("http://localhost:3000/questions")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      if (data.length === 0) {
        alert("No questions available in the database!");
        returnToStart();
        return;
      }
      selectedQuestions = shuffleArray(data).slice(0, 10);
      currentQuestionIndex = 0;
      loadQuestion();
    })
    .catch((error) => {
      console.error("Error fetching questions:", error);
      alert("Failed to load questions. Please check the server.");
      returnToStart();
    });
}

function loadQuestion() {
  questionContainer.classList.remove("fade-in");
  optionsContainer.classList.remove("fade-in");
  void questionContainer.offsetWidth;
  void optionsContainer.offsetWidth;
  questionContainer.classList.add("fade-in");

  const q = selectedQuestions[currentQuestionIndex];
  questionContainer.textContent = `Q${currentQuestionIndex + 1}. ${q.question}`;
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
  saveScore();
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
  nameInput.value = "";
}

function saveScore() {
  const data = {
    name: userName,
    timestamp: new Date().toISOString(),
    score: score,
  };
  fetch("http://localhost:3000/save-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => console.log("Score saved:", result))
    .catch((error) => console.error("Error saving score:", error));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
