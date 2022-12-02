import { Box, Typography, Link } from '@mui/material';
import './reactionBar.css';

import AddReactionIcon from '../assets/add_reaction.svg';
import ExclamationMarkIcon from '../assets/exclamation_mark.svg';
import FireIcon from '../assets/fire.svg';
import HappyFaceIcon from '../assets/happy_face.svg';
import HeartIcon from '../assets/heart.svg';
import LightBulbIcon from '../assets/light_bulb.svg';
import SkullIcon from '../assets/skull.svg';
import ThumbsDownIcon from '../assets/thumbs_down.svg';
import ThumbsUpIcon from '../assets/thumbs_up.svg';

export const UserReaction = (props) => {
    const src = props.src;
    const name = props.name;
    const num = props.num;

    return (
        // make outside the mui div, put box with the addreactionicon in the conditional w the icon part
        <Box
            backgroundColor={'#242424'}
            borderRadius={2}
            sx={{
                p: 1,
                marginRight: 1,
                my: 1,
                height: 30,
                justifyContent: 'flex-start',
                alignItems: 'center',
                display: 'inline-flex',
            }}
        >
            <img
                style={{
                    width: 20,
                    height: 20,
                    //margin: '1px 1px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'center',
                }}
                src={props.src}
                alt={props.name}
            />
            <Typography color={'#FFFFFF'} fontSize={12} paddingLeft={0.5}>
                {props.num}
            </Typography>
        </Box>
    );
};
