const tf = require('@tensorflow/tfjs-node');
const { Tokenizer } = require('@huggingface/tokenizers');

let emotionModel = null;
let tokenizer = null;

async function initEmotionService() {
  try {
    console.log('Loading emotion model...');
    emotionModel = await tf.loadLayersModel('file://path/to/your/model/model.json');
    console.log('Emotion model loaded.');

    console.log('Loading tokenizer...');
    tokenizer = await Tokenizer.fromFile('./path/to/tokenizer/tokenizer.json');
    console.log('Tokenizer loaded.');
  } catch (error) {
    console.error('Error loading model/tokenizer:', error);
    throw error;
  }
}

function getEmotionModel() {
  if (!emotionModel) {
    throw new Error('Emotion model is not loaded. Please initialize first.');
  }
  return emotionModel;
}

function getTokenizer() {
  if (!tokenizer) {
    throw new Error('Tokenizer is not loaded. Please initialize first.');
  }
  return tokenizer;
}

module.exports = {
  initEmotionService,
  getEmotionModel,
  getTokenizer,
};