import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter'
import { useAgeGroup } from '@/queryHooks/useAgeGroup'

type OptionType = { value: string; label: string }

const ageGroupOptions = (): {
  options: OptionType[] | undefined
  isLoading: boolean
  error: Error | null
} => {
  const { data, isLoading, error } = useAgeGroup()

  const ageGroupList: OptionType[] =
    data?.map(ageGroupItem => ({
      value: ageGroupItem.id,
      label: capitalizeFirstLetter(ageGroupItem.name)
    })) || [] // Menghindari undefined

  return { options: ageGroupList, isLoading, error }
}

export default ageGroupOptions
