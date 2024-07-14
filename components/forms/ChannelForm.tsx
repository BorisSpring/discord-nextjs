import { ServerWithMembersAndProfiles } from '@/lib/types';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { channelSchema } from '@/lib/validations';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Channel, ChannelType } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { createChannel, updateChannel } from '@/lib/actions/channel.action';
import { useModalStore } from '@/hooks/useModalStore';

interface Props {
  server?: ServerWithMembersAndProfiles;
  channelType?: ChannelType;
  channel?: Channel;
}

const ChannelForm = ({ server, channelType, channel }: Props) => {
  const pathName = usePathname();
  const { onClose } = useModalStore();
  const form = useForm<z.infer<typeof channelSchema>>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: channel?.name || '',
      type: channel?.type || channelType || ChannelType.TEXT,
    },
  });

  const onSubmit = async (values: z.infer<typeof channelSchema>) => {
    try {
      const methodObject = { ...values, serverId: server?.id, route: pathName };
      await (channel?.id
        ? updateChannel({ ...methodObject, channelId: channel.id })
        : createChannel(methodObject));
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const isSubmiting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                Channel name
              </FormLabel>
              <FormControl>
                <Input
                  className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                  placeholder='Enter channel name'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                Channel Type
              </FormLabel>
              <FormControl>
                <Select
                  defaultValue={channel?.type || channelType}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className='w-full bg-zinc-300/50 outline-none border-0 text-black  no-focus'>
                    <SelectValue placeholder='Select Channel Type' />
                  </SelectTrigger>
                  <SelectContent className='no-focus '>
                    <SelectItem value='TEXT'>Text</SelectItem>
                    <SelectItem value='AUDIO'>Audio</SelectItem>
                    <SelectItem value='VIDEO'>Video</SelectItem>
                  </SelectContent>
                </Select>
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
          {isSubmiting ? (
            <Loader2 className='size-4 animate-spin' />
          ) : channel?.id ? (
            'Edit'
          ) : (
            'Create'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ChannelForm;
