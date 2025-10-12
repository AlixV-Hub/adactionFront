export interface WasteCollectItem {
  wasteTypeId: number;
  quantity: number;
}

export interface Collect {
  collectionDate: string;
  cityId: number;
  wasteCollectItems: WasteCollectItem[];
}
