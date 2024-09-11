// // mainfolder/components/Header.js

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  LoginLink,
  LogoutLink,
  useKindeBrowserClient,
} from '@kinde-oss/kinde-auth-nextjs';
import Image from 'next/image';

const navLinks = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/timesheet',
    label: 'Timesheet',
    requiredPermissions: ['submit:timesheet'],
  },
  {
    href: '/admin',
    label: 'Admin',
    requiredPermissions: ['delete:timesheet'],
  },
  {
    href: '/rota',
    label: 'Rota',
    requiredPermissions: ['create:rota'],
  },
];

const Header = () => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfilePicClicked, setIsProfilePicClicked] = useState(false); // New state variable
  const { user, isAuthenticated, signOut } = useKindeBrowserClient();
  const dropdownRef = useRef(null);
  const profilePicRef = useRef(null);

  // Toggle dropdown menu for desktop
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    setIsProfilePicClicked(true); // Set to true when profile picture is clicked
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !profilePicRef.current.contains(event.target) &&
        !isProfilePicClicked
      ) {
        setIsDropdownOpen(false);
      }
      setIsProfilePicClicked(false); // Reset the state after handling
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfilePicClicked]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className='relative flex flex-col md:flex-row justify-between items-center py-4 px-7 border-b'>
      <div className='flex justify-between items-center w-full md:w-auto'>
        <Link href={'/'}>
          <h1 className='text-xl font-semibold text-slate-700'>
            Deer Park Timesheet
          </h1>
        </Link>
        {/* Mobile menu button */}
        <button
          className='md:hidden text-2xl text-slate-700'
          onClick={toggleMobileMenu}
        >
          &#9776;
        </button>
      </div>

      {/* Desktop Menu */}
      <nav className='hidden md:flex md:items-center'>
        <ul className='flex gap-x-5 items-center text-[14px]'>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                className={`text-zinc-500 ${
                  pathname === link.href ? 'font-bold' : ''
                }`}
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Login/Logout and Profile Picture */}
          <li className='ml-4 relative'>
            {isAuthenticated ? (
              <div className='flex items-center'>
                <div
                  className='cursor-pointer'
                  onClick={toggleDropdown}
                  ref={profilePicRef}
                >
                  {user?.picture ? (
                    <Image
                      src={user.picture}
                      alt='Profile picture'
                      width={30}
                      height={30}
                      className='rounded-full'
                    />
                  ) : (
                    <div className='h-10 w-10 rounded-full bg-zinc-800 text-white text-center flex justify-center items-center'>
                      {user?.given_name?.[0] || 'U'}
                    </div>
                  )}
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className='absolute right-0 mt-2 w-96  px -4 bg-white rounded-lg shadow-lg py-2 z-20'
                    style={{ top: '50px' }}
                  >
                    <div className='flex items-center px-4  py-2'>
                      {user?.picture ? (
                        <Image
                          src={user.picture}
                          alt='Profile picture'
                          width={40}
                          height={40}
                          className='rounded-full'
                        />
                      ) : (
                        <div className='h-10 w-10 rounded-full bg-zinc-800 text-white text-center flex justify-center items-center'>
                          {user?.given_name?.[0] || 'U'}
                        </div>
                      )}
                      <div className='ml-3'>
                        <p className='text-sm font-semibold'>
                          Hi, {user?.given_name || 'User'}
                        </p>
                        <p className='text-xs text-gray-500'>{user?.email}</p>
                      </div>
                    </div>
                    <LogoutLink className='block text-center text-white px-4 py-2 bg-slate-700 hover:bg-slate-900 hover:text-white transition duration-300 rounded-lg mx-4'>
                      Logout
                    </LogoutLink>
                  </div>
                )}
              </div>
            ) : (
              <LoginLink className='text-white px-4 py-2 bg-teal-900 hover:bg-teal-800 transition duration-300 rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-opacity-50'>
                Log in
              </LoginLink>
            )}
          </li>
        </ul>
      </nav>

      {/* Mobile Menu */}

      <div
        className={`fixed inset-y-0 right-0 bg-slate-700 shadow-lg md:hidden transform transition-transform duration-300 mt-20 rounded-s-3xl h-full ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 999 }}
      >
        <nav className='w-60 h-full flex flex-col '>
          <div className='flex items-center justify-center px-4 py-3 border-b'>
            <h2 className='text-xl p-1 font-semibold text-white'>
              Deerpark timesheet
            </h2>
            <button
              className='text-slate-700 text-2xl pt-2'
              onClick={closeMobileMenu} // Close mobile menu on click
            >
              &times;
            </button>
          </div>

          {/* Profile Section */}
          {isAuthenticated ? (
            <div className='w-full p-4 bg-slate-700'>
              <div
                className='cursor-pointer flex items-center justify-center'
                onClick={toggleDropdown}
                ref={profilePicRef}
              >
                {user?.picture ? (
                  <Image
                    src={user.picture}
                    alt='Profile picture'
                    width={60}
                    height={60}
                    className='rounded-full'
                  />
                ) : (
                  <div className='h-12 w-12 rounded-full bg-zinc-800 text-white text-center flex justify-center items-center'>
                    {user?.given_name?.[0] || 'U'}
                  </div>
                )}
              </div>

              {/* User Details */}
              <div className='flex flex-col items-center mt-2'>
                <p className='text-sm font-semibold text-green-50'>
                  Hi, {user?.given_name || 'User'}
                </p>
                <p className='text-xs text-green-50'>{user?.email}</p>
              </div>

              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className='w-full mt-3 bg-slate-800 rounded-lg shadow-lg py-2 '
                >
                  <div className='flex flex-col items-center px-4'>
                    <LogoutLink className='text-white px-12 py-2 bg-teal-800 hover:bg-teal-700 transition duration-300 rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-opacity-50'>
                      Logout
                    </LogoutLink>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='w-full px-4 flex flex-col items-center mt-4'>
              <LoginLink className='text-white px-12 py-2 bg-teal-900 hover:bg-teal-800 transition duration-300 rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-opacity-50'>
                Login
              </LoginLink>
            </div>
          )}

          {/* Navigation Links */}
          <ul className='flex-1 flex flex-col border-t border-gray-300 mt-4 bg-slate-700 '>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className={`block text-white px-4 py-2 ${
                    pathname === link.href
                      ? 'font-semibold bg-teal-900 text-white' // Active link with dark teal background
                      : 'hover:bg-teal-800 hover:text-white' // Hover state with a darker slate background
                  }`}
                  href={link.href}
                  onClick={closeMobileMenu} // Close mobile menu on link click
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
