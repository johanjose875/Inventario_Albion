import React from 'react';
import { User, Role } from '../types';
import { Shield, ShieldAlert, User as UserIcon } from 'lucide-react';
import { updateUserRole } from '../services/storageService';

interface UserManagementProps {
  users: User[];
  currentUser: User;
  onUpdate: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, currentUser, onUpdate }) => {
  const handleToggleAdmin = (targetUser: User) => {
    if (targetUser.username === 'admin') return; // Cannot change default admin
    const newRole = targetUser.role === Role.ADMIN ? Role.USER : Role.ADMIN;
    updateUserRole(targetUser.username, newRole);
    onUpdate();
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="text-indigo-400" /> Gestión de Usuarios
        </h2>
        <span className="text-xs text-slate-500">Solo administradores pueden ver esto</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-sm">
              <th className="p-4">Usuario</th>
              <th className="p-4">Rol Actual</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.username} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="p-4 flex items-center gap-3">
                  <div className="bg-slate-700 p-2 rounded-full">
                    <UserIcon size={16} className="text-slate-300" />
                  </div>
                  <span className="font-medium text-slate-200">
                    {user.username} {user.username === currentUser.username && '(Tú)'}
                  </span>
                </td>
                <td className="p-4">
                  {user.role === Role.ADMIN ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">
                      <Shield size={12} /> ADMINISTRADOR
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-600/20 text-slate-400 text-xs font-medium border border-slate-600/30">
                      USUARIO
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {user.username !== 'admin' && user.username !== currentUser.username && (
                     <button
                       onClick={() => handleToggleAdmin(user)}
                       className={`text-xs px-3 py-1.5 rounded transition-colors border ${
                         user.role === Role.ADMIN 
                          ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' 
                          : 'border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10'
                       }`}
                     >
                       {user.role === Role.ADMIN ? 'Quitar Admin' : 'Hacer Admin'}
                     </button>
                  )}
                  {user.username === 'admin' && (
                    <span className="text-xs text-slate-600 italic">Sistema</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;