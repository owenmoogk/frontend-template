import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { Homepage } from './components/Homepage';
import './main.css';

export type PathList = {
  path: string;
  element: ReactNode;
  children?: PathList[];
};

export const paths: PathList[] = [
  { path: '/', element: <Homepage /> },
  { path: '*', element: <Navigate to="/404" /> },
];

// function HelmetTitle(props: { name: string }) {
//   return (
//     <>
//       <Helmet>
//         <title>{props.name + ' - Owen Moogk'}</title>
//       </Helmet>
//       <Outlet />
//     </>
//   );
// }

// function Redirect({ to }: { to: string }) {
//   window.location.replace(to);
//   return null;
// }
