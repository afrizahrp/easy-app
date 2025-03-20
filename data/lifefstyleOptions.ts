import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter'
import { useLifestyle } from '@/queryHooks/useLifestyle'

type OptionType = { value: string; label: string }

const lifestyleOptions = (): {
  options: OptionType[] | undefined
  isLoading: boolean
  error: Error | null
} => {
  const { data, isLoading, error } = useLifestyle()

  const lifestyleList: OptionType[] =
    data?.map(lifestyleitem => ({
      value: lifestyleitem.id,
      label: capitalizeFirstLetter(lifestyleitem.name)
    })) || [] // Menghindari undefined

  return { options: lifestyleList, isLoading, error }
}

export default lifestyleOptions
