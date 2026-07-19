import Link from 'next/link';
import type { Service } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service._id}`} className="group block">
      <div className="border border-border/50 rounded-xl overflow-hidden hover:border-indigo-500/30 transition-all h-full flex flex-col">
        <div className="aspect-[16/10] bg-muted overflow-hidden">
          <img
            src={service.images[0] || '/placeholder.svg'}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium">
              {service.category}
            </span>
            <span className="text-xs text-muted-foreground">{service.duration} min</span>
          </div>
          <h3 className="font-semibold text-base mb-1 group-hover:text-indigo-400 transition-colors">
            {service.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
            {service.shortDesc}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-border/40">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs font-medium">{service.ratingAvg}</span>
              <span className="text-xs text-muted-foreground">({service.ratingCount})</span>
            </div>
            <span className="text-sm font-bold">${service.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between pt-3 border-t border-border/40">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}
