import {
  Gig,
  GigApplicant,
  UserRole,
  User as UserType,
  Wallet as WalletType,
} from "@prisma/client";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  profilePicture: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  wallet: {
    id: string;
    userId: string;
    balance: number;
  } | null;
};

export type Applicant = GigApplicant & {
  freelancer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    profilePicture: string | null;
  };
};

export type ModifiedGig = Gig & {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    profilePicture: string | null;
  };
};
