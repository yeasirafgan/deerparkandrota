// mainfolder/components/Footer.js

'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

const Footer = () => {
  const { user, isAuthenticated } = useKindeBrowserClient();

  return (
    <footer className='mt-auto bg-slate-100 text-zinc-500 px-8 py-6 border-t border-zinc-300 flex flex-col md:flex-row md:justify-between items-center'>
      {isAuthenticated && (
        <p className='text-xs md:text-sm mb-3 md:mb-0 text-center md:text-left'>
          Logged in as <span className='text-slate-700'>{user?.email}</span>
        </p>
      )}
      <small className='text-center md:text-right text-xs md:text-sm'>
      All Rights Reserved &copy; Deerpark | 2024
      </small>
    </footer>
  );
};

export default Footer;
