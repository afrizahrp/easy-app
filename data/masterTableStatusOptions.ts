type statusTypeOptionsProps = {
  filterData: number; // 0 - search, 1 - filter
  statusCounts?: Record<string, number>; // Total records per status
};

type OptionType = { value: string; label: string; count?: number };

const masterTableStatusOptions = ({
  filterData,
  statusCounts = {},
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
      count: statusCounts[_statusList.id] || 0, // Menambahkan jumlah data per status
    })
  );

  return { options: statusList, isLoading };
};

export default masterTableStatusOptions;
