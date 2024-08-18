'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { type Personal, CompletePersonal } from '@/lib/db/schema/personals'
import Modal from '@/components/shared/Modal'

import { useOptimisticPersonals } from '@/app/(app)/personals/useOptimisticPersonals'
import { Button } from '@/components/ui/button'
import PersonalForm from './PersonalForm'
import { PlusIcon } from 'lucide-react'
import { columns } from './Partiel/columns'
import { DataTable } from './Partiel/dataTable'
import { getPersonalByExcelAction } from '@/lib/actions/personals'
import { utils, writeFile } from "xlsx";
import { Chart } from './Partiel/chart'

type TOpenModal = (personal?: Personal) => void

export default function PersonalList({ personals }: { personals: CompletePersonal[] }) {
  const { optimisticPersonals, addOptimisticPersonal } = useOptimisticPersonals(personals)
  const [open, setOpen] = useState(false)
  const [openGraphic, setOpenGraphic] = useState(false)
  const [loadingExcel, setLoadingExcel] = useState(false)
  const [activePersonal, setActivePersonal] = useState<Personal | null>(null)
  const openModal = (personal?: Personal) => {
    setOpen(true)
    personal ? setActivePersonal(personal) : setActivePersonal(null)
  }
  const closeModal = () => setOpen(false)

  const generateReportExcel = (data:any) => {
    try {
      const workbook = utils.book_new();
      const worksheet = utils.json_to_sheet(data);
      utils.book_append_sheet(workbook, worksheet, "Sheet1");
      writeFile(workbook, `salary${Date.now()}.xlsx`, {
        compression: true
      });
    } catch (error) {
      console.error("Error generating Excel data:", error);
      throw error;
    }
  }

  const generateReport = async () => {
    setLoadingExcel(true)
    try {
      const result = await getPersonalByExcelAction()

      generateReportExcel(result)
    } catch (error) {
      console.error('Failed to generate report', error)
    } finally {
      setLoadingExcel(false)
    }
  }

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activePersonal ? 'Edit Personal' : 'Create Personal'}
      >
        <PersonalForm
          personal={activePersonal}
          addOptimistic={addOptimisticPersonal}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <Modal
        open={openGraphic}
        setOpen={setOpenGraphic}
        title={`Graphic Salary`}
      >
        <Chart />
      </Modal>
      <div className="absolute right-0 top-0">
        <Button
          className="mr-4"
          onClick={() => setOpenGraphic(true)}
          variant={'outline'}
          disabled={loadingExcel}
        >
          Graphic Salary
        </Button>
        <Button
          className="mr-4"
          onClick={() => generateReport()}
          variant={'outline'}
          disabled={loadingExcel}
        >
          {loadingExcel ? 'Reporting' : 'Report'}
        </Button>
        <Button
          onClick={() => openModal()}
          variant={'outline'}
        >
          +
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={optimisticPersonals}
      />

      {/* {optimisticPersonals.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticPersonals.map((personal) => (
            <Personal
              personal={personal}
              key={personal.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )} */}
    </div>
  )
}

const Personal = ({ personal, openModal }: { personal: CompletePersonal; openModal: TOpenModal }) => {
  const optimistic = personal.id === 'optimistic'
  const deleting = personal.id === 'delete'
  const mutating = optimistic || deleting
  const pathname = usePathname()
  const basePath = pathname.includes('personals') ? pathname : pathname + '/personals/'

  return (
    <li className={cn('flex justify-between my-2', mutating ? 'opacity-30 animate-pulse' : '', deleting ? 'text-destructive' : '')}>
      <div className="w-full">
        <div>{personal.name}</div>
      </div>
      <div className="w-full">
        <div>{personal.name}</div>
      </div>
      <div className="w-full">
        <div>{personal.name}</div>
      </div>
      <div className="w-full">
        <div>{personal.name}</div>
      </div>
      <div className="w-full">
        <div>{personal.name}</div>
      </div>
      <Button
        variant={'link'}
        asChild
      >
        <Link href={basePath + '/' + personal.id}>Edit</Link>
      </Button>
    </li>
  )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">No personals</h3>
      <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new personal.</p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Personals{' '}
        </Button>
      </div>
    </div>
  )
}
