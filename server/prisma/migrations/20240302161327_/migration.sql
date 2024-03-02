-- CreateTable
CREATE TABLE "Room" (
    "roomId" TEXT NOT NULL,
    "board" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomId")
);

-- CreateTable
CREATE TABLE "UserOnRoom" (
    "firebaseId" TEXT NOT NULL,
    "in" TIMESTAMP(3) NOT NULL,
    "out" TIMESTAMP(3),
    "roomId" TEXT NOT NULL,

    CONSTRAINT "UserOnRoom_pkey" PRIMARY KEY ("firebaseId","roomId")
);

-- AddForeignKey
ALTER TABLE "UserOnRoom" ADD CONSTRAINT "UserOnRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;
