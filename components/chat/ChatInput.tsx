'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import qs from 'query-string';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { messageSchema } from '@/lib/validations';
import { Plus } from 'lucide-react';
import { useModalStore } from '@/hooks/useModalStore';
import EmojiPicker from '../EmojiPicker';

interface Props {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: 'conversation' | 'channel';
}

const ChatInput = ({ apiUrl, query, name, type }: Props) => {
  const { onOpen } = useModalStore();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  async function onSubmit(values: z.infer<typeof messageSchema>) {
    try {
      const url = qs.stringifyUrl({ url: apiUrl, query });
      form.reset();
      await axios.post(url, values);
    } catch (error: any) {
      console.error(error?.response?.data.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative p-4 pb-6'>
                  <Button
                    type='button'
                    onClick={() => onOpen('sendFile', { apiUrl, query })}
                    className='absolute top-7 left-8 size-6 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 transition dark:hover:bg-zinc-300 rounded-full p-1 flex items-center justify-center'
                  >
                    <Plus className='text-white dark:text-zinc-900' />
                  </Button>
                  <Input
                    {...field}
                    placeholder={`Messages ${
                      type === 'conversation' ? name : '#' + name
                    }`}
                    value={field.value}
                    onChange={field.onChange}
                    className='px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 no-focus'
                  />
                  <div className='absolute top-8 right-8'>
                    <EmojiPicker
                      onChange={(emoji: string) => {
                        field.onChange(`${field.value} ${emoji}`);
                      }}
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
