'use client'
import { useState, useEffect, useRef } from 'react'
import lifestyleOptions from '@/data/lifefstyleOptions'
import { DataTableFaceted } from '../ui/data-table-faceted'
import useProductStore from '@/store/useProductStore'
import useProductTargeting from '@/queryHooks/useProductTargeting'
import useSelectedTermsStore from '@/store/useSelectedTermsStore'

interface LifestyleGroupSidebarProps {
  onClose: () => void
  isLoading: boolean
}

export function LifestyleGroupSidebar({ onClose, isLoading }: LifestyleGroupSidebarProps) {
  const { options: lifestyleOption = [], isLoading: isLifestyleLoading, error: lifestyleError } = lifestyleOptions()
  const {
    data: productTargetingData,
    isLoading: isProductTargetingLoading,
    error: productTargetingError
  } = useProductTargeting()
  const productId = useProductStore(state => state.productId)
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set())
  const addTerm = useSelectedTermsStore(state => state.addTerm) // Ambil fungsi addTerm
  const removeTerm = useSelectedTermsStore(state => state.removeTerm) // Ambil fungsi removeTerm
  const clearTerms = useSelectedTermsStore(state => state.clearTerms)
  const selectedLifesyleTerms = useSelectedTermsStore(state => state.selectedLifestyleTerms)

  useEffect(() => {
    if (productTargetingData && productId) {
      const productTargeting = productTargetingData.filter(pt => pt.product_id.trim() === productId)

      if (productTargeting.length > 0) {
        const lifestyleIds = productTargeting.map(pt => pt.target_lifestyle_id).flat()
        setSelectedOptions(new Set(lifestyleIds)) // Ensure lifestyleIds is an array of strings
      }
    }
  }, [productTargetingData, productId])

  useEffect(() => {
    if (selectedOptions.size > 0) {
      selectedOptions.forEach(termId => {
        const lifestyleGroup = lifestyleOption.find(group => group.value === termId)
        if (lifestyleGroup && !selectedLifesyleTerms.has(lifestyleGroup.label)) {
          addTerm('lifestyle', lifestyleGroup.label) // Memastikan pembaruan state terjadi setelah render
        }
      })
    }
  }, [selectedOptions, selectedLifesyleTerms, addTerm])

  useEffect(() => {
    selectedLifesyleTerms.forEach(term => {
      const matchingOption = lifestyleOption.find(group => group.label === term)
      if (!matchingOption || !selectedOptions.has(matchingOption.value)) {
        removeTerm('lifestyle', term) // Menghapus term setelah render
      }
    })
  }, [selectedLifesyleTerms, removeTerm])

  const handleSelect = (value: string) => {
    setSelectedOptions(prev => {
      const newSelectedOptions = new Set(prev)
      if (newSelectedOptions.has(value)) {
        newSelectedOptions.delete(value)
      } else {
        newSelectedOptions.add(value)
      }
      return newSelectedOptions
    })
  }

  const handleClear = () => {
    setSelectedOptions(new Set()) // Kosongkan selectedOptions
    clearTerms() // Kosongkan semua term di store
  }

  if (lifestyleError || productTargetingError) {
    console.error('Error fetching lifestyle data:', lifestyleError || productTargetingError)
    return <div>Error loading lifestyle data. Please try again later.</div>
  }

  return (
    <div className='flex items-center justify-end py-2'>
      <div className='flex flex-col items-center space-y-2 w-full'>
        <div className='w-full py-3'>
          <DataTableFaceted
            title='Lifestyle'
            options={lifestyleOption} // This will default to an empty array if undefined
            isLoading={isLifestyleLoading}
            onSelect={handleSelect}
            selectedValues={selectedOptions}
            onClear={handleClear}
            type='lifestyle'
          />
        </div>
      </div>
    </div>
  )
}
