import { useParams } from 'react-router-dom';
import { Container, ThemeProvider, Typography } from '@mui/material';
import theme from './theme';
import { Header } from '../components/header';

export const Profile = () => {
    const { id } = useParams();
    return (
        <ThemeProvider theme={theme}>
            <Header />
            <Container component='main' maxWidth='md'>
                <Typography color={'#D17A22'} fontSize={48} fontWeight={'bold'}>
                    {id}
                </Typography>
                <Typography color={'#fff'} fontSize={20}>
                    Biography here
                </Typography>
            </Container>
        </ThemeProvider>
    );
};
