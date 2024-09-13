-- DropForeignKey
ALTER TABLE "user-details" DROP CONSTRAINT "user-details_userId_fkey";

-- AddForeignKey
ALTER TABLE "user-details" ADD CONSTRAINT "user-details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
