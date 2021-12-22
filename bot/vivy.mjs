import prisma from "../prisma.mjs"

export default {
  async link (params) {
    const [id1, id2] = params.map(s => Number(s))

    await prisma.userFollows.create({ data: { followerId: id1,  followingId: id2 }})
    await prisma.userFollows.create({ data: { followerId: id2,  followingId: id1 }})
    return params
  }
}