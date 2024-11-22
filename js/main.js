import { sendData } from "./fetch.js"

let counterSpace = 0
let words = []
let inputWords = []
let corrected = []
let indexWords = []
let idDisplay = ''
let registerWords = []
let viewWords = []
let queue = true


export function eventOnchange(id) {
  const input = document.getElementById(id)

  if(input){
    let val = ''
    
    input.addEventListener('input', () => {
      val = input.value
      inputWords = val.split(' ').slice(0, -1)
      console.log(inputWords)
      console.log(viewWords)
      console.log(corrected)

      const array = val.split(' ').slice(0, -1)
      let register = array[array.length-2] + " " + array[array.length-1]
      checkingWord(inputWords) // checking if the word get change
      console.log(register)
      // fetch data when space get press twice
      if(counterSpace == 5){
        registerWords = val.split(' ').slice(0, -1)
        if(queue) {
          fetchApi(register)
          resetValue()
         
         } // reset value as a cleanup after fetch 
      }

      function resetValue(){
         val = ''
         register = ''
      }

      function checkingWord() {

        // registerWords.forEach((item, i) => {
        //   if(item != inputWords[i]){
        //     registerWords[i] = inputWords[i]
        //     viewWords[i] = inputWords[i]
        //     triggerDisplay()
        //   }
        // })
        
        for(let i = 0; i < registerWords.length; i++){
          if(registerWords[i] != inputWords[i]){
            console.log(inputWords)
            console.log('got checking')
            console.log(i)
            console.log(registerWords)
            console.log(viewWords)
            console.log('------after------')
           // registerWords[i] = inputWords[i]
            registerWords.splice(i, 1)
            console.log(registerWords)
            //viewWords[i] = inputWords[i]
            viewWords.splice(i, 1)
            console.log(viewWords)
            //corrected[i] = inputWords[i]
          //  corrected.splice(i, 1)
            console.log(corrected)
          }
        }
      }

    });

    input.addEventListener('keydown', (event) => {
      if(event.code === 'Space') {
        words.push(val)
        handleCountingSpace()
      }
    });
  }
}

async function fetchApi(query) {
  try {
    queue = false
    const data = await sendData(query)
    const correctSpell = data?.spelling?.correctedQuery
    counterSpace = 0 // reset counting after fetching
  
    if(correctSpell) processCorrectedQuery(correctSpell)
    else processIncorrectQuery(query);

  } catch (error) {
    console.error("Something went wrong:", error);
  }
  
  function processCorrectedQuery(correctSpell) {
    queue = true
    const sanitizedResult = correctSpell.replace('"_78 tK"', '');
    const words = sanitizedResult.split(' ').slice(0, 2); 
    corrected.push(...words); 
    return comparingWords();
  }

  function processIncorrectQuery(query) {
    queue = true
    const words = query.split(' ').slice(0, 2); 
    console.log(viewWords)
    viewWords.push(...words); 
    return triggerDisplay();
  }
}

function handleCountingSpace () {
  if(counterSpace < 5) return counterSpace += 1
}

function comparingWords () {
  viewWords.push(corrected[corrected.length-2])
  viewWords.push(corrected[corrected.length-1])
  indexWords = [] // cleaning the bucket as a cleanup

  for(let i = 0; i < inputWords.length; i++){
    if(inputWords[i] == corrected[i]) continue;
    else indexWords.push(i)
  }
  applyingCorrectWords()
 
}

function triggerDisplay () {
  console.log(indexWords)
  if(indexWords.length > 0 || viewWords.length > 0){
    const textDisplay = document.getElementById(idDisplay)
    if(textDisplay){
      const text = viewWords.join(' ')
      textDisplay.textContent = text
    }
  }
}

// function triggerDisplay () {
//   console.log(viewWords)
//   if(indexWords.length > 0){
//     const textDisplay = document.getElementById(idDisplay)
//     if(textDisplay){
//       viewWords.forEach(text => {
//         const newElement = document.createElement('span');
//         newElement.textContent = text
//         textDisplay.appendChild(newElement)
//       })
//     }
//   }
// }



function applyingCorrectWords(){
    indexWords.forEach(ind => {
        inputWords.splice(ind, 1, corrected[ind])
    });
    triggerDisplay()
}

console.log(queue)

// the element should pass it's id to display the correct words
export function displayWords(id) { idDisplay = id }






