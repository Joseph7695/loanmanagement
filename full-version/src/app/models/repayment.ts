import Loan from "./loan";

interface Repayment {
  id: number;
  repaymentAmount: number;
  receivedAmount: number;
  targetRepaymentDate: Date;
  extendedRepaymentDate?: Date | null;
  extendedRepaymentDateHistory?: string | null;
  repaymentAmountHistory?: string | null;
  receivedAmountHistory?: string | null;
  isUnlimitedRepayment: boolean;
  isPrincipalRepayment: boolean;
  isPaid: boolean;
  loan: Loan;
}

export default Repayment;
