const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema(
  {
    originalText: {
      type: String,
      required: [true, 'Original text is required'],
      trim: true,
      maxlength: [5000, 'Text cannot exceed 5000 characters'],
    },
    humanizedText: {
      type: String,
      required: true,
    },
    charDelta: {
      type: Number,
      default: 0,
    },
    transformCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for time-ago display
entrySchema.virtual('timeAgo').get(function () {
  const now = new Date();
  const diff = Math.floor((now - this.createdAt) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
});

entrySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Entry', entrySchema);
