import { Container } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { Route, Routes } from 'react-router';

import Nav from './components/Nav';
import './main.css';
import { paths } from './Paths';

export default function App() {
  const { width } = useViewportSize();

  return (
    <>
      <Nav />
      <Container
        maw={width < 700 ? '100vw' : 'calc(100vw - 120px)'}
        m="auto"
        pb={50}
        pt={40}
      >
        <Routes>
          {paths.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children?.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ))}
        </Routes>
      </Container>
    </>
  );
}
