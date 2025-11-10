import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { FiBook, FiUsers, FiCalendar, FiAward } from 'react-icons/fi';
import { Role } from '@/types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Formations',
      value: '12',
      icon: FiBook,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Apprenants',
      value: '145',
      icon: FiUsers,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Sessions',
      value: '8',
      icon: FiCalendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Certifications',
      value: '92',
      icon: FiAward,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-2 text-gray-600">
            Bienvenue, {user?.prenom} {user?.nom} ({user?.role})
          </p>
        </div>

        {/* Stats Grid */}
        {user?.role === Role.ADMIN && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.name} hover>
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Activités récentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiBook className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Nouvelle formation ajoutée
                    </p>
                    <p className="text-sm text-gray-500">Il y a 2 heures</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <FiUsers className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      5 nouveaux apprenants inscrits
                    </p>
                    <p className="text-sm text-gray-500">Il y a 5 heures</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prochaines sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-primary-500 pl-4">
                  <p className="text-sm font-medium text-gray-900">
                    Développement Web Full Stack
                  </p>
                  <p className="text-sm text-gray-500">Début: 15 janvier 2025</p>
                  <p className="text-sm text-gray-500">15 places disponibles</p>
                </div>
                <div className="border-l-4 border-secondary-500 pl-4">
                  <p className="text-sm font-medium text-gray-900">
                    Marketing Digital
                  </p>
                  <p className="text-sm text-gray-500">Début: 1 février 2025</p>
                  <p className="text-sm text-gray-500">18 places disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
