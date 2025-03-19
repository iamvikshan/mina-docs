// An array of links for navigation bar
const navBarLinks = [
  { name: 'Home', url: 'https://mina.vikshan.me' },
   { name: 'Blog', url: '/blog' },
  { name: 'Docs', url: '/' },
  /* { name: 'Products', url: '/products' },
  { name: 'Services', url: '/services' },
  { name: 'Contact', url: '/contact' }, */
];
// An array of links for footer
const footerLinks = [
  {
    section: 'Resources',
    links: [
      { name: 'Documentation', url: '/' },
      // { name: 'Blog', url: '/blog' },
      {
        name: 'Invite Amina',
        url: 'https://discord.com/oauth2/authorize?client_id=1035629678632915055',
      },
      { name: 'Dashboard', url: '/dash'}
    ],
  },
  {
    section: 'Community',
    links: [
      { name: 'GitHub', url: 'https:github.com/iamvikshan/amina' },
      { name: 'Support', url: `${process.env.SUPPORT_SERVER}` },
    ],
  },
];
// An object of links for social icons
const socialLinks = {
  discord: 'https://discord.com/oauth2/authorize?client_id=1035629678632915055',
  x: 'https://twitter.com/iamvikshan',
  github: 'https://github.com/iamvikshan/amina',
  youtube: 'https://youtube.com/@vikshan',
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
};
