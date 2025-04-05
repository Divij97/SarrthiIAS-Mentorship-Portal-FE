import { CourseDocuments as CourseDocument } from '@/types/course';

interface CourseDocumentsProps {
  documents: CourseDocument[];
}

export default function CourseDocuments({ documents }: CourseDocumentsProps) {
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Course Documents</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.map((doc, index) => (
          <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h4>
              {doc.description && (
                <p className="mt-1 text-xs text-gray-500">{doc.description}</p>
              )}
              {doc.disclaimer && (
                <p className="mt-1 text-xs text-orange-600">{doc.disclaimer}</p>
              )}
            </div>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              View Document
            </a>
          </div>
        ))}
      </div>
    </div>
  );
} 