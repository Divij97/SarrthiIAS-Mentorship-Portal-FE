import { MentorshipSession } from "@/types/session";
import { VideoCameraIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface ZoomLinkButtonProps {
  session: MentorshipSession;
}

const handleJoinSession = (zoomLink: string) => {
    window.open(zoomLink, '_blank');
  };

export const ZoomLinkButton = ({ session }: ZoomLinkButtonProps) => {
    if (session.isZoomLinkGenerated && session.z) {
      return (
        <button
          onClick={() => handleJoinSession(session.z!)}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-200"
        >
          <VideoCameraIcon className="h-5 w-5 mr-2" />
          Join Session
        </button>
      );
    }

    return (
      <div className="flex items-center text-sm text-gray-500">
        <ExclamationCircleIcon className="h-5 w-5 mr-2 text-gray-400" />
        <span>Zoom link will be generated 15 minutes before the session</span>
      </div>
    );
  };