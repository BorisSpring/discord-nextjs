'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useModalStore } from '@/hooks/useModalStore';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { fileSchema } from '@/lib/validations';
import FileUpload from '../FileUpload';
import axios from 'axios';
import qs from 'query-string';
import { Loader2 } from 'lucide-react';

const SendFileModal = () => {
  const { data, type, onClose, isOpen } = useModalStore();

  const form = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      fileUrl: '',
    },
  });

  async function onSubmit(values: z.infer<typeof fileSchema>) {
    try {
      const url = qs.stringifyUrl({
        url: data.apiUrl!,
        query: data.query,
      });
      await axios.post(url, { ...values, content: values.fileUrl });
      handleClose();
    } catch (error: any) {
      console.error(error?.response?.data.message);
    }
  }

  const isModalOpen = isOpen && type === 'sendFile';

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black  overflow-hidden'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl font-bold'>
            Upload File
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Send File as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='fileUrl'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      endpoint='messageFile'
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='w-full flex items-end'>
              <Button
                disabled={form.formState.isSubmitting}
                type='submit'
                className='w-fit ml-auto bg-indigo-500 text-white disabled:bg-indigo-500/50 hover:bg-indigo-500/90 transition'
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className='animate-spin' />
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SendFileModal;
