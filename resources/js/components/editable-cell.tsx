import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';
import { Input } from './ui/input';

export default function EditableCell({ value, ...props }: HTMLAttributes<HTMLDivElement>) {

    return (
        <div {...props} className={cn('flex items-center space-x-2')}>
            <Input className="w-full" value={value} />
        </div>
    );
}
