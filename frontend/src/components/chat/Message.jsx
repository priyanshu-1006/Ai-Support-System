import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Button } from '../ui/Button.jsx';

export function Message({ message, isUser }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md rounded-lg p-4 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-gray-100'
        }`}
      >
        {isUser ? (
          <p className="text-sm">{message.content}</p>
        ) : (
          <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                code: ({ inline, className, children }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="relative bg-gray-900 rounded text-white p-4 my-2 overflow-x-auto">
                      <SyntaxHighlighter
                        language={match[1]}
                        style={{}}
                        customStyle={{ margin: 0, background: 'transparent' }}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            String(children).replace(/\n$/, '')
                          )
                        }
                        className="absolute top-2 right-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                      >
                        Copy
                      </button>
                    </div>
                  ) : (
                    <code className="bg-gray-100 rounded px-2 py-1">
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {!isUser && (
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={copyToClipboard}
              className="text-xs"
            >
              Copy
            </Button>
            {message.sources?.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="text-xs"
              >
                Sources ({message.sources.length})
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
