type statusTypeOptionsProps = {
  filterData: number; //0 - search, 1 - filter
};

type OptionType = { value: string; label: string };

const masterTableStatusOptions = ({
  filterData,
}: statusTypeOptionsProps): {
  options: OptionType[] | undefined;
  isLoading: boolean;
} => {
  const MasterRecordStatusOptions = [
    { id: 'INACTIVE', name: 'INACTIVE' },
    { id: 'ACTIVE', name: 'ACTIVE' },
  ];

  const isLoading = false;

  const statusList: OptionType[] | undefined = MasterRecordStatusOptions.map(
    (_statusList) => ({
      value: filterData === 0 ? _statusList.id : _statusList.name,
      label: _statusList.name,
    })
  );

  return { options: statusList, isLoading };
};

export default masterTableStatusOptions;
