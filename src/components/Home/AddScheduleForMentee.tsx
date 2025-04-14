import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DayOfWeek, StrippedDownMentor } from '@/types/mentor';
import ScheduleEmailModal from './ScheduleEmailModal';
import { MenteeMode, StrippedDownMentee } from '@/types/mentee';
import { RecurrenceType } from '@/types/session';
import { useMentorStore } from '@/stores/mentor/store';
import { CustomTimeInput } from '@/components/ui/CustomTimeInput';


interface AddScheduleForMenteeProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    menteeUsername: string;
    menteeFullName: string;
    startTime: string;
    endTime: string;
    recurrenceType: RecurrenceType;
    firstSessionDate: string;
    dayOfWeek: DayOfWeek;
    mode: MenteeMode;
  }) => Promise<void>;
  mentee: StrippedDownMentee;
  mentor: StrippedDownMentor;
}

export default function AddScheduleForMentee({
  isOpen,
  onClose,
  onSubmit,
  mentor,
  mentee
}: AddScheduleForMenteeProps) {
  const [menteeUsername, setMenteeUsername] = useState(mentee.p);
  const [menteeFullName, setMenteeFullName] = useState(mentee.n);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(RecurrenceType.BI_WEEKLY);
  const [firstSessionDate, setFirstSessionDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(DayOfWeek.SUNDAY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const unscheduledMenteeEmail = useMentorStore(state => state.getUnscheduledMenteeEmail(menteeUsername));
  const [menteeMode, setMenteeMode] = useState<MenteeMode>(mentee.mode || MenteeMode.ONLINE);
  const [createZoomMeeting, setCreateZoomMeeting] = useState(mentee.mode === MenteeMode.ONLINE);

  useEffect(() => {
    if (firstSessionDate) {
      const date = new Date(firstSessionDate);
      const day = date.getDay();
      // Convert JavaScript day (0-6) to our DayOfWeek enum
      const dayOfWeekMap: Record<number, DayOfWeek> = {
        0: DayOfWeek.SUNDAY,
        1: DayOfWeek.MONDAY,
        2: DayOfWeek.TUESDAY,
        3: DayOfWeek.WEDNESDAY,
        4: DayOfWeek.THURSDAY,
        5: DayOfWeek.FRIDAY,
        6: DayOfWeek.SATURDAY
      };
      setDayOfWeek(dayOfWeekMap[day]);
    }
  }, [firstSessionDate]);

  const handleZoomMeetingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setCreateZoomMeeting(isChecked);
    setMenteeMode(isChecked ? MenteeMode.ONLINE : MenteeMode.OFFLINE);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        menteeUsername,
        menteeFullName,
        startTime,
        endTime,
        recurrenceType,
        firstSessionDate,
        dayOfWeek,
        mode: menteeMode
      });
      setShowEmailModal(true);
    } catch (error) {
      console.error('Error creating schedule:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    onClose();
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  
                  <div>
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Add Schedule for Mentee
                      </Dialog.Title>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">
                          Create a new schedule for a mentee.
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                      <label htmlFor="menteeUsername" className="block text-sm font-medium leading-6 text-gray-900">
                        Mentee Username
                      </label>
                      <input
                        type="text"
                        name="menteeUsername"
                        id="menteeUsername"
                        value={menteeUsername}
                        onChange={(e) => setMenteeUsername(e.target.value)}
                        required
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div>
                      <label htmlFor="menteeFullName" className="block text-sm font-medium leading-6 text-gray-900">
                        Mentee Full Name
                      </label>
                      <input
                        type="text"
                        name="menteeFullName"
                        id="menteeFullName"
                        value={menteeFullName}
                        onChange={(e) => setMenteeFullName(e.target.value)}
                        required
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium leading-6 text-gray-900">
                        Start Time
                      </label>
                      <CustomTimeInput
                        id="startTime"
                        value={startTime}
                        onChange={setStartTime}
                        required
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div>
                      <label htmlFor="endTime" className="block text-sm font-medium leading-6 text-gray-900">
                        End Time
                      </label>
                      <CustomTimeInput
                        id="endTime"
                        value={endTime}
                        onChange={setEndTime}
                        required
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div>
                      <label htmlFor="recurrenceType" className="block text-sm font-medium leading-6 text-gray-900">
                        Recurrence Type
                      </label>
                      <select
                        name="recurrenceType"
                        id="recurrenceType"
                        value={recurrenceType}
                        onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
                        required
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                      >
                        <option value="WEEKLY">Weekly</option>
                        <option value="BI_WEEKLY">Bi-weekly</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="firstSessionDate" className="block text-sm font-medium leading-6 text-gray-900">
                        First Session Date
                      </label>
                      <input
                        type="date"
                        name="firstSessionDate"
                        id="firstSessionDate"
                        value={firstSessionDate}
                        onChange={(e) => setFirstSessionDate(e.target.value)}
                        required
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div>
                      <label htmlFor="dayOfWeek" className="block text-sm font-medium leading-6 text-gray-900">
                        Day of Week
                      </label>
                      <select
                        name="dayOfWeek"
                        id="dayOfWeek"
                        value={dayOfWeek}
                        onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                        required
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                      >
                        <option value={DayOfWeek.SUNDAY}>Sunday</option>
                        <option value={DayOfWeek.MONDAY}>Monday</option>
                        <option value={DayOfWeek.TUESDAY}>Tuesday</option>
                        <option value={DayOfWeek.WEDNESDAY}>Wednesday</option>
                        <option value={DayOfWeek.THURSDAY}>Thursday</option>
                        <option value={DayOfWeek.FRIDAY}>Friday</option>
                        <option value={DayOfWeek.SATURDAY}>Saturday</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="createZoomMeeting"
                        name="createZoomMeeting"
                        checked={createZoomMeeting}
                        onChange={handleZoomMeetingChange}
                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                      />
                      <label htmlFor="createZoomMeeting" className="ml-2 block text-sm text-gray-900">
                        Create zoom meeting
                      </label>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="ml-3 inline-flex justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Creating...' : 'Create Schedule'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <ScheduleEmailModal
        isOpen={showEmailModal}
        onClose={handleCloseEmailModal}
        mentor={mentor}
        menteeName={menteeFullName}
        menteeEmail={unscheduledMenteeEmail}
        scheduleDetails={{
          startTime,
          endTime,
          recurrenceType,
          firstSessionDate,
          dayOfWeek
        }}
      />
    </>
  );
} 