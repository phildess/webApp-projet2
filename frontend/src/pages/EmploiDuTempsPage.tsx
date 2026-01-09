import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { FiPlus, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface EmploiDuTemps {
  id: string;
  titre: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  session: {
    formation: {
      titre: string;
    };
  };
  salle?: {
    nom: string;
  };
  formateur?: {
    user: {
      nom: string;
      prenom: string;
    };
  };
}

export const EmploiDuTempsPage: React.FC = () => {
  const [emploisDuTemps, setEmploisDuTemps] = useState<EmploiDuTemps[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    fetchEmploiDuTemps();
  }, [selectedDate]);

  const fetchEmploiDuTemps = async () => {
    try {
      setLoading(true);
      const response = await api.get('/emploi-du-temps', {
        params: { dateDebut: selectedDate },
      });
      setEmploisDuTemps(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'emploi du temps:', error);
      toast.error('Impossible de charger l\'emploi du temps');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emploi du temps</h1>
            <p className="mt-2 text-gray-600">Planning des cours et des sessions</p>
          </div>
          <Button>
            <FiPlus className="mr-2" />
            Ajouter un créneau
          </Button>
        </div>

        {/* Date Selector */}
        <Card>
          <CardContent>
            <div className="flex items-center space-x-4">
              <FiCalendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Button
                variant="secondary"
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              >
                Aujourd'hui
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Schedule View */}
        <Card>
          <CardHeader>
            <CardTitle>{formatDate(selectedDate)}</CardTitle>
          </CardHeader>
          <CardContent>
            {emploisDuTemps.length > 0 ? (
              <div className="space-y-4">
                {emploisDuTemps.map((item) => (
                  <div
                    key={item.id}
                    className="border-l-4 border-primary-500 pl-4 py-3 hover:bg-gray-50 rounded-r-lg transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{item.titre}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.session.formation.titre}
                        </p>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FiClock className="mr-2 h-4 w-4" />
                            {formatTime(item.dateDebut)} - {formatTime(item.dateFin)}
                          </div>
                          {item.salle && (
                            <div className="flex items-center">
                              <FiMapPin className="mr-2 h-4 w-4" />
                              {item.salle.nom}
                            </div>
                          )}
                          {item.formateur && (
                            <div className="flex items-center">
                              <span className="font-medium">
                                {item.formateur.user.prenom} {item.formateur.user.nom}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun cours prévu</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Aucun cours n'est planifié pour cette date
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
