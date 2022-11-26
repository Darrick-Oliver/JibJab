import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { Box, Typography, Link } from '@mui/material';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export const Post = (props) => {
    const post = props.post;

    return (
        <Box
            backgroundColor={'#2B333D'}
            height={120}
            borderRadius={5}
            sx={{
                p: 2,
                my: 2,
            }}
        >
            <Typography color={'#D17A22'} fontSize={22}>
                {post.message}
            </Typography>
            <Typography color={'#fff'} fontSize={16}>
                <Link
                    href={`profile/${post.user.username}`}
                    sx={{
                        textDecoration: 'none',
                        color: 'white',
                        fontWeight: 'bold',
                    }}
                >
                    {post.user.first_name} {post.user.last_name}
                </Link>{' '}
                • {timeAgo.format(new Date(post.time))}
            </Typography>
        </Box>
    );
};
