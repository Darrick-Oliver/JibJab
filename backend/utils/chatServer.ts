import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import User, { IUser } from '../models/User';
import { app } from '../app';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { ExtendedError } from 'socket.io/dist/namespace';
import GroupChat from '../models/GroupChat';
import { LeanDocument, Types } from 'mongoose';
import Chat, { IChat } from '../models/Chat';
import { errorMessage } from './returns';

const MAX_DISTANCE = 300;

export const chatServer = () => {
    const httpServer = createServer(app);
    const io = new Server(httpServer, {});

    enum Event {
        CONNECT = 'connect',
        DISCONNECT = 'disconnect',
        MESSAGE = 'message',
    }

    io.use(
        async (
            socket: Socket,
            next: (err?: ExtendedError | undefined) => void
        ) => {
            const accessToken = socket.handshake.auth.accessToken as string;
            jwt.verify(
                accessToken,
                process.env.JWT_SECRET!,
                async (err, token) => {
                    if (!err) {
                        token = token as jwt.JwtPayload;
                        const username = token.username;

                        const user = await User.findOne({
                            username: username,
                        }).lean();

                        if (user) {
                            socket.data.user = user;
                            return next();
                        }
                    }
                    return errorMessage(err?.message || "Group or user not found")
                }
            );
        }
    ).on(Event.CONNECT, async (socket: Socket) => {
        const user: LeanDocument<IUser & { _id: Types.ObjectId }> =
            socket.data.user;
        const groupId = socket.handshake.auth.groupId as string;
        const latitude = socket.handshake.auth.latitude as string;
        const longitude = socket.handshake.auth.longitude as string;

        // Find group within range
        const group = await GroupChat.findOne({
            _id: groupId,
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: MAX_DISTANCE * 1609.344, // Convert to meters
                },
            },
        }).lean();

        if (!group || !user) {
            return;
        }

        console.log(`${user.username} has joined ${group.title}`);
        socket.join(groupId);

        socket.on(Event.MESSAGE, async (req: { message: string }) => {
            // Create chat message
            const chatData: IChat = {
                group: group._id,
                user: user._id,
                message: req.message,
                createdOn: new Date(),
            };
            const chat = await new Chat(chatData).populate('user', { username: 1, first_name: 1, last_name: 1 });

            // Save to database
            await chat.save();

            // Update last activity time in group
            await GroupChat.updateOne({
                _id: groupId
            }, {
                lastPost: new Date()
            });

            // Send to others on socket
            io.to(groupId).emit(Event.MESSAGE, chat);
        });

        socket.on(Event.DISCONNECT, () => {
            console.log(`${user.username} has left ${group.title}`);
            socket.leave(groupId);
        });
    });

    httpServer.listen(4000);
};

const min = (a: number, b: number) => {
    return a > b ? b : a;
};
