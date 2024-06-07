// Create comment object with this component...
import { useState, useEffect } from "react";
import "./Comment.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { likeComment, unlikeComment } from "../../services/commentsServices"

import { faHeart } from '@fortawesome/free-solid-svg-icons';

const Comment = (props) => {
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (props.comment.likedBy && token) {
            console.log('coment.likeBy line 20',props.comment.likedBy);
            const userId = JSON.parse(atob(token.split('.')[1])).user_id;
            setHasLiked(props.comment.likedBy.includes(userId));
            console.log(props.comment.likedBy.includes(userId));
        }
    
        // if (comment.userId) {
        //     setUserName(`${props.comment.userId.firstName} ${props.comment.userId.lastName}`);
        //     const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
            // const defaultProfilePicture = `${backendUrl}/uploads/default-profile-photo.jpg`;
            // setProfilePicture(post.user_id.profilePicture ? `${backendUrl}${post.user_id.profilePicture}` : defaultProfilePicture);
        // }
    }, [props.comment.likedBy]);

    console.log('hasLiked line 28', hasLiked);
    
    const handleLikeToggle = async () => {
        const token = localStorage.getItem('token');
        try {
            let updatedComment;
            if (hasLiked) {
                updatedComment = await unlikeComment(token, props.comment._id);
            } else {
                updatedComment = await likeComment(token, props.comment._id);
            }
            setHasLiked(!hasLiked);
            props.updateComment(updatedComment);
        } catch (error) {
            console.error(`Error ${hasLiked ? 'unliking' : 'liking'} comment: `, error);
        }
        };
        
        console.log('hasLiked line 46', hasLiked);
    return (
        <div className="comment-feed">
                <img
                src={props.profilePicture}
                alt="Profile"
                className="comment-profile-picture"
                onError={(e) => { e.target.onerror = null; e.target.src=`${import.meta.env.VITE_BACKEND_URL}/uploads/default-profile-photo.jpg`; }}
                />
                <div className="comment-content">
                    <div className="user-info-commment">
                        <strong>{props.comment.userId.firstName} {props.comment.userId.lastName}</strong>
                        <h3 className="comment-message">{props.comment.commentMessage}</h3>
                    </div>
                    <div className="comment-info-feed">
                            <span className="comment-date">{new Date(props.comment.createdAt).toLocaleString()}</span>
                            <div className="likes-feed">
                                <FontAwesomeIcon 
                                    icon={faHeart} 
                                    className={`heart-feed ${hasLiked ? 'liked' : ''}`} 
                                    onClick={handleLikeToggle}
                                />
                                <span>{props.comment.numOfLikes}</span>
                            </div>
                    </div>
            </div>
        </div>
    )
    }

    export default Comment;
