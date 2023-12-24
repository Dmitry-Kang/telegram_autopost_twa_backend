module.exports = {
  isEnglish(text) {
    const russianRegex = /[а-яё]/i;
    return !russianRegex.test(text);
  }, 
}