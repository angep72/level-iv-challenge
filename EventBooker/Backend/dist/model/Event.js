"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const EventSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long']
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long']
    },
    date: {
        type: Date,
        required: [true, 'Event date is required'],
        validate: {
            validator: function (value) {
                return value > new Date();
            },
            message: 'Event date must be in the future'
        }
    },
    location: {
        type: String,
        required: [true, 'Event location is required'],
        trim: true,
        minlength: [3, 'Location must be at least 3 characters long']
    },
    maxCapacity: {
        type: Number,
        required: [true, 'Maximum capacity is required'],
        min: [1, 'Maximum capacity must be at least 1']
    },
    currentBookings: {
        type: Number,
        default: 0,
        min: [0, 'Current bookings cannot be negative'],
        validate: {
            validator: function (value) {
                return value <= this.maxCapacity;
            },
            message: 'Current bookings cannot exceed maximum capacity'
        }
    },
    price: {
        type: Number,
        required: [true, 'Event price is required'],
        min: [0, 'Price cannot be negative']
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Event creator is required']
    }
}, {
    timestamps: true
});
EventSchema.index({ date: 1 });
EventSchema.index({ createdBy: 1 });
EventSchema.index({ title: 'text', description: 'text' });
EventSchema.virtual('availableSpots').get(function () {
    return this.maxCapacity - this.currentBookings;
});
EventSchema.set('toJSON', { virtuals: true });
exports.default = mongoose_1.default.model('Event', EventSchema);
//# sourceMappingURL=Event.js.map