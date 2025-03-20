import { capitalizeFirstLetter } from '@/utils/capitalize-first-letter';
import { useAuth } from '@/provider/auth.provider';
import { useModuleStore } from '@/store';
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
  const { session } = useAuth();
  const companyId = session?.user?.company_id;
  const module_id = useModuleStore((state) => state.moduleId);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/${companyId}/${module_id}/get-categories`;
  const { data, isLoading } = useCategory(companyId ?? '', 1, 100);
  const categoryList: OptionType[] | undefined = data?.map((_categoryList) => ({
    value: filterData === 0 ? _categoryList.id : (_categoryList.name ?? ''),
    label: capitalizeFirstLetter(_categoryList.name),
  }));

  return { options: categoryList, isLoading };
};

export default categoryOptions;
