import { z } from 'zod'

import { useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useValidatedForm } from '@/lib/hooks/useValidatedForm'

import { type Action, cn } from '@/lib/utils'
import { type TAddOptimistic } from '@/app/(app)/personals/useOptimisticPersonals'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useBackPath } from '@/components/shared/BackButton'

import { type Personal, insertPersonalParams } from '@/lib/db/schema/personals'
import { createPersonalAction, deletePersonalAction, updatePersonalAction } from '@/lib/actions/personals'
import { useForm } from 'react-hook-form'

const PersonalForm = ({
  personal,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess
}: {
  personal?: Personal | null

  openModal?: (personal?: Personal) => void
  closeModal?: () => void
  addOptimistic?: TAddOptimistic
  postSuccess?: () => void
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { hasErrors, setErrors, handleChange } = useValidatedForm<Personal>(insertPersonalParams)
  const editing = !!personal?.id

  const [isDeleting, setIsDeleting] = useState(false)
  const [pending, startMutation] = useTransition()

  const router = useRouter()
  const backPath = useBackPath('personals')

  const onSuccess = (action: Action, data?: { error: string; values: Personal }) => {
    const failed = Boolean(data?.error)
    if (failed) {
      openModal && openModal(data?.values)
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? 'Error'
      })
    } else {
      router.refresh()
      postSuccess && postSuccess()
      toast.success(`Personal ${action}d!`)
      if (action === 'delete') router.push(backPath)
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    setErrors(null)

    const payload = data
    const personalParsed = await insertPersonalParams.safeParseAsync({ ...payload })
    if (!personalParsed.success) {
      setErrors(personalParsed?.error.flatten().fieldErrors)
      return
    }

    closeModal && closeModal()
    const values = personalParsed.data
    const pendingPersonal: Personal = {
      updatedAt: personal?.updatedAt ?? new Date(),
      createdAt: personal?.createdAt ?? new Date(),
      id: personal?.id ?? '',
      userId: personal?.userId ?? '',
      ...values
    }
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingPersonal,
            action: editing ? 'update' : 'create'
          })

        const error = editing ? await updatePersonalAction({ ...values, id: personal.id }) : await createPersonalAction(values)

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingPersonal
        }
        onSuccess(editing ? 'update' : 'create', error ? errorFormatted : undefined)
      })
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors)
      }
    }
  })

  return (
    <form
      onSubmit={onSubmit}
      className={'space-y-8'}
    >
      {/* Schema fields start */}
      <div>
        <Label className={cn('mb-2 inline-block', errors?.name ? 'text-destructive' : '')}>Name</Label>
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
          className={cn(errors?.name ? 'ring ring-destructive' : '')}
          defaultValue={personal?.name ?? ''}
          placeholder='Joe Smith'
        />
        {errors?.name ? <p className="text-xs text-destructive mt-2">{errors?.name.message?.toString()}</p> : <div className="h-6" />}
      </div>
      <div>
        <Label className={cn('mb-2 inline-block', errors?.identification ? 'text-destructive' : '')}>Identification</Label>
        <Input
          type="text"
          {...register('identification',
            {
              required: {
                value: true,
                message: 'Identification is required'
              },
              pattern: {
                value: /^\d{1}-\d{2,3}-\d{3}$/,
                message: 'Please enter a valid identification number'
              }
            }
          )}
          className={cn(errors?.identification ? 'ring ring-destructive' : '')}
          defaultValue={personal?.identification ?? ''}
          placeholder='1-123-457'
        />
        {errors?.identification ? <p className="text-xs text-destructive mt-2">{errors?.identification.message?.toString()}</p> : <div className="h-6" />}
      </div>
      <div>
        <Label className={cn('mb-2 inline-block', errors?.phone ? 'text-destructive' : '')}>Phone</Label>
        <Input
          type="text"
          {...register('phone',
            {
              required: {
                value: true,
                message: 'phone is required'
              },
            }
          )}
          className={cn(errors?.phone ? 'ring ring-destructive' : '')}
          defaultValue={personal?.phone ?? ''}
          placeholder='0000000000'
        />
        {errors?.phone ? <p className="text-xs text-destructive mt-2">{errors?.phone.message?.toString()}</p> : <div className="h-6" />}
      </div>
      <div>
        <Label className={cn('mb-2 inline-block', errors?.address ? 'text-destructive' : '')}>Address</Label>
        <Input
          type="text"
          {...register('address',
            {
              required: {
                value: true,
                message: 'address is required'
              },
            }
          )}
          className={cn(errors?.address ? 'ring ring-destructive' : '')}
          defaultValue={personal?.address ?? ''}
          placeholder='123 Main St'
        />
        {errors?.address ? <p className="text-xs text-destructive mt-2">{errors?.address.message?.toString()}</p> : <div className="h-6" />}
      </div>
      <div>
        <Label className={cn('mb-2 inline-block', errors?.salary ? 'text-destructive' : '')}>Salary</Label>
        <Input
          type="text"
          {...register('salary',
            {
              required: {
                value: true,
                message: 'Salary is required'
              },
              min: {
                value: 0,
                message: 'Salary should be a positive number'
              }
            }
          )}
          className={cn(errors?.salary ? 'ring ring-destructive' : '')}
          defaultValue={personal?.salary ?? ''}
          placeholder='100'
        />
        {errors?.salary ? <p className="text-xs text-destructive mt-2">{errors?.salary?.message?.toString()}</p> : <div className="h-6" />}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton
        errors={hasErrors}
        editing={editing}
      />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={'destructive'}
          onClick={() => {
            setIsDeleting(true)
            closeModal && closeModal()
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: 'delete', data: personal })
              const error = await deletePersonalAction(personal.id)
              setIsDeleting(false)
              const errorFormatted = {
                error: error ?? 'Error',
                values: personal
              }

              onSuccess('delete', error ? errorFormatted : undefined)
            })
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      ) : null}
    </form>
  )
}

export default PersonalForm

const SaveButton = ({ editing, errors }: { editing: Boolean; errors: boolean }) => {
  const { pending } = useFormStatus()
  const isCreating = pending && editing === false
  const isUpdating = pending && editing === true
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing ? `${isUpdating ? 'Saving...' : 'Save'}` : `${isCreating ? 'Creating...' : 'Create'}`}
    </Button>
  )
}
