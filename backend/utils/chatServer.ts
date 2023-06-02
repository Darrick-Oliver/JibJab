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
            const accessToken = socket.handshake.query.accessToken as string;
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
                    return next();
                }
            );
        }
    ).on(Event.CONNECT, async (socket: Socket) => {
        const user: LeanDocument<IUser & { _id: Types.ObjectId }> =
            socket.data.user;
        const groupId = socket.handshake.query.group as string;
        const latitude = socket.handshake.query.latitude as string;
        const longitude = socket.handshake.query.longitude as string;
        const distance = Number(socket.handshake.query.distance as string);

        // Find group within range
        const group = await GroupChat.findOne({
            _id: groupId,
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: min(MAX_DISTANCE, distance) * 1609.344, // Convert to meters
                },
            },
        }).lean();

        if (!group || !user) {
            return;
        }

        console.log(`${user} has joined ${group}`);
        socket.join(groupId);

        socket.on(Event.MESSAGE, async (message: string) => {
            // Create chat message
            const chatData: IChat = {
                group: group._id,
                user: user._id,
                message: message,
                createdOn: new Date(),
            };
            const chat = new Chat(chatData);

            // Save to database
            await chat.save();

            // TODO: update group time

            // Send to others on socket
            io.to(groupId).emit(Event.MESSAGE, chat);
        });

        socket.on(Event.DISCONNECT, () => {
            socket.leave(groupId);
        });
    });

    httpServer.listen(4000);
};

const min = (a: number, b: number) => {
    return a > b ? b : a;
};
