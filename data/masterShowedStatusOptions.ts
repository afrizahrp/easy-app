import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter';
import { useMasterShowedStatus } from '@/queryHooks/useMasterShowedStatus';

type masterShowedStatusOptionsProps = {
  filterData: number; //0 - search, 1 - filter
};


type OptionType = { value: string; label: string };



const masterShowedStatusOptions = ({
  filterData,

}: masterShowedStatusOptionsProps): {
  options: OptionType[] | undefined;
  isLoading: boolean;
} => {
  const { data, isLoading } = useMasterShowedStatus();
  const statusList: OptionType[] | undefined = data?.map(
    (_statusList) => ({
      value: filterData === 0
        ? _statusList.id
        : _statusList.name,
      label: capitalizeFirstLetter(_statusList.name),
    }));

  return { options: statusList, isLoading };
};

export default masterShowedStatusOptions;
