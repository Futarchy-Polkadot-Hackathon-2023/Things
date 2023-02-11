import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Block} from "./block.model"
import {Transaction} from "./transaction.model"

@Entity_()
export class PermitFunction {
    constructor(props?: Partial<PermitFunction>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Block

    @Index_()
    @ManyToOne_(() => Transaction, {nullable: true})
    transaction!: Transaction

    @Index_()
    @Column_("text", {nullable: false})
    name!: string

    @Column_("text", {nullable: true})
    holder!: string | undefined | null

    @Column_("text", {nullable: true})
    spender!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    nonce!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    expiry!: bigint | undefined | null

    @Column_("bool", {nullable: true})
    allowed!: boolean | undefined | null

    @Column_("int4", {nullable: true})
    v!: number | undefined | null

    @Column_("text", {nullable: true})
    r!: string | undefined | null

    @Column_("text", {nullable: true})
    s!: string | undefined | null
}
