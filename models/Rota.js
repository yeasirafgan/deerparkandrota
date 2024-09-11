// import mongoose from 'mongoose';

import mongoose from 'mongoose';

const rotaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name of the rota (from the uploaded file)
    },
    weekStart: {
      type: Date,
      required: true, // Start date of the rota week
    },
    parsedData: [
      {
        staff: {
          type: String,
          default: 'Unknown', // Staff name
        },
        post: {
          type: String,
          default: 'N/A', // Post or position of the staff member
        },
        monday: {
          type: String,
          default: '',
        },
        tuesday: {
          type: String,
          default: '',
        },
        wednesday: {
          type: String,
          default: '',
        },
        thursday: {
          type: String,
          default: '',
        },
        friday: {
          type: String,
          default: '',
        },
        saturday: {
          type: String,
          default: '',
        },
        sunday: {
          type: String,
          default: '',
        },
      },
    ],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export default mongoose.models.Rota || mongoose.model('Rota', rotaSchema);
