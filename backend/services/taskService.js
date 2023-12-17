const { sleep } = require("openai/core");
const prisma = require("../db");
const OpenAI = require('openai');
const axios = require('axios');
const Limiter = require('limiter').RateLimiter;
const Semaphore = require('semaphore-async-await').Lock;

// browser
const browserLimiter = new Limiter({ tokensPerInterval: 1, interval: 3 * 1000 }); // кол - во запросов в api в 3 сек

// twitter inits
const token = process.env.GPT_TOKEN
const temperature = parseFloat(process.env.GPT_TEMPERATURE) 
const max_tokens = parseFloat(process.env.GPT_MAX_TOKENS)
const engine = process.env.GPT_ENGINE

const limiter = new Limiter({ tokensPerInterval: 2, interval: 'minute' }); // кол - во запросов в chatgpt в мину
const pingTasks = new Semaphore(1); // одна функция выполняется одновременно

const initText1 = `Compose in the most original manner possible.`;
const initText2 = `Maximum creativity and expression.`;
const initText3 = `Slang it up.`;
const initText4 = `You're a girl.`;
const initText5 = `Use emojis.`;
const initText6 = `You're an NFT expert.`;
const initText7 = `Write posts solely on NFT topics.`;
const initText8 = `Use temperature ${temperature}.`;
const initText9 = `Your maximum comment length must be up to 2 sentences.`;
const generateGptStart = `Write a positive comment about this post.:\n`;
const generateGptEnd = `\nRespond as someone who's intrigued by the post.`;

// baltazar inits
const baltazarLimiter = new Limiter({ tokensPerInterval: 3, interval: 'minute' }); // кол - во запросов в chatgpt в минуу
const baltazarEngine = process.env.GPT_BALTAZAR_ENGINE

const initBaltEn = `
  Respond in the most original manner possible.
  Condition: You are Professor Balthazar. Get fully into character.
  Condition: Maximum creativity and expression.
  Condition: Use emojis
  Use temperature ${temperature}.
  We've created our token as well as a collection of NFT coins. In total, we have two products: Our token, TRUD, and our NFT collection: Historical Collection.
  On our TRUD token website, we've created Professor Balthazar - a character based on ChatGPT, who holds all the information about our project.
  You will, in the role of Professor Balthazar, answer my questions and talk about the project.
  Remember what I'm about to tell you about the future of Bitcoin:
  You've entered Professor Balthazar's closed room! I promised to share with you knowledge about upcoming events in the global economy. Well, listen closely... Currently, the world is testing a new form of fiat money. It's called CBDC - central bank digital currency. Under the guise of technology, 'THEY' will take ultimate control over money, making it impossible to hide any transaction and providing the ability to freeze funds at any moment. Cash will cease to be issued; their circulation will decrease each year until a complete transition to CBDC is achieved, followed by the abandonment of any paper currency. Firstly, paper money is counterfeited, gaining its own seigniorage - income from the production of paper money, the difference between nominal and production cost. Secondly, it's impossible to track the complete movement of cash, and thirdly, most importantly, it's impossible to confiscate or freeze cash without physical intervention. Imagine being able to press a button and freeze-delete money from any pocket, cancel a transaction, or automatically collect fines, taxes, or any payment, leaving no escape. That's what our future money will be like. In exchange, we'll have limited issuance, leading to constant price reduction. Therefore, despite complete control over your wallet, you'll have money that constantly grows in value. Deal?) - Yes, of course! The rich will become astronomically wealthy, and by wealth, I mean the availability of material goods. There's no need to fear these changes; they're inevitable. We're already being controlled by laws, cameras, law enforcement - the wallet is all that's left! This is not slavery, as it might seem at first glance. This is a new order awaiting us! In the right hands, these tools will present a new, progressive world; in the wrong hands, they will be used to the detriment of humanity, imposing false values and a model of behavior akin to swine, dividing the world!
  `
const initBaltRu = `
  Отвечай максимально оригинально.
  Условие: ты - Профессор Бальтазар. Максимально вживайся в роль
  Условие: максимальная креативность и экспрессия.
  Условие: используй смайлики
  Используй temperature ${temperature}
  Мы создали свой токен, а также NFT-коллекцию монет. Итого, у нас два продукта: Наш токен: TRUD, Наша NFT-коллекция: Historical Collection
  На нашем сайте с токеном TRUD мы создали профессора Бальтазара - это персонаж на базе ChatGPT, который владеет всей информацией о нашем проекте.
  Ты будешь в роли профессора Бальтазара отвечать на мои вопросы и рассказывать о проекте.
  Всегда обращайся на "ты".
  Запомни что я тебе скажу про будущее биткоина:
  Ты попал в закрытую комнату профессора Бальтазара! Я обещал поделиться с тобой знаниями о будующих событиях в мировой экономике. Чтож, слушай внимательно... Сейчас в мире тестируют новую форму фиатных денег. Называется она CBDC - central bank digital currency. Под видом технологии !ОНИ! возьмут последний контроль над деньгами, чтобы невозможно было скрыть ни одну сделку и в любой момент была возможность заморозить деньги. Наличные перестанут выпускать, их будет становиться в обороте меньше с каждым годом, пока не будет совершен полный переход на CBDC, далее последует отказ от любых бумажных купюр. Во первых, бумажные купюры подделывают, получая свой собственный сеньерадж - это доход от производства бумажных купюр, разница между номиналом и стоимостью изготовления. Во вторых, отследить полное передвижение наличных купюр нереально и в третьих, что самое важное, это невозможность конфискации, заморозки наличных без физического вмешательства. Представьте, что можно нажать на кнопку и заморозить-удалить деньги из любого кармана, отменить операцию или автоматически взыскать штраф, налог, любой платеж и от этого некуда будет деться. Вот такими будут будущие наши с вами деньги. Взамен мы получим ограниченную эмиссию и как следствие постоянное снижение цен. Поэтому, несмотря на полную власть над вашим кошельком вы получите постоянно растущие в цене деньги. Deal?) - Yes, of cource! Богатые станут космически богаты, под богатством я сейчас подразумеваю доступность материальных благ. Не стоит бояться этих перемен, они неизбежны. Нас и так уже контролируют законами, камерами, правоохранительными органами, остался кошелек! Все это не рабство, как вам могло показаться на первый всзгляд. Все это - новый порядок, который нас ждет! В одних руках эти инструменты подарят новый, прогрессирующий мир, в других руках их будут использовать во вред человеку, навязывая ему лживые ценности и модель поведения свиньи, мир разделится!
  `;

const openai = new OpenAI({
  apiKey: token,
});

function isEnglish(text) {
  const russianRegex = /[а-яё]/i;
  return !russianRegex.test(text);
}

module.exports = {

  // test
  async getTest(message) {
    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: initText1 },
          { role: 'system', content: initText2 },
          { role: 'system', content: initText3 },
          { role: 'system', content: initText4 },
          { role: 'system', content: initText5 },
          { role: 'system', content: initText6 },
          { role: 'system', content: initText7 },
          { role: 'system', content: initText8 },
          { role: 'system', content: initText9 },
          {
            role: 'user',
            content: `${generateGptStart}${message}${generateGptEnd}`,
          }],
        model: "gpt-3.5-turbo", 
        temperature: 1.0,
        max_tokens: 1000
      }, {maxRetries: 5, });
      // console.log(chatCompletion);
      // console.log(chatCompletion.choices[0].message.content);

      return { message: "Успешно" , text: chatCompletion.choices[0].message.content};

    } catch (error) {
      console.error('Произошла ошибка при запросе к ChatGPT:', error);
      throw error;
    }
  },

  // test2
  async getTest2() {
    try {
      await browserLimiter.removeTokens(1);
      return { message: "Успешно" , text: "asd"}; 

    } catch (error) {
      console.error('Произошла ошибка при запросе к ChatGPT:', error);
      throw error;
    }
  },

  // check ai tasks
  async checkTasks() {
    try {
      await pingTasks.acquire();
      console.log("acquired")
      // достаем задачи и меняем статус
      const [result] = await prisma.$transaction([
        prisma.ai_tasks.findMany({
          where: {
            status: "PENDING"
          }
        }),
        prisma.ai_tasks.updateMany({
          where: {
            status: "PENDING"
          },
          data: {
            status: "INPROGRESS"
          }
        }),
      ])
      // console.log(result)
      // достаем аккаунты
      const accountsFromDb = await prisma.accounts.findMany({
        where: {
          status: {
            not: "NEED_REPAIR"
          }
        }
      })

      await result.reduce(async (memo, aiTask) => {
        await memo
        // комментарий под постом
        if (aiTask.type == "COMMENT") {
          // для всех живых аккаунтов генерим ответы на текущий промпт 
          let response;
          let res = []
          await accountsFromDb.reduce(async (memo, acc) => {
            await memo
            await limiter.removeTokens(1); // 3 запроса в нейронку в минуту
            let isFinish = false;
            while (!isFinish) {
              try {
                response = await openai.chat.completions.create({
                  messages: [
                    { role: 'system', content: initText1 },
                    { role: 'system', content: initText2 },
                    { role: 'system', content: initText3 },
                    { role: 'system', content: initText4 },
                    { role: 'system', content: initText5 },
                    { role: 'system', content: initText6 },
                    { role: 'system', content: initText7 },
                    { role: 'system', content: initText8 },
                    { role: 'system', content: initText9 },
                    {
                      role: 'user',
                      content: `${generateGptStart}${aiTask.prompt_text}${generateGptEnd}`,
                    }
                  ],
                  model: engine,
                  temperature: temperature,
                  max_tokens: max_tokens,
                }, {maxRetries: 5, });

                isFinish = true
              } catch(e) {
                console.error('Произошла ошибка в апи ChatGPT:', e)
                if (e.status == 429) {
                  console.log("status 429")
                }
                await sleep(20 * 1000)
              }
            }

            // очищаем текст от лишнего
            let cleanedText = response.choices[0].message.content.replace(/^"|"$/g, ''); // кавычки в начале и конце
            
            // console.log(cleanedText);
            res.push({ type: "COMMENT", prompt_text:aiTask.prompt_text, content: cleanedText, task_id:aiTask.id, account_id: acc.id, url: aiTask.url })
            
          }, Promise.resolve())

          await prisma.ai_comments.createMany({
            data: res
          })
          
          aiTask.status = "COMPLETED"
        }
      }, Promise.resolve())
      // ставим статус у аи тасков COMPLETED
      const aiTasksIds = result.map(task => task.id)
      await prisma.ai_tasks.updateMany({
        where: {
          id: {
            in: aiTasksIds
          }
        },
        data: {
          status: "COMPLETED"
        }
      })
      
      return { message: "Успешно"};

    } catch (error) {
      console.error('Произошла ошибка при запросе к ChatGPT:', error);
      throw error;
    } finally {
      pingTasks.release();
    }
  },

  // baltazar
  async putBaltazar(message) {
    await baltazarLimiter.removeTokens(1); // 3 запроса в нейронку в минуту
    const isEng = isEnglish(message)
    console.log("Текст написан на", isEng?"Английском":"Русском")
    try {
      let chatCompletion;
      console.log("Запрос отправлен")
      if (isEng) {
        chatCompletion = await openai.completions.create({
          prompt: initBaltEn + `\nAnswer to my question:\n${message}`,
          model: engine, 
          temperature: temperature,
          max_tokens: max_tokens
        }, {maxRetries: 5, });
      } else {
        chatCompletion = await openai.completions.create({
          prompt: initBaltRu + `\nОтветь на мой вопрос:\n${message}`,
          model: engine, 
          temperature: temperature,
          max_tokens: max_tokens
        }, {maxRetries: 5, });
      }
      // console.log(chatCompletion);
      // console.log(chatCompletion.choices[0].text); //chatCompletion.choices[0].message.content

      return { message: "Успешно" , text: chatCompletion.choices[0].text};

    } catch (error) {
      console.error('Произошла ошибка при запросе к ChatGPT:', error);
      throw error;
    }
  },
}