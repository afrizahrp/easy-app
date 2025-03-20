'use client'
import { useState, useEffect, useRef } from 'react'
import ageGroupOptions from '@/data/ageGroupOptions'
import { DataTableFaceted } from '../ui/data-table-faceted'
import useProductStore from '@/store/useProductStore'
import useProductTargeting from '@/queryHooks/useProductTargeting'
import useSelectedTermsStore from '@/store/useSelectedTermsStore'

interface AgeGroupOptionsSidebarOldProps {
  onClose: () => void
  isLoading: boolean
}

export function AgeGroupOptionsSidebarOld({ onClose, isLoading }: AgeGroupOptionsSidebarOldProps) {
  const { options: ageGroupOption = [], isLoading: isAgeGroupLoading } = ageGroupOptions()
  const {
    data: productTargetingData,
    isLoading: isProductTargetingLoading,
    error: productTargetingError
  } = useProductTargeting()
  const productId = useProductStore(state => state.productId)
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set())
  const addTerm = useSelectedTermsStore(state => state.addTerm) // Ambil fungsi addTerm
  const removeTerm = useSelectedTermsStore(state => state.removeTerm) // Ambil fungsi removeTerm
  const selectedAgeTerms = useSelectedTermsStore(state => state.selectedAgeTerms)

  useEffect(() => {
    if (productTargetingData && productId) {
      const productTargeting = productTargetingData.filter(pt => pt.product_id.trim() === productId)
      // console.log('productTargeting:', productTargeting)

      if (productTargeting.length > 0) {
        const ageGroupIds = productTargeting.map(pt => pt.target_agegroup_id).flat()
        setSelectedOptions(new Set(ageGroupIds)) // Ensure ageGroupIds is an array of strings
      }
    }
  }, [productTargetingData, productId])

  const prevSelectedOptions = useRef(selectedOptions)

  useEffect(() => {
    if (!isAgeGroupLoading && selectedOptions !== prevSelectedOptions.current) {
      prevSelectedOptions.current = selectedOptions

      selectedOptions.forEach(termId => {
        const ageGroup = ageGroupOption.find(group => group.value === termId)
        if (ageGroup && !selectedAgeTerms.has(ageGroup.label)) {
          addTerm('age', ageGroup.label) // Menambahkan label ke selectedAgeTerms di store
        }
      })
    }
  }, [selectedOptions, addTerm, ageGroupOption, selectedAgeTerms, isAgeGroupLoading])

  useEffect(() => {
    selectedAgeTerms.forEach(term => {
      const matchingOption = ageGroupOption.find(group => group.label === term)
      if (!matchingOption || !selectedOptions.has(matchingOption.value)) {
        removeTerm('gender', term) // Menghapus term setelah render
      }
    })
  }, [selectedOptions, selectedAgeTerms, removeTerm])

  const handleSelect = (value: string) => {
    setSelectedOptions(prev => {
      const newSelectedOptions = new Set(prev)
      if (newSelectedOptions.has(value)) {
        newSelectedOptions.delete(value)
      } else {
        newSelectedOptions.add(value)
      }
      console.log('newSelectedOptions:', newSelectedOptions)
      return newSelectedOptions
    })
  }

  const handleClear = () => {
    setSelectedOptions(new Set())
    console.log('selectedOptions cleared')
  }

  if (isAgeGroupLoading || isProductTargetingLoading) {
    return <div>Loading...</div>
  }

  // if (ageGroupError || productTargetingError) {
  //   console.error('Error fetching data:', ageGroupError || productTargetingError);
  //   return <div>Error loading data</div>;
  // }

  // Map selectedOptions to their corresponding labels
  // const selectedLabels = Array.from(selectedOptions).map(id => {
  //   const option = ageGroupOption.find(option => option.value === id);
  //   return option ? option.label : id;
  // });

  return (
    <div className='flex items-center justify-end py-2'>
      <div className='flex flex-col items-center space-y-2 w-full'>
        <div className='w-full py-3'>
          <DataTableFaceted
            title='Age Groups'
            options={ageGroupOption} // This will default to an empty array if undefined
            isLoading={isAgeGroupLoading}
            onSelect={handleSelect}
            selectedValues={selectedOptions}
            onClear={handleClear}
            type='age'
          />
        </div>
      </div>
    </div>
  )
}
