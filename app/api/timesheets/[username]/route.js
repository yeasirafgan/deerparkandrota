// app/api/timesheets/[username]/route.js

import connectMongo from '@/db/connectMongo';
import Timesheet from '@/models/Timesheet';
import { NextResponse } from 'next/server';
import { subWeeks, startOfDay } from 'date-fns';

export async function GET(request, { params }) {
  const username = decodeURIComponent(params.username);
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 20;

  // Connect to MongoDB
  await connectMongo();

  // Calculate date range for the last 4 weeks
  const today = new Date();
  const fourWeeksAgo = subWeeks(startOfDay(today), 4);

  // First, calculate the total count of timesheets
  const totalCount = await Timesheet.countDocuments({
    username,
    date: { $gte: fourWeeksAgo },
  });

  // Aggregation pipeline
  const aggregationPipeline = [
    {
      $match: {
        username,
        date: { $gte: fourWeeksAgo },
      },
    },
    {
      $addFields: {
        // Convert start and end time strings to Date objects
        startTime: {
          $dateFromString: {
            dateString: {
              $concat: [
                { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                'T',
                '$start', // HH:mm format
              ],
            },
          },
        },
        endTime: {
          $dateFromString: {
            dateString: {
              $concat: [
                { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                'T',
                '$end', // HH:mm format
              ],
            },
          },
        },
      },
    },
    {
      $addFields: {
        // Calculate the duration in minutes
        durationMinutes: {
          $cond: [
            { $gte: ['$endTime', '$startTime'] },
            { $divide: [{ $subtract: ['$endTime', '$startTime'] }, 1000 * 60] }, // If endTime >= startTime
            {
              $divide: [
                { $subtract: [{ $add: ['$endTime', 86400000] }, '$startTime'] },
                1000 * 60,
              ],
            }, // If endTime < startTime, assume next day
          ],
        },
      },
    },
    {
      $group: {
        _id: null, // Group all records together
        totalMinutes: { $sum: '$durationMinutes' }, // Sum of all durations
        timesheets: { $push: '$$ROOT' }, // Push all timesheets to an array
      },
    },
    {
      $project: {
        _id: 0, // Exclude the _id field
        totalMinutes: 1, // Total minutes worked
        timesheets: { $slice: ['$timesheets', (page - 1) * limit, limit] }, // Apply pagination to timesheets
      },
    },
  ];

  const result = await Timesheet.aggregate(aggregationPipeline);

  // If no timesheets are found, return an empty response
  if (result.length === 0) {
    return NextResponse.json({
      timesheets: [],
      totalCount: 0,
      totalHours: 0,
      totalMinutes: 0,
    });
  }

  const { timesheets, totalMinutes } = result[0];

  // Convert total minutes to hours and minutes
  const totalHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return NextResponse.json({
    timesheets,
    totalCount,
    totalHours,
    totalMinutes: minutes,
  });
}
