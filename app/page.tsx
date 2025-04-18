import { getPosts } from "@/components/action/post.action";
import { getDbUserId } from "@/components/action/user.action";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import WhoToFollow from "@/components/WhoToFollow";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser()
  const posts = await getPosts()
  const dbUserId = await getDbUserId()
  if(!dbUserId) return
  
  return (
    
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6"> 
      <div className="lg:col-span-6">  
        {user && <CreatePost/>}
        <div className="space-y-6">
          {posts.map(post=> (
            <PostCard key={post.id} post={post} dbUserId={dbUserId}/>
          ))}
        </div>
      </div>

      <div className= " hidden lg:col-span-4 lg:block sticky top-20"> 
        <WhoToFollow/>
      </div>
      
      
    </div>
  );
}
