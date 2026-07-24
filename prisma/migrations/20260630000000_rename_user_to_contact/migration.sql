-- Rename the CRM entity from User to Contact.
ALTER TABLE "User" RENAME TO "Contact";

DROP INDEX IF EXISTS "User_email_key";
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");

ALTER TABLE "Contact" DROP COLUMN "passwordHash";
