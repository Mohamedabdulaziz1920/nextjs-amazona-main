import { HomeCarousel } from '@/components/shared/home/home-carousel'
import ProductSlider from '@/components/shared/product/product-slider'
import { Card, CardContent } from '@/components/ui/card'
import {
  getProductsGroupedByCategory,
  getProductsByTag,
} from '@/lib/actions/product.actions'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('Home')
  const { carousels } = await getSetting()

  // جلب البيانات بشكل متوازي
  const [groupedProducts, todaysDeals, bestSellingProducts] = await Promise.all(
    [
      getProductsGroupedByCategory(),
      getProductsByTag({ tag: 'todays-deal' }),
      getProductsByTag({ tag: 'best-seller' }),
    ]
  )

  return (
    <>
      <HomeCarousel items={carousels} />

      <div className='md:p-4 md:space-y-4 bg-border'>
        {/* عرض المنتجات حسب الفئة */}
        {groupedProducts.map((group, index) => (
          <Card key={`category-${index}`} className='w-full rounded-none mb-6'>
            <CardContent className='p-4 items-center gap-3'>
              <ProductSlider
                title={group.category} // اسم الفئة كعنوان
                products={group.products}
              />
            </CardContent>
          </Card>
        ))}

        {/* العروض الخاصة */}
        <Card className='w-full rounded-none'>
          <CardContent className='p-4 items-center gap-3'>
            <ProductSlider title={t("Today's Deals")} products={todaysDeals} />
          </CardContent>
        </Card>

        <Card className='w-full rounded-none'>
          <CardContent className='p-4 items-center gap-3'>
            <ProductSlider
              title={t('Best Selling Products')}
              products={bestSellingProducts}
              hideDetails
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
