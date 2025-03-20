import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter';
import { useProductCategories } from '@/queryHooks/useProductCategories';

type productCategoryOptionsProps = {
  filterData: number; //0 - search, 1 - filter
};

type OptionType = { value: string; label: string };

const productCategoryOptions = ({
  filterData,
}: productCategoryOptionsProps): {
  options: OptionType[] | undefined;
  isLoading: boolean;
} => {
  const { data, isLoading } = useProductCategories();
  const productCategoryList: OptionType[] | undefined = data?.map(
    (_productCategoryList) => ({
      value:
        filterData === 0 ? _productCategoryList.id : _productCategoryList.name,
      label: capitalizeFirstLetter(_productCategoryList.name),
    })
  );

  return { options: productCategoryList, isLoading };
};

export default productCategoryOptions;
