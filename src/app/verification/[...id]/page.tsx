"use client";
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react';

const Page = ({params}: { params: {id: string}}) => {;
  const router = useRouter()
  const userId = params.id[0]
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const verificationEmail = async (id: string) => {
    setLoading(true)
    // Simulate API request to verify email
    try {

      const res = await fetch("/api/auth/verification", {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      const response = await res.json();

      if (!res.ok) {
        const error = await response.message;
        setMessage(error)
        throw new Error(error);
      }

      setMessage('Your verification email has been verified successfully')
    } catch (error) {

      const msg = `Failed to verify email`;
      setMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    verificationEmail(userId)
  }, [userId]);

  const onSubmit = () => {
    router.push('/dashboard')
  }


  return (
    <main className="bg-popover max-w-lg mx-auto my-4 rounded-lg p-10">
      <h1 className="text-2xl font-bold text-center">
        Verification Email
      </h1>

        <p className='text-center text-sm my-6 h-6'>
          {message}
        </p>
        <div className='flex justify-end'>
        <Button
          type="submit"
          className="mr-2"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading? 'Verifying...' : 'Login'}
        </Button>
        </div>
    </main>
  )
};

export default Page;
