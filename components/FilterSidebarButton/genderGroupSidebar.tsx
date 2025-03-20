'use client'
import { useState, useEffect, useRef } from 'react'
import genderOptions from '@/data/genderOptions'
import { DataTableFaceted } from '../ui/data-table-faceted'
import useProductStore from '@/store/useProductStore'
import useProductTargeting from '@/queryHooks/useProductTargeting'
import useSelectedTermsStore from '@/store/useSelectedTermsStore'

interface GenderOptionsSidebarProps {
  onClose: () => void
  isLoading: boolean
}

export function GenderOptionsSidebar({ onClose, isLoading }: GenderOptionsSidebarProps) {
  const { options: genderOption = [], isLoading: isGenderLoading, error: genderError } = genderOptions()
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
  const selectedGenderTerms = useSelectedTermsStore(state => state.selectedGenderTerms)

  useEffect(() => {
    if (productTargetingData && productId) {
      const productTargeting = productTargetingData.filter(pt => pt.product_id.trim() === productId)

      if (productTargeting.length > 0) {
        const genderIds = productTargeting.map(pt => pt.target_gender_id).flat()
        setSelectedOptions(new Set(genderIds))
      }
    }
  }, [productTargetingData, productId])

  useEffect(() => {
    if (selectedOptions.size > 0) {
      selectedOptions.forEach(termId => {
        const genderGroup = genderOption.find(group => group.value === termId)
        if (genderGroup && !selectedGenderTerms.has(genderGroup.label)) {
          addTerm('gender', genderGroup.label) // Memastikan pembaruan state terjadi setelah render
        }
      })
    }
  }, [selectedOptions, selectedGenderTerms, addTerm])

  useEffect(() => {
    selectedGenderTerms.forEach(term => {
      const matchingOption = genderOption.find(group => group.label === term)
      if (!matchingOption || !selectedOptions.has(matchingOption.value)) {
        removeTerm('gender', term) // Menghapus term setelah render
      }
    })
  }, [selectedGenderTerms, removeTerm])

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

  if (genderError || productTargetingError) {
    return <div>Error loading gender data. Please try again later.</div>
  }

  return (
    <div className='flex items-center justify-end py-2'>
      <div className='flex flex-col items-center space-y-2 w-full'>
        <div className='w-full py-3'>
          <DataTableFaceted
            title='Gender'
            options={genderOption} // This will default to an empty array if undefined
            isLoading={isGenderLoading}
            onSelect={handleSelect}
            selectedValues={selectedOptions}
            onClear={handleClear}
            type='gender'
          />
        </div>
      </div>
    </div>
  )
}
