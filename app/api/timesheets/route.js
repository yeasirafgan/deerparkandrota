import connectMongo from '@/db/connectMongo';
import Timesheet from '@/models/Timesheet';

export async function GET(req) {
  try {
    // Parse the query params for pagination (page and limit)
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');

    // Establish MongoDB connection
    await connectMongo();

    // Define the time range (start and end of the week)
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (today.getDay() || 7) + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Calculate skip value based on page number and limit
    const skip = (page - 1) * limit;

    // Fetch timesheets for the current week, sorted by date, with pagination
    const timesheets = await Timesheet.find({
      username,
      date: {
        $gte: startOfWeek,
        $lte: endOfWeek,
      },
    })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalCount = await Timesheet.countDocuments({
      username,
      date: {
        $gte: startOfWeek,
        $lte: endOfWeek,
      },
    });

    // Return the timesheet data and pagination details as JSON
    return new Response(
      JSON.stringify({
        timesheets,
        totalCount,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch timesheets' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
