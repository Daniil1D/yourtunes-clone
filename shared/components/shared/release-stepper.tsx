'use client';

import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const steps = [
  { title: 'Шаг 1', path: 'information-releases' },
  { title: 'Шаг 2', path: 'platforms' },
  { title: 'Шаг 3', path: 'tracklist' },
  { title: 'Шаг 4', path: 'artist-cards' },
  { title: 'Финал', path: 'review' },
];

export const ReleaseStepper = () => {
  const pathname = usePathname();

  const currentIndex = steps.findIndex(step =>
    pathname.includes(step.path)
  );

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-gray-400">
        {steps.map((step, i) => (
          <span
            key={step.title}
            className={clsx(
              i <= currentIndex && 'text-orange-500 font-semibold'
            )}
          >
            {step.title}
          </span>
        ))}
      </div>

      <div className="h-[2px] bg-gray-200 relative">
        <div
          className="absolute top-0 left-0 h-full bg-orange-500 transition-all"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};
