import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const WhoToFollow = async () => {
    const userId =  await currentUser()
    try {
        const randomUsers = await prisma.user.findMany({
            where:{
                AND:[
                    {NOT:{id:userId}},
                    {
                        
                    }
                ]
            }
        })
        
    } catch (error) {
        
    }
  return (
    
    <div>
   
      
    </div>
  )
}

export default WhoToFollow
