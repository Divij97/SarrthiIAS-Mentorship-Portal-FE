import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { StrippedDownMentor } from '@/types/mentor';
import { RecurrenceType } from '@/types/session';
import { DayOfWeek } from '@/types/mentor';

interface ScheduleEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: StrippedDownMentor;
  menteeName: string;
  menteeEmail: string;
  scheduleDetails: {
    startTime: string;
    endTime: string;
    recurrenceType: RecurrenceType;
    firstSessionDate: string;
    dayOfWeek: DayOfWeek;
  };
}

export default function ScheduleEmailModal({
  isOpen,
  onClose,
  mentor,
  menteeName,
  menteeEmail,
  scheduleDetails
}: ScheduleEmailModalProps) {
  const subject = '🚀 Welcome to Sarrthi IAS One on One Mentorship Programme';
  
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const emailBody = `Hey ${menteeName}!

🎉 Congratulations! You've just stepped into one of the most prestigious and life-changing journeys—the UPSC Civil Services Examination. Yes, it's one of the toughest exams out there, and yes, the road ahead will have its ups and downs. But guess what? You're not alone in this!

I'm ${mentor.displayName}, your mentor, guide, friend, and biggest cheerleader on this adventure. My job? To help you cut through the noise, stay on track, and master UPSC preparation with the right strategy, motivation, and resources.

Here are the details of our first session:
📅 Date: ${formatDate(scheduleDetails.firstSessionDate)}
⏰ Time: ${formatTime(scheduleDetails.startTime)} - ${formatTime(scheduleDetails.endTime)}
🔄 Frequency: ${scheduleDetails.recurrenceType === RecurrenceType.WEEKLY ? 'Weekly' : 'Bi-weekly'} on ${scheduleDetails.dayOfWeek}

🔹 Just let me know if this schedule works for you, and we'll make any necessary adjustments to ensure it fits perfectly with your routine.

⏳ Time to make every study hour count—let's make this journey unstoppable! 🔥🚀

Looking forward to catching up!

Best regards,
${mentor.displayName}
📧 ${mentor.displayEmail}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailBody);
    // You could add a visual confirmation here if needed
  };

  return (
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
                      Send Welcome Email to Mentee
                    </Dialog.Title>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Copy and send this email to welcome your new mentee and start their UPSC journey.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="to" className="block text-sm font-medium leading-6 text-gray-900">
                      To
                    </label>
                    <input
                      type="text"
                      name="to"
                      id="to"
                      value={menteeEmail}
                      readOnly
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 bg-gray-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium leading-6 text-gray-900">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={subject}
                      readOnly
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="emailBody" className="block text-sm font-medium leading-6 text-gray-900">
                      Email Body
                    </label>
                    <div className="mt-2 relative">
                      <textarea
                        id="emailBody"
                        name="emailBody"
                        rows={12}
                        value={emailBody}
                        readOnly
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                      />
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="absolute right-2 top-2 inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Copy this text and paste it into an email to your mentee.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 