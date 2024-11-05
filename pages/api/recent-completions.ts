import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

interface Activity {
  id: string
  type: 'completion' | 'session'
  userId: string
  moduleId?: number
  courseId?: number
  timestamp: string
  user: {
    name: string | null
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Fetch recent completions
    const completions = await prisma.courseCompletion.findMany({
      take: 15,
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

    // Fetch recent sessions
    const sessions = await prisma.user.findMany({
      where: {
        lastSessionAt: {
          not: null
        }
      },
      take: 15,
      orderBy: {
        lastSessionAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        lastSessionAt: true
      }
    })

    // Transform and combine both types of activities
    const activities: Activity[] = [
      ...completions.map(completion => ({
        id: completion.id,
        type: 'completion' as const,
        userId: completion.userId,
        moduleId: completion.moduleId,
        courseId: completion.courseId,
        timestamp: completion.completedAt.toISOString(),
        user: {
          name: completion.user.name
        }
      })),
      ...sessions.map(session => ({
        id: `session-${session.id}`,
        type: 'session' as const,
        userId: session.id,
        timestamp: session.lastSessionAt!.toISOString(),
        user: {
          name: session.name
        }
      }))
    ]

    // Sort combined activities by timestamp
    activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    // Return only the 5 most recent activities
    res.status(200).json(activities.slice(0, 5))
  } catch (error) {
    console.error('Error fetching recent activities:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}