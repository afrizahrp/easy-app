// // useUpdateAgeGroups.ts
// import axios from 'axios';
// import useProductTargeting from './useProductTargeting';
// import { useMutation } from '@tanstack/react-query';


// const useUpdateAgeGroups = () => {
//   const { data: productTargetingData, isLoading: isProductTargetingLoading, error: productTargetingError } = useProductTargeting();
//   const mutation = useMutation(
//     async (data) => {
//       const response = await axios.post('/api/agegroup', data);
//       return response.data;
//     },
//     {
//       onSuccess: () => {
//         // Logika setelah berhasil melakukan POST
//       },
//       onError: () => {
//         // Menangani error
//       },
//     }
//   );
  
//   return mutation;
// };

// export default useUpdateAgeGroups;
