/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import {CNavItem } from '@coreui/react'
import {
  AppstoreOutlined,
  PictureOutlined,
  CameraOutlined,
  ReadOutlined,
  StarOutlined,
  ContactsOutlined,
  CommentOutlined,
} from '@ant-design/icons'

const useNav = () => {
  const navItems = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <AppstoreOutlined className="me-3" />,
    },
    {
      component: CNavItem,
      name: 'Banner',
      to: '/banner',
      icon: <PictureOutlined className="me-3" />,
    },
    {
      component: CNavItem,
      name: 'Gallery',
      to: '/gallery',
      icon: <CameraOutlined className="me-3" />,
    },
    {
      component: CNavItem,
      name: 'Blog',
      to: '/blogs',
      icon: <ReadOutlined className="me-3" />,
    },
    {
      component: CNavItem,
      name: 'Testimonials',
      to: '/testimonials',
      icon: <StarOutlined className="me-3" />,
    },
    {
      component: CNavItem,
      name: 'Contacts',
      to: '/contacts',
      icon: <ContactsOutlined className="me-3" />,
    },
    // {
    //   component: CNavItem,
    //   name: 'Comments',
    //   to: '/comments',
    //   icon: <CommentOutlined className="me-3" />,
    // },
  ]

  return navItems
}

export default useNav
