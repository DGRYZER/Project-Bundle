import { useState, useEffect } from 'react'
import { Plus } from "lucide-react"
import { flashcards as defaultFlashcards } from './flashcardData'
import './GalacticNexus.css'

export default function GalacticNexus() {
  // Initialize flashcards state from localStorage or defaultFlashcards immediately.
  const [cards, setCards] = useState(() => {
    const storedCards = localStorage.getItem('flashcards')
    if (storedCards) {
      try {
        return JSON.parse(storedCards)
      } catch (e) {
        console.error("Error parsing flashcards from storage:", e)
        return defaultFlashcards
      }
    }
    return defaultFlashcards
  })

  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [correctGuesses, setCorrectGuesses] = useState(0)
  const [newFront, setNewFront] = useState('')
  const [newBack, setNewBack] = useState('')

  // Save flashcards to localStorage whenever they update.
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(cards))
  }, [cards])

  // Prevent accessing undefined if cards is empty.
  if (!cards || cards.length === 0) {
    return <div>Loading flashcards...</div>
  }

  const currentFlashcard = cards[currentFlashcardIndex]

  const handleNextFlashcard = () => {
    if (currentFlashcardIndex < cards.length - 1) {
      setCurrentFlashcardIndex(currentFlashcardIndex + 1)
      setShowAnswer(false)
    }
  }

  const handlePreviousFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(currentFlashcardIndex - 1)
      setShowAnswer(false)
    }
  }

  const handleRevealAnswer = () => {
    setShowAnswer(true)
  }

  const handleAddFlashcard = () => {
    if (newFront && newBack) {
      const updatedCards = [...cards, { front: newFront, back: newBack }]
      setCards(updatedCards)
      setNewFront('')
      setNewBack('')
    }
  }

  const handleCorrectGuess = () => {
    setCorrectGuesses(correctGuesses + 1)
    handleNextFlashcard()
  }

  return (
    <div className="galactic-nexus">
      <header>
        <h1>Galactic Nexus</h1>
      </header>

      <main className="main-content">
        <div className="left-column">
          <div className="flashcard-section">
            <div className="flashcard-container" onClick={handleRevealAnswer}>
              <div className={`flashcard ${showAnswer ? 'flipped' : ''}`}>
                <div className="card-face front">
                  <h2>{currentFlashcard.front}</h2>
                </div>
                <div className="card-face back">
                  <p>{currentFlashcard.back}</p>
                </div>
              </div>
            </div>
            <div className="controls">
              <button 
                onClick={handlePreviousFlashcard} 
                disabled={currentFlashcardIndex === 0}
              >
                Previous Flashcard
              </button>
              <button 
                onClick={handleNextFlashcard} 
                disabled={currentFlashcardIndex === cards.length - 1}
              >
                Next Flashcard
              </button>
              {showAnswer && (
                <button onClick={handleCorrectGuess}>
                  Correct
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="add-flashcard">
            <h2>Add a New Flashcard</h2>
            <div className="input-group">
              <label htmlFor="front">Front:</label>
              <input
                id="front"
                value={newFront}
                onChange={(e) => setNewFront(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="back">Back:</label>
              <textarea
                id="back"
                value={newBack}
                onChange={(e) => setNewBack(e.target.value)}
              />
            </div>
            <button onClick={handleAddFlashcard} className="add-button">
              <Plus /> Add Flashcard
            </button>
          </div>

          <div className="progress">
            <h2>Progress</h2>
            <p>Correct Guesses: {correctGuesses}</p>
          </div>
        </div>
      </main>

      <footer>
        <p>&copy; 2025 Galactic Nexus. All rights reserved.</p>
      </footer>
    </div>
  )
}
