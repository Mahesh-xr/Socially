'use server'
import { currentUser } from '@clerk/nextjs/server';
import React from 'react';
import { getUserByClerkId } from './action/user.action';
import SidebarClient from './SidebarClient';
import { revalidatePath } from 'next/cache';

const Sidebar = async () => {
  const authUser = await currentUser();
  if (!authUser) return <SidebarClient />;

  const user = await getUserByClerkId(authUser.id);
  if (!user) return null;
  
  return <SidebarClient user={user} />;
};  

export default Sidebar;
