import { useState } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { CreateDocumentRequest } from '@/types/course';
import toast from 'react-hot-toast';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (documents: CreateDocumentRequest[]) => Promise<void>;
  isSubmitting: boolean;
}

export default function DocumentModal({ isOpen, onClose, onSubmit, isSubmitting }: DocumentModalProps) {
  const [documentFormData, setDocumentFormData] = useState<CreateDocumentRequest>({
    name: '',
    description: '',
    url: '',
    disclaimer: ''
  });
  const [documents, setDocuments] = useState<CreateDocumentRequest[]>([]);

  if (!isOpen) return null;

  const handleDocumentFormSubmit = () => {
    if (!documentFormData.name || !documentFormData.url) {
      toast.error('Document name and URL are required');
      return;
    }

    // Add the document to the list
    setDocuments(prev => [...prev, { ...documentFormData }]);
    
    // Reset the form
    setDocumentFormData({
      name: '',
      description: '',
      url: '',
      disclaimer: ''
    });

    toast.success('Document added to the list');
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (documents.length === 0) {
      toast.error('Please add at least one document');
      return;
    }

    await onSubmit(documents);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Add Documents to Course</h3>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Document Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={documentFormData.name}
                onChange={(e) => setDocumentFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Enter document name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={documentFormData.description}
                onChange={(e) => setDocumentFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Enter document description"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={documentFormData.url}
                onChange={(e) => setDocumentFormData(prev => ({ ...prev, url: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Enter document URL"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Disclaimer
              </label>
              <input
                type="text"
                value={documentFormData.disclaimer}
                onChange={(e) => setDocumentFormData(prev => ({ ...prev, disclaimer: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Enter any disclaimer"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleDocumentFormSubmit}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add to List
              </button>
            </div>
          </div>
          
          {/* Document List */}
          {documents.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Documents to be Added</h4>
              <div className="bg-gray-50 rounded-md p-3 max-h-60 overflow-y-auto">
                <ul className="divide-y divide-gray-200">
                  {documents.map((doc, index) => (
                    <li key={index} className="py-3 flex justify-between items-start">
                      <div>
                        <h5 className="text-sm font-medium">{doc.name}</h5>
                        {doc.description && <p className="text-xs text-gray-500">{doc.description}</p>}
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                          {doc.url}
                        </a>
                        {doc.disclaimer && <p className="text-xs italic text-gray-500 mt-1">{doc.disclaimer}</p>}
                      </div>
                      <button
                        onClick={() => handleRemoveDocument(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={documents.length === 0 || isSubmitting}
            className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              documents.length === 0 || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Documents'}
          </button>
        </div>
      </div>
    </div>
  );
} 