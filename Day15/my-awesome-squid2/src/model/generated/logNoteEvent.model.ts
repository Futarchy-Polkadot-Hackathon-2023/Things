import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Block} from "./block.model"
import {Transaction} from "./transaction.model"

@Entity_()
export class LogNoteEvent {
    constructor(props?: Partial<LogNoteEvent>) {
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

    @Index_()
    @Column_("text", {nullable: false})
    sig!: string

    @Index_()
    @Column_("text", {nullable: false})
    usr!: string

    @Index_()
    @Column_("text", {nullable: false})
    arg1!: string

    @Index_()
    @Column_("text", {nullable: false})
    arg2!: string

    @Column_("text", {nullable: false})
    data!: string
}
