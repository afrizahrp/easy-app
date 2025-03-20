import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter';
import { useSubCategories } from '@/queryHooks/useSubCategories';

type subCategoryOptionsProps = {
  filterData: number; //0 - search, 1 - filter
  category_id: string; // Add category_id to the props
};

type OptionType = { value: string; label: string };

const subCategoryOptions = ({
  filterData,
  category_id,
}: subCategoryOptionsProps): {
  options: OptionType[] | undefined;
  isLoading: boolean;
} => {
  const { data, isLoading } = useSubCategories(category_id); // Pass category_id to the hook

  const subCategoryList: OptionType[] | undefined = data?.map(
    (_subCategoryList) => ({
      value: filterData === 0 ? _subCategoryList.id : _subCategoryList.name,
      label: capitalizeFirstLetter(_subCategoryList.name),
    })
  );

  return { options: subCategoryList, isLoading };
};

export default subCategoryOptions;
