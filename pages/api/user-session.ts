import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId } = req.body
    if (typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid userId' })
    }

    try {
      await prisma.user.update({
        where: { id: userId },
        data: { lastSessionAt: new Date() }
      })
      res.status(200).json({ message: 'User session updated' })
    } catch (error) {
      console.error('Error updating user session:', error)
      res.status(500).json({ error: 'An error occurred while updating user session' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}