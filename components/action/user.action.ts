"use server";
import prisma from "@/lib/prisma";
import { currentUser, auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!user || !userId) return;

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (existingUser) return existingUser;
    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });
  } catch (error) {
    console.log("Error in Sync User", error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}
export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");
  const user = await getUserByClerkId(clerkId);
  if (!user) {
    return null
    // throw new Error("User not Found");
  }
  return user.id;
}

export async function getRandomUsers() {
  try {
    const userId = await getDbUserId();
    if(!userId) return []
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
    });
    return randomUsers;
  } catch (error) {
    console.log("Error fetching Random Users", error);
    return [];
  }
}
export async function toggleFollow(targetId: string) {
  try {
    const userId = await getDbUserId();
    if(!userId) return;
    if (userId === targetId) throw new Error(" You can't Follow Yourself");
    const exsistingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetId,
        },
      },
    });
    if(exsistingFollow){
      // UnFollow
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetId,
          },
        },
      });
    }
    else{

      // follow
      await prisma.$transaction([
        prisma.follows.create({
          data:{
            followerId:userId,
            followingId:targetId
          }
        }),
        prisma.notification.create({
          data:{
            type:"FOLLOW",
            userId:targetId,
            creatorId:userId
          }
        })
      ])
      revalidatePath("/")
      return{sucess:true}

    }
  } catch (error) {
    return {sucess:false, error:"Error while trying to follow"}
  }
}
