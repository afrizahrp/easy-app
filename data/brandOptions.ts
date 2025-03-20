import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter';
import { useBrands } from '@/queryHooks/useBrands';

type brandOptionsProps = {
  filterData: number; //0 - search, 1 - filter
};

type OptionType = { value: string; label: string };

const BrandsOptions = ({
  filterData,
}: brandOptionsProps): {
  options: OptionType[] | undefined;
  isLoading: boolean;
} => {
  const { data, isLoading } = useBrands();
  const brandList: OptionType[] | undefined = data?.map((_brandList) => ({
    value: filterData === 0 ? _brandList.id : _brandList.name,
    label: capitalizeFirstLetter(_brandList.name),
  }));
  return { options: brandList, isLoading };
};

export default BrandsOptions;
