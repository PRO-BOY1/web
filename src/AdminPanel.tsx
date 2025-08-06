import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

export function AdminPanel() {
  const isAdmin = useQuery(api.admin.isAdmin);
  const addUpdate = useMutation(api.admin.addServerUpdate);
  const updateInfo = useMutation(api.admin.updateServerInfo);
  
  const [newVersion, setNewVersion] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [discordLink, setDiscordLink] = useState("");
  const [currentPlayers, setCurrentPlayers] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");

  if (!isAdmin) {
    return null;
  }

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersion || !newDescription) return;
    
    setSubmitting(true);
    try {
      await addUpdate({
        version: newVersion,
        description: newDescription,
      });
      setNewVersion("");
      setNewDescription("");
      toast.success("Server update added successfully!");
    } catch (error) {
      toast.error("Failed to add update");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateServerInfo = async (key: string, value: string) => {
    try {
      await updateInfo({ key, value });
      toast.success(`${key} updated successfully!`);
    } catch (error) {
      toast.error(`Failed to update ${key}`);
    }
  };

  return (
    <div className="bg-yellow-800 rounded-lg p-6 mb-6">
      <h3 className="text-white font-medium mb-4">🔧 Admin Panel</h3>
      
      {/* Add Server Update */}
      <div className="mb-6">
        <h4 className="text-white text-sm font-medium mb-2">Add Server Update</h4>
        <form onSubmit={handleAddUpdate} className="space-y-2">
          <input
            type="text"
            value={newVersion}
            onChange={(e) => setNewVersion(e.target.value)}
            placeholder="Version (e.g., v2.2.0)"
            className="w-full px-3 py-2 bg-yellow-700 text-white rounded text-sm"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description (use \n for new lines)"
            rows={3}
            className="w-full px-3 py-2 bg-yellow-700 text-white rounded text-sm resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !newVersion || !newDescription}
            className="w-full px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-500 disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Update"}
          </button>
        </form>
      </div>

      {/* Update Server Info */}
      <div className="space-y-2">
        <h4 className="text-white text-sm font-medium">Update Server Info</h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={currentPlayers}
            onChange={(e) => setCurrentPlayers(e.target.value)}
            placeholder="Current Players"
            className="px-3 py-2 bg-yellow-700 text-white rounded text-sm"
          />
          <button
            onClick={() => handleUpdateServerInfo("currentPlayers", currentPlayers)}
            disabled={!currentPlayers}
            className="px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-500 disabled:opacity-50"
          >
            Update
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={discordLink}
            onChange={(e) => setDiscordLink(e.target.value)}
            placeholder="Discord Link"
            className="px-3 py-2 bg-yellow-700 text-white rounded text-sm"
          />
          <button
            onClick={() => handleUpdateServerInfo("discordLink", discordLink)}
            disabled={!discordLink}
            className="px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-500 disabled:opacity-50"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
