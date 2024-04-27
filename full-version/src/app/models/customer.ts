import Loan from "./loan";
import User from "./user";

interface Customer {
  id: number;
  name: string;
  ic: string;
  icImagePath: string;
  homeAddressImagePath?: string | null;
  homeAddressGoogleMapsUrl: string;
  phoneNumber: string;
  occupation: string;
  companyName: string;
  officeLocationImagePath?: string | null;
  officeLocationGoogleMapsUrl?: string | null;
  salary: number;
  carPlateNumber: string;
  emergencyContactName: string | null;
  emergencyContactNumber: string | null;
  emergencyContactName2: string | null;
  emergencyContactNumber2: string | null;
  emergencyContactName3: string | null;
  emergencyContactNumber3: string | null;
  emergencyContactName4: string | null;
  emergencyContactNumber4: string | null;
  emergencyContactName5: string | null;
  emergencyContactNumber5: string | null;
  waterUtilityBillImagePath?: string | null;
  electricUtilityBillImagePath?: string | null;
  salarySlipImagePath?: string | null;
  isBlacklist: boolean;
  createdDate: Date;
  updatedDate: Date;
  deletedDate?: Date | null;

  loans: Loan[];
  user: User;
}

export default Customer;
