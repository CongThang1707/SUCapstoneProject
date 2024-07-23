import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));

const Template = Loadable(lazy(() => import('views/utilities/Template')));
const Test = Loadable(lazy(() => import('views/utilities/renderTemplate')));
const Display = Loadable(lazy(() => import('views/utilities/Display')));
const ChooseTemplate = Loadable(lazy(() => import('views/sample-page/ChooseTemplate')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/pages/template',
      element: <Template />
    },
    {
      path: '/pages/display',
      element: <Display />
    },
    {
      path: '/pages/choose-template',
      element: <ChooseTemplate />
    },
    {
      path: '/pages/getTemplate',
      element: <Test />
    },
    {
      path: '/',
      element: <AuthLogin3 />
    }
  ]
};

export default AuthenticationRoutes;
