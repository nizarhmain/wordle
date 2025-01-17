import "./App.css";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

function App() {
  const [words, setWords] = useState<string[]>([]);
  const [wordToGuess, setWordToGuess] = useState<string>("");

  useEffect(() => {
    fetch("words_alpha_of_length_five.txt")
      .then((response) => response.text())
      .then((data) => setWords(data.split("\n").map((line) => line.trim())));
  }, []);

  useEffect(() => {
    if (words.length > 0) {
      const randomIndex = Math.floor(Math.random() * words.length);
      setWordToGuess(words[randomIndex]);
    }
  }, [words]);

  return <Main wordToGuess={wordToGuess} />;
}

function Main({ wordToGuess }: { wordToGuess: string }) {
  const [userInput, setUserInput] = useState("");
  const [guesses, setGuesses] = useState<string[]>(Array(5).fill(""));
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(e);
      if (e.key === "Backspace") {
        setUserInput(userInput.slice(0, -1));
        return;
      }

      if (e.key === "Enter") {
        check();
      }

      if (
        e.key.match(/[a-zA-Z]/) &&
        e.key.length === 1 &&
        userInput.length < 5
      ) {
        setUserInput(userInput + e.key.toLowerCase());
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [userInput]);

  function check() {
    if (userInput === wordToGuess) {
      confetti();
    }

    if (userInput.length === 5 && currentGuessIndex < 5) {
      const newGuesses = [...guesses];
      newGuesses[currentGuessIndex] = userInput;
      setGuesses(newGuesses);
      setCurrentGuessIndex(currentGuessIndex + 1);
      setUserInput("");
    }
  }

  function getLetterColor(
    letter: string,
    index: number,
    rowIndex: number,
  ): string {
    if (rowIndex >= currentGuessIndex) return "transparent";

    if (letter === wordToGuess[index]) {
      return "green";
    } else if (wordToGuess.includes(letter)) {
      return "yellow";
    } else {
      return "gray";
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          margin: 20,
        }}
      >
        <h2>{wordToGuess}</h2>

        {[0, 1, 2, 3, 4].map((rowIndex) => (
          <div
            key={rowIndex}
            style={{ display: "flex", flexDirection: "row", gap: 10 }}
          >
            {[0, 1, 2, 3, 4].map((colIndex) => {
              const letter =
                rowIndex === currentGuessIndex
                  ? userInput[colIndex] ?? ""
                  : guesses[rowIndex][colIndex] ?? "";

              const backgroundColor = getLetterColor(
                letter,
                colIndex,
                rowIndex,
              );

              return (
                <div
                  key={colIndex}
                  style={{
                    border: "1px solid white",
                    width: 50,
                    height: 50,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor,
                  }}
                >
                  <h2 style={{ margin: 0 }}>{letter}</h2>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <button onClick={() => check()}>Check</button>
    </>
  );
}

export default App;
