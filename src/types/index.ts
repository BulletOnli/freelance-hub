import { User as UserType, Wallet as WalletType } from "@prisma/client";

export type User = UserType & {
  wallet: WalletType;
};
