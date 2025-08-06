import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

export function Dashboard() {
  const userData = useQuery(api.users.getCurrentUserData);
  const [activeCharacter, setActiveCharacter] = useState<"c1" | "c2">("c1");

  if (userData === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Welcome to Law Town RP</h2>
        <p className="text-gray-300 mb-6">No character data found. Contact an administrator to set up your account.</p>
      </div>
    );
  }

  const character = userData[activeCharacter];

  return (
    <div className="space-y-6">
      {/* Character Selector */}
      <div className="bg-red-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Character Selection</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveCharacter("c1")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeCharacter === "c1"
                ? "bg-red-600 text-white"
                : "bg-red-700 text-red-200 hover:bg-red-600"
            }`}
          >
            Character 1
          </button>
          <button
            onClick={() => setActiveCharacter("c2")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeCharacter === "c2"
                ? "bg-red-600 text-white"
                : "bg-red-700 text-red-200 hover:bg-red-600"
            }`}
          >
            Character 2
          </button>
        </div>
      </div>

      {/* Character Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-red-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Cash</h3>
          <p className="text-3xl font-bold text-green-400">${character.cash.toLocaleString()}</p>
        </div>
        
        <div className="bg-red-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Bank</h3>
          <p className="text-3xl font-bold text-blue-400">${character.bank.toLocaleString()}</p>
        </div>
        
        <div className="bg-red-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${character.status ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-white">{character.status ? 'Online' : 'Offline'}</span>
          </div>
        </div>
        
        <div className="bg-red-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Jail Time</h3>
          <p className="text-3xl font-bold text-orange-400">{character.jail}</p>
        </div>
      </div>

      {/* Police Points */}
      <div className="bg-red-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Police Points</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {character.police_points.map((point, index) => (
            <div key={index} className="bg-red-700 rounded-lg p-4">
              <h4 className="text-white font-medium capitalize">{point.name.replace('_', ' ')}</h4>
              <p className="text-2xl font-bold text-red-200">{point.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Points */}
      <div className="bg-red-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Overall Points</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-red-700 rounded-lg p-4">
            <h4 className="text-white font-medium">GMC</h4>
            <p className="text-2xl font-bold text-red-200">{userData.points.gmc}</p>
          </div>
          <div className="bg-red-700 rounded-lg p-4">
            <h4 className="text-white font-medium">Start Game</h4>
            <p className="text-2xl font-bold text-red-200">{userData.points.start_game}</p>
          </div>
          <div className="bg-red-700 rounded-lg p-4">
            <h4 className="text-white font-medium">Join Game</h4>
            <p className="text-2xl font-bold text-red-200">{userData.points.join_game}</p>
          </div>
          <div className="bg-red-700 rounded-lg p-4">
            <h4 className="text-white font-medium">Take Ticket</h4>
            <p className="text-2xl font-bold text-red-200">{userData.points.take_ticket}</p>
          </div>
        </div>
      </div>

      {/* Character Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-red-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Inventory</h3>
          {character.inv.length > 0 ? (
            <div className="space-y-2">
              {character.inv.map((item, index) => (
                <div key={index} className="bg-red-700 rounded p-3 text-white flex justify-between">
                  <span className="capitalize">{item.name?.charAt(0).toUpperCase() + item.name?.slice(1) || 'Unknown Item'}</span>
                  <span className="font-bold">{item.count || 1}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-200">No items in inventory</p>
          )}
        </div>

        <div className="bg-red-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Vehicles</h3>
          {character.cars.length > 0 ? (
            <div className="space-y-2">
              {character.cars.map((car, index) => (
                <div key={index} className="bg-red-700 rounded p-3 text-white">
                  <div className="flex justify-between items-center">
                    <span className="capitalize">{car.model || car.name || 'Unknown Vehicle'}</span>
                    <span className="text-sm text-red-200">{car.plate || 'No Plate'}</span>
                  </div>
                  {car.color && <div className="text-sm text-red-300">Color: {car.color}</div>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-200">No vehicles owned</p>
          )}
        </div>
      </div>

      {/* Character Status */}
      <div className="bg-red-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Character Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-red-700 rounded-lg p-4">
            <h4 className="text-white font-medium">Clamped</h4>
            <p className="text-lg text-red-200">{character.clamped ? 'Yes' : 'No'}</p>
          </div>
          <div className="bg-red-700 rounded-lg p-4">
            <h4 className="text-white font-medium">Time Left</h4>
            <p className="text-lg text-red-200">{character.timeLeft} mins</p>
          </div>
          <div className="bg-red-700 rounded-lg p-4">
            <h4 className="text-white font-medium">Buildings</h4>
            <p className="text-lg text-red-200">{character.builds.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
