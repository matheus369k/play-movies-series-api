import { and, eq } from 'drizzle-orm'
import { db } from '@/drizzle/client'
import { watchLaterMedias } from '@/drizzle/schema/watchLaterMedias'
import {
  BadRequestError,
  NotFoundError,
  ServerError,
  UnAuthorizationError,
} from '@/middlewares/error'

interface CreateWatchLaterMediasType {
  MovieId: string
  userId?: string
  image: string
  title: string
  release: number
  type: string
}

export class WatchLaterMediasController {
  async createWatchLaterMedia(watchLater: CreateWatchLaterMediasType) {
    if (!watchLater.userId) {
      throw new UnAuthorizationError('This user not have authorization')
    }

    const verifyExists = await db
      .select({ MovieId: watchLaterMedias.MovieId })
      .from(watchLaterMedias)
      .where(eq(watchLaterMedias.MovieId, watchLater.MovieId))

    if (verifyExists[0]) {
      throw new BadRequestError('This Media already register')
    }

    const watchLaterMedia = await db
      .insert(watchLaterMedias)
      .values({
        image: watchLater.image,
        MovieId: watchLater.MovieId,
        release: watchLater.release,
        title: watchLater.title,
        type: watchLater.type,
        userId: watchLater.userId,
      })
      .returning()

    if (!watchLaterMedia[0]) {
      throw new ServerError('Error to try register new media')
    }

    return {
      watchLaterId: watchLaterMedia[0].MovieId,
    }
  }

  async getAllWatchLaterMedias({
    userId,
  }: Pick<CreateWatchLaterMediasType, 'userId'>) {
    if (!userId) {
      throw new UnAuthorizationError('This user not have authorization')
    }

    const watchLaterMediasList = await db
      .select({
        image: watchLaterMedias.image,
        MovieId: watchLaterMedias.MovieId,
        release: watchLaterMedias.release,
        title: watchLaterMedias.title,
        type: watchLaterMedias.type,
        id: watchLaterMedias.id,
      })
      .from(watchLaterMedias)
      .where(eq(watchLaterMedias.userId, userId))

    if (!watchLaterMediasList[0]) {
      throw new NotFoundError('Watch later medias not found')
    }

    return {
      watchLaterMedias: watchLaterMediasList,
    }
  }

  async getWatchLaterMedia({
    userId,
    MovieId,
  }: Pick<CreateWatchLaterMediasType, 'userId' | 'MovieId'>) {
    if (!userId) {
      throw new UnAuthorizationError('This user not have authorization')
    }

    const watchLaterMedia = await db
      .select({
        image: watchLaterMedias.image,
        MovieId: watchLaterMedias.MovieId,
        release: watchLaterMedias.release,
        title: watchLaterMedias.title,
        type: watchLaterMedias.type,
        id: watchLaterMedias.id,
      })
      .from(watchLaterMedias)
      .where(
        and(
          eq(watchLaterMedias.userId, userId),
          eq(watchLaterMedias.MovieId, MovieId)
        )
      )

    if (!watchLaterMedia[0]) {
      throw new NotFoundError('Watch later media not found')
    }

    return {
      watchLaterMedia: watchLaterMedia[0],
    }
  }

  async deleteWatchLaterMedia({
    userId,
    MovieId,
  }: Pick<CreateWatchLaterMediasType, 'userId' | 'MovieId'>) {
    if (!userId) {
      throw new UnAuthorizationError('This user not have authorization')
    }

    await db
      .delete(watchLaterMedias)
      .where(
        and(
          eq(watchLaterMedias.userId, userId),
          eq(watchLaterMedias.MovieId, MovieId)
        )
      )

    const watchLaterMedia = await db
      .select({
        MovieId: watchLaterMedias.MovieId,
      })
      .from(watchLaterMedias)
      .where(
        and(
          eq(watchLaterMedias.userId, userId),
          eq(watchLaterMedias.MovieId, MovieId)
        )
      )

    if (watchLaterMedia[0]) {
      throw new NotFoundError('error to try delete watch later media')
    }

    return { status: 'ok' }
  }
}
