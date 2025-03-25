export interface Branch {
  id: number
  name: string
  country: number
  country_name: string
  address: string
  phone: string
  email: string
  is_active: boolean
  has_online_ordering: boolean
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: number;
  microsites: number[];
  name: string;
  description: string;
  price: string;
  currency: string;
  currency_display: string;
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateMenuItemDto {
  name: string;
  description: string;
  microsites: number[];
  price: string;
  currency: string;
  is_active: boolean;
}

export interface UpdateMenuItemDto extends Partial<CreateMenuItemDto> {
  id: number;
}