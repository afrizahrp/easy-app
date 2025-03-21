import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter';
import { useModuleStore, useSessionStore } from '@/store';
import { useCategory } from '../queryHooks/useCategory';

type categoryOptionProps = {
  filterData: number; //0 - search, 1 - filter
};

type OptionType = { value: string; label: string };

const categoryOptions = ({
  filterData,
}: categoryOptionProps): {
  options: OptionType[] | undefined;
  isLoading: boolean;
} => {
  const user = useSessionStore((state) => state.user);
  const module_id = useModuleStore((state) => state.moduleId);
  const companyId = user?.company_id;

  const url = `${process.env.NEXT_PUBLIC_API_URL}/${companyId}/${module_id}/get-categories`;
  const { data, isLoading } = useCategory(1, 20);
  const categoryList: OptionType[] | undefined = data?.map((_categoryList) => ({
    value: filterData === 0 ? _categoryList.id : (_categoryList.name ?? ''),
    label: capitalizeFirstLetter(_categoryList.name),
  }));

  return { options: categoryList, isLoading };
};

export default categoryOptions;
