module.exports = {
  isEnglish(text) {
    const russianRegex = /[а-яё]/i;
    return !russianRegex.test(text);
  }, 
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}