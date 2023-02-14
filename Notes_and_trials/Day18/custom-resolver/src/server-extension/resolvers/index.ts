import 'reflect-metadata'
import type { EntityManager } from 'typeorm'
import { Field, ObjectType, Query, Resolver } from 'type-graphql'
import { Transfer } from '../../model'

@ObjectType()
export class TransfersDayData {
    @Field(() => Date, { nullable: false })
    day!: Date

    @Field(() => Number, {nullable: false})
    count!: number

    constructor(props: Partial<TransfersDayData>) {
        Object.assign(this, props)
    }
}

@Resolver()
export class TransfersDayDataResolver {
    constructor(private tx: () => Promise<EntityManager>) {}

    @Query(()=>[TransfersDayData])
    async getTransfersDayData(): Promise<TransfersDayData[]> {
        const manager = await this.tx()
        const repository = manager.getRepository(Transfer)

        const data: {
            day: string
            count: number
        }[] = await repository.query(`
            SELECT DATE(timestamp) AS day, COUNT(*) as count
            FROM transfer
            GROUP BY day
            ORDER BY day DESC
        `)
        return data.map(
            (i) => new TransfersDayData({
                day: new Date(i.day),
                count: i.count
            })
        )
    }
}