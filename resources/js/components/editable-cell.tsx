import { cn } from '@/lib/utils';
import { Input } from './ui/input';

export default function EditableCell({ ...props}) {

    return (
        <div className={cn('flex items-center space-x-2')}>
            <Input className="w-full" value={props.value}/>
        </div>
    );
}
