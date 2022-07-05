export interface ITransaction {
  ID: string;
  Amount: number;
  currency: string;
  customerEmail: string;
  SplitInfo: Array<ISplitInfo>;
}

interface ISplitInfo {
  SplitType: 'FLAT' | 'RATIO' | 'PERCENTAGE';
  SplitValue: number;
  SplitEntityId: string;
}
