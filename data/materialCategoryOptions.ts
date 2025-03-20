import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter';
import { useMaterialCategories } from '@/queryHooks/useMaterialCategories';

type materialCategoryOptionsProps = {
  filterData: number; //0 - search, 1 - filter
};

type OptionType = { value: string; label: string };

const materialCategoryOptions = ({
  filterData,
}: materialCategoryOptionsProps): {
  options: OptionType[] | undefined;
  isLoading: boolean;
} => {
  const { data, isLoading } = useMaterialCategories();
  const materialCategoryList: OptionType[] | undefined = data?.map(
    (_materialCategoryList) => ({
      value:
        filterData === 0
          ? _materialCategoryList.id
          : _materialCategoryList.name,
      label: capitalizeFirstLetter(_materialCategoryList.name),
    })
  );

  return { options: materialCategoryList, isLoading };
};

export default materialCategoryOptions;
