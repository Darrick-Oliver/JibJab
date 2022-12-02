import { Box, Typography, Link } from '@mui/material';
import './reactionBar.css';

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
