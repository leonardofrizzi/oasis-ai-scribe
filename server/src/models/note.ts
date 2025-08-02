export interface Note {
  id: number;
  patientId: number;
  transcriptRaw: string;
  transcriptText?: string;
  oasisFields: Record<string, any>;
  createdAt: Date;
}