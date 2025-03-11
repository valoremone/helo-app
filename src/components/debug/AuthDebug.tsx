import { auth } from '@/lib/better-auth';
import { useEffect, useState, useRef } from 'react';

export function AuthDebug() {
  const [status, setStatus] = useState('Initializing');
  const [renderCount, setRenderCount] = useState(0);
  const session = auth.useSession();
  const lastSessionRef = useRef<any>(null);
  
  // Track render counts to detect looping
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  }, []);
  
  // Track session changes
  useEffect(() => {
    const currentSessionJSON = JSON.stringify({
      isPending: session.isPending,
      hasError: !!session.error,
      hasData: !!session.data,
      data: session.data ? { 
        userId: session.data.user?.id,
        sessionId: session.data.session?.id
      } : null
    });
    
    const lastSessionJSON = lastSessionRef.current;
    
    if (lastSessionJSON !== currentSessionJSON) {
      console.log(`[AuthDebug] Session changed (render #${renderCount}):`, { 
        isPending: session.isPending,
        hasError: !!session.error,
        hasData: !!session.data
      });
      
      lastSessionRef.current = currentSessionJSON;
      
      setStatus(session.isPending 
        ? 'Loading' 
        : session.error 
          ? `Error: ${session.error.message}` 
          : session.data 
            ? `Authenticated as ${session.data.user?.email || 'unknown'}`
            : 'Not Authenticated');
    }
  }, [session, renderCount]);

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Auth Status</h3>
        <span className="px-2 py-1 text-xs rounded bg-gray-700">Renders: {renderCount}</span>
      </div>
      <div className="text-sm font-medium mb-2">{status}</div>
      <pre className="text-xs mt-2 max-h-32 overflow-auto">
        {JSON.stringify({
          isPending: session.isPending,
          hasError: !!session.error,
          hasData: !!session.data,
          path: window.location.pathname
        }, null, 2)}
      </pre>
      <div className="mt-2 flex space-x-2">
        <button 
          onClick={() => window.location.reload()} 
          className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
        >
          Reload
        </button>
        <button 
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
          }} 
          className="px-2 py-1 bg-red-600 text-white text-xs rounded"
        >
          Clear Storage
        </button>
      </div>
    </div>
  );
} 