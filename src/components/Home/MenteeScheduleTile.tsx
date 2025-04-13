import { StrippedDownMentee } from '@/types/mentee';
import { Button } from '@/components/ui/Button';
import { Calendar } from 'lucide-react';

interface MenteeScheduleTileProps {
  mentee: StrippedDownMentee;
  onScheduleClick: (menteeId: string) => void;
}

export const MenteeScheduleTile = ({ mentee, onScheduleClick }: MenteeScheduleTileProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{mentee.n}</h3>
            <p className="text-sm text-gray-500">{mentee.e}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Unscheduled
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Preferred Slot:</span>
            <span className="ml-2">{mentee.preferredSlot}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Phone:</span>
            <span className="ml-2">{mentee.p}</span>
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={() => onScheduleClick(mentee.p)}
            className="w-full flex items-center justify-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Create Schedule</span>
          </Button>
        </div>
      </div>
    </div>
  );
}; 