import { Container, Text } from '@mantine/core';
import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <Container id="notFoundPage" ta={'center'}>
      <h1 className="title">404!</h1>
      <p className="subtitle">Uh oh, looks like I lost you.</p>
      <Text>
        If there should be a valid page here, please{' '}
        <Link to="/contact">let me know</Link>.
        <br />
        <br />
        Country roads... <Link to="/">take me home</Link>.
      </Text>
    </Container>
  );
}
