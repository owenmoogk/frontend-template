import { Route, Routes } from 'react-router';

import './main.css';
import { paths } from './Paths';

export default function App() {
  return (
    <Routes>
      {paths.map((route, index) => (
        <Route key={index} path={route.path} element={route.element}>
          {route.children?.map((child, childIndex) => (
            <Route key={childIndex} path={child.path} element={child.element} />
          ))}
        </Route>
      ))}
    </Routes>
  );
}
