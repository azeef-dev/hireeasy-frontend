import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProviderCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(23,25,51,0.06),0_8px_24px_rgba(23,25,51,0.06)]">
      <div className="flex items-start gap-3 p-5 pb-6">
        <Skeleton circle width={48} height={48} />
        <div className="min-w-0 flex-1">
          <Skeleton width="70%" height={16} />
          <Skeleton width="45%" height={12} style={{ marginTop: 6 }} />
          <Skeleton width={90} height={12} style={{ marginTop: 8 }} />
        </div>
      </div>
      <div className="px-5">
        <Skeleton width={100} height={22} borderRadius={999} />
      </div>
      <div className="mt-5 px-5">
        <Skeleton height={1} />
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <Skeleton width={70} height={30} />
        <Skeleton width={70} height={30} />
        <Skeleton width={90} height={32} borderRadius={999} />
      </div>
    </div>
  );
}
