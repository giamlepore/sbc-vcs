import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query
    const progress = await prisma.progress.findMany({
      where: { userId: userId as string },
    })
    const formattedProgress = progress.reduce((acc: Record<number, number[]>, curr: { moduleId: number; courseId: number }) => {
        if (!acc[curr.moduleId]) {
          acc[curr.moduleId] = [];
        }
        acc[curr.moduleId].push(curr.courseId);
        return acc;
      }, {});
    res.status(200).json(formattedProgress)
  } else if (req.method === 'POST') {
    const { userId, moduleId, courseId } = req.body
    await prisma.progress.upsert({
      where: {
        userId_moduleId_courseId: {
          userId,
          moduleId,
          courseId,
        },
      },
      update: {
        completed: true,
      },
      create: {
        userId,
        moduleId,
        courseId,
        completed: true,
      },
    })
    res.status(200).json({ message: 'Progress saved' })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}