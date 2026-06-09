import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../../api/endpoints.js';
import { Card, CardBody, CardHeader } from '../ui/Card.jsx';
import { Spinner } from '../ui/Loading.jsx';
import { Alert } from '../ui/Alert.jsx';

export function AnalyticsDashboard() {
  const { data: overview, isLoading: overviewLoading, error: overviewError } = useQuery({
    queryKey: ['analyticsOverview'],
    queryFn: () => adminAPI.getAnalyticsOverview(),
    select: (response) => response.data.data,
  });

  const { data: modelUsage, isLoading: modelLoading } = useQuery({
    queryKey: ['modelUsage'],
    queryFn: () => adminAPI.getModelUsage(),
    select: (response) => response.data.data,
  });

  if (overviewLoading || modelLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {overviewError && (
        <Alert type="error" message="Failed to load analytics" />
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">
              {overview?.totalUsers || 0}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-gray-600 text-sm">Active Users (Today)</p>
            <p className="text-3xl font-bold text-gray-900">
              {overview?.activeUsers || 0}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-gray-600 text-sm">Total Conversations</p>
            <p className="text-3xl font-bold text-gray-900">
              {overview?.totalConversations || 0}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-gray-600 text-sm">Avg Response Time</p>
            <p className="text-3xl font-bold text-gray-900">
              {overview?.avgResponseTime?.toFixed(2) || 0}s
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Model Usage */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Model Usage</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {modelUsage && Object.entries(modelUsage).map(([model, stats]) => (
              <div key={model}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-900">{model}</span>
                  <span className="text-sm text-gray-600">
                    {stats.usageCount} requests • {stats.tokensUsed?.toLocaleString() || 0} tokens
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (stats.usageCount /
                          (Object.values(modelUsage).reduce(
                            (sum, s) => sum + s.usageCount,
                            0
                          ) || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
