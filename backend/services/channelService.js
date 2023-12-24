const prisma = require("../db");

module.exports = {
  async create(user_id, channel_name, channel_id) {
    let toCreateObj = {config, first_name, last_name, username, tg_api};
    toCreateObj = Object.fromEntries(Object.entries(toCreateObj).filter(([_, v]) => v !== undefined))

    try {
      const newChannel = await prisma.channel.create({
        data: toCreateObj
      })

      return { message: "Success" , data: newChannel};
    } catch(e) {
      console.error('Error', error);
      throw error;
    }
  },

  async getAll() {
    try {
      const allChannels = await prisma.channel.findMany()

      return { message: "Success" , data: allChannels};
    } catch(e) {
      console.error('Error', error);
      throw error;
    }
  },

  async getOne(id) {
    let elem;
    try {
      elem = await prisma.channel.findFirst({
        where: {
          id
        }
      })

      return { message: "Success" , data: elem};
    } catch(e) {
      console.error('Error', error);
      throw error;
    }
  },

  async edit(id, channel_name, channel_id, username, config, status, reason) {
    let toEditObj = {channel_name, channel_id, username, config, status, reason};
    toEditObj = Object.fromEntries(Object.entries(toEditObj).filter(([_, v]) => v !== undefined))

    let channel;
    try {
      channel = await prisma.channel.update({
        where: {
          id
        },
        data: toEditObj
      })

      return { message: "Success" , data: channel};
    } catch(e) {
      console.error('Error', error);
      throw error;
    }
  },

  async delete(id) {
    let elem;
    try {
      elem = await prisma.channel.delete({
        where: {
          id
        }
      })

      return { message: "Success" , data: elem};
    } catch(e) {
      console.error('Error', error);
      throw error;
    }
  },
}