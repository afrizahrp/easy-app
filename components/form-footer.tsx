import { Button } from '@/components/ui/button';
import cn from '@/utils/class-names';
import { Loader2 } from 'lucide-react';

interface FormFooterProps {
  className?: string;
  altBtnText?: string;
  submitBtnText?: string;
  isLoading?: boolean;
  handleAltBtn?: (e: any) => void; // Updated type here
}

export const negMargin = '-mx-4 md:-mx-5 lg:-mx-6 3xl:-mx-8 4xl:-mx-10';

export default function FormFooter({
  isLoading,
  altBtnText = 'Back',
  submitBtnText = 'Submit',
  className,
  handleAltBtn,
}: FormFooterProps) {
  return (
    <div
      className={cn(
        'sticky bottom-0 left-0 right-0 z-10 -mb-8 flex items-center justify-end gap-4 border-t rounded-lg bg-white px-4 py-4 dark:bg-inherit md:px-5 lg:px-6 3xl:px-8 4xl:px-10',
        className,
        negMargin
      )}
    >
      <Button variant='outline' className='w-[80px]' onClick={handleAltBtn}>
        {altBtnText}
      </Button>
      <Button type='submit' disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Saving...
          </>
        ) : (
          submitBtnText
        )}
      </Button>
    </div>
  );
}
