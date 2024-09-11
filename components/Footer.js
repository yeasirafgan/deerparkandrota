// // mainfolder/components/Footer.js

'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

const Footer = () => {
  const { user, isAuthenticated } = useKindeBrowserClient();

  return (
    <footer className='mt-auto text-zinc-400 py-5 px-7 border-t flex flex-col md:flex-row md:justify-between items-center'>
      {isAuthenticated && (
        <p className='text-xs md:text-sm mb-2 md:mb-0 text-center md:text-left'>
          Logged in as {user?.email}
        </p>
      )}
      <small className='text-center md:text-right text-xs md:text-sm'>
        All Rights Reserved &copy; Deerpark | 2024
      </small>
    </footer>
  );
};

export default Footer;
