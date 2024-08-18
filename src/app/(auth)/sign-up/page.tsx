'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { emailSchema } from '@/lib/email/utils'
import Link from 'next/link'


const Page = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const router = useRouter()


  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');

  const sendMail = async (data:any) => {
    const payload = emailSchema.parse({
      name: data.name,
      email: data.email,
      id: data.id,
    });
    try {
      const req = await fetch("/api/email", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log('Failed to fetch email', error);
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    setIsCreating(true)
    setMessage('')
    const res = await fetch('api/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const resJson =  await res.json()

    if (res.ok) {
      sendMail(resJson)
      router.push('/sign-in')
    } else {
      setMessage(`Failed to create account: ${resJson?.error}`)
    }
    setIsCreating(false)

  })


  return (
    <main className="bg-popover max-w-lg mx-auto my-4 rounded-lg p-10">
      <h1 className="text-2xl font-bold text-center">Sign up to your new account</h1>
      <form
        onSubmit={onSubmit}
        className="mt-4 space-y-4"
      >
        {message && <div className='text-sm bg-red-600 p-2 text-white'>
          {message}
        </div>}
        <div>
          <Label
            htmlFor='name'
            className={cn('mb-2 inline-block', errors?.name ? "text-destructive" : "",)}
          >
            Name
          </Label>
          <Input
            type="text"
            {...register('name', {
              required: {
                value: true,
                message: 'Name is required'
              },
              minLength: { value: 2, message: 'Name should be at least 2 characters long' },
              maxLength: { value: 50, message: 'Name should not exceed 50 characters' }
            })}
            placeholder='John Smith'
            className={cn(errors.name ? "ring ring-destructive" : "")}
          />
          {errors.name ? (
          <p className="text-xs text-destructive mt-2">{errors?.name?.message?.toString()}</p>
        ) : (
          <div className="h-6" />
        )}
        </div>
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
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
              }
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
        <div>
          <Label
            htmlFor='confirmation_password'
            className={cn('mb-2 inline-block', errors?.confirmation_password ? "text-destructive" : "")}
          >
            Confirmation Password
          </Label>
          <Input
            type="password"
            {...register('confirmation_password', {
              required: {
                value: true,
                message: 'Confirmation password is required'
              },
              validate: (value) => value === watch('password') || 'Passwords do not match'
            })}
            placeholder='*******'
            className={cn(errors?.confirmation_password ? "ring ring-destructive" : "")}
          />
          {errors?.confirmation_password ? (
          <p className="text-xs text-destructive mt-2">{errors.confirmation_password?.message?.toString()}</p>
        ) : (
          <div className="h-6" />
        )}
        </div>
        <p className='text-center text-sm'>
          Already have an account? <Link href='/sign-in' className='text-blue-700'>Sign in</Link> now.
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
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create'}
        </Button>
        </div>
      </form>
    </main>
  )
}

export default Page
