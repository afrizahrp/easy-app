import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter'
import { useGender } from '@/queryHooks/useGender'

type OptionType = { value: string; label: string }

const genderOptions = (): {
  options: OptionType[] | undefined
  isLoading: boolean
  error: Error | null
} => {
  const { data, isLoading, error } = useGender()

  const genderList: OptionType[] =
    data?.map(genderItem => ({
      value: genderItem.id,
      label: capitalizeFirstLetter(genderItem.name)
    })) || [] // Menghindari undefined

  return { options: genderList, isLoading, error }
}

export default genderOptions
