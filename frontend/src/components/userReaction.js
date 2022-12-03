import { Box, Typography, Link } from '@mui/material';
import './reactionBar.css';

export const UserReaction = (props) => {
    const { src, num, index, callback, post } = props;

    return (
        <Box
            backgroundColor={post.reactions[index] ? '#373737' : '#242424'}
            border={
                post.reactions[index]
                    ? '1px solid #D17A22'
                    : '1px solid #242424'
            }
            borderRadius={2}
            sx={{
                p: 1,
                marginRight: 1,
                my: 1,
                height: 30,
                justifyContent: 'flex-start',
                alignItems: 'center',
                display: 'inline-flex',
                cursor: 'pointer',
            }}
            onClick={() => callback(post, index, !post.reactions[index])}
        >
            <img
                style={{
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'center',
                }}
                src={src}
            />
            <Typography color={'#FFFFFF'} fontSize={12} paddingLeft={0.8}>
                {num}
            </Typography>
        </Box>
    );
};
