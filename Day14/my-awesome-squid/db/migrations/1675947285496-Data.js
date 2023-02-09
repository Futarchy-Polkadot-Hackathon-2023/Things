module.exports = class Data1675947285496 {
    name = 'Data1675947285496'

    async up(db) {
        await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "extrinsic_hash" text, "amount" numeric NOT NULL, "fee" numeric NOT NULL, "from_id" character varying, "to_id" character varying, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_d6624eacc30144ea97915fe846" ON "transfer" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_70ff8b624c3118ac3a4862d22c" ON "transfer" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_070c555a86b0b41a534a55a659" ON "transfer" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_76bdfed1a7eb27c6d8ecbb7349" ON "transfer" ("from_id") `)
        await db.query(`CREATE INDEX "IDX_0751309c66e97eac9ef1149362" ON "transfer" ("to_id") `)
        await db.query(`CREATE INDEX "IDX_f4007436c1b546ede08a4fd7ab" ON "transfer" ("amount") `)
        await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "bounty" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "extrinsic_hash" text, "amount" numeric NOT NULL, "fee" numeric NOT NULL, "bullshit" numeric NOT NULL, "from_id" character varying, "to_id" character varying, CONSTRAINT "PK_afc9754b790b0effd1d59257f4d" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_72487decfc29b48b453dd8d609" ON "bounty" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_23954ccb20a0139ee9d93fe8c0" ON "bounty" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_89b08c9687e53eb7818954fe33" ON "bounty" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_fc9c845f34839d05144379ee49" ON "bounty" ("from_id") `)
        await db.query(`CREATE INDEX "IDX_19f3fdaacb909f201fac73bf5a" ON "bounty" ("to_id") `)
        await db.query(`CREATE INDEX "IDX_ee2f2810ebc5a41d72c7509772" ON "bounty" ("amount") `)
        await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_76bdfed1a7eb27c6d8ecbb73496" FOREIGN KEY ("from_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_0751309c66e97eac9ef11493623" FOREIGN KEY ("to_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "bounty" ADD CONSTRAINT "FK_fc9c845f34839d05144379ee494" FOREIGN KEY ("from_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "bounty" ADD CONSTRAINT "FK_19f3fdaacb909f201fac73bf5a5" FOREIGN KEY ("to_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "transfer"`)
        await db.query(`DROP INDEX "public"."IDX_d6624eacc30144ea97915fe846"`)
        await db.query(`DROP INDEX "public"."IDX_70ff8b624c3118ac3a4862d22c"`)
        await db.query(`DROP INDEX "public"."IDX_070c555a86b0b41a534a55a659"`)
        await db.query(`DROP INDEX "public"."IDX_76bdfed1a7eb27c6d8ecbb7349"`)
        await db.query(`DROP INDEX "public"."IDX_0751309c66e97eac9ef1149362"`)
        await db.query(`DROP INDEX "public"."IDX_f4007436c1b546ede08a4fd7ab"`)
        await db.query(`DROP TABLE "account"`)
        await db.query(`DROP TABLE "bounty"`)
        await db.query(`DROP INDEX "public"."IDX_72487decfc29b48b453dd8d609"`)
        await db.query(`DROP INDEX "public"."IDX_23954ccb20a0139ee9d93fe8c0"`)
        await db.query(`DROP INDEX "public"."IDX_89b08c9687e53eb7818954fe33"`)
        await db.query(`DROP INDEX "public"."IDX_fc9c845f34839d05144379ee49"`)
        await db.query(`DROP INDEX "public"."IDX_19f3fdaacb909f201fac73bf5a"`)
        await db.query(`DROP INDEX "public"."IDX_ee2f2810ebc5a41d72c7509772"`)
        await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_76bdfed1a7eb27c6d8ecbb73496"`)
        await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_0751309c66e97eac9ef11493623"`)
        await db.query(`ALTER TABLE "bounty" DROP CONSTRAINT "FK_fc9c845f34839d05144379ee494"`)
        await db.query(`ALTER TABLE "bounty" DROP CONSTRAINT "FK_19f3fdaacb909f201fac73bf5a5"`)
    }
}
