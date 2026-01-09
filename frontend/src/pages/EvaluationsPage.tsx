import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { FiPlus, FiFileText, FiCheckCircle } from 'react-icons/fi';

export const EvaluationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'evaluations' | 'notes'>('evaluations');

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Évaluations</h1>
            <p className="mt-2 text-gray-600">
              Gérez les évaluations et les notes des apprenants
            </p>
          </div>
          <Button>
            <FiPlus className="mr-2" />
            Nouvelle évaluation
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('evaluations')}
              className={`${
                activeTab === 'evaluations'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Évaluations
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`${
                activeTab === 'notes'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Saisie des notes
            </button>
          </nav>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">0</p>
                <p className="text-sm text-gray-600 mt-1">Total évaluations</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">0</p>
                <p className="text-sm text-gray-600 mt-1">En attente</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-600 mt-1">Terminées</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-600 mt-1">Moyenne générale</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        {activeTab === 'evaluations' ? (
          <Card>
            <CardHeader>
              <CardTitle>Liste des évaluations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Aucune évaluation
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Commencez par créer une nouvelle évaluation
                </p>
                <div className="mt-6">
                  <Button>
                    <FiPlus className="mr-2" />
                    Créer une évaluation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Saisie des notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FiCheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Aucune note à saisir
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Les notes des évaluations en cours apparaîtront ici
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <FiCheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Aucune activité récente
                  </p>
                  <p className="text-sm text-gray-500">
                    L'historique des évaluations apparaîtra ici
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
