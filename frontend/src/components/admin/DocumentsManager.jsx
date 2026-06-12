import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentAPI } from '../../api/endpoints.js';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { Card, CardBody, CardHeader } from '../ui/Card.jsx';
import { Alert } from '../ui/Alert.jsx';
import { Spinner } from '../ui/Loading.jsx';

export function DocumentsManager() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading, error } = useQuery({
    queryKey: ['documents', search, status],
    queryFn: () => documentAPI.list(20, 0, status, search),
    select: (response) => response.data.data?.documents || [],
  });

  const deleteDoc = useMutation({
    mutationFn: (docId) => documentAPI.delete(docId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Knowledge Base</h2>
        </CardHeader>
        <CardBody>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Status</option>
              <option value="ready">Ready</option>
              <option value="processing">Processing</option>
              <option value="error">Error</option>
            </select>
          </div>

          {error && <Alert type="error" message="Failed to load documents" />}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 text-left font-semibold">Title</th>
                  <th className="px-4 py-2 text-left font-semibold">Size</th>
                  <th className="px-4 py-2 text-left font-semibold">Chunks</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-4 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No documents found
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2">{doc.title}</td>
                      <td className="px-4 py-2">
                        {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                      </td>
                      <td className="px-4 py-2">{doc.chunkCount}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            doc.status === 'ready'
                              ? 'bg-green-100 text-green-800'
                              : doc.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => deleteDoc.mutate(doc.id)}
                          disabled={deleteDoc.isPending}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
