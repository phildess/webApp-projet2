import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  FiFileText,
  FiDownload,
  FiCalendar,
  FiUsers,
  FiBook,
  FiTrendingUp,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
}

export const ReportsSection: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [generating, setGenerating] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);

  const reportTypes: ReportType[] = [
    {
      id: 'users',
      name: 'Rapport utilisateurs',
      description: 'Liste complète des utilisateurs avec statistiques',
      icon: FiUsers,
      color: 'text-blue-600',
    },
    {
      id: 'formations',
      name: 'Rapport formations',
      description: 'Statistiques sur les formations et inscriptions',
      icon: FiBook,
      color: 'text-green-600',
    },
    {
      id: 'attendance',
      name: 'Rapport de présence',
      description: 'Taux de présence des apprenants par formation',
      icon: FiCalendar,
      color: 'text-purple-600',
    },
    {
      id: 'performance',
      name: 'Rapport de performance',
      description: 'Statistiques des évaluations et notes',
      icon: FiTrendingUp,
      color: 'text-yellow-600',
    },
  ];

  const quickStats = [
    {
      label: 'Nouveaux utilisateurs (30j)',
      value: '24',
      change: '+12%',
      positive: true,
    },
    {
      label: 'Formations complétées',
      value: '18',
      change: '+8%',
      positive: true,
    },
    {
      label: 'Taux de présence moyen',
      value: '94%',
      change: '+3%',
      positive: true,
    },
    {
      label: 'Moyenne des évaluations',
      value: '15.2/20',
      change: '+0.5',
      positive: true,
    },
  ];

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      toast.error('Veuillez sélectionner un type de rapport');
      return;
    }

    try {
      setGenerating(true);
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const reportName = reportTypes.find((r) => r.id === selectedReport)?.name;
      const formatExt = exportFormat === 'excel' ? 'xlsx' : exportFormat;

      toast.success(`${reportName} généré avec succès (format: ${exportFormat.toUpperCase()}, graphiques: ${includeCharts ? 'inclus' : 'exclus'})`);

      // Simulate download
      const blob = new Blob(['Contenu du rapport simulé'], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedReport}_${startDate}_${endDate}.${formatExt}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Erreur lors de la génération du rapport');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReport = (reportName: string, reportType: string) => {
    toast.success(`Téléchargement de "${reportName}"`);
    // Simulate download
    const blob = new Blob(['Contenu du rapport'], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName}.${reportType.toLowerCase()}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <div className="flex items-baseline justify-between mt-2">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <span
                    className={`text-sm font-medium ${
                      stat.positive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Generator */}
      <Card>
        <CardHeader>
          <CardTitle>Générer un rapport</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Report Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type de rapport
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  return (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReport(report.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        selectedReport === report.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start">
                        <Icon className={`h-6 w-6 ${report.color} mr-3 mt-0.5`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{report.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-end">
              <Button onClick={handleGenerateReport} loading={generating}>
                <FiDownload className="mr-2" />
                Générer et télécharger le rapport
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: 'Rapport utilisateurs - Décembre 2025',
                date: '2026-01-08',
                size: '1.2 MB',
                type: 'PDF',
              },
              {
                name: 'Rapport formations - Décembre 2025',
                date: '2026-01-07',
                size: '2.5 MB',
                type: 'PDF',
              },
              {
                name: 'Rapport de présence - Novembre 2025',
                date: '2025-12-30',
                size: '890 KB',
                type: 'Excel',
              },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <FiFileText className="h-8 w-8 text-gray-400" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{report.name}</h4>
                    <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                      <span>{new Date(report.date).toLocaleDateString('fr-FR')}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                        {report.type}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDownloadReport(report.name, report.type)}
                >
                  <FiDownload className="mr-1" />
                  Télécharger
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Options d'export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Format par défaut</h4>
                <p className="text-sm text-gray-500">Format utilisé pour les exports</p>
              </div>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel (.xlsx)</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Inclure les graphiques</h4>
                <p className="text-sm text-gray-500">
                  Ajouter des graphiques visuels aux rapports
                </p>
              </div>
              <button
                onClick={() => setIncludeCharts(!includeCharts)}
                className={`${
                  includeCharts ? 'bg-primary-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    includeCharts ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
