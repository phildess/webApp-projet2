import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { FiDatabase, FiDownload, FiUpload, FiTrash2, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Backup {
  id: string;
  filename: string;
  size: string;
  date: string;
  type: 'auto' | 'manual';
}

export const DatabaseBackup: React.FC = () => {
  const [backups, setBackups] = useState<Backup[]>([
    {
      id: '1',
      filename: 'backup_2026-01-09_auto.sql',
      size: '2.4 MB',
      date: '2026-01-09T08:00:00',
      type: 'auto',
    },
    {
      id: '2',
      filename: 'backup_2026-01-08_auto.sql',
      size: '2.3 MB',
      date: '2026-01-08T08:00:00',
      type: 'auto',
    },
    {
      id: '3',
      filename: 'backup_2026-01-07_manual.sql',
      size: '2.3 MB',
      date: '2026-01-07T14:30:00',
      type: 'manual',
    },
  ]);

  const [creating, setCreating] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');

  const handleCreateBackup = async () => {
    try {
      setCreating(true);
      // Simulate backup creation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newBackup: Backup = {
        id: Date.now().toString(),
        filename: `backup_${new Date().toISOString().split('T')[0]}_manual.sql`,
        size: '2.5 MB',
        date: new Date().toISOString(),
        type: 'manual',
      };

      setBackups([newBackup, ...backups]);
      toast.success('Sauvegarde créée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création de la sauvegarde');
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = (backup: Backup) => {
    toast.success(`Téléchargement de ${backup.filename}`);
    // Simulate download
  };

  const handleRestore = (backup: Backup) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir restaurer la sauvegarde ${backup.filename} ? Cette action remplacera toutes les données actuelles.`
      )
    ) {
      toast('Restauration en cours... (fonctionnalité simulée)');
    }
  };

  const handleDelete = (backupId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette sauvegarde ?')) {
      setBackups(backups.filter((b) => b.id !== backupId));
      toast.success('Sauvegarde supprimée');
    }
  };

  return (
    <div className="space-y-6">
      {/* Backup Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions de sauvegarde</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleCreateBackup} loading={creating} className="w-full">
              <FiDatabase className="mr-2" />
              Créer une sauvegarde maintenant
            </Button>
            <Button variant="secondary" className="w-full">
              <FiUpload className="mr-2" />
              Importer une sauvegarde
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            La création d'une sauvegarde peut prendre plusieurs minutes selon la taille de votre
            base de données.
          </p>
        </CardContent>
      </Card>

      {/* Auto Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Sauvegardes automatiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Activer les sauvegardes automatiques
                </h4>
                <p className="text-sm text-gray-500">
                  Créer automatiquement des sauvegardes selon la fréquence définie
                </p>
              </div>
              <button
                onClick={() => setAutoBackupEnabled(!autoBackupEnabled)}
                className={`${
                  autoBackupEnabled ? 'bg-primary-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    autoBackupEnabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>

            {autoBackupEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fréquence des sauvegardes
                </label>
                <select
                  value={backupFrequency}
                  onChange={(e) => setBackupFrequency(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="hourly">Toutes les heures</option>
                  <option value="daily">Quotidienne (recommandé)</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuelle</option>
                </select>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <FiClock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-900">
                    Prochaine sauvegarde automatique
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {autoBackupEnabled
                      ? 'Demain à 08:00'
                      : 'Les sauvegardes automatiques sont désactivées'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backups List */}
      <Card>
        <CardHeader>
          <CardTitle>Sauvegardes disponibles ({backups.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backups.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FiDatabase className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{backup.filename}</h4>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>{backup.size}</span>
                      <span>•</span>
                      <span>{new Date(backup.date).toLocaleString('fr-FR')}</span>
                      <span>•</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          backup.type === 'auto'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {backup.type === 'auto' ? 'Automatique' : 'Manuelle'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownload(backup)}
                  >
                    <FiDownload className="mr-1" />
                    Télécharger
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRestore(backup)}
                  >
                    <FiUpload className="mr-1" />
                    Restaurer
                  </Button>
                  <button
                    onClick={() => handleDelete(backup.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {backups.length === 0 && (
            <div className="text-center py-12">
              <FiDatabase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune sauvegarde</h3>
              <p className="mt-1 text-sm text-gray-500">
                Créez votre première sauvegarde pour protéger vos données
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Storage Info */}
      <Card>
        <CardHeader>
          <CardTitle>Stockage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Espace utilisé par les sauvegardes</span>
              <span className="font-medium text-gray-900">7.0 MB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Espace disponible</span>
              <span className="font-medium text-gray-900">4.5 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full"
                style={{ width: '0.15%' }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              Il est recommandé de conserver au moins 3 sauvegardes récentes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
