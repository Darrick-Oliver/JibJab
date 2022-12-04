import { Box, Typography, Link } from '@mui/material';

export const NotFound = () => {
    return (
        <Box
            sx={{
                p: 2,
                backgroundColor: '#465362',
                fontFamily: 'Inter',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex',
            }}
        >
            <Box
                backgroundColor={'#2B333D'}
                borderRadius={5}
                sx={{
                    p: 2,
                    my: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Typography color={'#D17A22'} fontSize={22}>
                    {'Page not found ;('}
                </Typography>
                <Typography color={'#fff'} fontSize={16}>
                    <Link
                        sx={{
                            textDecoration: 'none',
                            color: 'white',
                            fontWeight: 'bold',
                        }}
                    >
                        {
                            'Uh oh, we cannot seem to find the page you are looking for. Try going back a page '
                        }
                    </Link>{' '}
                </Typography>
            </Box>
        </Box>
    );
};
