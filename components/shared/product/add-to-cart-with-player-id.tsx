// components/shared/product/add-to-cart-with-player-id.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import useCartStore from '@/hooks/use-cart-store'
import { useToast } from '@/hooks/use-toast'
import { OrderItem } from '@/types'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function AddToCartWithPlayerId({
  item,
}: {
  item: Omit<OrderItem, 'playerId'>
}) {
  const router = useRouter()
  const { toast } = useToast()
  const { addItem } = useCartStore()
  const [playerId, setPlayerId] = useState('')
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const t = useTranslations()

  const handleAddToCart = async () => {
    if (!playerId.trim()) {
      setError(t('Product.Player ID is required'))
      return
    }

    // تحقق إضافي مطابق للـ schema
    if (!/^[a-zA-Z0-9]+$/.test(playerId)) {
      setError(t('Product.Player ID must contain only letters and numbers'))
      return
    }

    try {
      const itemWithPlayerId: OrderItem = {
        ...item,
        playerId, // يتم حفظه كstring
        quantity,
      }

      await addItem(itemWithPlayerId, quantity)

      toast({
        description: t('Product.Added to Cart'),
        action: (
          <Button onClick={() => router.push('/cart')}>
            {t('Product.Go to Cart')}
          </Button>
        ),
      })
    } catch (err: any) {
      toast({
        variant: 'destructive',
        description: err.message || t('Product.Add to Cart failed'),
      })
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='w-full'>
        <label htmlFor='player-id' className='block text-sm font-medium mb-1'>
          * {t('Product.Player ID')}
        </label>
        <input
          type='text'
          id='player-id'
          name='player-id'
          placeholder={t('Product.Enter your player ID')}
          required
          className={`w-full p-2 border rounded-md ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          value={playerId}
          onChange={(e) => {
            setPlayerId(e.target.value)
            setError('')
          }}
        />
        {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
      </div>

      <div className='w-full'>
        <label className='block text-sm font-medium mb-1'>
          {t('Product.Quantity')}
        </label>
        <input
          type='number'
          min='1'
          max={item.countInStock}
          value={quantity}
          onChange={(e) =>
            setQuantity(
              Math.max(1, Math.min(item.countInStock, Number(e.target.value)))
            )
          }
          className='w-full p-2 border border-gray-300 rounded-md'
        />
      </div>

      <Button onClick={handleAddToCart} className='w-full'>
        {t('Product.Add to Cart')}
      </Button>
    </div>
  )
}
