import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  FiSettings,
  FiUsers,
  FiDatabase,
  FiShield,
  FiMail,
  FiFileText,
} from 'react-icons/fi';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'system'>('general');

  const adminSections = [
    {
      title: 'Gestion des utilisateurs',
      description: 'Gérer les comptes utilisateurs et les permissions',
      icon: FiUsers,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Base de données',
      description: 'Sauvegarde et maintenance de la base de données',
      icon: FiDatabase,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Sécurité',
      description: 'Paramètres de sécurité et authentification',
      icon: FiShield,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Notifications',
      description: 'Configuration des emails et notifications',
      icon: FiMail,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Rapports',
      description: 'Génération de rapports et statistiques',
      icon: FiFileText,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Configuration',
      description: 'Paramètres généraux de l\'application',
      icon: FiSettings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          <p className="mt-2 text-gray-600">
            Configuration et paramètres du système
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('general')}
              className={`${
                activeTab === 'general'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Général
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Utilisateurs
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`${
                activeTab === 'system'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Système
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'general' && (
          <>
            {/* Admin Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminSections.map((section) => {
                const Icon = section.icon;
                return (
                  <Card key={section.title} hover>
                    <CardContent>
                      <div className="flex items-center mb-4">
                        <div className={`p-3 rounded-lg ${section.bgColor}`}>
                          <Icon className={`h-6 w-6 ${section.color}`} />
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">{section.description}</p>
                      <Button variant="secondary" size="sm">
                        Configurer
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* System Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informations système</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Version</dt>
                    <dd className="mt-1 text-sm text-gray-900">1.0.0</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Environnement</dt>
                    <dd className="mt-1 text-sm text-gray-900">Production</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Base de données</dt>
                    <dd className="mt-1 text-sm text-gray-900">PostgreSQL 14</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Dernière sauvegarde</dt>
                    <dd className="mt-1 text-sm text-gray-900">-</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Gestion des utilisateurs
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Interface de gestion des utilisateurs en construction
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'system' && (
          <Card>
            <CardHeader>
              <CardTitle>Paramètres système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FiSettings className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Configuration système
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Interface de configuration système en construction
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};
