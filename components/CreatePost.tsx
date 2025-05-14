"use client";
import { useUser } from "@clerk/nextjs";
import React, { useRef, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { createPost } from "./action/post.action";
import toast from "react-hot-toast";

const CreatePost = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useUser();
  const [imageURl, setImageUrl] = useState("")
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !imageFile) return;
    setIsPosting(true);

    try {
      let uploadedImageUrl = "";

      if (imageFile) {
        const data = new FormData();
        data.set("file", imageFile);

        const uploadRequest = await fetch("/api/files", {
          method: "POST",
          body: data,
        });

        const response = await uploadRequest.json();
        uploadedImageUrl = response.url; 
        setImageUrl(uploadedImageUrl)// Adjust this key based on your API response
      }

      const result = await createPost(content, imageURl);
      if (result?.success) {
        setContent("");
        setImageFile(null);
        setShowImageUpload(false);
        toast.success("Post Created Successfully");
      }
    } catch (error) {
      toast.error("Failed to create a post");
      console.error("Failed to create a post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.imageUrl || "/avatar.png"} />
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            />
          </div>

          {(showImageUpload || imageFile) && (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                className="absolute right-[9999px]"
                onChange={handleChange}
          //        {/* <ImageUpload
          //         endpoint="postImage"
          //         value={imageUrl}
          //         onChange={url=>{
          //        setImageUrl(url)
          //   if(!url) setShowImageUpload(false)
          // }}
          //             /> */}
 
              />
              {imageFile && <p className="text-sm mt-2">{imageFile.name}</p>}
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                  setShowImageUpload(true);
                }}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageFile) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
