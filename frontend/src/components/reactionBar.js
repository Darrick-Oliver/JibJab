import { useState, useContext } from 'react';
import { Box } from '@mui/material';
import './reactionBar.css';
import { AuthContext } from '../App';
import { UserReaction } from './userReaction.js';

import AddReactionIcon from '../assets/add_reaction.svg';
import ExclamationMarkIcon from '../assets/exclamation_mark.svg';
import FireIcon from '../assets/fire.svg';
import HappyFaceIcon from '../assets/happy_face.svg';
import HeartIcon from '../assets/heart.svg';
import LightBulbIcon from '../assets/light_bulb.svg';
import SkullIcon from '../assets/skull.svg';
import ThumbsDownIcon from '../assets/thumbs_down.svg';
import ThumbsUpIcon from '../assets/thumbs_up.svg';
import TrashIcon from '../assets/trash.svg';

const usingMobile = () => window.screen.width < 480;

const reactionsEnum = {
    FIRE: 0,
    SKULL: 1,
    HEART: 2,
    EXCLAMATION_MARK: 3,
    THUMBS_UP: 4,
    THUMBS_DOWN: 5,
    HAPPY_FACE: 6,
    LIGHT_BULB: 7,
};

const reactionIcons = [
    FireIcon,
    SkullIcon,
    HeartIcon,
    ExclamationMarkIcon,
    ThumbsUpIcon,
    ThumbsDownIcon,
    HappyFaceIcon,
    LightBulbIcon,
];

export const ReactionBar = (props) => {
    const [hoverAddReaction, setHoverAddReaction] = useState(false);
    const { callback, post, deleteCallback } = props;
    const { user } = useContext(AuthContext);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    display: !usingMobile() && 'flex',
                    flexDirection: usingMobile() && 'row',
                }}
            >
                {post.numReactions.map((value, index) => {
                    return (
                        value != 0 && (
                            <UserReaction
                                key={`user-reaction-${index}`}
                                src={reactionIcons[index]}
                                num={value}
                                index={index}
                                post={post}
                                callback={callback}
                            />
                        )
                    );
                })}
                {hoverAddReaction ? (
                    <Box
                        backgroundColor={'#242424'}
                        borderRadius={3}
                        sx={{
                            my: 1,
                            height: 30,
                            width: 240,
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'row',
                        }}
                        className='loadup'
                        onMouseOver={() => setHoverAddReaction(true)}
                        onMouseLeave={() => setHoverAddReaction(false)}
                    >
                        <img
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 8,
                                cursor: 'pointer',
                            }}
                            src={FireIcon}
                            alt='Fire'
                            className='iconLoad'
                            onClick={() =>
                                callback(post, reactionsEnum.FIRE, true)
                            }
                        />
                        <img
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 8,
                                cursor: 'pointer',
                            }}
                            src={SkullIcon}
                            alt='Skull'
                            className='iconLoad'
                            onClick={() =>
                                callback(post, reactionsEnum.SKULL, true)
                            }
                        />
                        <img
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 8,
                                cursor: 'pointer',
                            }}
                            src={HeartIcon}
                            alt='Heart'
                            className='iconLoad'
                            onClick={() =>
                                callback(post, reactionsEnum.HEART, true)
                            }
                        />
                        <img
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 8,
                                cursor: 'pointer',
                            }}
                            src={ExclamationMarkIcon}
                            alt='ExclamationMark'
                            className='iconLoad'
                            onClick={() =>
                                callback(
                                    post,
                                    reactionsEnum.EXCLAMATION_MARK,
                                    true
                                )
                            }
                        />
                        <img
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 8,
                                cursor: 'pointer',
                            }}
                            src={ThumbsUpIcon}
                            alt='ThumbsUp'
                            className='iconLoad'
                            onClick={() =>
                                callback(post, reactionsEnum.THUMBS_UP, true)
                            }
                        />
                        <img
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 8,
                                cursor: 'pointer',
                            }}
                            src={ThumbsDownIcon}
                            alt='ThumbsDown'
                            className='iconLoad'
                            onClick={() =>
                                callback(post, reactionsEnum.THUMBS_DOWN, true)
                            }
                        />
                        <img
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 8,
                                cursor: 'pointer',
                            }}
                            src={HappyFaceIcon}
                            alt='HappyFace'
                            className='iconLoad'
                            onClick={() =>
                                callback(post, reactionsEnum.HAPPY_FACE, true)
                            }
                        />

                        <img
                            style={{
                                width: 20,
                                height: 20,
                                cursor: 'pointer',
                            }}
                            src={LightBulbIcon}
                            alt='LightBulb'
                            className='iconLoad'
                            onClick={() =>
                                callback(post, reactionsEnum.LIGHT_BULB, true)
                            }
                        />
                    </Box>
                ) : (
                    <Box
                        backgroundColor={'#242424'}
                        borderRadius={2}
                        sx={{
                            p: 1,
                            my: 1,
                            height: 30,
                            width: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                        }}
                        onMouseOver={() => setHoverAddReaction(true)}
                        onMouseLeave={() => setHoverAddReaction(false)}
                    >
                        <img
                            style={{
                                width: 20,
                                height: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: 'center',
                            }}
                            src={AddReactionIcon}
                            alt='AddReaction'
                        />
                    </Box>
                )}
            </div>
            {user.username == post.user.username && (
                <div
                    style={{
                        width: 30,
                        height: 30,
                        marginLeft: 'auto',
                        cursor: 'pointer',
                    }}
                    onClick={() => deleteCallback(post)}
                >
                    <img
                        style={{
                            width: 30,
                            height: 30,
                        }}
                        src={TrashIcon}
                        alt='Trash'
                    />
                </div>
            )}
        </div>
    );
};
