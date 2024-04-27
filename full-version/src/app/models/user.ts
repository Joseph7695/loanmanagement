import Customer from "./customer";
import Loan from "./loan";

export enum UserRole {
  SUPERADMIN = "SUPERADMIN",
  ADMIN2 = "ADMIN2",
  ADMIN3 = "ADMIN3",
  COLLECTOR = "COLLECTOR",
}

interface User {
  id: number;
  password: string;
  username: string;
   name: string;
 role: UserRole;
  isStillWorking: boolean;
  createdDate: Date;
  updatedDate: Date;
  deletedDate: Date | null; // Since it's soft deleting, it can be null if not deleted

  loans: Loan[];
  customers: Customer[];
}

export default User;
