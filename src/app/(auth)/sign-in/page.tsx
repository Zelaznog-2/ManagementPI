"use client";
// import { signIn } from "next-auth/react";
import { useForm } from 'react-hook-form'
import { useState } from'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { signIn } from "next-auth/react";
import Link from 'next/link';

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const router = useRouter()
  const [message, setMessage] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setIsSigningIn(true)
    setMessage('')

    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: '/dashboard'
    })

    if (res?.error) {
      setIsSigningIn(false)
      setMessage(res.error)
      return false
    }

    router.push('/dashboard')

  })


  return (
    <main className="bg-popover max-w-lg mx-auto my-4 rounded-lg p-10">
      <h1 className="text-2xl font-bold text-center">Sign in to your account</h1>
      <form
        onSubmit={onSubmit}
        className="mt-4 space-y-4"
      >
        {message && <div className='text-sm bg-red-600 p-2 text-white'>
          {message}
        </div>}
        <div>
          <Label
            htmlFor='email'
            className={cn('mb-2 inline-block', errors?.email ? "text-destructive" : "")}
          >
            Email
          </Label>
          <Input
            type="text"
            {...register('email', {
              required: {
                value: true,
                message: 'Email is required'
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
            placeholder='john.smith@example.com'
            className={cn(errors?.name ? "ring ring-destructive" : "")}
          />
          {errors?.email ? (
          <p className="text-xs text-destructive mt-2">{errors?.email?.message?.toString()}</p>
        ) : (
          <div className="h-6" />
        )}
        </div>
        <div>
          <Label
            htmlFor='password'
            className={cn('mb-2 inline-block', errors?.password ? "text-destructive" : "")}
          >
            Password
          </Label>
          <Input
            type="password"
            {...register('password', {
              required: {
                value: true,
                message: 'Password is required'
              },
              minLength: { value: 8, message: 'Password should be at least 8 characters long' },
            })}
            placeholder='*******'
            className={cn(errors?.password ? "ring ring-destructive" : "")}
          />
          {errors?.password ? (
          <p className="text-xs text-destructive mt-2">{errors.password?.message?.toString()}</p>
        ) : (
          <div className="h-6" />
        )}
        </div>
        <p className='text-center text-sm'>
          Don&apos;t have an account? <Link href='/sign-up' className='text-blue-700'>Sign up</Link> now.
        </p>
        <div className='flex justify-end'>
        <Link
          className="mr-2 mt-"
          href='/'
        >
          <Button
            type="button"
            className="mr-2 bg-gray-600"
          >
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          className="mr-2"
          disabled={isSigningIn}
        >
          {isSigningIn ? 'logging...' : 'Login'}
        </Button>
        </div>
      </form>
    </main>
  )
};

export default Page;
