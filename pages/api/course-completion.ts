import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, moduleId, courseId } = req.body
    if (typeof userId !== 'string' || typeof moduleId !== 'number' || typeof courseId !== 'number') {
      return res.status(400).json({ error: 'Invalid request body' })
    }

    try {
      await prisma.courseCompletion.upsert({
        where: {
          userId_moduleId_courseId: { userId, moduleId, courseId }
        },
        update: {},
        create: { userId, moduleId, courseId }
      })
      res.status(200).json({ message: 'Course completion recorded' })
    } catch (error) {
      console.error('Error recording course completion:', error)
      res.status(500).json({ error: 'An error occurred while recording course completion' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}