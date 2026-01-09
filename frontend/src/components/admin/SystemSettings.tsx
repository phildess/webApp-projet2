import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { FiSave, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface SystemSettings {
  siteName: string;
  siteUrl: string;
  contactEmail: string;
  maxUploadSize: number;
  sessionTimeout: number;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
}

export const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'Centre de Formation pour Adultes',
    siteUrl: 'http://localhost',
    contactEmail: 'contact@centre-formation.com',
    maxUploadSize: 10,
    sessionTimeout: 30,
    maintenanceMode: false,
    registrationEnabled: true,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Paramètres enregistrés avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Réinitialiser tous les paramètres par défaut ?')) {
      setSettings({
        siteName: 'Centre de Formation pour Adultes',
        siteUrl: 'http://localhost',
        contactEmail: 'contact@centre-formation.com',
        maxUploadSize: 10,
        sessionTimeout: 30,
        maintenanceMode: false,
        registrationEnabled: true,
      });
      toast.success('Paramètres réinitialisés');
    }
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres généraux</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du site
              </label>
              <Input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                placeholder="Nom de votre centre de formation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL du site
              </label>
              <Input
                type="url"
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                placeholder="https://exemple.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de contact
              </label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                placeholder="contact@exemple.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres techniques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taille maximale des uploads (Mo)
              </label>
              <Input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) =>
                  setSettings({ ...settings, maxUploadSize: parseInt(e.target.value) })
                }
                min="1"
                max="100"
              />
              <p className="text-sm text-gray-500 mt-1">
                Taille maximale des fichiers pouvant être uploadés
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeout de session (minutes)
              </label>
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) =>
                  setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })
                }
                min="5"
                max="120"
              />
              <p className="text-sm text-gray-500 mt-1">
                Durée avant déconnexion automatique en cas d'inactivité
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Fonctionnalités</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Mode maintenance</h4>
                <p className="text-sm text-gray-500">
                  Afficher une page de maintenance aux utilisateurs
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })
                }
                className={`${
                  settings.maintenanceMode ? 'bg-primary-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Inscription ouverte</h4>
                <p className="text-sm text-gray-500">
                  Autoriser les nouvelles inscriptions d'utilisateurs
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({ ...settings, registrationEnabled: !settings.registrationEnabled })
                }
                className={`${
                  settings.registrationEnabled ? 'bg-primary-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.registrationEnabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={handleReset}>
          <FiRefreshCw className="mr-2" />
          Réinitialiser
        </Button>
        <Button onClick={handleSave} loading={saving}>
          <FiSave className="mr-2" />
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
};
