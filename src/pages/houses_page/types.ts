export interface Occupant {
  occupant_id: number;
  occupant_name: string;
  occupant_status: string;
  occupant_phone_number?: string;
}

export interface HouseOccupant {
  house_occupant_id: number;
  is_current: boolean;
  start_in_date?: string;
  end_in_date?: string;
  occupant: Occupant;
}

export interface House {
  house_id: number;
  house_name: string;
  house_number: string;
  house_occupants_count?: number;
  house_occupants?: HouseOccupant[];
  created_at: string;
  updated_at: string;
}
