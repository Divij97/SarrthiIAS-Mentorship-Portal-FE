import { useState } from 'react';
import { CreateDocumentRequest } from '@/types/course';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (document: CreateDocumentRequest) => void;
}

export default function AddDocumentModal({
  isOpen,
  onClose,
  onAddDocument,
}: AddDocumentModalProps) {
  const [newDocument, setNewDocument] = useState<CreateDocumentRequest>({
    name: '',
    description: '',
    url: '',
    disclaimer: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDocument(newDocument);
    setNewDocument({
      name: '',
      description: '',
      url: '',
      disclaimer: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Document</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="docName" className="block text-sm font-medium text-gray-700">
              Document Name
            </label>
            <input
              type="text"
              id="docName"
              value={newDocument.name}
              onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="docDescription" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="docDescription"
              value={newDocument.description}
              onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              rows={2}
            />
          </div>

          <div>
            <label htmlFor="docUrl" className="block text-sm font-medium text-gray-700">
              Document URL
            </label>
            <input
              type="url"
              id="docUrl"
              value={newDocument.url}
              onChange={(e) => setNewDocument({ ...newDocument, url: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="docDisclaimer" className="block text-sm font-medium text-gray-700">
              Disclaimer
            </label>
            <input
              type="text"
              id="docDisclaimer"
              value={newDocument.disclaimer}
              onChange={(e) => setNewDocument({ ...newDocument, disclaimer: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
            >
              Add Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 