import { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import Pagination from '@/components/shared/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getMyOrders } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/db/models/order.model'
import { formatDateTime, formatId } from '@/lib/utils'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import ProductPrice from '@/components/shared/product/product-price'

const PAGE_TITLE = 'Your Orders'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>
}) {
  const t = await getTranslations('AccountPage')
  const searchParams = await props.searchParams
  const page = Number(searchParams.page) || 1
  const orders = await getMyOrders({
    page,
  })

  return (
    <div>
      <div className='flex gap-2'>
        <Link href='/account'>{t('YourAccount')}</Link>
        <span>›</span>
        <span>{t('YourOrders')}</span>
      </div>
      <h1 className='h1-bold pt-4'>{t('YourOrders')}</h1>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('OrderId')}</TableHead>
              <TableHead>{t('OrderDate')}</TableHead>
              <TableHead>{t('OrderTotal')}</TableHead>
              <TableHead>{t('OrderPaid')}</TableHead>
              <TableHead>{t('OrderDelivered')}</TableHead>
              <TableHead>{t('OrderActions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className=''>
                  {t('NoOrders')}
                </TableCell>
              </TableRow>
            )}
            {orders.data.map((order: IOrder) => (
              <TableRow key={order._id}>
                <TableCell>
                  <Link href={`/account/orders/${order._id}`}>
                    {formatId(order._id)}
                  </Link>
                </TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt!).dateTime}
                </TableCell>
                <TableCell>
                  <ProductPrice price={order.totalPrice} plain />
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : t('No')}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : t('No')}
                </TableCell>
                <TableCell>
                  <Link href={`/account/orders/${order._id}`}>
                    <span className='px-2'>{t('Details')}</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination page={page} totalPages={orders.totalPages} />
        )}
      </div>
      <BrowsingHistoryList className='mt-16' />
    </div>
  )
}
