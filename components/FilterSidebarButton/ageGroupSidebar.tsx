'use client'
import { useEffect } from 'react'
import ageGroupOptions from '@/data/ageGroupOptions'
import { DataTableFaceted } from '../ui/data-table-faceted'
import useProductStore from '@/store/useProductStore'
import useProductTargeting from '@/queryHooks/useProductTargeting'
import useSelectedTermsStore from '@/store/useSelectedTermsStore'

interface AgeGroupOptionsSidebarProps {
  onClose: () => void
  isLoading: boolean
}

export function AgeGroupOptionsSidebar({ onClose, isLoading }: AgeGroupOptionsSidebarProps) {
  const { options: ageGroupOption = [], isLoading: isAgeGroupLoading } = ageGroupOptions()
  const {
    data: productTargetingData,
    isLoading: isProductTargetingLoading,
    error: productTargetingError
  } = useProductTargeting()
  const productId = useProductStore(state => state.productId)
  const addTerm = useSelectedTermsStore(state => state.addTerm)
  const removeTerm = useSelectedTermsStore(state => state.removeTerm)
  const clearTerms = useSelectedTermsStore(state => state.clearTerms)
  const selectedAgeTerms = useSelectedTermsStore(state => state.selectedAgeTerms)

  // Load initial data into the store
  useEffect(() => {
    if (productTargetingData && productId) {
      const productTargeting = productTargetingData.filter(pt => pt.product_id.trim() === productId)
      if (productTargeting.length > 0) {
        const ageGroupIds = productTargeting.map(pt => pt.target_agegroup_id).flat()
        ageGroupIds.forEach(id => addTerm('age', id))
      }
    }
  }, [productTargetingData, productId, addTerm])

  const handleSelect = (value: string) => {
    if (selectedAgeTerms.has(value)) {
      removeTerm('age', value)
    } else {
      addTerm('age', value)
    }
  }

  const handleClear = () => {
    clearTerms()
  }

  if (isAgeGroupLoading || isProductTargetingLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex items-center justify-end py-2'>
      <div className='flex flex-col items-center space-y-2 w-full'>
        <div className='w-full py-3'>
          <DataTableFaceted
            title='Age Groups'
            options={ageGroupOption}
            isLoading={isAgeGroupLoading}
            onSelect={handleSelect}
            selectedValues={new Set(Array.from(selectedAgeTerms))}
            onClear={handleClear}
            type='age'
          />
        </div>
      </div>
    </div>
  )
}
