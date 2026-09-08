'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                'flex gap-4 items-center p-4 rounded-lg justify-start',
                {
                  'bg-blue-1': isActive,
                }
              )}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={24}
                height={24}
              />
              <p className="text-lg font-semibold max-lg:hidden">
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Profile section */}
      <div className="mt-6 border-t border-dark-3 pt-4">
        {isLoaded && user ? (
          <div className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-dark-3">
            <UserButton
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  userButtonAvatarBox: 'w-10 h-10',
                },
              }}
            />
            <div className="flex flex-col overflow-hidden max-lg:hidden">
              <p className="truncate text-sm font-semibold">
                {user.fullName || user.username || 'YOOM User'}
              </p>
              <p className="truncate text-xs text-sky-1">
                {user.primaryEmailAddress?.emailAddress ||
                  user.emailAddresses?.[0]?.emailAddress ||
                  ''}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-2">
            <div className="size-10 animate-pulse rounded-full bg-dark-3" />
            <div className="flex flex-col gap-1.5 max-lg:hidden">
              <div className="h-3 w-24 animate-pulse rounded bg-dark-3" />
              <div className="h-2.5 w-32 animate-pulse rounded bg-dark-3" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Sidebar;
