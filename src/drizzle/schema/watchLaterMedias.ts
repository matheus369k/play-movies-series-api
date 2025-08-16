import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'

export const watchLaterMedias = pgTable('watch_later_medias', {
  id: uuid('id').primaryKey().defaultRandom(),
  MovieId: text('movie_id').notNull(),
  userId: uuid('user_id').references(() => users.id),
  image: text('image').notNull(),
  title: text('title').notNull(),
  release: integer('release').notNull(),
  type: text('type').notNull(),
  createAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
