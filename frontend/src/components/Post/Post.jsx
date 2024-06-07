import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { likePost, unlikePost } from "../../services/posts";
import './Post.css';
import Comment from "../Comment/Comment";
import { createComment, getPostComments } from "../../services/commentsServices";
import { getUserById } from "../../services/user.js";


const Post = ({ post, updatePost }) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [comments, setComments] = useState([]);
  const [commentMessage, setCommentMessage] = useState('');
  const [currUser, setCurrUser] = useState('');

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

    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.user_id;
      getUserById(userId).then(user => {
        setCurrUser(user);
      }).catch(err => {
        console.error("Failed to fetch user details:", err);
      });
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

  const sortedComments = comments.sort((a, b) => new Date(a.date) - new Date(b.date));

  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
  const defaultProfilePicture = `${backendUrl}/uploads/default-profile-photo.jpg`;

  return (
    <div className="card my-3">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <img
            src={profilePicture}
            alt="Profile"
            className="rounded-circle me-3"
            width="50"
            height="50"
            onError={(e) => { e.target.onerror = null; e.target.src=`${import.meta.env.VITE_BACKEND_URL}/uploads/default-profile-photo.jpg`; }}
          />
          <div>
            <h5 className="mb-0">{userName}</h5>
            <small className="text-muted">{new Date(post.date).toLocaleString()}</small>
          </div>
        </div>
        <p className="card-text text-left">{post.message}</p> {/* Ensure text is left aligned */}
        {post.image && <img src={`${import.meta.env.VITE_BACKEND_URL}${post.image}`} alt="Post" className="img-fluid rounded mb-3" />}
        <div className="d-flex justify-content-between">
          <button className="btn btn-outline-danger" onClick={handleLikeToggle}>
            <FontAwesomeIcon icon={faHeart} className={hasLiked ? 'text-danger' : ''} /> {post.numOfLikes}
          </button>
        </div>
      </div>

      <div className="mt-4">
        {sortedComments.map((comment) => (
          <Comment 
            key={comment._id} 
            updateComment={ updateComment }
            comment={comment} 
            profilePicture = {profilePicture}
            setProfilePicture = {setProfilePicture}
            />
          ))}
        <form onSubmit={handleCommentSubmit} className="d-flex align-items-center mt-3">
          <img
            src={currUser.profilePicture ? `${backendUrl}${currUser.profilePicture}` : defaultProfilePicture}
            alt="Profile"
            className="rounded-circle me-3"
            width="30"
            height="30"
            onError={(e) => { e.target.onerror = null; e.target.src=`${import.meta.env.VITE_BACKEND_URL}/uploads/default-profile-photo.jpg`; }}
          />
          <textarea
            className="form-control me-2"
            type="text"
            placeholder={`Hey ${currUser.firstName}, add a comment...`}
            value={commentMessage}
            onChange={(e) => setCommentMessage(e.target.value)}
            rows="2"
            required
          />
          <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
