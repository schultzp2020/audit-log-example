import { LOG_LEVELS } from '@/logger/constants'
import { getLogger } from '@/logger/getLogger'
import { type NextRequest, userAgent } from 'next/server'

const logger = getLogger()

export async function POST(request: NextRequest) {
  const body: { level: keyof typeof LOG_LEVELS; message: string; isAuditLog?: boolean } =
    await request.json()

  const extraProps = body.isAuditLog
    ? { ip: request.ip, geo: request.geo, userAgent: userAgent(request) }
    : {}

  logger.log({ ...body, ...extraProps })
  return Response.json(body)
}
