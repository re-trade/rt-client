export interface BaseSignalData {
  type: 'offer' | 'answer' | 'ice-candidate' | 'signal';
  data: any;
  roomId: string;
}

export interface ClientSignalData extends BaseSignalData {
  to: string;
}

export type SignalData = ClientSignalData;
