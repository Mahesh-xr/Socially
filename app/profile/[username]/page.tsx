import { getProfileByUsername } from '@/components/action/profilr.action'
import React from 'react'

export async function generateMetadata({params}:{params:{username:string}}){
    const user = await getProfileByUsername(params.username)
    if(!user) return;
    return{
        title:`${user.name ?? user.username}`,
        description:user.bio || `Check out ${user.username}'s profile.`
    }
}

function ProfilePage({params}:{params:{username:string}}) {
  return (
    <div>
      {params.username}
    </div>
  )
}

export default ProfilePage
