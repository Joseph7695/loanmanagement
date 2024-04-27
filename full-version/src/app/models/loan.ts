import Customer from "./customer";
import Repayment from "./repayment";
import User from "./user";

enum LoanRepaymentFrequency {
  NONE = "NONE",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

interface Loan {
  id: number;
  name: string;
  loanedAmount: number;
  loanApplicationDate: Date;
  loanRepaymentFrequency: LoanRepaymentFrequency;
  loanRepaymentTotalCount: number | null;
  loanSingleRepaymentAmount: number;
  loanTotalPrincipal: number | null;
  isUnlimited: boolean;
  customer: Customer;
  hardcopyImagePath: string;
  hardcopyImagePath2?: string | null;
  hardcopyImagePath3?: string | null;
  hardcopyImagePath4?: string | null;
  hardcopyImagePath5?: string | null;
  hardcopyImagePath6?: string | null;

  user: User;
  repayments: Repayment[];

  // frontend properties
  paidRepaymentCount: number;
}

export default Loan;
