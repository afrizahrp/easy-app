import { useCategoryTypes } from '@/queryHooks/useCategoryTypes';
import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter';

type categoryTypeOptionsProps = {
  filterData: number; //0 - search, 1 - filter
};

type OptionType = { value: string; label: string };

const categoryTypeOptions = ({
  filterData,
}: categoryTypeOptionsProps): {
  options: OptionType[] | undefined;
  isLoading: boolean;
} => {
  const { data, isLoading, error } = useCategoryTypes();

  const categoryTypeList: OptionType[] | undefined = data?.map(
    (_categoryTypeList) => ({
      value: filterData === 0 ? _categoryTypeList.id : _categoryTypeList.name,
      label: capitalizeFirstLetter(_categoryTypeList.name),
    })
  );
  return { options: categoryTypeList, isLoading };
};

export default categoryTypeOptions;
