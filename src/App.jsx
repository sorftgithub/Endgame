import React from "react";
import { clsx } from "clsx";
import { languages } from "./language";
import { nanoid } from "nanoid";
import { getFarewellText, getRandomWord } from "./utils";
import Confetti from "react-confetti";

export default function App() {
  //State values
  const [currentWord, setCurrentWord] = React.useState(() => getRandomWord());
  // console.log(currentWord);

  const [guessedLetter, setGuessedLetter] = React.useState([]);

  // Derived values
  const wrongGuessCount = guessedLetter.filter(
    (letter) => !currentWord.includes(letter),
  ).length;

  const numGuessesLeft = languages.length - 1;

  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetter.includes(letter));

  const isGameLost = wrongGuessCount >= languages.length - 1;

  const isGameOver = isGameWon || isGameLost;

  const lastGuessedLetter = guessedLetter[guessedLetter.length - 1];

  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);
  // console.log(isLastGuessIncorrect);

  //Static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addGuessedLetter(letter) {
    setGuessedLetter((prevLetters) =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter],
    );
  }

  function startNewGame() {
    setCurrentWord(getRandomWord());
    setGuessedLetter([]);
  }
  const keyboardElement = alphabet.split("").map((letter, index) => {
    const isGuessed = guessedLetter.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    return (
      <button
        key={index}
        onClick={() => addGuessedLetter(letter)}
        className={className}
        disabled={isGameOver}
        aria-disabled={guessedLetter.includes(letter)}
        aria-label={`letter ${letter}`}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const wordElement = currentWord.split("").map((word, index) => {
    const revealGuessedLetter = isGameLost || guessedLetter.includes(word);
    const letterClassName = clsx(
      "letters",
      isGameLost && !guessedLetter.includes(word) && "missed-letters",
    );
    return (
      <span key={index} className={letterClassName}>
        {revealGuessedLetter ? word.toUpperCase() : ""}
      </span>
    );
  });
  const languageChips = languages.map((language, index) => {
    const isLanguageLost = index < wrongGuessCount;
    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    };
    const className = clsx("chip", isLanguageLost && "lost");
    return (
      <span className={className} style={styles} key={language.name}>
        {language.name}
      </span>
    );
  });

  const gameStatusClass = clsx("status-bar", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect,
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      );
    }

    if (isGameWon) {
      return (
        <>
          <h2>You Win!</h2>
          <p>Well done! 🎉</p>
        </>
      );
    }
    if (isGameLost) {
      return (
        <>
          <h2>Game Over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      );
    }
    return null;
  }

  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word in under 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section aria-live="polite" role="status" className={gameStatusClass}>
        {renderGameStatus()}
      </section>
      <section className="language-chips">{languageChips}</section>
      <section className="letters-wrap">{wordElement}</section>
      {/* Combined visually-hidden aria-live region for status updates */}
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuessedLetter)
            ? `correct! The letter ${lastGuessedLetter} is in the word.`
            : `Sorry, the letter ${lastGuessedLetter} is not in the word.`}
          You have {numGuessesLeft} attempts left.
        </p>
        <p>
          current word:
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetter.includes(letter) ? letter + "." : "blank.",
            )
            .join("")}
        </p>
      </section>
      <section className="keyboard">{keyboardElement}</section>
      {isGameOver && (
        <section className="refresh">
          <button className="refresh-btn" onClick={startNewGame}>
            New Game
          </button>
        </section>
      )}
    </main>
  );
}
