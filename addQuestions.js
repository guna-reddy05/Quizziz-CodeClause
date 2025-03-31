const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("questions.db", (err) => {
  if (err) console.error("Error connecting to database:", err.message);
  console.log("Connected to questions database.");
});

db.run(
  `
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    options TEXT NOT NULL,
    answer TEXT NOT NULL
  )
`,
  (err) => {
    if (err) console.error("Error creating table:", err.message);
    console.log("Questions table ready.");
  }
);
const questions = [
  {
    question: "What is the capital of France?",
    options: JSON.stringify(["London", "Berlin", "Paris", "Madrid"]),
    answer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: JSON.stringify(["Venus", "Mars", "Jupiter", "Saturn"]),
    answer: "Mars",
  },
  {
    question: "What is 2 + 2?",
    options: JSON.stringify(["3", "4", "5", "6"]),
    answer: "4",
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: JSON.stringify(["Gold", "Oxygen", "Silver", "Iron"]),
    answer: "Oxygen",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: JSON.stringify(["Van Gogh", "Picasso", "Da Vinci", "Monet"]),
    answer: "Da Vinci",
  },
  {
    question: "What is the largest ocean on Earth?",
    options: JSON.stringify(["Atlantic", "Indian", "Arctic", "Pacific"]),
    answer: "Pacific",
  },
  {
    question: "Which country hosted the 2016 Summer Olympics?",
    options: JSON.stringify(["China", "Brazil", "USA", "Japan"]),
    answer: "Brazil",
  },
  {
    question: "What gas do plants primarily use for photosynthesis?",
    options: JSON.stringify([
      "Oxygen",
      "Nitrogen",
      "Carbon Dioxide",
      "Hydrogen",
    ]),
    answer: "Carbon Dioxide",
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: JSON.stringify(["Shakespeare", "Dickens", "Austen", "Hemingway"]),
    answer: "Shakespeare",
  },
  {
    question: "What is the hardest natural substance known?",
    options: JSON.stringify(["Gold", "Iron", "Diamond", "Quartz"]),
    answer: "Diamond",
  },
  {
    question: "What is the capital of Japan?",
    options: JSON.stringify(["Seoul", "Beijing", "Tokyo", "Bangkok"]),
    answer: "Tokyo",
  },
  {
    question: "Which animal is known as the 'King of the Jungle'?",
    options: JSON.stringify(["Tiger", "Lion", "Elephant", "Bear"]),
    answer: "Lion",
  },
  {
    question: "What is the smallest country in the world?",
    options: JSON.stringify(["Monaco", "Vatican City", "Nauru", "San Marino"]),
    answer: "Vatican City",
  },
  {
    question: "Who discovered penicillin?",
    options: JSON.stringify([
      "Alexander Fleming",
      "Marie Curie",
      "Isaac Newton",
      "Albert Einstein",
    ]),
    answer: "Alexander Fleming",
  },
  {
    question: "What is the main ingredient in guacamole?",
    options: JSON.stringify(["Tomato", "Avocado", "Onion", "Pepper"]),
    answer: "Avocado",
  },
  {
    question: "Which gas makes up most of Earth's atmosphere?",
    options: JSON.stringify(["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"]),
    answer: "Nitrogen",
  },
  {
    question: "What is the currency of Brazil?",
    options: JSON.stringify(["Peso", "Real", "Dollar", "Euro"]),
    answer: "Real",
  },
  {
    question: "Who wrote 'Pride and Prejudice'?",
    options: JSON.stringify([
      "Jane Austen",
      "Charlotte Brontë",
      "Emily Dickinson",
      "Mary Shelley",
    ]),
    answer: "Jane Austen",
  },
  {
    question: "What is the largest desert in the world?",
    options: JSON.stringify(["Sahara", "Gobi", "Antarctic", "Arabian"]),
    answer: "Antarctic",
  },
  {
    question: "Which element has the chemical symbol 'Au'?",
    options: JSON.stringify(["Silver", "Gold", "Copper", "Iron"]),
    answer: "Gold",
  },
  {
    question: "What is the capital of Australia?",
    options: JSON.stringify(["Sydney", "Melbourne", "Canberra", "Perth"]),
    answer: "Canberra",
  },
  {
    question: "Which instrument has 88 keys?",
    options: JSON.stringify(["Piano", "Guitar", "Drums", "Violin"]),
    answer: "Piano",
  },
  {
    question: "What is the tallest mountain in the world?",
    options: JSON.stringify(["K2", "Kangchenjunga", "Everest", "Makalu"]),
    answer: "Everest",
  },
  {
    question: "Who painted the 'Starry Night'?",
    options: JSON.stringify([
      "Claude Monet",
      "Vincent van Gogh",
      "Pablo Picasso",
      "Leonardo da Vinci",
    ]),
    answer: "Vincent van Gogh",
  },
  {
    question: "What is the primary source of energy for Earth?",
    options: JSON.stringify(["Wind", "Sun", "Water", "Geothermal"]),
    answer: "Sun",
  },
  {
    question: "What is the capital of Brazil?",
    options: JSON.stringify([
      "Sao Paulo",
      "Rio de Janeiro",
      "Brasilia",
      "Salvador",
    ]),
    answer: "Brasilia",
  },
  {
    question: "Which country is known as the Land of the Rising Sun?",
    options: JSON.stringify(["China", "Japan", "Korea", "Thailand"]),
    answer: "Japan",
  },
  {
    question: "What is the chemical symbol for water?",
    options: JSON.stringify(["H2O", "CO2", "O2", "N2"]),
    answer: "H2O",
  },
  {
    question: "Who invented the telephone?",
    options: JSON.stringify([
      "Thomas Edison",
      "Alexander Graham Bell",
      "Nikola Tesla",
      "Guglielmo Marconi",
    ]),
    answer: "Alexander Graham Bell",
  },
  {
    question: "What is the longest river in the world?",
    options: JSON.stringify(["Amazon", "Nile", "Yangtze", "Mississippi"]),
    answer: "Nile",
  },
  {
    question: "Which planet is the largest in our solar system?",
    options: JSON.stringify(["Earth", "Mars", "Jupiter", "Saturn"]),
    answer: "Jupiter",
  },
  {
    question: "What is the capital of India?",
    options: JSON.stringify(["Mumbai", "Delhi", "Kolkata", "New Delhi"]),
    answer: "New Delhi",
  },
  {
    question: "Who was the first person to walk on the moon?",
    options: JSON.stringify([
      "Buzz Aldrin",
      "Neil Armstrong",
      "Yuri Gagarin",
      "John Glenn",
    ]),
    answer: "Neil Armstrong",
  },
  {
    question: "What is the largest mammal in the world?",
    options: JSON.stringify([
      "Elephant",
      "Blue Whale",
      "Giraffe",
      "Hippopotamus",
    ]),
    answer: "Blue Whale",
  },
  {
    question: "Which country won the FIFA World Cup in 2018?",
    options: JSON.stringify(["Brazil", "Germany", "France", "Argentina"]),
    answer: "France",
  },
  {
    question: "What is the chemical symbol for iron?",
    options: JSON.stringify(["Fe", "Ir", "In", "Io"]),
    answer: "Fe",
  },
  {
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: JSON.stringify([
      "Harper Lee",
      "J.K. Rowling",
      "Ernest Hemingway",
      "Mark Twain",
    ]),
    answer: "Harper Lee",
  },
  {
    question: "What is the capital of Canada?",
    options: JSON.stringify(["Toronto", "Vancouver", "Ottawa", "Montreal"]),
    answer: "Ottawa",
  },
  {
    question: "Which is the smallest planet in our solar system?",
    options: JSON.stringify(["Mercury", "Venus", "Mars", "Pluto"]),
    answer: "Mercury",
  },
  {
    question: "What is the largest continent by land area?",
    options: JSON.stringify(["Africa", "Asia", "Australia", "Europe"]),
    answer: "Asia",
  },
  {
    question: "Who discovered gravity?",
    options: JSON.stringify([
      "Isaac Newton",
      "Albert Einstein",
      "Galileo Galilei",
      "Stephen Hawking",
    ]),
    answer: "Isaac Newton",
  },
  {
    question: "What is the currency of Japan?",
    options: JSON.stringify(["Yuan", "Yen", "Won", "Dollar"]),
    answer: "Yen",
  },
  {
    question:
      "Which bird is known for its colorful feathers and ability to mimic sounds?",
    options: JSON.stringify(["Parrot", "Peacock", "Eagle", "Owl"]),
    answer: "Parrot",
  },
  {
    question: "What is the capital of South Africa?",
    options: JSON.stringify([
      "Johannesburg",
      "Cape Town",
      "Pretoria",
      "Durban",
    ]),
    answer: "Pretoria",
  },
  {
    question: "Which gas is most abundant in the Sun?",
    options: JSON.stringify(["Oxygen", "Hydrogen", "Helium", "Carbon"]),
    answer: "Hydrogen",
  },
  {
    question: "Who wrote 'The Great Gatsby'?",
    options: JSON.stringify([
      "F. Scott Fitzgerald",
      "John Steinbeck",
      "William Faulkner",
      "Ernest Hemingway",
    ]),
    answer: "F. Scott Fitzgerald",
  },
  {
    question: "What is the capital of Russia?",
    options: JSON.stringify([
      "St. Petersburg",
      "Moscow",
      "Kiev",
      "Vladivostok",
    ]),
    answer: "Moscow",
  },
  {
    question: "Which animal is the fastest land animal?",
    options: JSON.stringify(["Cheetah", "Lion", "Horse", "Greyhound"]),
    answer: "Cheetah",
  },
  {
    question: "What is the chemical symbol for sodium?",
    options: JSON.stringify(["Na", "So", "Sd", "No"]),
    answer: "Na",
  },
  {
    question: "What is the capital of Egypt?",
    options: JSON.stringify(["Alexandria", "Giza", "Cairo", "Luxor"]),
    answer: "Cairo",
  },
];

db.serialize(() => {
  db.run("DELETE FROM questions");
  const stmt = db.prepare(
    `INSERT INTO questions (question, options, answer) VALUES (?, ?, ?)`
  );
  questions.forEach((q, index) => {
    stmt.run(q.question, q.options, q.answer, (err) => {
      if (err)
        console.error(`Error inserting question ${index + 1}:`, err.message);
    });
  });
  stmt.finalize((err) => {
    if (err) console.error("Error finalizing statement:", err.message);
    console.log("All questions inserted.");
    db.close((err) => {
      if (err) console.error("Error closing database:", err.message);
      console.log("Database connection closed.");
    });
  });
});
