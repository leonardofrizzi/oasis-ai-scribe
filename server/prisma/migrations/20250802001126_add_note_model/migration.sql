-- CreateTable
CREATE TABLE "public"."Note" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "transcriptRaw" TEXT NOT NULL,
    "transcriptText" TEXT,
    "oasisFields" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
