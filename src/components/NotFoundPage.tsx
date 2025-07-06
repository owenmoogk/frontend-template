import { Container, Text, Title } from '@mantine/core';
import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <Container id="notFoundPage" ta="center">
      <Title>404!</Title>
      <p>Uh oh, looks like I lost you.</p>
      <Text>
        If there should be a valid page here, please{' '}
        <Link to="https://owenmoogk.github.io/contact">let me know</Link>.
        <br />
        <br />
        Country roads... <Link to="/">take me home</Link>.
      </Text>
    </Container>
  );
}
