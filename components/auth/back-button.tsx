'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface BackButtonProps {
  href: string
  label: string
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button
      variant='link'
      className='font-normal w-full bg-transparent  dark:text-white text-blue-900 hover:bg-customGree'
      size='sm'
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  )
}
