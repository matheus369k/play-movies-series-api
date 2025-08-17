import { and, eq } from 'drizzle-orm'
import { db } from '@/drizzle/client'
import { assessmentMedia } from '@/drizzle/schema/assessmentMedia'
import {
  BadRequestError,
  NotFoundError,
  ServerError,
  UnAuthorizationError,
} from '@/middlewares/error'
import { redis } from '@/redis/client'

interface CreateAssessmentMediaType {
  MovieId: string
  userId?: string
  liked: boolean
  unlike: boolean
}

export class AssessmentMediaController {
  async calculationLikesAndUnlikeMedia(assessment: CreateAssessmentMediaType) {
    let totalLiked = await redis.zscore('media:liked', assessment.MovieId)
    let totalUnlike = await redis.zscore('media:unlike', assessment.MovieId)

    if (assessment.liked) {
      totalLiked = await redis.zincrby('media:liked', 1, assessment.MovieId)
    } else if (Number(totalLiked) > 0) {
      totalLiked = await redis.zincrby('media:liked', -1, assessment.MovieId)
    }

    if (assessment.unlike) {
      totalUnlike = await redis.zincrby('media:unlike', 1, assessment.MovieId)
    } else if (Number(totalUnlike) > 0) {
      totalUnlike = await redis.zincrby('media:unlike', -1, assessment.MovieId)
    }

    return {
      totalUnlike: Number(totalUnlike) || 0,
      totalLiked: Number(totalLiked) || 0,
    }
  }

  async createAssessmentMedia(assessment: CreateAssessmentMediaType) {
    if (!assessment.userId) {
      throw new UnAuthorizationError('This user not have authorization')
    }

    const verifyExists = await db
      .select({ MovieId: assessmentMedia.MovieId })
      .from(assessmentMedia)
      .where(eq(assessmentMedia.MovieId, assessment.MovieId))

    if (verifyExists[0]) {
      throw new BadRequestError('This assessment already created')
    }

    const [mediaAssessment] = await db
      .insert(assessmentMedia)
      .values({
        MovieId: assessment.MovieId,
        userId: assessment.userId,
        liked: assessment.liked,
        unlike: assessment.unlike,
      })
      .returning({
        liked: assessmentMedia.liked,
        unlike: assessmentMedia.unlike,
      })

    if (!mediaAssessment) {
      throw new ServerError('Error to try register new assessment')
    }

    const { totalLiked, totalUnlike } =
      await this.calculationLikesAndUnlikeMedia(assessment)

    return {
      mediaAssessment: {
        ...mediaAssessment,
        totalLiked,
        totalUnlike,
      },
    }
  }

  async getAssessmentMedia(
    assessment: Pick<CreateAssessmentMediaType, 'MovieId' | 'userId'>
  ) {
    if (!assessment.userId) {
      throw new UnAuthorizationError('This user not have authorization')
    }

    const [mediaAssessment] = await db
      .select({ liked: assessmentMedia.liked, unlike: assessmentMedia.unlike })
      .from(assessmentMedia)
      .where(
        and(
          eq(assessmentMedia.userId, assessment.userId),
          eq(assessmentMedia.MovieId, assessment.MovieId)
        )
      )

    if (!mediaAssessment) {
      throw new ServerError('Error to try register new assessment')
    }

    const totalLiked = await redis.zscore('media:liked', assessment.MovieId)
    const totalUnlike = await redis.zscore('media:unlike', assessment.MovieId)

    return {
      mediaAssessment: {
        ...mediaAssessment,
        totalLiked: Number(totalLiked),
        totalUnlike: Number(totalUnlike),
      },
    }
  }

  async updateAssessmentMedia(assessment: CreateAssessmentMediaType) {
    if (!assessment.userId) {
      throw new UnAuthorizationError('This user not have authorization')
    }

    const [verifyAssessmentMedia] = await db
      .select({
        MovieId: assessmentMedia.MovieId,
      })
      .from(assessmentMedia)
      .where(
        and(
          eq(assessmentMedia.MovieId, assessment.MovieId),
          eq(assessmentMedia.userId, assessment.userId),
          eq(assessmentMedia.unlike, assessment.unlike),
          eq(assessmentMedia.liked, assessment.liked)
        )
      )

    if (verifyAssessmentMedia) {
      throw new BadRequestError('This fields already updated yet')
    }

    const [mediaAssessment] = await db
      .update(assessmentMedia)
      .set({
        liked: assessment.liked,
        unlike: assessment.unlike,
      })
      .where(
        and(
          eq(assessmentMedia.userId, assessment.userId),
          eq(assessmentMedia.MovieId, assessment.MovieId)
        )
      )
      .returning({
        liked: assessmentMedia.liked,
        unlike: assessmentMedia.unlike,
      })

    if (!mediaAssessment) {
      throw new NotFoundError('Watch later medias not found')
    }

    const { totalLiked, totalUnlike } =
      await this.calculationLikesAndUnlikeMedia(assessment)

    return {
      mediaAssessment: {
        ...mediaAssessment,
        totalLiked,
        totalUnlike,
      },
    }
  }
}
