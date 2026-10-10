import cron, { type ScheduledTask } from "node-cron";
import redisClient from "../config/redis.js";
import calculatePoints from "./calculatePoints.js";
import formatDateAndTime from "./formatDateAndTime.js";
import { calculationHours } from "../schemas/admin.schemas.js";

export const DEFAULT_CALCULATION_HOURS = [12, 14, 17, 19, 22]

let calculationTask: ScheduledTask | null = null

export async function getCalculationHours() {
  const hours = await redisClient.get("calculation_hours")
  return hours ? calculationHours.parse(JSON.parse(hours)) : DEFAULT_CALCULATION_HOURS
}

export function getNextCalculation() {
  return calculationTask?.getNextRun()?.getTime() ?? null
}

async function scheduleCalculation(hours: number[]) {
  await calculationTask?.destroy()
  calculationTask = cron.schedule(`0 ${hours.join(',')} * * *`, calculatePoints, { timezone: 'Europe/Belgrade' })

  const next = calculationTask.getNextRun()
  console.log(`Points calculation scheduled at hours ${hours.join(', ')}, next at ${next ? formatDateAndTime(next) : 'unknown'}`)
}

export async function setCalculationHours(hours: number[]) {
  await redisClient.set("calculation_hours", JSON.stringify(hours))
  await scheduleCalculation(hours)
}

export async function startCalculationScheduler() {
  let hours = DEFAULT_CALCULATION_HOURS
  try {
    hours = await getCalculationHours()
  } catch (err) {
    console.error(`[${formatDateAndTime()}]Couldn't read calculation hours, using defaults: ${ err }`)
  }

  await scheduleCalculation(hours)
}
