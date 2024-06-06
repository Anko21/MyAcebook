import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { likePost, unlikePost } from "../../services/posts";
import './Post.css';
import Comment from "../Comment/Comment";
import { createComment, getPostComments } from "../../services/commentsServices";
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Post = ({ post, updatePost }) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [comments, setComments] = useState([]);
  const [commentMessage, setCommentMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (post.likedBy && token) {
      const userId = JSON.parse(atob(token.split('.')[1])).user_id;
      setHasLiked(post.likedBy.includes(userId));
    }

    if (post.user_id) {
      setUserName(`${post.user_id.firstName} ${post.user_id.lastName}`);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const defaultProfilePicture = `${backendUrl}/uploads/default-profile-photo.jpg`;
      setProfilePicture(post.user_id.profilePicture ? `${backendUrl}${post.user_id.profilePicture}` : defaultProfilePicture);
    }
  }, [post.likedBy, post.user_id]);

  const handleLikeToggle = async () => {
    const token = localStorage.getItem('token');
    try {
      let updatedPost;
      if (hasLiked) {
        updatedPost = await unlikePost(token, post._id);
      } else {
        updatedPost = await likePost(token, post._id);
      }
      setHasLiked(!hasLiked);
      updatePost(updatedPost);
    } catch (error) {
      console.error(`Error ${hasLiked ? 'unliking' : 'liking'} post: `, error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getPostComments(token, post._id)
        .then((data) => {
          setComments(data.comments);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [post._id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    
    const newComment = {
      commentMessage: commentMessage,
      createdAt: new Date(), 
      postId: post._id,
      userId: user_id,
      numOfLikes: 0, 
    };

    const commentCreated = await createComment(token, newComment);

    setComments((currComments) => [commentCreated, ...currComments]);
    setCommentMessage('');
  };


  const updateComment = (updatedComment) => {
    setComments(comments.map(comment => comment._id === updatedComment._id ? updatedComment : comment));
  };




  return (
    <div className="container">
      <div className="post">
        <div className="user-info">
          <img
            src={profilePicture}
            alt="Profile"
            className="profile-picture"
            onError={(e) => { e.target.onerror = null; e.target.src=`${import.meta.env.VITE_BACKEND_URL}/uploads/default-profile-photo.jpg`; }}
          />
          <p><strong>{userName}</strong></p>
        </div>
        <h3>{post.message}</h3>
        {post.image && <img src={`${import.meta.env.VITE_BACKEND_URL}${post.image}`} alt="Post" className="post-image" />}
        <div className="post-info">
          <span>{new Date(post.date).toLocaleString()}</span>
          <div className="likes">
            <FontAwesomeIcon 
              icon={faHeart} 
              className={`heart ${hasLiked ? 'liked' : ''}`} 
              onClick={handleLikeToggle} 
            />
            <span>{post.numOfLikes}</span>
          </div>
        </div>
      </div>

      <div className="comment">
          {comments.map((comment) => (
            <Comment 
            key={comment._id} 
            updateComment={ updateComment }
            comment={comment} 
            profilePicture = {profilePicture}
            />
          ))}
        <form onSubmit={handleCommentSubmit}>
          <div className="user-info-commments">
            <img
              src={profilePicture}
              alt="Profile"
              className="profile-picture-comments"
              onError={(e) => { e.target.onerror = null; e.target.src=`${import.meta.env.VITE_BACKEND_URL}/uploads/default-profile-photo.jpg`; }}
            />
            <textarea
              type="text"
              placeholder = {`Hey ${post.user_id.firstName}, add a comment...`}
              value={commentMessage}
              onChange={(e) => setCommentMessage(e.target.value)}
              rows="2" 
              required
            />  
            <button type="submit" className="comment-add-btn">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
