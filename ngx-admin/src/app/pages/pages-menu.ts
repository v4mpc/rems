import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Advance Request',
    icon: 'file-text-outline',
    link: '/pages/arf',
  },
  {
    title: 'Profile',
    icon: 'person-outline',
    link: '/pages/profile',
  }
  ,
  {
    title: 'Logout',
    icon: 'log-out-outline',
    link: '/pages/arf',
  }
  ,
  // {
  //   title: 'FEATURES',
  //   group: true,
  // },
  {
    title: 'Auth',
    icon: 'lock-outline',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
];
