import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Bounty {
    constructor(props?: Partial<Bounty>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Column_("text", {nullable: false})
    bountyName!: string

    @Index_()
    @Column_("text", {nullable: true})
    extrinsicHash!: string | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    extrinsicId!: string | undefined | null

    @Column_("bool", {nullable: true})
    extrinsicSuccess!: boolean | undefined | null

    @Column_("int4", {nullable: true})
    callArgsIndex!: number | undefined | null

    @Column_("int4", {nullable: true})
    callArgsBountyId!: number | undefined | null

    @Column_("text", {nullable: true})
    callArgsBountyRemark!: string | undefined | null

    @Column_("int4", {nullable: true})
    eventArgsIndex!: number | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    proposalHash!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    fee!: bigint | undefined | null
}
