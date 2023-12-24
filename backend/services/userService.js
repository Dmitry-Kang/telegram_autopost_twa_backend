const prisma = require("../db");

module.exports = {
  async authorize(telegram_id) {
    let newUser;
    try {
      newUser = await prisma.users.findFirst({
        where: {
          telegram_id
        }
      })

      if (!newUser) {
        newUser = await prisma.users.create({
          where: {
            telegram_id
          }
        })
      }

      return { message: "Success" , data: newUser};
    } catch(e) {
      console.error('Error', error);
      throw error;
    }
  },

  async getAll() {
    let allUsers;
    try {
      allUsers = await prisma.users.findMany()

      return { message: "Success" , data: allUsers};
    } catch(e) {
      console.error('Error', error);
      throw error;
    }
  },

  async getOne(id) {
    let elem;
    try {
      elem = await prisma.users.findFirst({
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

  async edit(tg_id, config, first_name, last_name, username, tg_api) {
    let toEditObj = {config, first_name, last_name, username, tg_api};
    toEditObj = Object.fromEntries(Object.entries(toEditObj).filter(([_, v]) => v !== undefined))

    let user;
    try {
      user = await prisma.users.update({
        where: {
          telegram_id: tg_id
        },
        data: toEditObj
      })

      return { message: "Success" , data: user};
    } catch(e) {
      console.error('Error', error);
      throw error;
    }
  },
}