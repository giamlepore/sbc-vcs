import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        progress: {
          where: {
            completed: true
          },
          select: {
            id: true
          }
        }
      },
    })

    const leaderboardWithPoints = leaderboard.map(user => ({
      id: user.id,
      name: user.name,
      points: user.progress.length * 5
    })).sort((a, b) => b.points - a.points).slice(0, 10)

    res.status(200).json(leaderboardWithPoints)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}