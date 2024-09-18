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
  googleId: string | null;
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
};
