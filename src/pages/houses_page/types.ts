export interface Occupant {
  occupant_id: number;
  occupant_name: string;
  occupant_status: string;
  occupant_phone_number?: string;
}

export interface Payment {
  payment_id: number;
  dues_type_id: number;
  payment_amount: string;
  payment_date: string;
  payment_period_month: number;
  payment_period_year: number;
  payment_status: string;
  dues_type?: {
    dues_type_name: string;
  };
  payer_occupant?: {
    occupant_name: string;
  };
}

export interface HouseOccupant {
  house_occupant_id: number;
  is_current: boolean;
  is_head_family: boolean;
  start_in_date?: string;
  end_in_date?: string;
  occupant: Occupant;
  payments?: Payment[];
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
