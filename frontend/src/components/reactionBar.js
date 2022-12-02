import { useState, useContext } from 'react';
import { Box, Typography, Link } from '@mui/material';
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

export const ReactionBar = (props) => {
    const [hoverAddReaction, setHoverAddReaction] = useState(false);
    const [clickReaction, setClickReaction] = useState(false);
    const [auth, setAuth] = useContext(AuthContext);

    const callback = props.callback;

    // const handleReaction = () => {
    //     setClickReaction((current) => !current);
    // };

    // callback in portal.js, number of the reaction selected
    // const handleReaction = async (message, reaction) => {
    //     const res = await makePostRequest(
    //         '/api/message/react',
    //         {
    //             reaction: reaction,
    //             messageid: message._id,
    //         },
    //         {
    //             accesstoken: auth,
    //         }
    //     );
    // };

    return (
        // make outside the mui div, put box with the addreactionicon in the conditional w the icon part
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            {/* map w/ get req */}
            <UserReaction src={FireIcon} name={'Fire'} num={2134} />

            {hoverAddReaction ? (
                <Box
                    backgroundColor={'#242424'}
                    borderRadius={3}
                    sx={{
                        //p: 1,
                        //px: 1,
                        my: 1,
                        height: 30,
                        width: 240,
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'row',
                        position: 'relative',
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
                            //backgroundColor: clickReaction ? '#b3cde0' : '',
                        }}
                        src={FireIcon}
                        alt='Fire'
                        className='iconLoad'
                        //className={clickReaction ? 'loadup' : 'icon'}
                        onClick={() => callback(reactionsEnum.FIRE)}
                    />
                    <img
                        style={{
                            width: 20,
                            height: 20,
                            marginRight: 8,
                            //backgroundColor: clickReaction ? '#b3cde0' : '',
                        }}
                        src={SkullIcon}
                        alt='Skull'
                        className='iconLoad'
                        //className={clickReaction ? 'loadup' : 'icon'}
                        onClick={() => callback(reactionsEnum.SKULL)}
                    />
                    <img
                        style={{
                            width: 20,
                            height: 20,
                            marginRight: 8,
                            //backgroundColor: clickReaction ? '#b3cde0' : '',
                        }}
                        src={HeartIcon}
                        alt='Heart'
                        className='iconLoad'
                        //className={clickReaction ? 'loadup' : 'icon'}
                        onClick={() => callback(reactionsEnum.HEART)}
                    />
                    <img
                        style={{
                            width: 20,
                            height: 20,
                            marginRight: 8,
                            // animationName: expand,
                            // highlighted,
                            //backgroundColor: clickReaction ? '#b3cde0' : '',
                        }}
                        src={ExclamationMarkIcon}
                        alt='ExclamationMark'
                        className='iconLoad'
                        //className={clickReaction ? 'loadup' : 'icon'}
                        onClick={() => callback(reactionsEnum.EXCLAMATION_MARK)}
                    />
                    <img
                        style={{
                            width: 20,
                            height: 20,
                            marginRight: 8,
                            //backgroundColor: clickReaction ? '#b3cde0' : '',
                        }}
                        src={ThumbsUpIcon}
                        alt='ThumbsUp'
                        className='iconLoad'
                        //className={clickReaction ? 'loadup' : 'icon'}
                        onClick={() => callback(reactionsEnum.THUMBS_UP)}
                    />
                    <img
                        style={{
                            width: 20,
                            height: 20,
                            marginRight: 8,
                            //backgroundColor: clickReaction ? '#b3cde0' : '',
                        }}
                        src={ThumbsDownIcon}
                        alt='ThumbsDown'
                        className='iconLoad'
                        //className={clickReaction ? 'loadup' : 'icon'}
                        onClick={() => callback(reactionsEnum.THUMBS_DOWN)}
                    />
                    <img
                        style={{
                            width: 20,
                            height: 20,
                            marginRight: 8,
                            //backgroundColor: clickReaction ? '#b3cde0' : '',
                        }}
                        src={HappyFaceIcon}
                        alt='HappyFace'
                        className='iconLoad'
                        //className={clickReaction ? 'loadup' : 'icon'}
                        onClick={() => callback(reactionsEnum.HAPPY_FACE)}
                    />

                    <img
                        style={{
                            width: 20,
                            height: 20,
                            //margin: '0px 4px',
                            //backgroundColor: clickReaction ? '#b3cde0' : '',
                            //animation
                        }}
                        src={LightBulbIcon}
                        alt='LightBulb'
                        className='iconLoad'
                        //className={clickReaction ? 'loadup' : 'icon'}
                        onClick={() => callback(reactionsEnum.LIGHT_BULB)}
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
                    <img // addReactionImage
                        style={{
                            width: 20,
                            height: 20,
                            //margin: '1px 1px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'center',
                            //paddingRight: 4,
                        }}
                        src={AddReactionIcon}
                        alt='AddReaction'
                    />
                </Box>
            )}
        </div>
    );
};
