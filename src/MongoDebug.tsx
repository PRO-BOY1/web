import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

export function MongoDebug() {
  const [showDebug, setShowDebug] = useState(false);
  const testConnection = useAction(api.mongodb.testMongoConnection);
  const getAdminDetails = useAction(api.mongodb.getAdminDetails);
  const [connectionResult, setConnectionResult] = useState<any>(null);
  const [adminDetails, setAdminDetails] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const result = await testConnection();
      setConnectionResult(result);
      
      // Also get admin details
      const adminResult = await getAdminDetails();
      setAdminDetails(adminResult);
    } catch (error) {
      setConnectionResult({ 
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-600">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="text-sm text-gray-400 hover:text-white"
      >
        {showDebug ? 'Hide' : 'Show'} Debug Info
      </button>
      
      {showDebug && (
        <div className="mt-4 space-y-4">
          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Test MongoDB Connection'}
          </button>
          
          {connectionResult && (
            <div className="bg-gray-800 p-4 rounded text-sm text-white overflow-auto max-h-64">
              <pre>{JSON.stringify(connectionResult, null, 2)}</pre>
            </div>
          )}
          
          {adminDetails && (
            <div className="bg-gray-800 p-4 rounded text-sm text-white overflow-auto max-h-64">
              <h4 className="text-white font-medium mb-2">Admin User Details:</h4>
              <pre>{JSON.stringify(adminDetails, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
