const prisma = require("../db");

module.exports = {
  async create(channel_id, time) {
    let toCreateObj = {channel_id, time};
    toCreateObj = Object.fromEntries(Object.entries(toCreateObj).filter(([_, v]) => v !== undefined))

    try {
      const newPost = await prisma.channel_post.create({
        data: toCreateObj
      })

      return { message: "Success" , data: newPost};
    } catch(e) {
      console.error('Error', e);
      throw e;
    }
  },

  async getAll() {
    try {
      const allPosts = await prisma.channel_post.findMany()

      return { message: "Success" , data: allPosts};
    } catch(e) {
      console.error('Error', e);
      throw e;
    }
  },

  async getOne(id) {
    let elem;
    try {
      elem = await prisma.channel_post.findFirst({
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

  async edit(id, channel_id, time, text, photo, status) {
    let toEditObj = {channel_id, time, text, photo, status};
    toEditObj = Object.fromEntries(Object.entries(toEditObj).filter(([_, v]) => v !== undefined))

    let post;
    try {
      post = await prisma.channel_post.update({
        where: {
          id
        },
        data: toEditObj
      })

      return { message: "Success" , data: post};
    } catch(e) {
      console.error('Error', e);
      throw e;
    }
  },

  async delete(id) {
    let elem;
    try {
      elem = await prisma.channel_post.delete({
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