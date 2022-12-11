-- CreateTable
CREATE TABLE "Drone" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "Drone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "droneName" TEXT NOT NULL,
    "time" BIGINT NOT NULL,
    "coordinates" DECIMAL(65,30)[],

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Drone_name_key" ON "Drone"("name");

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_droneName_fkey" FOREIGN KEY ("droneName") REFERENCES "Drone"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
