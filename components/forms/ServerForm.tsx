'use client';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { serverSchema } from '@/lib/validations';
import FileUpload from '../FileUpload';
import { useModalStore } from '@/hooks/useModalStore';
import { createServer, updateServer } from '@/lib/actions/server.action';
import { usePathname } from 'next/navigation';
import { Server } from '@prisma/client';

interface Props {
  server?: Server;
}

const ServerForm = ({ server }: Props) => {
  const pathName = usePathname();
  const { onClose } = useModalStore();

  const form = useForm<z.infer<typeof serverSchema>>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: server?.name || '',
      imageUrl: server?.imageUrl || '',
    },
  });

  const isSubmiting = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof serverSchema>) => {
    try {
      await (server
        ? updateServer({ ...values, id: server.id })
        : createServer({ ...values, route: pathName! }));
      form.reset();
      onClose();
    } catch (error) {}
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='imageUrl'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <FileUpload
                  endpoint='serverImage'
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                Server name
              </FormLabel>
              <FormControl>
                <Input
                  className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                  placeholder='Enter server name'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isSubmiting}
          className='w-full'
          variant='primary'
          type='submit'
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ServerForm;
