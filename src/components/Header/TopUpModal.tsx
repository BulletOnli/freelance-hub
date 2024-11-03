"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { PhilippinePeso } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useServerAction } from "zsa-react";
import { checkoutAction } from "./action";
import { toast } from "sonner";
import formatCurrency from "@/utils/formatCurrency";
import { usePathname } from "next/navigation";

const coins = [
  {
    id: "price_1QH3CdLKmI6nNPf5BHMNU5g0",
    unit_amount: 10_000,
  },
  {
    id: "price_1QGvgTLKmI6nNPf5JVqGvIN1",
    unit_amount: 50_000,
  },
  {
    id: "price_1QGvLSLKmI6nNPf5hb7K99pL",
    unit_amount: 100_000,
  },
  {
    id: "price_1QGvLbLKmI6nNPf5wOU2seMQ",
    unit_amount: 500_000,
  },
  {
    id: "price_1QGvlNLKmI6nNPf52TSAohzn",
    unit_amount: 1_000_000,
  },
  {
    id: "price_1QH3AbLKmI6nNPf5AHUnR3ZZ",
    unit_amount: 10_000_000,
  },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TopUpModal = ({ open, onOpenChange }: Props) => {
  const pathname = usePathname();
  const [customAmount, setCustomAmount] = useState<string>("");
  const checkout = useServerAction(checkoutAction);
  const [priceId, setPriceId] = useState<string | undefined>(coins[0].id);

  const handleCustomAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      setPriceId(undefined);
    }
  };

  const handleSelectCoin = (priceId: string) => {
    setCustomAmount("");
    setPriceId(priceId);
  };

  const handleTopUp = async () => {
    if (!priceId && !customAmount) {
      return toast.info("Please select an amount to top up");
    }

    if (customAmount) {
      if (Number(customAmount) >= 1_000_000 || Number(customAmount) < 100) {
        return toast.error(
          "Invalid amount. Please enter an amount between P100.00 and P1,000,000.00"
        );
      }
    }

    const [data, err] = await checkout.execute({
      priceId,
      redirectUrl: pathname,
      customPrice: Number(customAmount),
    });

    if (err) {
      return toast.error(err.message || "Failed to top up coins");
    }

    window.open(data, "_blank");
  };

  useEffect(() => {
    if (!open) {
      document.body.style.pointerEvents = "";
    }

    return () => {
      document.body.style.pointerEvents = "";
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Top Up Coins</DialogTitle>
          <DialogDescription>
            Choose an amount or enter a custom value to top up your virtual
            coins.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            {coins?.map((coin) => (
              <Button
                key={coin.id}
                variant={priceId === coin.id ? "secondary" : "outline"}
                className="w-full h-16 border border-customBorder"
                onClick={() => handleSelectCoin(coin.id)}
              >
                <span className="text-base">
                  {formatCurrency(coin.unit_amount / 100)}
                </span>
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-amount">
              Custom Amount{" "}
              <span className="text-xs text-customGray/80">
                (P100.00 - P1,000,000.00)
              </span>
            </Label>
            <div className="flex items-center space-x-2">
              <PhilippinePeso className="w-5 h-5 text-muted-foreground" />
              <Input
                id="custom-amount"
                type="text"
                placeholder="Enter coin amount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="flex-grow"
                min={100}
                max={1_000_000}
              />
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleTopUp}
          disabled={checkout.isPending || (!priceId && !customAmount)}
        >
          {checkout.isPending ? "Loading..." : "Proceed to Payment"}
        </Button>

        <TestCardDetails />
      </DialogContent>
    </Dialog>
  );
};

const TestCardDetails = () => {
  return (
    <div className="space-y-2">
      <p className="text-xs">Use these test card details:</p>
      <div className="text-xs bg-secondary-custom border border-customBorder p-3 rounded-md space-y-1">
        <p>
          <span className="font-medium">Card Number:</span> 4242 4242 4242 4242
        </p>
        <p>
          <span className="font-medium">Expiry:</span> Any future date (e.g.,
          12/34)
        </p>
        <p>
          <span className="font-medium">CVC:</span> Any 3 digits
        </p>
      </div>
      <p className="text-xs text-center text-gray-600">
        This card will simulate a successful payment without charging any real
        money.
      </p>
    </div>
  );
};

export default TopUpModal;
