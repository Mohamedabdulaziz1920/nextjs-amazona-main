import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ISettingInput } from '@/types'
import { TrashIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { useTranslations } from 'next-intl'

export default function LanguageForm({
  form,
  id,
}: {
  form: UseFormReturn<ISettingInput>
  id: string
}) {
  const t = useTranslations('LanguageForm')
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'availableLanguages',
  })
  const {
    setValue,
    watch,
    control,
    formState: { errors },
  } = form

  const availableLanguages = watch('availableLanguages')
  const defaultLanguage = watch('defaultLanguage')

  useEffect(() => {
    const validCodes = availableLanguages.map((lang) => lang.code)
    if (!validCodes.includes(defaultLanguage)) {
      setValue('defaultLanguage', '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(availableLanguages)])

  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle>{t('languages')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-4'>
          {fields.map((field, index) => (
            <div key={field.id} className='flex gap-2'>
              <FormField
                control={form.control}
                name={`availableLanguages.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    {index == 0 && <FormLabel>{t('name')}</FormLabel>}
                    <FormControl>
                      <Input {...field} placeholder={t('name')} />
                    </FormControl>
                    <FormMessage>
                      {errors.availableLanguages?.[index]?.name?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`availableLanguages.${index}.code`}
                render={({ field }) => (
                  <FormItem>
                    {index == 0 && <FormLabel>{t('code')}</FormLabel>}
                    <FormControl>
                      <Input {...field} placeholder={t('code')} />
                    </FormControl>
                    <FormMessage>
                      {errors.availableLanguages?.[index]?.code?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <div>
                {index == 0 && <div>{t('action')}</div>}
                <Button
                  type='button'
                  disabled={fields.length === 1}
                  variant='outline'
                  className={index == 0 ? 'mt-2' : ''}
                  onClick={() => {
                    remove(index)
                  }}
                >
                  <TrashIcon className='w-4 h-4' />
                </Button>
              </div>
            </div>
          ))}

          <Button
            type='button'
            variant={'outline'}
            onClick={() => append({ name: '', code: '' })}
          >
            {t('addLanguage')}
          </Button>
        </div>

        <FormField
          control={control}
          name='defaultLanguage'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('defaultLanguage')}</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ''}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectLanguage')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguages
                      .filter((x) => x.code)
                      .map((lang, index) => (
                        <SelectItem key={index} value={lang.code}>
                          {lang.name} ({lang.code})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage>{errors.defaultLanguage?.message}</FormMessage>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
