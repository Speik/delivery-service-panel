type PaymentMethod = import('../declarations').PaymentMethod;
type OrderType = import('../declarations').OrderType;
type OrderStatus = import('../declarations').OrderStatus;

type DateRange = [Date, Date];
type ScreenSize = 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl';

interface IUser {
  id: string;
  name: string;
  createdAt: Date;
}

interface ICategory {
  id: string;
  name: string;
}

interface ICustomer {
  id: string;
  customerNumber: number;
  name: string;
  phone: string;
  address?: string;
  preferredPayment: PaymentMethod;
  preferredOrder: OrderType;
  createdAt: Date;
  updatedAt: Date;
}

interface IDish {
  id: string;
  name: string;
  price: string;
  visible: boolean;
  category: ICategory | null;
  image: string | null;
  description: string | null;
  updatedAt: Date;
}

interface IOrder {
  id: string;
  orderNumber: number;
  type: OrderType;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  price: number;
  comment: string;
  dishes: IDish[];
  customer: ICustomer;
  createdAt: Date;
}

interface IGeneralStats {
  totalOrders: number;
  uniqueCustomers: number;
  totalIncome: number;
  averageBill: number;
}

interface IDetailedStatsEntry {
  totalOrders: number;
  totalIncome: number;
  averageTime: number;
}

interface IDetailedStats {
  delivery: IDetailedStatsEntry;
  takeaway: IDetailedStatsEntry;
}

interface IPlatinumMember extends ICustomer {
  totalOrders: number;
}

interface IDailyStats {
  orders: IOrder[];
  totalIncome: number;
}

interface IAuthorizedUser {
  id: string;
  name: string;
  accessToken: string;
}