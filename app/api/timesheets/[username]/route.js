// app/api/timesheets/[username]/route.js

import connectMongo from '@/db/connectMongo';
import Timesheet from '@/models/Timesheet';
import { NextResponse } from 'next/server';
import { subWeeks, startOfDay } from 'date-fns';

export async function GET(request, { params }) {
  const username = decodeURIComponent(params.username);
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 10;

  console.log(limit);

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
        startHours: {
          $toInt: { $arrayElemAt: [{ $split: ['$start', ':'] }, 0] }, // Convert hours to integer
        },
        startMinutes: {
          $toInt: { $arrayElemAt: [{ $split: ['$start', ':'] }, 1] }, // Convert minutes to integer
        },
        endHours: {
          $toInt: { $arrayElemAt: [{ $split: ['$end', ':'] }, 0] }, // Convert hours to integer
        },
        endMinutes: {
          $toInt: { $arrayElemAt: [{ $split: ['$end', ':'] }, 1] }, // Convert minutes to integer
        },
      },
    },
    {
      $addFields: {
        totalStartMinutes: {
          $add: ['$startHours', { $divide: ['$startMinutes', 60] }], // Total start minutes
        },
        totalEndMinutes: {
          $add: ['$endHours', { $divide: ['$endMinutes', 60] }], // Total end minutes
        },
      },
    },
    {
      $group: {
        _id: null, // Group all records together
        totalMinutes: {
          $sum: {
            $cond: [
              { $gt: ['$totalEndMinutes', '$totalStartMinutes'] }, // If end time is greater than start time
              { $subtract: ['$totalEndMinutes', '$totalStartMinutes'] },
              {
                $add: [
                  { $subtract: ['$totalEndMinutes', '$totalStartMinutes'] },
                  1440,
                ],
              }, // Assume the end time is on the next day
            ],
          },
        },
        timesheets: { $push: '$$ROOT' }, // Push all timesheets to an array
      },
    },
    {
      $project: {
        _id: 0, // Exclude the _id field
        totalMinutes: '$totalMinutes', // Total minutes worked
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
      totalMinutes: 0,
    });
  }

  const { timesheets, totalMinutes } = result[0];

  // Convert total minutes to hours and minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return NextResponse.json({
    timesheets,
    totalCount,
    totalHours: hours,
    totalMinutes: minutes,
  });
}
