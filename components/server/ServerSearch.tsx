'use client';
import { Search } from 'lucide-react';
import React, { useState } from 'react';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useParams, useRouter } from 'next/navigation';

interface Props {
  data: {
    label: string;
    type: 'channel' | 'member';
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

const ServerSearch = ({ data }: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const onHandleClick = ({
    id,
    type,
  }: {
    id: string;
    type: 'channel' | 'member';
  }) => {
    if (type === 'member') {
      return router.push(`/servers/${params?.serverId}/conversations/${id}`);
    } else {
      return router.push(`/servers/${params?.serverId}/channels/${id}`);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'
      >
        <Search className='size-4 text-zinc-500 dark:text-zinc-400' />
        <p className='font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'>
          Search
        </p>
        <kbd className='pointer-events-none ml-auto text-[10px] inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono'>
          <span className='text-xs'>CMD</span>K
        </kbd>
      </button>

      <Command>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder='Type a keyword to search' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {data.map(({ label, type, data }) => {
              if (!data?.length) return null;

              return (
                <CommandGroup key={label} heading={label}>
                  {data?.map(({ id, icon, name }) => {
                    return (
                      <CommandItem
                        key={id}
                        onSelect={() => onHandleClick({ id, type })}
                        className='cursor-pointer'
                      >
                        {icon}
                        <span>{name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            })}
          </CommandList>
        </CommandDialog>
      </Command>
    </>
  );
};

export default ServerSearch;
