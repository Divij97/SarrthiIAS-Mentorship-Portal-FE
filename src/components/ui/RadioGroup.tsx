import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react';
import clsx from 'clsx';

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  name: string;
}

export function RadioGroup({ value, onChange, options, name }: RadioGroupProps) {
  return (
    <HeadlessRadioGroup value={value} onChange={onChange} className="space-y-1">
      {options.map((option) => (
        <HeadlessRadioGroup.Option
          key={option.value}
          value={option.value}
          className={({ active, checked }) =>
            clsx(
              'relative flex cursor-pointer rounded-lg px-3 py-2 focus:outline-none',
              {
                'bg-orange-50 ring-2 ring-orange-500': checked,
                'bg-white': !checked,
              }
            )
          }
        >
          {({ active, checked }) => (
            <>
              <div className="flex w-full items-center">
                <div
                  className={clsx(
                    'h-4 w-4 rounded-full border flex items-center justify-center mr-3',
                    {
                      'border-orange-500 bg-orange-500': checked,
                      'border-gray-300': !checked,
                    }
                  )}
                >
                  {checked && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="text-sm">
                  <p className={clsx('font-medium', {
                    'text-orange-900': checked,
                    'text-gray-900': !checked,
                  })}>
                    {option.label}
                  </p>
                </div>
              </div>
            </>
          )}
        </HeadlessRadioGroup.Option>
      ))}
    </HeadlessRadioGroup>
  );
} 