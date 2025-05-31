import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from '@/components/action/profile.action';
import { notFound } from 'next/navigation';
import React from 'react';
import ProfilePageClient from './ProfilePageClient';

interface Params {
  username: string;
}

export interface PageProps {
  params: Promise<Params>; // Expect params to be a Promise resolving to Params
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const user = await getProfileByUsername(resolvedParams.username);
  if (!user) return;
  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${resolvedParams.username}'s profile.`,
  };
}

async function ProfilePageServer({ params }: PageProps) {
  const resolvedParams = await params;
  const user = await getProfileByUsername(resolvedParams.username);
  if (!user) notFound();
  const [posts, likedPosts, isCurrentUserFollower] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <div>
      <ProfilePageClient
        user={user}
        posts={posts}
        likedPosts={likedPosts}
        isFollowing={isCurrentUserFollower}
      />
    </div>
  );
}

export default ProfilePageServer;