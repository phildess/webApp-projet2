import api from './api';
import { Formation, SessionFormation, Inscription } from '@/types';

export const formationService = {
  async getAllFormations(params?: {
    niveau?: string;
    domaine?: string;
    search?: string;
  }): Promise<Formation[]> {
    const { data } = await api.get<Formation[]>('/formations', { params });
    return data;
  },

  async getFormationById(id: string): Promise<Formation> {
    const { data } = await api.get<Formation>(`/formations/${id}`);
    return data;
  },

  async createFormation(formationData: Partial<Formation>): Promise<Formation> {
    const { data } = await api.post<{ formation: Formation }>('/formations', formationData);
    return data.formation;
  },

  async updateFormation(id: string, formationData: Partial<Formation>): Promise<Formation> {
    const { data } = await api.put<{ formation: Formation }>(`/formations/${id}`, formationData);
    return data.formation;
  },

  async deleteFormation(id: string): Promise<void> {
    await api.delete(`/formations/${id}`);
  },

  async createSession(
    formationId: string,
    sessionData: Partial<SessionFormation>
  ): Promise<SessionFormation> {
    const { data } = await api.post<{ session: SessionFormation }>(
      `/formations/${formationId}/sessions`,
      sessionData
    );
    return data.session;
  },

  async inscrireApprenant(sessionId: string, apprenantId: string): Promise<Inscription> {
    const { data } = await api.post<{ inscription: Inscription }>(
      `/formations/sessions/${sessionId}/inscrire`,
      { apprenantId }
    );
    return data.inscription;
  },
};
