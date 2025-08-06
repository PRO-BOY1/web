import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { AdminPanel } from "./AdminPanel";

export function Sidebar() {
  const serverInfo = useQuery(api.admin.getServerInfo);
  const serverUpdates = useQuery(api.admin.getServerUpdates);

  return (
    <div className="w-80 bg-red-900 shadow-xl border-l border-red-700">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Server Info</h2>
        
        <AdminPanel />
        
        <div className="space-y-4">
          <div className="bg-red-800 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">Server Status</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-red-100">Offline</span>
            </div>
            <p className="text-red-200 text-sm mt-1">
              Players: {serverInfo?.currentPlayers || 0}/{serverInfo?.maxPlayers || 64}
            </p>
          </div>
          
          <div className="bg-red-800 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">Quick Links</h3>
            <div className="space-y-2">
              <a 
                href={serverInfo?.discordLink || "https://discord.gg/lawtown"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-red-200 hover:text-white transition-colors"
              >
                Discord Server
              </a>
              <a 
                href={serverInfo?.rulesLink || "#"} 
                className="block text-red-200 hover:text-white transition-colors"
              >
                Rules & Guidelines
              </a>
              <a 
                href={serverInfo?.supportLink || "#"} 
                className="block text-red-200 hover:text-white transition-colors"
              >
                Support Tickets
              </a>
              <a 
                href={serverInfo?.donationLink || "#"} 
                className="block text-red-200 hover:text-white transition-colors"
              >
                Donation Store
              </a>
            </div>
          </div>

          <div className="bg-red-800 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">Recent Updates</h3>
            <div className="space-y-2 text-sm">
              {serverUpdates && serverUpdates.length > 0 ? (
                serverUpdates.map((update) => (
                  <div key={update._id} className="text-red-200">
                    <span className="text-white">{update.version}</span> - {update.description}
                  </div>
                ))
              ) : (
                <>
                  <div className="text-red-200">
                    <span className="text-white">v2.1.0</span> - New police system
                  </div>
                  <div className="text-red-200">
                    <span className="text-white">v2.0.5</span> - Bug fixes
                  </div>
                  <div className="text-red-200">
                    <span className="text-white">v2.0.0</span> - Major update
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
