import {
  Gig,
  GigApplicant,
  User as UserType,
  Wallet as WalletType,
} from "@prisma/client";

export type User = UserType & {
  wallet: WalletType;
};

export type Applicant = GigApplicant & {
  freelancer: {
    firstName: string;
    lastName: string;
    email: string | null;
    profilePicture: string | null;
  };
};

export type ModifiedGig = Gig & {
  user: {
    firstName: string;
    lastName: string;
    email: string | null;
    profilePicture: string | null;
  };
  applicants: Applicant[] | [];
};
