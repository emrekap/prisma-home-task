-- DropForeignKey
ALTER TABLE "guest_book_entries" DROP CONSTRAINT "guest_book_entries_user_id_fkey";

-- AddForeignKey
ALTER TABLE "guest_book_entries" ADD CONSTRAINT "guest_book_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
