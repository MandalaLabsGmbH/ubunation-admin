'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useAuthModal } from '@/app/contexts/AuthModalContext'
import { Button } from '@/components/ui/button' // Assuming you use a UI library like shadcn/ui

export default function BuyNowButton() {
  const { data: session } = useSession()
  const router = useRouter()
  const { openModal } = useAuthModal()

  const handleClick = () => {
    if (session) {
      // If the user is logged in, redirect them directly to the purchase page.
      router.push('/purchase')
    } else {
      // If the user is not logged in, open the login modal and tell it
      // to redirect to '/purchase' on successful login.
      openModal('/purchase')
    }
  }

  return (
    <Button onClick={handleClick} className="w-full">
      Buy Now
    </Button>
  )
}
