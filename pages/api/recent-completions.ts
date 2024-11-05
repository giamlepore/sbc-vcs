import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const recentCompletions = await prisma.courseCompletion.findMany({
      take: 5,
      orderBy: {
        completedAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    res.status(200).json(recentCompletions)
  } catch (error) {
    console.error('Error fetching recent completions:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}