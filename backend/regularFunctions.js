const prisma = require("./db");
const utils = require("./utils")
const axios = require('axios');
const telegramFunctions = require('./telegramFunctions')
const HttpsProxyAgent = require('https-proxy-agent');
const Semaphore = require('semaphore-async-await').Lock;
const Limiter = require('limiter').RateLimiter;
const temperature = 1.0
const max_tokens = 1024
const engine = "text-davinci-003"
const model_engine = "text-russian-002"
const openAiApi = "sk-"

const initText = `
Тебе нужно сгенерировать пост для телеграмм канала на тему: Психология.
Добавь максимальный уровень экспрессии.
Сделай пост максимально оригинальным.
Представь, что ты таролог с двадцатилетним стажем и ты обладаешь всеми знаниями, опытом и знаешь даже самые неочевидные лайфхаки.
Ты женщина.
Используй смайлики.
Используй сленг эксперта.
`;

// openai
const isBusyGeneratePosts = new Semaphore(1);
let oldRequests = 3
let limiter = new Limiter({ tokensPerInterval: 1, interval: 60000/oldRequests }); // кол - во запросов в chatgpt в мину

//telegram
const isBusyTelegram = new Semaphore(1);

// proxy
const httpsAgent = new HttpsProxyAgent({host: "185.000", port: "2222", auth: "asd:sad"})
const axiosInstance = axios.create({httpsAgent});

module.exports = {
  // сами таски для main
  async regularGeneratePosts() {
    if(isBusyGeneratePosts.getPermits() > 0) {
      try {
        await isBusyGeneratePosts.acquire();
        console.log("acquired")
        // await utils.sleep(60 * 1000)
        await this.generateTextAndImage()
      } catch (error) {
        console.error('Произошла ошибка при запросе к ChatGPT:', error);
        throw error;
      } finally {
        isBusyGeneratePosts.release();
        console.log("free")
      }
    }
  },

  async postInTelegram() {
    if(isBusyTelegram.getPermits() > 0) {
      try {
        await isBusyTelegram.acquire();
        console.log("tg:acquired")

        const postsForPost = await prisma.channel_post.findMany({
          where: {
            status: "GENERATED"
          },
          include: {
            channel: true
          }
        })
        // await utils.sleep(60 * 1000)
        await telegramFunctions.postToTelegramChannels(postsForPost)
      } catch (error) {
        console.error('Произошла ошибка при запросе к telegram:', error);
        throw error;
      } finally {
        isBusyTelegram.release();
        console.log("tg:free")
      }
    }
  },

  // внутренние таски

  async generateTextAndImage() {
    const postsForGeneration = await prisma.channel_post.findMany({
      where: {
        status: "PENDING_FOR_GENERATION",
        text: null
      },
      include: {
        channel: true
      }
    })

    await postsForGeneration.reduce(async (memo, post) => {
      await memo
      const generatedText = await this.generateFromOpenAi(post)
      await prisma.channel_post.update({
        where: {
          id: post.id
        },
        data: {
          text: generatedText.text,
          status: "GENERATED"
        }
      })
      console.log("generated text:", generatedText)

    }, Promise.resolve())
  },

  async generateFromOpenAi(post) {
    try {
      let response
      let flag = false
      while (!flag) {
        try {
          await limiter.removeTokens(1);
          response = await axiosInstance.post(`https://api.openai.com/v1/engines/${engine}/completions`,
            {
              prompt: initText + `\nСгенерируй пост для телеграмм канала на тему: Психология:\n`,
              temperature: temperature,
              max_tokens: max_tokens,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openAiApi}`,
              },
            }
          );
      
          response = response.data
          flag = true
        } catch (error) {
          let resetTokensMs = 0;

          if (error.code === 'ECONNRESET') { // проблемы с прокси или интернетом
            //
          } else if (error?.response?.status == 429 || error.response.status >= 500) { // лимит запросов или на их стороне
            if (error.response && error.response.headers) {
              const limitRequests = parseInt(error.response.headers['x-ratelimit-limit-requests']);
              if (limitRequests !== oldRequests) {
                oldRequests = limitRequests
                limiter = new Limiter({ tokensPerInterval: 1, interval: 60000/oldRequests })
              }
              resetTokensMs = utils.parseDuration(error.response.headers['x-ratelimit-reset-tokens']);
              console.log(`status ${error.response.status} sleep ${resetTokensMs || 60 * 1000}ms : ${error.response.data.error.message}`)
            }
            console.log(`status ${error.response.status}`)
          } else  {
            throw error; // убрать если не для тестов
          }
          await utils.sleep(resetTokensMs || 60 * 1000)
        }
      }
      // очищаем текст от лишнего
      let cleanedText = response.choices[0].text.replace(/^"|"$/g, ''); // кавычки в начале и конце
      return { message: "Успешно" , text: cleanedText};

    } catch (error) {
      console.error('Произошла ошибка при запросе к ChatGPT:', error);
      throw error;
    }
  }
}