const axios = require('axios');
const prisma = require("./db");
const FormData = require('form-data');
const telegramBotToken = "124124"
const telegramBotName = "124124"

module.exports = {
    async postToTelegramChannels(posts) {
      for (const post of posts) {
        const { id, text, photo } = post;
        const channelId = post.channel.channel_id
    
        // Проверяем наличие бота в канале
        const botInChannel = await this.checkBotInChannel(telegramBotToken, channelId);
        if (!botInChannel) {
          console.log(`Бот отсутствует в канале ${channelId}`);
          continue;
        }
    
        // Проверяем права на создание поста
        const hasPostPermissions = await this.checkPostPermissions(telegramBotToken, channelId);
        if (!hasPostPermissions) {
          console.log(`Отсутствуют права на создание поста в канале ${channelId}`);
          continue;
        }
    
        // Создаем пост
        const postResult = await this.createPost(telegramBotToken, channelId, text, photo, id);
        if (!postResult) {
          console.log(`Ошибка при создании поста в канале ${channelId}: ${postResult?.error}`);
          continue;
        }
    
        console.log(`Пост успешно создан в канале ${channelId}`);
      }
    },

    async checkBotInChannel(token, channelId) {
      try {
        const response = await axios.get(`https://api.telegram.org/bot${token}/getChatMember?chat_id=${channelId}&user_id=${telegramBotName}`);
        return response.data.ok && response.data.result.status !== 'left';
      } catch (error) {
        console.log(`Ошибка при проверке бота в канале ${channelId}: ${error.message}`);
        return false;
      }
    },
    
    async checkPostPermissions(token, channelId) {
      try {
        const response = await axios.get(`https://api.telegram.org/bot${token}/getChatMember?chat_id=${channelId}&user_id=${telegramBotName}`);
        return response.data.ok && response.data.result.can_post_messages;
      } catch (error) {
        console.log(`Ошибка при проверке прав на пост в канале ${channelId}: ${error.message}`);
        return false;
      }
    },
    
    async createPost(token, channelId, text, photo, id) {
      const formData = new FormData();
      formData.append('chat_id', channelId);
      formData.append('text', text);
    
      if (photo) {
        // Добавьте обработку загрузки фото, если они есть
        // formData.append('photo', photo);
      }
    
      try {
        const response = await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, formData);

        await prisma.channel_post.update({
          where: {
            id
          },
          data: {
            status: "POSTED"
          }
        })
        return response.data;
      } catch (error) {
        console.log(`Ошибка при создании поста в канале ${channelId}: ${error.message}`);
        return null;
      }
    }
    
}