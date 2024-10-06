import CommonLoadingSpinner from './CommonLoadingSpinner';

import { useAsyncLoadingSpinner } from '@/stores/useCommon';

export default function CommonAsyncLoadingSpinner() {
  const { loading } = useAsyncLoadingSpinner();

  if (!loading) {
    return null;
  }

  return (
    <div className="fixed left-0 top-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-30">
      <CommonLoadingSpinner />
    </div>
  );
}
