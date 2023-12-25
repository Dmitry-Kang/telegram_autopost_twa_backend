const prisma = require("../db");

module.exports = {
  async create(user_id, channel_name, channel_id) {
    let toCreateObj = {user_id, channel_name, channel_id};
    toCreateObj = Object.fromEntries(Object.entries(toCreateObj).filter(([_, v]) => v !== undefined))

    try {
      const newChannel = await prisma.channel.create({
        data: toCreateObj
      })

      return { message: "Success" , data: newChannel};
    } catch(e) {
      console.error('Error', e);
      throw e;
    }
  },

  async getAll() {
    try {
      const allChannels = await prisma.channel.findMany()

      return { message: "Success" , data: allChannels};
    } catch(e) {
      console.error('Error', e);
      throw e;
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
      console.error('Error', e);
      throw e;
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
      console.error('Error', e);
      throw e;
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
      console.error('Error', e);
      throw e;
    }
  },
}