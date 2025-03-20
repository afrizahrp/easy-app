import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter';
import { useUoms } from '@/queryHooks/useUoms';

type uomOptionsProps = {
  filterData: number; //0 - search, 1 - filter
};
type OptionType = { value: string; label: string };

const uomOptions = ({
  filterData,
}: uomOptionsProps): {
  options: OptionType[] | undefined;
  isLoading: boolean;
} => {
  const { data, isLoading } = useUoms();
  const uomList: OptionType[] | undefined = data?.map((_uomList) => ({
    value: filterData === 0 ? _uomList.id : _uomList.name,
    label: capitalizeFirstLetter(_uomList.name),
  }));

  return { options: uomList, isLoading };
};

export default uomOptions;
