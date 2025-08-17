import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'

export const assessmentMedia = pgTable('assessment_media', {
  id: uuid('id').primaryKey().defaultRandom(),
  MovieId: text('movie_id').notNull(),
  userId: uuid('user_id').references(() => users.id),
  liked: boolean('liked'),
  unlike: boolean('unlike'),
})
