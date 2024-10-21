
// import the utility functions "decodeHtml" and "shuffle"
import { decodeHtml, shuffle } from './utils.js' 

// get the elements from the DOM
const questionElement = document.querySelector('#question')
const answersElement = document.querySelector('#answers')
const nextQuestionElement = document.querySelector('#nextQuestion')

// IIFE (so we can use async/await)
;(async () => {

	// Gets a question from the API
	const getNextQuestion = async () => {
		const url = 'https://opentdb.com/api.php?amount=1&category=21&difficulty=easy&type=multiple'
		const response = await fetch(url)
		const json = await response.json()
		const { question, correct_answer: correct, incorrect_answers: incorrect } = json.results[0]
		const answers = shuffle([ ...incorrect, correct ])
		return { question, answers, correct }
	}

	// Render the question and possible answers onto the webpage
	const renderQuestion = ({ question, answers, correct }) => { 
		// render question
		questionElement.textContent = decodeHtml(question)

		// render the possible answers
		answersElement.innerHTML = ''
		answers.forEach(answer => {
			const answerOption = document.createElement('button')
			answerOption.textContent = answer
			answersElement.append(answerOption)

			// add functionality to each possible answer
			answerOption.addEventListener('click', () => {
				if (answer === correct) {
					answerOption.classList.add('correct')
					answersElement.querySelectorAll('button').forEach(b => b.disabled = true)
					alert('Correct!')
					return
				}
				
				answerOption.disabled = true
				alert('Incorrect!')
			})
		});
	}
	

	// add functionality for the next question button
	nextQuestionElement.addEventListener('click', async () => {
		renderQuestion(await getNextQuestion())
		nextQuestionElement.disabled = true
		setTimeout(() => nextQuestionElement.disabled = false, 10000)
	})
})()

// mimic a click on the "nextQuestion" button to show the first question
nextQuestionElement.click()