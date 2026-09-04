import Layout from './Layout.jsx'
import Home from './pages/Home.jsx'
import FlagFootball from './pages/FlagFootball.jsx'
import Sevens from './pages/Sevens.jsx'
import Camps from './pages/Camps.jsx'
import Divisions from './pages/Divisions.jsx'
import Schedule from './pages/Schedule.jsx'
import Standings from './pages/Standings.jsx'
import Locations from './pages/Locations.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Account from './pages/Account.jsx'
import NotFound from './pages/NotFound.jsx'
import RequireAuth from './auth/RequireAuth.jsx'

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'flag-football', element: <FlagFootball /> },
      { path: '7v7', element: <Sevens /> },
      { path: 'camps', element: <Camps /> },
      { path: 'divisions', element: <Divisions /> },
      { path: 'schedule', element: <Schedule /> },
      { path: 'standings', element: <Standings /> },
      { path: 'locations', element: <Locations /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        path: 'account',
        element: (
          <RequireAuth>
            <Account />
          </RequireAuth>
        ),
      },
      // Explicit /404 so the static build emits dist/404.html, which hosts serve
      // for unknown paths. The wildcard covers client-side navigation.
      { path: '404', element: <NotFound /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]

export default routes
