import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter';
import { useMasterTableStatus } from '@/queryHooks/useMasterTableStatus';

type OptionType = { value: string; label: string };

const masterTableStatusOptions = (): {
  options: OptionType[] | undefined;
  isLoading: boolean;
} => {
  const { data, isLoading } = useMasterTableStatus();
  const statusList: OptionType[] | undefined = data?.map((_statusList) => ({
    value: _statusList.name,
    label: capitalizeFirstLetter(_statusList.name),
  }));

  return { options: statusList, isLoading };
};

export default masterTableStatusOptions;
