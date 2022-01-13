const natural = require('natural')
const BrainJs = require('brain.js')
const network = new BrainJs.NeuralNetwork({hiddenLayers:[3]})

const  getDictionary = trainingData =>{
  const tokenisedArray = trainingData.map(item => {
    const tokens = item.input.split(' ')
    const stemmedTokens = tokens.map(token =>
      natural.PorterStemmer.stem(token.toLowerCase()))
    return stemmedTokens.filter((token) => !natural.stopwords.includes(token))
  
  })
  const flattenedArray = [].concat.apply([], tokenisedArray)
  return flattenedArray.filter((item, pos, self) => self.indexOf(item) == pos)
}

const encode = (phrase,trainingData) =>{
  const dictionary = getDictionary(trainingData)
  const phraseTokens = phrase.split(' ').map((token)=>natural.PorterStemmer.stem(token.toLowerCase()))
  const encodedPhrase = dictionary.map(word => phraseTokens.includes(word) ? 1 : 0)
  return encodedPhrase
}
const getTrainingData = trainingData =>
    trainingData.map(dataSet => {
        const encodedValue = encode(dataSet.input,trainingData)
        return {input: encodedValue, output: dataSet.output}
      })

const trainModel = trainingData=>{
    network.train(getTrainingData(trainingData),{log:(error)=>console.log(error),iterations:2000})
}

const runModel = (phrase,trainingData)=>{
    const encoded = encode(phrase,trainingData)
    return network.run(encoded)
}
module.exports = {trainModel,runModel}