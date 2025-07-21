import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'customer' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map