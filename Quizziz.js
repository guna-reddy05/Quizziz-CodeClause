let selectedQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timer;
let userAnswers = [];
let userName = "";
const PORT = 3000; // Adjust if server runs on a different port

const startContainer = document.getElementById("start-container");
const quizContainer = document.getElementById("quiz-container");
const questionContainer = document.getElementById("question-container");
const optionsContainer = document.getElementById("options-container");
const submitBtn = document.getElementById("submit-btn");
const timerProgress = document.getElementById("timer-progress");
const timerElement = document.getElementById("timer");
const nameInput = document.getElementById("name-input");
const topScoresList = document.getElementById("top-scores-list");
const checkAllResultsStartBtn = document.getElementById(
  "check-all-results-start-btn"
);
const startBtn = document.getElementById("start-btn");
const resultsContainer = document.getElementById("results-container");

document.getElementById("start-btn").addEventListener("click", startQuiz);
submitBtn.addEventListener("click", checkAnswer);
window.addEventListener("load", fetchTopScores);
checkAllResultsStartBtn.addEventListener("click", () => {
  window.open(`http://localhost:${PORT}/all-results`, "_blank");
});

function fetchTopScores() {
  fetch(`http://localhost:${PORT}/top-scores`)
    .then((response) => response.json())
    .then((scores) => displayTopScores(scores))
    .catch((error) => {
      console.error("Error fetching top scores:", error);
      topScoresList.innerHTML = "<p>Unable to load top scores.</p>";
    });
}

function displayTopScores(scores) {
  topScoresList.innerHTML = "";
  if (scores.length === 0) {
    topScoresList.innerHTML = "<p>No scores available yet.</p>";
    return;
  }
  scores.forEach((score, index) => {
    const scoreItem = document.createElement("div");
    scoreItem.className = "score-item";
    scoreItem.innerHTML = `
      <span class="name">${index + 1}. ${score.name}</span>
      <span class="score">${score.score}/10</span>
    `;
    topScoresList.appendChild(scoreItem);
  });
}

function startQuiz() {
  userName = nameInput.value.trim();
  if (!userName) {
    alert("Please enter your name!");
    return;
  }
  startContainer.querySelector(".start-content").style.display = "block";
  resultsContainer.style.display = "none";
  startContainer.style.display = "none";
  quizContainer.style.display = "block";
  userAnswers = [];
  fetchQuestions();
}

function fetchQuestions() {
  fetch(`http://localhost:${PORT}/questions`)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        alert("No questions available!");
        startContainer.style.display = "block";
        quizContainer.style.display = "none";
        return;
      }
      selectedQuestions = shuffleArray(data).slice(0, 10);
      currentQuestionIndex = 0;
      loadQuestion();
    })
    .catch((error) => {
      console.error("Error fetching questions:", error);
      alert("Failed to load questions.");
      startContainer.style.display = "block";
      quizContainer.style.display = "none";
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
  setTimeout(() => (submitBtn.disabled = false), 3000);
  startTimer();
}

function startTimer() {
  timeLeft = 30;
  timerProgress.style.transition = "height 0.3s ease-out";
  timerProgress.style.height = "100%";
  setTimeout(() => {
    timerProgress.style.transition = "height 0.05s linear";
    clearInterval(timer);
    timer = setInterval(() => {
      timeLeft -= 0.05;
      const percentage = (timeLeft / 30) * 100;
      timerProgress.style.height = `${percentage}%`;
      timerProgress.classList.remove("warning", "danger", "jerk");
      if (timeLeft <= 5) {
        timerProgress.classList.add("danger", "jerk");
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
  const answer = selected ? selected.textContent.substring(3) : "Not answered";
  userAnswers[currentQuestionIndex] = answer;
  nextQuestion();
}

function nextQuestion() {
  currentQuestionIndex++;
  timerProgress.classList.remove("warning", "danger", "jerk");
  questionContainer.classList.add("fade-out");
  optionsContainer
    .querySelectorAll(".option")
    .forEach((opt) => opt.classList.add("fade-out"));
  setTimeout(() => {
    questionContainer.classList.remove("fade-out");
    if (currentQuestionIndex < 10) {
      loadQuestion();
    } else {
      finishQuiz();
    }
  }, 500);
}

function finishQuiz() {
  quizContainer.style.display = "none";
  startContainer.style.display = "block";
  nameInput.value = "";
  saveScore();
  showCurrentResults();
  fetchTopScores();
}

function calculateScore() {
  score = 0;
  userAnswers.forEach((answer, index) => {
    if (answer === selectedQuestions[index].answer) score++;
  });
  return score;
}

function saveScore() {
  score = calculateScore();
  const data = {
    name: userName,
    timestamp: new Date().toISOString(),
    score: score,
  };
  fetch(`http://localhost:${PORT}/save-score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Error saving score:", error));
}

function showCurrentResults() {
  score = calculateScore();
  startContainer.querySelector(".start-content").style.display = "none";
  resultsContainer.style.display = "block";
  resultsContainer.innerHTML = `
    <h1>Your Results</h1>
    <p>Here’s how you did, ${userName}!</p>
    <div class="final-score">Final Score: ${score}/10</div>
    <div id="results-list">
  `;
  selectedQuestions.forEach((q, index) => {
    const userAnswer = userAnswers[index] || "Not answered";
    const isCorrect = userAnswer === q.answer;
    resultsContainer.innerHTML += `
      <div class="result-item">
        <p><strong>Q${index + 1}:</strong> ${q.question}</p>
        <p><strong>Your Answer:</strong> ${userAnswer}</p>
        <p><strong>Correct Answer:</strong> <span class="${
          isCorrect ? "correct-answer" : "wrong-answer"
        }">${q.answer}</span></p>
      </div>
    `;
  });
  resultsContainer.innerHTML += `
    </div>
    <p>Thanks for playing!</p>
    <button onclick="resetQuiz()" class="close-btn">Play Again</button>
  `;
}

function resetQuiz() {
  resultsContainer.style.display = "none";
  resultsContainer.innerHTML = "";
  startContainer.querySelector(".start-content").style.display = "block";
  nameInput.value = "";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
