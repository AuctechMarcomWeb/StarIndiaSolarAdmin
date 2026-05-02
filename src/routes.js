import React from 'react'
import Banners from './views/Banners/Banners'
import Gallery from './views/Gallery/Gallery'
import Blog from './views/Blog/Blog'
import Testimonials from './views/Testinominals/Testimonials'
import Contacts from './views/Contacts/Contacts'
import Auth from './views/Users/Auth'
import Comments from './views/Comments/Comments'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/dashboard', exact: true, name: 'Dashboard', element: Dashboard },
  { path: '/banner', name: 'Banners ', element: Banners },
  { path: '/gallery', name: 'Gallery', element: Gallery },
  { path: '/blogs', name: 'Blog', element: Blog },
  { path: '/testimonials', name: 'Testimonials', element: Testimonials },
  { path: '/contacts', name: 'Contacts', element: Contacts },
  { path: '/comments', name: 'Comments', element: Comments },

  { path: '/users', name: 'Users', element: Auth },
]

export default routes
