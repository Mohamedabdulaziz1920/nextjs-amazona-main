import { notFound } from 'next/navigation'
import React from 'react'

import { auth } from '@/auth'
import { getOrderById } from '@/lib/actions/order.actions'
import OrderDetailsForm from '@/components/shared/order/order-details-form'
import Link from 'next/link'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Admin Order Details',
}

const AdminOrderDetailsPage = async (props: {
  params: {
    id: string
    locale: string
  }
}) => {
  const { id, locale } = props.params
  const t = await getTranslations('AdminOrderDetailsPage')

  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()

  return (
    <main
      className={`max-w-6xl mx-auto p-4 md:p-6 ${locale === 'ar' ? 'text-right' : 'text-left'}`}
    >
      {/* Breadcrumb Navigation */}
      <nav className='flex items-center mb-6 text-sm'>
        <Link
          href='/admin/orders'
          className='text-primary hover:underline transition-colors'
        >
          {t('orders')}
        </Link>
        <span className='mx-2 text-muted-foreground'>/</span>
        <Link
          href={`/admin/orders/${order._id}`}
          className='font-medium text-primary hover:underline transition-colors'
        >
          {t('order_id', { id: order._id.toString() })}
        </Link>
      </nav>

      {/* Page Header */}
      <div className='mb-8'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'>
          {t('order_details')}
        </h1>
        <p className='text-muted-foreground mt-2'>
          {t('order_details_description')}
        </p>
      </div>

      {/* Order Details Container */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 border border-gray-200 dark:border-gray-700'>
        <OrderDetailsForm
          order={order}
          isAdmin={session?.user?.role === 'Admin' || false}
        />
      </div>
    </main>
  )
}

export default AdminOrderDetailsPage
