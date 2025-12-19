import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import {
  CreatePost,
  deleteComment,
  deletePost,
  getAllComments,
  getAllPosts,
  incrementPostLikes,
  postComment,
} from "@/config/redux/action/postAction";
import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "@/layout/DashboardLayout";
import styles from "./style.module.css";
import { BASE_URL } from "@/config";
import { resetPostId } from "@/config/redux/reducers/postReducer";

function DashboardComponent() {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const PostState = useSelector((state) => state.posts);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [commentText, setCommentText] = useState("");

  //Fetching posts user details only when token is confirmed
  useEffect(() => {
    if (authState.isTokenThere) {
      const token = localStorage.getItem("token");
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token }));
    }
  }, [authState.isTokenThere, dispatch]);

  useEffect(() => {
    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profile_fetched, dispatch]);

  // handling Post upload functionality
  const handlePost = async () => {
    try {
      await dispatch(
        CreatePost({ file: fileContent, body: postContent })
      ).unwrap();

      setPostContent("");
      setFileContent(null);
      dispatch(getAllPosts());
    } catch (error) {
      console.error("Post failed:", error);
    }
  };

  // handling Delete Post functionality
  const handleDelete = async (postId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!isConfirmed) return;

    await dispatch(
      deletePost({ token: localStorage.getItem("token"), post_id: postId })
    );

    await dispatch(getAllPosts());
  };

  // handling Delete Comment functionality
  const handleDeleteComment = async (commentId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!isConfirmed) return;

    await dispatch(deleteComment({ comment_id: commentId }));
    await dispatch(getAllComments({ post_id: PostState.postId }));
  };

  // Handling Share functionality
  const handleShare = async (postId) => {
    try {
      const shareUrl = `${window.location.origin}/post/${postId}`;

      if (navigator.share) {
        await navigator.share({
          title: "Check out this post",
          text: "Mujhe ye post interesting laga",
          url: shareUrl,
        });
        console.log("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
      alert("Share karne me problem aa gayi");
    }
  };

  // handle Likes functionality
  const handleLikes = async (post) => {
    await dispatch(incrementPostLikes(post._id));
    dispatch(getAllPosts());
  };

  // handle comments functionality
  const handleComments = (post) => {
    dispatch(getAllComments({ post_id: post._id }));
  };

  // Alert
  const handleAlert = () => {
    alert(
      `🚧 This feature is currently under development  We’re writing clean code & fixing bugs. Stay tuned.`
    );
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.Dashboard_component}>
          {/* Create Post Container */}
          <div className={styles.create_post_container}>
            <img
              className={styles.user_profile}
              width={100}
              src={`${BASE_URL}/${authState.user?.userId?.profilePicture}`}
              alt=""
            />
            <textarea
              className={styles.textArea_content}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              name=""
              id=""
              placeholder={"What's in your mind?"}
            ></textarea>

            <label htmlFor="fileUpload">
              <div className={styles.fab}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </div>
            </label>
            <input
              onChange={(e) => setFileContent(e.target.files[0])}
              type="file"
              hidden
              id="fileUpload"
            />

            {postContent.length > 0 && (
              <div onClick={handlePost} className={styles.upload_button}>
                Post
              </div>
            )}
          </div>

          <div className={styles.whiteSpace}></div>

          {/* All Posts Card */}
          <div className={styles.all_posts_Container}>
            {PostState.posts?.map((post) => {
              return (
                <div key={post._id} className={styles.singleCard}>
                  <div className={styles.singleCardContainer}>
                    <div className={styles.singleCard_postContainer}>
                      <div className={styles.postDetails_container}>
                        <img
                          onClick={() =>
                            router.push(`/view_profile/${post.userId.username}`)
                          }
                          className={styles.user_profile_picture}
                          src={`${BASE_URL}/${post?.userId?.profilePicture}`}
                          alt=""
                        />

                        <div
                          className={styles.singleCard_userDetails}
                          style={{ marginTop: "0.5rem" }}
                        >
                          <p
                            onClick={() =>
                              router.push(
                                `/view_profile/${post.userId.username}`
                              )
                            }
                            style={{ fontWeight: "bold", cursor: "pointer" }}
                          >
                            {post?.userId?.name}
                          </p>

                          <p style={{ color: "grey", fontSize: "0.8rem" }}>
                            @{post?.userId?.username}
                          </p>
                        </div>
                      </div>

                      {post.userId._id === authState.user?.userId?._id ? (
                        <div
                          onClick={() => handleDelete(post._id)}
                          className={styles.delete}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>

                          <p>Delete</p>
                        </div>
                      ) : (
                        <div onClick={handleAlert} className={styles.follow}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>

                          <p>Follow</p>
                        </div>
                      )}
                    </div>

                    <div className={styles.singleCard_postContainer_body}>
                      <p style={{ color: "grey" }}>{post?.body}</p>
                    </div>

                    <div className={styles.post_img}>
                      {post.media && (
                        <img src={`${BASE_URL}/${post.media}` || ""} alt="" />
                      )}
                    </div>

                    <div className={styles.post_footer}>
                      <div
                        onClick={() => handleLikes(post)}
                        className={styles.like}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                          />
                        </svg>

                        <p>{post.likes} Likes</p>
                      </div>

                      <div
                        onClick={() => handleComments(post)}
                        className={styles.comment}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                          />
                        </svg>
                        <p>Comment</p>
                      </div>

                      <div
                        onClick={() => handleShare(post._id)}
                        className={styles.share}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                          />
                        </svg>

                        <p>Share</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {PostState.postId && (
          <div
            onClick={() => dispatch(resetPostId())}
            className={styles.comments_Container}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={styles.all_Comments_Container}
            >
              {/* COMMENTS */}
              <div className={styles.commentsList}>
                <p style={{ fontWeight: "bold", marginBottom: "1rem" }}>
                  Total comments - {PostState.comments.length}
                </p>
                {PostState.comments.map((comment) => (
                  <div key={comment._id} className={styles.commentCard}>
                    <img
                      onClick={() =>
                        router.push(`/view_profile/${comment.userId.username}`)
                      }
                      src={`${BASE_URL}/${comment.userId.profilePicture}`}
                      className={styles.avatar}
                    />
                    <div className={styles.content}>
                      <p className={styles.username}>
                        {comment.userId.name}
                        <span>@{comment.userId.username}</span>
                      </p>
                      <p className={styles.text}>{comment.body}</p>
                    </div>
                    {comment.userId._id === authState.user?.userId?._id && (
                      <div
                        onClick={() => handleDeleteComment(comment._id)}
                        className={styles.deleteComment}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* INPUT BAR */}
              <div className={styles.Post_Comment_Container}>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add your comment..."
                />

                <div
                  onClick={async (e) => {
                    if (!commentText.trim()) return;
                    await dispatch(
                      postComment({
                        post_id: PostState.postId,
                        body: commentText,
                      })
                    );
                    await dispatch(
                      getAllComments({ post_id: PostState.postId })
                    );
                    setCommentText("");
                  }}
                  className={styles.comment_button}
                >
                  <p>Comment</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}

export default DashboardComponent;
